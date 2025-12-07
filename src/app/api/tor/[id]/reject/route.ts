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

    // 5. Update TOR - set to REVISE status and reset step number
    // Note: Schema doesn't have REJECTED status, so we use REVISE with REJECT action in history.
    // Reset currentStepNumber to 0 so creator can re-submit through full approval workflow.
    const updatedTor = await prisma.tor.update({
      where: { id: torId },
      data: {
        statusStage: "REVISE",
        currentStepNumber: 0, // Reset to 0 so progress bar resets
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

    // Send email notification to creator
    try {
      const { sendRejectionNotification } = await import("@/lib/email");
      
      const creator = await prisma.user.findUnique({
        where: { id: tor.creatorUserId },
      });

      if (creator?.email) {
        await sendRejectionNotification({
          to: creator.email,
          torNumber: tor.number || 'N/A',
          torTitle: tor.title,
          rejectorName: user.name,
          rejectionNote: note,
          viewLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tor/${tor.id}`,
        });
      }
    } catch (emailError) {
      console.error("Failed to send rejection notification email:", emailError);
      // Don't fail the rejection if email fails
    }

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
