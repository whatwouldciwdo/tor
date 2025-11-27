// src/app/(main)/admin/bidang/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import BidangForm from "../BidangForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditBidangPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (Number.isNaN(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>ID bidang tidak valid.</p>
      </div>
    );
  }

  const bidang = await prisma.bidang.findUnique({
    where: { id },
  });

  if (!bidang) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>Bidang tidak ditemukan.</p>
      </div>
    );
  }

  const initialData = {
    id: bidang.id,
    name: bidang.name,
    code: bidang.code || "",
    isActive: bidang.isActive,
  };

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10 md:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Edit Bidang</h1>
          <p className="text-xs text-gray-300">
            Perbarui data bidang. Perubahan akan mempengaruhi pilihan jabatan.
          </p>
        </header>

        <section className="bg-[#1f1f1f] border border-[#42ff6b]/40 rounded-2xl p-4 md:p-6 shadow-lg">
          <BidangForm mode="edit" initialData={initialData} />
        </section>
      </div>
    </div>
  );
}
