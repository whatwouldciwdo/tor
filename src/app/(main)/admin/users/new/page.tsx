// src/app/(main)/admin/users/new/page.tsx
import { prisma } from "@/lib/prisma";
import UserForm, { type PositionOption } from "../UserForm";

export default async function NewUserPage() {
  const positions = await prisma.position.findMany({
    where: { isActive: true },
    include: { bidang: true },
    orderBy: [{ bidangId: "asc" }, { levelOrder: "asc" }],
  });

  const positionOptions: PositionOption[] = positions.map((p) => ({
    id: p.id,
    label: p.bidang
      ? `${p.bidang.name} — ${p.name}`
      : p.name,
  }));

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10 md:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Tambah User Baru</h1>
          <p className="text-xs text-gray-300">
            Form ini hanya dapat diakses oleh Super Admin.
          </p>
        </header>

        <section className="bg-[#1f1f1f] border border-[#42ff6b]/40 rounded-2xl p-4 md:p-6 shadow-lg">
          <UserForm mode="create" positions={positionOptions} />
        </section>
      </div>
    </div>
  );
}
