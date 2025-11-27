// src/app/(main)/admin/positions/new/page.tsx
import { prisma } from "@/lib/prisma";
import PositionForm, { type BidangOption } from "../PositionForm";

export default async function NewPositionPage() {
  const bidangList = await prisma.bidang.findMany({
    where: { isActive: true },
    orderBy: { id: "asc" },
  });

  const bidangOptions: BidangOption[] = bidangList.map((b) => ({
    id: b.id,
    name: b.name,
  }));

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10 md:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Tambah Jabatan</h1>
          <p className="text-xs text-gray-300">
            Form ini hanya dapat diakses oleh Super Admin.
          </p>
        </header>

        <section className="bg-[#1f1f1f] border border-[#42ff6b]/40 rounded-2xl p-4 md:p-6 shadow-lg">
          <PositionForm mode="create" bidangOptions={bidangOptions} />
        </section>
      </div>
    </div>
  );
}
