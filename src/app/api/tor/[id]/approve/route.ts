import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { TorStatusStage } from "@prisma/client";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// POST /api/tor/[id]/approve
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    const { id } = await context.params;
    const torId = parseInt(id);

    // 1. Get TOR with Bidang info
    const tor = await prisma.tor.findUnique({
      where: { id: torId },
      include: {
        bidang: true,
      },
    });

    if (!tor) {
      return NextResponse.json({ message: "ToR not found" }, { status: 404 });
    }

    // 2. Validate Status
    if (tor.statusStage === "DRAFT" || tor.statusStage === "REVISE") {
      return NextResponse.json(
        { message: "ToR is not in an approval stage" },
        { status: 400 }
      );
    }

    if (tor.isFinalApproved) {
      return NextResponse.json(
        { message: "ToR is already fully approved" },
        { status: 400 }
      );
    }

    // 3. Get Workflow and Current Step
    const workflow = await prisma.workflow.findUnique({
      where: { bidangId: tor.bidangId },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json(
        { message: "Workflow not found" },
        { status: 500 }
      );
    }

    const currentStep = workflow.steps.find(
      (s) => s.stepNumber === tor.currentStepNumber
    );

    if (!currentStep) {
      return NextResponse.json(
        { message: "Current workflow step not found" },
        { status: 500 }
      );
    }

    // 4. Check Permission (User Position must match Step Position)
    // Note: Super Admin might be able to bypass, but strictly for approval workflow, usually it's role based.
    // For now, let's strictly enforce position match unless it's super admin for debugging.
    if (user.positionId !== currentStep.positionId && !user.isSuperAdmin) {
      return NextResponse.json(
        { message: "You are not authorized to approve this step" },
        { status: 403 }
      );
    }

    // 5. Determine Next State
    let nextStepNumber = tor.currentStepNumber;
    let nextStatusStage = tor.statusStage;
    let isFinal = false;

    if (currentStep.isLastStep) {
      isFinal = true;
      // Status stage remains the same (e.g. APPROVAL_4) but isFinalApproved becomes true
    } else {
      const nextStep = workflow.steps.find(
        (s) => s.stepNumber === tor.currentStepNumber + 1
      );
      if (!nextStep) {
        // Should not happen if isLastStep is configured correctly
        return NextResponse.json(
          { message: "Next step not found configuration error" },
          { status: 500 }
        );
      }
      nextStepNumber = nextStep.stepNumber;
      nextStatusStage = nextStep.statusStage;
    }

    // 6. Update TOR
    const updatedTor = await prisma.tor.update({
      where: { id: torId },
      data: {
        currentStepNumber: nextStepNumber,
        statusStage: nextStatusStage as any,
        isFinalApproved: isFinal,
      },
    });

    // 7. Log History
    await prisma.torApprovalHistory.create({
      data: {
        torId: torId,
        stepNumber: tor.currentStepNumber,
        action: "APPROVE",
        fromStatusStage: tor.statusStage,
        toStatusStage: nextStatusStage,
        actedByUserId: user.id,
        actedByNameSnapshot: user.name,
        actedByPositionSnapshot: user.position?.name || "Unknown",
        note: isFinal ? "Final Approval Granted" : "Approved, proceeding to next step",
      },
    });

    return NextResponse.json({
      message: "ToR approved successfully",
      tor: updatedTor,
    });
  } catch (error: any) {
    console.error("Error approving ToR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to approve ToR" },
      { status: 500 }
    );
  }
}
