// src/app/(main)/tor/page.tsx
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type PageProps = {
  searchParams?: Promise<{
    view?: string;
  }>;
};

export default async function TorListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionUser = await getCurrentUser();
  const view = params?.view === "approve" ? "approve" : "mine";

  const dbUser = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      positionId: true,
      isSuperAdmin: true,
    },
  });

  const isSuperAdmin = dbUser?.isSuperAdmin ?? false;

  let torList: any[] = [];

  if (view === "mine") {
    // === TOR SAYA ===
    torList = await prisma.tor.findMany({
      where: isSuperAdmin
        ? {} // super admin boleh lihat semua
        : { creatorUserId: sessionUser.id },
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
    // === TOR YANG PERLU SAYA APPROVE ===
    if (!isSuperAdmin && !dbUser?.positionId) {
      torList = [];
    } else {
      // Ambil workflow steps yang sesuai dengan posisi user
      const workflows = await prisma.workflow.findMany({
        include: {
          steps: {
            where: isSuperAdmin
              ? {} // super admin bisa approve semua
              : { positionId: dbUser!.positionId! },
          },
        },
      });

      // Collect step numbers yang bisa di-approve user ini
      const approveableStepNumbers = new Set<number>();
      workflows.forEach((wf) => {
        wf.steps.forEach((step) => {
          approveableStepNumbers.add(step.stepNumber);
        });
      });

      if (approveableStepNumbers.size > 0 || isSuperAdmin) {
        torList = await prisma.tor.findMany({
          where: {
            statusStage: { not: "DRAFT" },
            isFinalApproved: false,
            ...(isSuperAdmin
              ? {}
              : {
                  currentStepNumber: {
                    in: Array.from(approveableStepNumbers),
                  },
                }),
          },
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
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header + tombol create */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Daftar TOR</h1>

          <Link
            href="/tor/create"
            className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
          >
            + Buat TOR
          </Link>
        </div>

        {/* Tabs filter */}
        <div className="flex gap-2 text-sm">
          <Link
            href="/tor"
            className={`px-3 py-1.5 rounded-lg border border-[#444] ${
              view === "mine" ? "bg-blue-600" : "bg-[#333]"
            }`}
          >
            TOR Saya
          </Link>
          <Link
            href="/tor?view=approve"
            className={`px-3 py-1.5 rounded-lg border border-[#444] ${
              view === "approve" ? "bg-blue-600" : "bg-[#333]"
            }`}
          >
            Perlu Persetujuan Saya
          </Link>
        </div>

        {/* List TOR */}
        <div className="space-y-3">
          {torList.map((tor) => (
            <Link
              key={tor.id}
              href={`/tor/${tor.id}`}
              className="block p-4 bg-[#333] rounded-lg hover:bg-[#3a3a3a]"
            >
              <div className="text-lg font-medium">
                {tor.title || "Tanpa Judul"}
              </div>

              {/* Info utama */}
              {view === "mine" ? (
                <div className="text-sm text-gray-300">
                  {tor.bidang?.name ?? "-"} — {tor.statusStage}
                </div>
              ) : (
                <div className="text-sm text-gray-300 space-y-0.5">
                  <div>
                    Bidang: {tor.bidang?.name ?? "-"} — Status: {tor.statusStage}
                  </div>
                  <div>
                    Step: {tor.currentStepNumber} | Pengusul:{" "}
                    {tor.creator?.name ?? "-"}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-400">
                {new Date(tor.createdAt).toLocaleString("id-ID")}
              </div>
            </Link>
          ))}

          {torList.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-8">
              {view === "mine"
                ? "Belum ada TOR."
                : "Belum ada TOR yang menunggu persetujuan Anda."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}