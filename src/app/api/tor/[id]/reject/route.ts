import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

// POST /api/tor/[id]/reject
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser();
    const { id } = await context.params;
    const torId = parseInt(id);
    const body = await req.json();
    const { note } = body;

    if (!note) {
      return NextResponse.json(
        { message: "Rejection note is required" },
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
        { message: "You are not authorized to reject this step" },
        { status: 403 }
      );
    }

    // 5. Update TOR to REJECTED
    // Note: TorStatusStage enum does not have REJECTED in the schema I saw earlier?
    // Let me check schema.prisma content I read earlier.
    // enum TorActionType { SUBMIT, APPROVE, REVISE, REJECT, EXPORT }
    // enum TorStatusStage { DRAFT, APPROVAL_1, ... REVISE }
    // There is NO "REJECTED" status in TorStatusStage!
    // So "Reject" might just mean "Revise" effectively, or I need to add REJECTED to enum?
    // Or maybe it goes back to DRAFT?
    // For now, I will treat REJECT as REVISE but with action "REJECT".
    // OR, I should check if I can add REJECTED to schema.
    // The user said "jangan rubah apapun dulu" (don't change anything yet) regarding schema/seed?
    // Wait, the user said "jangan rubah apapun dulu" in the context of "analisa approval".
    // But if the schema doesn't support REJECTED, I can't set it.
    // I will set it to REVISE for now, but with action REJECT.
    
    const updatedTor = await prisma.tor.update({
      where: { id: torId },
      data: {
        statusStage: "REVISE", // Fallback since REJECTED enum is missing
      },
    });

    // 6. Log History
    await prisma.torApprovalHistory.create({
      data: {
        torId: torId,
        stepNumber: tor.currentStepNumber,
        action: "REJECT",
        fromStatusStage: tor.statusStage,
        toStatusStage: "REVISE",
        actedByUserId: user.id,
        actedByNameSnapshot: user.name,
        actedByPositionSnapshot: user.position?.name || "Unknown",
        note: note,
      },
    });

    return NextResponse.json({
      message: "ToR rejected (returned to revision)",
      tor: updatedTor,
    });
  } catch (error: any) {
    console.error("Error rejecting ToR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to reject ToR" },
      { status: 500 }
    );
  }
}
