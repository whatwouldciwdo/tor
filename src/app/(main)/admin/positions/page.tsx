// src/app/(main)/admin/positions/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function PositionsListPage() {
  const positions = await prisma.position.findMany({
    include: { bidang: true },
    orderBy: [{ bidangId: "asc" }, { levelOrder: "asc" }],
  });

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10 md:px-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back to Admin */}
        <div className="mb-2">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-[#42ff6b] transition"
          >
            <span className="text-lg leading-none">←</span>
            <span>Kembali ke Panel Admin</span>
          </Link>
        </div>

        <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Master Jabatan</h1>
            <p className="text-xs text-gray-300">
              Kelola daftar jabatan yang terkait dengan bidang dan user.
            </p>
          </div>

          <Link
            href="/admin/positions/new"
            className="rounded-full bg-[#42ff6b] px-4 py-2 text-xs font-semibold text-black hover:bg-[#39e05d] transition"
          >
            + Tambah Jabatan
          </Link>
        </header>

        <section className="bg-[#1f1f1f] border border-[#42ff6b]/40 rounded-2xl p-4 md:p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Daftar Jabatan</h2>
            <span className="text-xs text-gray-400">
              Total: {positions.length} jabatan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#42ff6b]/40 text-xs uppercase text-gray-300">
                  <th className="py-2 pr-4 text-left">ID</th>
                  <th className="py-2 pr-4 text-left">Nama</th>
                  <th className="py-2 pr-4 text-left">Kode</th>
                  <th className="py-2 pr-4 text-left">Bidang</th>
                  <th className="py-2 pr-4 text-left">Global</th>
                  <th className="py-2 pr-4 text-left">Level</th>
                  <th className="py-2 pr-4 text-left">Status</th>
                  <th className="py-2 pr-0 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition"
                  >
                    <td className="py-2 pr-4 text-xs text-gray-300">#{p.id}</td>
                    <td className="py-2 pr-4 text-sm">{p.name}</td>
                    <td className="py-2 pr-4 text-xs text-gray-200">
                      {p.code || "-"}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-300">
                      {p.isGlobal ? "—" : p.bidang?.name ?? "-"}
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      {p.isGlobal ? (
                        <span className="inline-flex rounded-full bg-[#42ff6b] px-2 py-0.5 text-[10px] font-semibold text-black">
                          GLOBAL
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-gray-500 px-2 py-0.5 text-[10px] text-gray-300">
                          BIDANG
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-4 text-xs text-gray-200">
                      {p.levelOrder ?? "-"}
                    </td>
                    <td className="py-2 pr-4 text-xs">
                      {p.isActive ? (
                        <span className="inline-flex rounded-full bg-[#42ff6b] px-2 py-0.5 text-[10px] font-semibold text-black">
                          ACTIVE
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full border border-gray-500 px-2 py-0.5 text-[10px] text-gray-300">
                          INACTIVE
                        </span>
                      )}
                    </td>
                    <td className="py-2 pr-0 text-xs">
                      <Link
                        href={`/admin/positions/${p.id}`}
                        className="text-[#42ff6b] hover:underline"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}

                {positions.length === 0 && (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-6 text-center text-sm text-gray-400"
                    >
                      Belum ada jabatan terdaftar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
