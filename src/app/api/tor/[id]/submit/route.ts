import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.SECRET!;

// Helper to get current user from token
async function getCurrentUser(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    throw new Error("Unauthorized");
  }

  const decoded = jwt.verify(token, JWT_SECRET) as any;
  const user = await prisma.user.findUnique({
    where: { id: decoded.sub },
    include: {
      position: {
        include: {
          bidang: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}

type RouteContext = {
  params: Promise<{ id: string }>;
};

// POST /api/tor/[id]/submit - Submit ToR for approval
export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const user = await getCurrentUser(req);
    const { id } = await context.params;

    const tor = await prisma.tor.findUnique({
      where: { id: parseInt(id) },
      include: {
        bidang: true,
      },
    }) as any;

    if (!tor) {
      return NextResponse.json({ message: "ToR not found" }, { status: 404 });
    }

    // Only creator can submit
    if (tor.creatorUserId !== user.id && !user.isSuperAdmin) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    // Can only submit if DRAFT
    if (tor.statusStage !== "DRAFT") {
      return NextResponse.json(
        { message: "ToR is not in DRAFT status" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!tor.title || !tor.background || !tor.objective) {
      return NextResponse.json(
        { message: "Please fill in all required fields (Title, Background, Objective)" },
        { status: 400 }
      );
    }

    // Get workflow for this bidang
    const workflow = await prisma.workflow.findUnique({
      where: { bidangId: tor.bidangId },
      include: {
        steps: {
          orderBy: { stepNumber: "asc" },
        },
      },
    });

    if (!workflow || workflow.steps.length === 0) {
      return NextResponse.json(
        { message: "No workflow configured for this bidang" },
        { status: 400 }
      );
    }

    const firstStep = workflow.steps[0];

    // Update ToR to first approval step
    const updatedTor = await prisma.tor.update({
      where: { id: parseInt(id) },
      data: {
        statusStage: firstStep.statusStage,
        currentStepNumber: firstStep.stepNumber,
      },
      include: {
        bidang: true,
        creator: {
          include: {
            position: true,
          },
        },
      },
    });

    // Create approval history
    await prisma.torApprovalHistory.create({
      data: {
        torId: updatedTor.id,
        stepNumber: 0,
        action: "SUBMIT",
        fromStatusStage: "DRAFT",
        toStatusStage: firstStep.statusStage,
        actedByUserId: user.id,
        actedByNameSnapshot: user.name,
        actedByPositionSnapshot: user.position?.name || "Unknown",
        note: "ToR submitted for approval",
      },
    });

    return NextResponse.json({
      message: "ToR submitted successfully",
      tor: updatedTor,
    });
  } catch (error: any) {
    console.error("Error submitting ToR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to submit ToR" },
      { status: 500 }
    );
  }
}
