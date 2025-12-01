// src/app/(main)/tor/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import TorDetailClient from "./TorDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function TorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const sessionUser = await getCurrentUser();

  const [tor, dbUser] = await Promise.all([
    prisma.tor.findUnique({
      where: { id: parseInt(id) },
      include: {
        bidang: {
          include: {
            workflows: {
              include: {
                steps: {
                  orderBy: { stepNumber: "asc" }
                }
              }
            }
          }
        },
        creator: {
          include: {
            position: true,
          },
        },
        history: {
          include: {
            actedBy: {
              include: {
                position: true,
              },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    }),
    prisma.user.findUnique({
      where: { id: sessionUser.id },
      select: { id: true, positionId: true, isSuperAdmin: true },
    }),
  ]);

  if (!tor) {
    return (
      <div className="min-h-screen bg-[#262626] text-white flex items-center justify-center">
        <div>TOR tidak ditemukan.</div>
      </div>
    );
  }

  const canSubmit =
    tor.creatorUserId === sessionUser.id && tor.statusStage === "DRAFT";

  const workflow = tor.bidang?.workflows?.[0];
  const currentStep = workflow?.steps?.find(
    (step) => step.stepNumber === tor.currentStepNumber
  );

  const canApprove =
    tor.statusStage !== "DRAFT" &&
    !tor.isFinalApproved &&
    !!dbUser &&
    (dbUser.isSuperAdmin ||
      (currentStep && dbUser.positionId === currentStep.positionId));

  return (
    <div className="min-h-screen bg-[#262626] text-white px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Detail TOR</h1>

          <Link
            href="/tor"
            className="px-3 py-1.5 rounded-lg bg-[#333] text-sm hover:bg-[#404040]"
          >
            &larr; Kembali ke daftar
          </Link>
        </div>

        <div className="space-y-2 bg-[#333] rounded-lg p-4">
          <div className="text-lg font-semibold">
            {tor.title || "Tanpa Judul"}
          </div>
          <div className="text-sm text-gray-300">
            Nomor: {tor.number || "-"}
          </div>
          <div className="text-sm text-gray-300">
            Bidang: {tor.bidang?.name ?? "-"}
          </div>
          <div className="text-sm text-gray-300">
            Dibuat oleh: {tor.creator?.name ?? "-"} ({tor.creator?.position?.name ?? "-"})
          </div>
          <div className="text-sm text-gray-300">
            Status: <span className="font-medium">{tor.statusStage}</span>
          </div>
          <div className="text-sm text-gray-300">
            Step saat ini: {tor.currentStepNumber}
            {currentStep && ` - ${currentStep.label}`}
          </div>
          {tor.isFinalApproved && (
            <div className="text-sm text-green-400 font-semibold">
              ✅ TOR sudah disetujui lengkap
            </div>
          )}
          <div className="text-xs text-gray-400">
            Dibuat: {new Date(tor.createdAt).toLocaleString("id-ID")}
          </div>
        </div>

        {/* History approval */}
        <div className="bg-[#333] rounded-lg p-4 space-y-3">
          <div className="font-semibold text-sm">Riwayat Persetujuan</div>
          {tor.history.length === 0 && (
            <div className="text-xs text-gray-400">Belum ada riwayat.</div>
          )}

          <div className="space-y-2">
            {tor.history.map((h) => (
              <div
                key={h.id}
                className="text-xs border-b border-[#444] pb-2 last:border-0 last:pb-0"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{h.action}</span>
                  <span className="text-gray-400">
                    {new Date(h.createdAt).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="text-gray-300">
                  {h.fromStatusStage && `${h.fromStatusStage} → `}
                  {h.toStatusStage}
                </div>
                <div className="text-gray-300">
                  Oleh: {h.actedBy?.name ?? h.actedByNameSnapshot} ({h.actedByPositionSnapshot})
                </div>
                {h.note && (
                  <div className="text-gray-400 italic">{h.note}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <TorDetailClient
          torId={tor.id.toString()}
          status={tor.statusStage}
          canSubmit={canSubmit}
          canApprove={canApprove}
        />
      </div>
    </div>
  );
}