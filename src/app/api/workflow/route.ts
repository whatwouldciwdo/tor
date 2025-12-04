import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const bidangId = searchParams.get("bidangId");

    if (!bidangId) {
      return NextResponse.json(
        { message: "bidangId is required" },
        { status: 400 }
      );
    }

    const workflow = await prisma.workflow.findFirst({
      where: {
        bidangId: parseInt(bidangId),
        isActive: true,
      },
      include: {
        steps: {
          include: {
            position: {
              include: {
                users: true, // Include users who have this position
              },
            },
          },
          orderBy: {
            stepNumber: "asc",
          },
        },
      },
    });

    if (!workflow) {
      return NextResponse.json({
        message: "No workflow found for this bidang",
        steps: [],
      });
    }

    // Format the response to include user info
    const formattedSteps = workflow.steps.map((step) => ({
      id: step.id,
      stepNumber: step.stepNumber,
      label: step.label,
      position: {
        id: step.position.id,
        name: step.position.name,
        code: step.position.code,
      },
      // Get the first active user with this position (or null if none)
      user: step.position.users.find((u) => u.isActive) || null,
    }));

    return NextResponse.json({
      workflow: {
        id: workflow.id,
        name: workflow.name,
      },
      steps: formattedSteps,
    });
  } catch (error: any) {
    console.error("Error fetching workflow:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch workflow" },
      { status: 500 }
    );
  }
}
