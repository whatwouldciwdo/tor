// src/app/(main)/admin/users/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import UserForm, { type PositionOption } from "../UserForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  if (Number.isNaN(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>ID user tidak valid.</p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      position: {
        include: { bidang: true },
      },
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#262626] text-white">
        <p>User tidak ditemukan.</p>
      </div>
    );
  }

  const positions = await prisma.position.findMany({
    where: { isActive: true },
    include: { bidang: true },
    orderBy: [{ bidangId: "asc" }, { levelOrder: "asc" }],
  });

  const positionOptions: PositionOption[] = positions.map((p) => ({
    id: p.id,
    label: p.bidang ? `${p.bidang.name} — ${p.name}` : p.name,
  }));

  const initialData = {
    id: user.id,
    name: user.name,
    username: user.username || '',
    email: user.email,
    positionId: user.positionId,
    isSuperAdmin: user.isSuperAdmin,
    isActive: user.isActive,
  };

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10 md:px-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">Edit User</h1>
          <p className="text-xs text-gray-300">
            Perbarui informasi user. Kosongkan password jika tidak ingin diubah.
          </p>
        </header>

        <section className="bg-[#1f1f1f] border border-[#42ff6b]/40 rounded-2xl p-4 md:p-6 shadow-lg">
          <UserForm
            mode="edit"
            positions={positionOptions}
            initialData={initialData}
          />
        </section>
      </div>
    </div>
  );
}
