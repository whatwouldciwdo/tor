"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, User, Calendar, TrendingUp, DollarSign, Trash2 } from "lucide-react";
import ApprovalProgressBar from "./components/ApprovalProgressBar";
import TorStatusBadge from "./components/TorStatusBadge";

type TorListItemProps = {
  tor: any;
  isCreator: boolean;
  view: "mine" | "approve";
  workflowSteps?: any[];
};

export default function TorListItem({ tor, isCreator, view, workflowSteps = [] }: TorListItemProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!confirm("Are you sure you want to delete this ToR? This action cannot be undone.")) return;

    try {
      setSubmitting(true);
      const res = await fetch(`/api/tor/${tor.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to delete ToR");
      }

      alert("ToR deleted successfully!");
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
      className="block bg-[#1f1f1f] border border-[#333] rounded-xl hover:border-[#42ff6b] hover:shadow-lg hover:shadow-[#42ff6b]/10 transition-all duration-200 overflow-hidden group"
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white group-hover:text-[#42ff6b] transition-colors line-clamp-1">
                  {tor.title || "Tanpa Judul"}
                </h3>
                <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                  {tor.description || "No description"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <TorStatusBadge 
            status={tor.statusStage} 
            isFinalApproved={tor.isFinalApproved}
            className="ml-3 flex-shrink-0"
          />
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-4 text-xs text-gray-400 mb-4">
          <div className="flex items-center gap-1.5">
            <TrendingUp size={14} className="text-[#42ff6b]" />
            <span>{tor.bidang?.name || "-"}</span>
          </div>
          
          {view === "approve" && (
            <div className="flex items-center gap-1.5">
              <User size={14} className="text-[#42ff6b]" />
              <span>{tor.creator?.name || "-"}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1.5">
            <Calendar size={14} className="text-[#42ff6b]" />
            <span>{new Date(tor.createdAt).toLocaleDateString("id-ID")}</span>
          </div>

          {tor.budgetAmount && (
            <div className="flex items-center gap-1.5 font-medium text-[#42ff6b]">
              <DollarSign size={14} />
              <span>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: tor.budgetCurrency || "IDR",
                  minimumFractionDigits: 0,
                }).format(tor.budgetAmount)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar - only show if not DRAFT */}
        {tor.statusStage !== "DRAFT" && workflowSteps.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#333]">
            <ApprovalProgressBar
              workflowSteps={workflowSteps}
              currentStepNumber={tor.currentStepNumber || 0}
              isFinalApproved={tor.isFinalApproved || false}
              variant="compact"
            />
          </div>
        )}

        {/* Action Buttons */}
        {view === "mine" && isCreator && tor.statusStage === "DRAFT" && (
          <div className="mt-4 pt-4 border-t border-[#333] flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 sm:flex-initial px-4 py-2 bg-[#42ff6b] text-black text-sm font-medium rounded-lg hover:bg-[#38e05c] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors shadow-lg shadow-[#42ff6b]/20"
            >
              <Send size={16} />
              {submitting ? "Submitting..." : "Submit for Approval"}
            </button>
            <button
              onClick={handleDelete}
              disabled={submitting}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              title="Delete ToR"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </Link>
  );
}
