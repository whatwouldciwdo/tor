import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.lampiranTemplate.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        description: true,
        renderMode: true,
        tpgColumns: true,
        itpColumns: true,
        drsColumns: true,
        pgrsColumns: true,
        technicalParticulars: true,
        inspectionTestingPlans: true,
        documentRequestSheets: true,
        performanceGuarantees: true,
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching lampiran templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
