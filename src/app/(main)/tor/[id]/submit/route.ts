// src/app/(main)/tor/[id]/submit/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteParams = {
  params: { id: string };
};

export async function POST(req: Request, { params }: RouteParams) {
  const sessionUser = await getCurrentUser();

  const tor = await prisma.tor.findUnique({
    where: { id: params.id },
    include: {
      bidang: true,
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

  // hanya creator atau super admin yg boleh submit
  if (
    tor.creatorId !== sessionUser.id &&
    !sessionUser.isSuperAdmin
  ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  if (tor.status !== "draft") {
    return NextResponse.json(
      { message: "Hanya TOR dengan status draft yang bisa diajukan" },
      { status: 400 }
    );
  }

  // 1. Tentukan workflow (berdasarkan bidang)
  let workflow = tor.workflow;

  if (!workflow) {
    workflow = await prisma.workflow.findFirst({
      where: { bidangId: tor.bidangId },
    });

    if (!workflow) {
      return NextResponse.json(
        { message: "Workflow untuk bidang ini belum dikonfigurasi" },
        { status: 400 }
      );
    }
  }

  // 2. Step pertama: stepNumber = 1
  const firstStep = await prisma.workflowStep.findUnique({
    where: {
      workflowId_stepNumber: {
        workflowId: workflow.id,
        stepNumber: 1,
      },
    },
  });

  if (!firstStep) {
    return NextResponse.json(
      { message: "Workflow belum memiliki tahapan" },
      { status: 400 }
    );
  }

  // 3. Update TOR → submitted + set workflow + current step
  const updatedTor = await prisma.tor.update({
    where: { id: tor.id },
    data: {
      status: "submitted",
      workflowId: workflow.id,
      currentStepId: firstStep.id,
    },
  });

  // 4. Catat history "submitted"
  await prisma.torApprovalHistory.create({
    data: {
      torId: tor.id,
      stepId: firstStep.id,
      actorId: sessionUser.id,
      action: "submitted",
      note: "Pengusul mengajukan TOR",
    },
  });

  return NextResponse.json({
    id: updatedTor.id,
    status: updatedTor.status,
    workflowId: workflow.id,
    currentStepId: firstStep.id,
  });
}
