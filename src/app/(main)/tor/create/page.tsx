import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TorFormLayout from "./TorFormLayout";

interface PageProps {
  searchParams?: Promise<{
    id?: string;
  }>;
}

export default async function CreateTorPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const user = await getCurrentUser();

  // Get user's bidang info
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      position: {
        include: {
          bidang: true,
        },
      },
    },
  });

  if (!dbUser || !dbUser.position) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">User position not found. Please contact administrator.</p>
      </div>
    );
  }

  const bidangId = dbUser.position.bidangId;
  const bidangName = dbUser.position.bidang?.name || "Unknown";
  const creatorName = dbUser.name;

  // If editing existing ToR
  if (params?.id) {
    const torId = parseInt(params.id);
    const tor = await prisma.tor.findUnique({
      where: { id: torId },
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

    if (!tor) {
      redirect("/tor");
    }

    // Check access
    if (tor.creatorUserId !== user.id && !dbUser.isSuperAdmin) {
      redirect("/tor");
    }

    // Convert to form data format
    const initialData = {
      ...tor,
      creationDate: tor.creationDate?.toISOString().split("T")[0],
      projectStartDate: tor.projectStartDate?.toISOString().split("T")[0],
      projectEndDate: tor.projectEndDate?.toISOString().split("T")[0],
      budgetItems: tor.budgetItems.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.totalPrice),
      })),
      subtotal: tor.subtotal ? Number(tor.subtotal) : undefined,
      ppn: tor.ppn ? Number(tor.ppn) : undefined,
      pph: tor.pph ? Number(tor.pph) : undefined,
      grandTotal: tor.grandTotal ? Number(tor.grandTotal) : undefined,
      materialJasaValue: tor.materialJasaValue ? Number(tor.materialJasaValue) : undefined,
      budgetAmount: tor.budgetAmount ? Number(tor.budgetAmount) : undefined,
    };

    return (
      <TorFormLayout
        torId={torId}
        initialData={initialData}
        bidangId={bidangId}
        bidangName={bidangName}
        creatorName={creatorName}
      />
    );
  }

  // Creating new ToR
  return (
    <TorFormLayout
      bidangId={bidangId}
      bidangName={bidangName}
      creatorName={creatorName}
    />
  );
}
