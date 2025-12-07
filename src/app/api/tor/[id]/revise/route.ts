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

    // 5. Update TOR to REVISE and reset step number
    // When revision is requested, reset currentStepNumber to 0 so the progress bar resets.
    // Creator can then edit and re-submit to start the approval workflow again.
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
        action: "REVISE",
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
      const { sendRevisionNotification } = await import("@/lib/email");
      
      const creator = await prisma.user.findUnique({
        where: { id: tor.creatorUserId },
      });

      if (creator?.email) {
        await sendRevisionNotification({
          to: creator.email,
          torNumber: tor.number || 'N/A',
          torTitle: tor.title,
          revisionNote: note,
          revisorName: user.name,
          editLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tor/${tor.id}`,
        });
      }
    } catch (emailError) {
      console.error("Failed to send revision notification email:", emailError);
      // Don't fail the revision if email fails
    }

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
