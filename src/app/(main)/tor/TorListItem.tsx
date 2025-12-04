"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";

type TorListItemProps = {
  tor: any; // Using any for simplicity as per existing pattern, or define strict type if preferred
  isCreator: boolean;
  view: "mine" | "approve";
};

export default function TorListItem({ tor, isCreator, view }: TorListItemProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation();

    if (!confirm("Submit this ToR for approval?")) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/tor/${tor.id}/submit`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit ToR");
      }

      alert("ToR submitted successfully!");
      router.refresh();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Link
      href={`/tor/${tor.id}`}
      className="block p-4 bg-[#333] rounded-lg hover:bg-[#3a3a3a] group relative"
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
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

          <div className="text-xs text-gray-400 mt-1">
            {new Date(tor.createdAt).toLocaleString("id-ID")}
          </div>
        </div>

        {/* Submit Button for Drafts */}
        {view === "mine" && isCreator && tor.statusStage === "DRAFT" && (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="ml-4 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-colors z-10"
            title="Submit for Approval"
          >
            <Send size={14} />
            {submitting ? "..." : "Submit"}
          </button>
        )}
      </div>
    </Link>
  );
}
