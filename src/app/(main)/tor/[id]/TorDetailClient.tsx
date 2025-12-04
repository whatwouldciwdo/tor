"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, AlertCircle, Send } from "lucide-react";

type Props = {
  torId: string;
  status: string;
  canSubmit: boolean;
  canApprove: boolean;
};

export default function TorDetailClient({
  torId,
  status,
  canSubmit,
  canApprove,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<null | "submit" | "approve" | "revise" | "reject">(null);
  const [error, setError] = useState<string | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [showNoteModal, setShowNoteModal] = useState<"revise" | "reject" | null>(null);

  async function handleSubmit() {
    if (!confirm("Apakah Anda yakin ingin mengajukan TOR ini?")) return;
    try {
      setLoading("submit");
      setError(null);

      const res = await fetch(`/api/tor/${torId}/submit`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal mengajukan TOR");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleApprove() {
    if (!confirm("Apakah Anda yakin ingin menyetujui TOR ini?")) return;
    try {
      setLoading("approve");
      setError(null);

      const res = await fetch(`/api/tor/${torId}/approve`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Gagal menyetujui TOR");
      }

      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  async function handleActionWithNote() {
    if (!showNoteModal) return;
    if (!actionNote.trim()) {
      setError("Catatan wajib diisi");
      return;
    }

    const action = showNoteModal;
    try {
      setLoading(action);
      setError(null);

      const res = await fetch(`/api/tor/${torId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: actionNote }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Gagal melakukan aksi ${action}`);
      }

      setShowNoteModal(null);
      setActionNote("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        {canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={loading !== null}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            <Send size={18} />
            {loading === "submit" ? "Mengajukan..." : "Ajukan TOR"}
          </button>
        )}

        {canApprove && (
          <>
            <button
              onClick={handleApprove}
              disabled={loading !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              <CheckCircle size={18} />
              {loading === "approve" ? "Menyetujui..." : "Setujui"}
            </button>

            <button
              onClick={() => setShowNoteModal("revise")}
              disabled={loading !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              <AlertCircle size={18} />
              Revisi
            </button>

            <button
              onClick={() => setShowNoteModal("reject")}
              disabled={loading !== null}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
            >
              <XCircle size={18} />
              Tolak
            </button>
          </>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Modal for Note */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#333] rounded-xl shadow-xl w-full max-w-md p-6 space-y-4 border border-[#444]">
            <h3 className="text-lg font-semibold text-white">
              {showNoteModal === "revise" ? "Permintaan Revisi" : "Tolak TOR"}
            </h3>
            
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Catatan / Alasan {showNoteModal === "revise" ? "Revisi" : "Penolakan"} <span className="text-red-400">*</span>
              </label>
              <textarea
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="w-full px-3 py-2 bg-[#222] border border-[#444] rounded-lg text-white focus:outline-none focus:border-blue-500 min-h-[100px]"
                placeholder="Tuliskan catatan anda disini..."
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  setShowNoteModal(null);
                  setActionNote("");
                  setError(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#444] hover:bg-[#555] text-gray-200 text-sm font-medium"
              >
                Batal
              </button>
              <button
                onClick={handleActionWithNote}
                disabled={loading !== null || !actionNote.trim()}
                className={`px-4 py-2 rounded-lg text-white text-sm font-medium ${
                  showNoteModal === "revise" 
                    ? "bg-yellow-600 hover:bg-yellow-700" 
                    : "bg-red-600 hover:bg-red-700"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === showNoteModal ? "Memproses..." : "Kirim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
