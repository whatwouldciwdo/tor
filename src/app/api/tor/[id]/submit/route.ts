import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

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

// Generate TOR number: {title-slug}-{ddmmyyyy}-{ms}
function generateTorNumber(title: string, createdAt: Date): string {
  const titleSlug = (title || "draft")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 30);

  const day = String(createdAt.getDate()).padStart(2, "0");
  const month = String(createdAt.getMonth() + 1).padStart(2, "0");
  const year = createdAt.getFullYear();
  const dateStr = `${day}${month}${year}`;
  
  const ms = String(createdAt.getTime()).slice(-6);

  return `${titleSlug}-${dateStr}-${ms}`;
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

    // Can only submit if DRAFT or REVISE
    if (tor.statusStage !== "DRAFT" && tor.statusStage !== "REVISE") {
      return NextResponse.json(
        { message: "ToR is not in DRAFT or REVISE status" },
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

    // ✅ Generate final TOR number from title (if still draft number)
    const now = new Date();
    const finalTorNumber = generateTorNumber(tor.title || "untitled", tor.createdAt || now);

    // Update ToR to first approval step with final number
    const updatedTor = await prisma.tor.update({
      where: { id: parseInt(id) },
      data: {
        number: finalTorNumber, // ✅ Update to final number
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
        fromStatusStage: tor.statusStage, // Use actual current status (DRAFT or REVISE)
        toStatusStage: firstStep.statusStage,
        actedByUserId: user.id,
        actedByNameSnapshot: user.name,
        actedByPositionSnapshot: user.position?.name || "Unknown",
        note: tor.statusStage === "REVISE" ? "ToR re-submitted after revision" : "ToR submitted for approval",
      },
    });

    // Send email notification to first approver
    try {
      const { sendSubmitNotification } = await import("@/lib/email");
      
      // Get first approver
      const firstApprover = await prisma.user.findFirst({
        where: { 
          positionId: firstStep.positionId, 
          isActive: true 
        },
      });

      if (firstApprover?.email) {
        await sendSubmitNotification({
          to: firstApprover.email,
          torNumber: updatedTor.number || 'N/A',
          torTitle: updatedTor.title,
          creatorName: user.name,
          approvalLink: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/tor/${updatedTor.id}`,
        });
      }
    } catch (emailError) {
      console.error("Failed to send submit notification email:", emailError);
      // Don't fail the submission if email fails
    }

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
