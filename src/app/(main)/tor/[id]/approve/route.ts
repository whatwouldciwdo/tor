// src/app/(main)/tor/[id]/approve/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteParams = {
  params: { id: string };
};

export async function POST(req: Request, { params }: RouteParams) {
  const sessionUser = await getCurrentUser();

  // ambil user dari DB biar pasti ada positionId & isSuperAdmin
  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { id: true, positionId: true, isSuperAdmin: true },
  });

  if (!dbUser) {
    return NextResponse.json(
      { message: "User tidak ditemukan" },
      { status: 401 }
    );
  }

  const tor = await prisma.tor.findUnique({
    where: { id: params.id },
    include: {
      workflow: true,
      currentStep: true,
    },
  });

  if (!tor) {
    return NextResponse.json(
      { message: "TOR tidak ditemukan" },
      { status: 404 }
    );
  }

  if (tor.status !== "submitted") {
    return NextResponse.json(
      { message: "Hanya TOR submitted yang bisa diproses approve" },
      { status: 400 }
    );
  }

  if (!tor.workflowId || !tor.currentStepId) {
    return NextResponse.json(
      { message: "TOR belum terhubung dengan workflow / currentStep" },
      { status: 400 }
    );
  }

  const currentStep = await prisma.workflowStep.findUnique({
    where: { id: tor.currentStepId },
  });

  if (!currentStep) {
    return NextResponse.json(
      { message: "Current step pada TOR tidak valid" },
      { status: 400 }
    );
  }

  // ====== CEK HAK APPROVE ======
  const canApprove =
    dbUser.isSuperAdmin ||
    (!!dbUser.positionId &&
      dbUser.positionId === currentStep.positionId);

  if (!canApprove) {
    return NextResponse.json(
      { message: "Anda tidak memiliki hak approve pada tahap ini" },
      { status: 403 }
    );
  }

  // 1. catat approval pada history
  await prisma.torApprovalHistory.create({
    data: {
      torId: tor.id,
      stepId: currentStep.id,
      actorId: dbUser.id,
      action: "approved",
      note: "Disetujui",
    },
  });

  // 2. tentukan step berikut / final
  let finalStatus = tor.status;
  let nextCurrentStepId: string | null = tor.currentStepId;

  if (currentStep.isLastStep) {
    // step terakhir → TOR dinyatakan approved
    finalStatus = "approved";
    nextCurrentStepId = null;
  } else {
    // cari step dengan stepNumber terbesar berikutnya
    const nextStep = await prisma.workflowStep.findFirst({
      where: {
        workflowId: tor.workflowId,
        stepNumber: { gt: currentStep.stepNumber },
      },
      orderBy: { stepNumber: "asc" },
    });

    if (!nextStep) {
      // fallback kalau isLastStep belum di-set tapi step habis
      finalStatus = "approved";
      nextCurrentStepId = null;
    } else {
      finalStatus = "submitted";
      nextCurrentStepId = nextStep.id;
    }
  }

  const updatedTor = await prisma.tor.update({
    where: { id: tor.id },
    data: {
      status: finalStatus,
      currentStepId: nextCurrentStepId,
    },
  });

  return NextResponse.json({
    id: updatedTor.id,
    status: updatedTor.status,
    currentStepId: updatedTor.currentStepId,
  });
}
