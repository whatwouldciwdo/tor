// src/app/api/tor/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(req: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const torId = parseInt(id);
    
    const sessionUser = await getCurrentUser();

    // Get user from DB with position
    const dbUser = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { 
        id: true, 
        name: true,
        positionId: true, 
        isSuperAdmin: true,
        position: {
          include: {
            positionRoles: {
              include: { role: true }
            }
          }
        }
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 401 }
      );
    }

    const tor = await prisma.tor.findUnique({
      where: { id: torId },
      include: {
        bidang: {
          include: {
            workflows: {
              include: {
                steps: {
                  orderBy: { stepNumber: "asc" }
                }
              }
            }
          }
        }
      },
    });

    if (!tor) {
      return NextResponse.json(
        { message: "TOR tidak ditemukan" },
        { status: 404 }
      );
    }

    // Hanya TOR dengan status bukan DRAFT yang bisa di-approve
    if (tor.statusStage === "DRAFT") {
      return NextResponse.json(
        { message: "TOR masih dalam status DRAFT, belum bisa di-approve" },
        { status: 400 }
      );
    }

    // Get workflow steps
    const workflow = tor.bidang?.workflows?.[0];
    
    if (!workflow || !workflow.steps || workflow.steps.length === 0) {
      return NextResponse.json(
        { message: "Workflow untuk bidang ini belum dikonfigurasi" },
        { status: 400 }
      );
    }

    // Find current step
    const currentStep = workflow.steps.find(
      (step) => step.stepNumber === tor.currentStepNumber
    );

    if (!currentStep) {
      return NextResponse.json(
        { message: "Current step tidak valid" },
        { status: 400 }
      );
    }

    // ====== CEK HAK APPROVE ======
    const canApprove =
      dbUser.isSuperAdmin ||
      (!!dbUser.positionId && dbUser.positionId === currentStep.positionId);

    if (!canApprove) {
      return NextResponse.json(
        { message: "Anda tidak memiliki hak approve pada tahap ini" },
        { status: 403 }
      );
    }

    // 1. Catat approval pada history
    await prisma.torApprovalHistory.create({
      data: {
        torId: tor.id,
        stepNumber: currentStep.stepNumber,
        action: "APPROVE",
        fromStatusStage: tor.statusStage,
        toStatusStage: currentStep.isLastStep ? "APPROVAL_4_1" : workflow.steps[tor.currentStepNumber]?.statusStage || tor.statusStage,
        actedByUserId: dbUser.id,
        actedByNameSnapshot: dbUser.name,
        actedByPositionSnapshot: dbUser.position?.name || "Unknown",
        note: "Disetujui",
      },
    });

    // 2. Tentukan step berikutnya / final
    let nextStatusStage = tor.statusStage;
    let nextStepNumber = tor.currentStepNumber;

    if (currentStep.isLastStep) {
      // Step terakhir → TOR selesai
      nextStatusStage = "APPROVAL_4_1";
      nextStepNumber = currentStep.stepNumber; // tetap di step terakhir
      
      await prisma.tor.update({
        where: { id: tor.id },
        data: {
          statusStage: nextStatusStage,
          currentStepNumber: nextStepNumber,
          isFinalApproved: true,
        },
      });
    } else {
      // Cari step berikutnya
      const nextStep = workflow.steps.find(
        (step) => step.stepNumber === currentStep.stepNumber + 1
      );

      if (nextStep) {
        nextStatusStage = nextStep.statusStage;
        nextStepNumber = nextStep.stepNumber;
      }

      await prisma.tor.update({
        where: { id: tor.id },
        data: {
          statusStage: nextStatusStage,
          currentStepNumber: nextStepNumber,
        },
      });
    }

    return NextResponse.json({
      message: "TOR berhasil di-approve",
      statusStage: nextStatusStage,
      currentStepNumber: nextStepNumber,
    });
  } catch (error: any) {
    console.error("Approve error:", error);
    return NextResponse.json(
      { message: error.message || "Gagal approve TOR" },
      { status: 500 }
    );
  }
}