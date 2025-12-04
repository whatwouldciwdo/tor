import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// POST /api/tor/[id]/revise
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    const { id } = await context.params;
    const torId = parseInt(id);
    const body = await req.json();
    const { note } = body;

    if (!note) {
      return NextResponse.json(
        { message: "Revision note is required" },
        { status: 400 }
      );
    }

    // 1. Get TOR
    const tor = await prisma.tor.findUnique({
      where: { id: torId },
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

    // 3. Get Workflow Step
    const workflow = await prisma.workflow.findUnique({
      where: { bidangId: tor.bidangId },
      include: { steps: true },
    });

    if (!workflow) return NextResponse.json({ message: "Workflow not found" }, { status: 500 });

    const currentStep = workflow.steps.find((s) => s.stepNumber === tor.currentStepNumber);
    if (!currentStep) return NextResponse.json({ message: "Step not found" }, { status: 500 });

    // 4. Check Permission
    if (user.positionId !== currentStep.positionId && !user.isSuperAdmin) {
      return NextResponse.json(
        { message: "You are not authorized to revise this step" },
        { status: 403 }
      );
    }

    // 5. Update TOR to REVISE
    // Usually revision goes back to DRAFT or a specific REVISE state where Creator can edit.
    // For simplicity, let's set statusStage to REVISE.
    const updatedTor = await prisma.tor.update({
      where: { id: torId },
      data: {
        statusStage: "REVISE",
        // Optional: Reset step number or keep it to know where it was revised from?
        // Usually we keep currentStepNumber or reset to 0. Let's reset to 0 (Draft-like) or keep it?
        // If we set to REVISE, the creator needs to be able to edit.
        // Let's assume REVISE state allows editing.
      },
    });

    // 6. Log History
    await prisma.torApprovalHistory.create({
      data: {
        torId: torId,
        stepNumber: tor.currentStepNumber,
        action: "REVISE",
        fromStatusStage: tor.statusStage,
        toStatusStage: "REVISE",
        actedByUserId: user.id,
        actedByNameSnapshot: user.name,
        actedByPositionSnapshot: user.position?.name || "Unknown",
        note: note,
      },
    });

    return NextResponse.json({
      message: "ToR requested for revision",
      tor: updatedTor,
    });
  } catch (error: any) {
    console.error("Error revising ToR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to revise ToR" },
      { status: 500 }
    );
  }
}
