"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const [loading, setLoading] = useState<null | "submit" | "approve">(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    try {
      setLoading("submit");
      setError(null);

      const res = await fetch(`/tor/${torId}/submit`, {
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
    try {
      setLoading("approve");
      setError(null);

      const res = await fetch(`/tor/${torId}/approve`, {
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

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        {canSubmit && (
          <button
            onClick={handleSubmit}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "submit" ? "Mengajukan..." : "Ajukan TOR"}
          </button>
        )}

        {canApprove && (
          <button
            onClick={handleApprove}
            disabled={loading !== null}
            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading === "approve" ? "Menyetujui..." : "Setujui TOR (test)"}
          </button>
        )}
      </div>

      {error && <div className="text-sm text-red-400">{error}</div>}

      <div className="text-xs text-gray-400">
        Status saat ini: <span className="font-medium">{status}</span>
      </div>
    </div>
  );
}
