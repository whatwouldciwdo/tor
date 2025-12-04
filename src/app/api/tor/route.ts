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

// POST /api/tor - Create new ToR
export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();

    console.log("📝 Creating new TOR");
    console.log("   - Title:", body.title);
    console.log("   - coverImage:", body.coverImage);

    const {
      title,
      description,
      bidangId,
      coverImage,
      // Tab 1: Informasi Umum
      creationDate,
      creationYear,
      budgetType,
      workType,
      program,
      rkaYear,
      projectStartDate,
      projectEndDate,
      executionYear,
      materialJasaValue,
      budgetCurrency,
      budgetAmount,
      // Tab 2: Pendahuluan
      introduction,
      background,
      objective,
      scope,
      warranty,
      acceptanceCriteria,
      // Tab 3: Tahapan Pekerjaan
      duration,
      durationUnit,
      technicalSpec,
      generalProvisions,
      deliveryPoint,
      deliveryMechanism,
      workStages,
      workStagesExplanation,
      deliveryRequirements,
      handoverPoint,
      handoverMechanism,
      // Tab 4: Usulan
      directorProposal, // ⚠️ OLD FIELD (deprecated)
      fieldDirectorProposal, // ⚠️ OLD FIELD (deprecated)
      directorProposals, // ✅ NEW FIELD (Json array)
      fieldDirectorProposals, // ✅ NEW FIELD (Json array)
      vendorRequirements,
      procurementMethod,
      paymentTerms,
      penaltyRules,
      otherRequirements,
      subtotal,
      ppn,
      pph,
      grandTotal,
      // Tab 6: Lampiran
      technicalParticulars,
      inspectionTestingPlans,
      documentRequestSheets,
      performanceGuarantees,
      // Budget items
      budgetItems,
    } = body;

    // Use user's bidang if not specified
    const finalBidangId = bidangId || user.position?.bidangId;

    if (!finalBidangId) {
      return NextResponse.json(
        { message: "Bidang is required" },
        { status: 400 }
      );
    }

    const now = new Date();
    const torNumber = generateTorNumber(title, now);

    // Create ToR with all fields
    const tor = await prisma.tor.create({
      data: {
        number: torNumber,
        title,
        description,
        bidangId: finalBidangId,
        creatorUserId: user.id,
        coverImage,
        // Tab 1
        creationDate: creationDate ? new Date(creationDate) : now,
        creationYear: creationYear || now.getFullYear(),
        budgetType,
        workType,
        program,
        rkaYear,
        projectStartDate: projectStartDate ? new Date(projectStartDate) : null,
        projectEndDate: projectEndDate ? new Date(projectEndDate) : null,
        executionYear,
        materialJasaValue,
        budgetCurrency,
        budgetAmount,
        // Tab 2
        introduction,
        background,
        objective,
        scope,
        warranty,
        acceptanceCriteria,
        // Tab 3
        duration,
        durationUnit,
        technicalSpec,
        generalProvisions,
        deliveryPoint,
        deliveryMechanism,
        workStagesData: workStages || null,
        workStagesExplanation,
        deliveryRequirements,
        handoverPoint,
        handoverMechanism,
        // Tab 4
        directorProposal, // Keep for backward compatibility
        fieldDirectorProposal, // Keep for backward compatibility
        directorProposals: directorProposals || null, // ✅ NEW: Save Json array
        fieldDirectorProposals: fieldDirectorProposals || null, // ✅ NEW: Save Json array
        vendorRequirements,
        procurementMethod,
        paymentTerms,
        penaltyRules,
        otherRequirements,
        subtotal,
        ppn,
        pph,
        grandTotal,
        // Tab 6
        technicalParticulars,
        inspectionTestingPlans,
        documentRequestSheets,
        performanceGuarantees,
        // Budget items
        budgetItems: budgetItems
          ? {
              create: budgetItems.map((item: any, index: number) => ({
                item: item.item,
                description: item.description,
                quantity: item.quantity,
                unit: item.unit,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
                orderIndex: index,
              })),
            }
          : undefined,
      },
      include: {
        bidang: true,
        creator: {
          include: {
            position: true,
          },
        },
        budgetItems: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    console.log("✅ TOR created successfully!");
    console.log("   - ID:", tor.id);
    console.log("   - Number:", tor.number);
    console.log("   - coverImage:", tor.coverImage);
    console.log("   - directorProposals:", tor.directorProposals);
    console.log("   - fieldDirectorProposals:", tor.fieldDirectorProposals);

    return NextResponse.json(tor, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating ToR:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create ToR" },
      { status: 500 }
    );
  }
}

// GET /api/tor - Get list of ToRs
export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser(req);

    const { searchParams } = new URL(req.url);
    const view = searchParams.get("view") || "mine";

    let tors;

    if (view === "mine") {
      // Get ToRs created by user
      tors = await prisma.tor.findMany({
        where: user.isSuperAdmin ? {} : { creatorUserId: user.id },
        include: {
          bidang: true,
          creator: {
            include: {
              position: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Get ToRs that need approval from user
      tors = [];
    }

    return NextResponse.json(tors);
  } catch (error: any) {
    console.error("Error fetching ToRs:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch ToRs" },
      { status: 500 }
    );
  }
}