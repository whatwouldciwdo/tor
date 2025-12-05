"use client";

import { CheckCircle, XCircle, RotateCcw, Send, FileEdit, Download } from "lucide-react";

interface ApprovalHistoryEntry {
  id: number;
  action: string;
  fromStatusStage: string | null;
  toStatusStage: string;
  actedByNameSnapshot: string;
  actedByPositionSnapshot: string;
  note: string | null;
  createdAt: string | Date;
  stepNumber: number;
}

interface ApprovalHistoryTimelineProps {
  history: ApprovalHistoryEntry[];
  className?: string;
}

const actionConfig = {
  SUBMIT: {
    label: "Submitted",
    icon: Send,
    color: "bg-blue-100 text-blue-700 border-blue-300",
    iconBg: "bg-blue-500",
  },
  APPROVE: {
    label: "Approved",
    icon: CheckCircle,
    color: "bg-green-100 text-green-700 border-green-300",
    iconBg: "bg-green-500",
  },
  REVISE: {
    label: "Revision Requested",
    icon: RotateCcw,
    color: "bg-orange-100 text-orange-700 border-orange-300",
    iconBg: "bg-orange-500",
  },
  REJECT: {
    label: "Rejected",
    icon: XCircle,
    color: "bg-red-100 text-red-700 border-red-300",
    iconBg: "bg-red-500",
  },
  EXPORT: {
    label: "Exported",
    icon: Download,
    color: "bg-purple-100 text-purple-700 border-purple-300",
    iconBg: "bg-purple-500",
  },
};

export default function ApprovalHistoryTimeline({
  history,
  className = "",
}: ApprovalHistoryTimelineProps) {
  if (!history || history.length === 0) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-8 text-center ${className}`}>
        <FileEdit className="mx-auto text-gray-400 mb-2" size={48} />
        <p className="text-gray-500 text-sm">No approval history yet</p>
      </div>
    );
  }

  // Sort by createdAt descending (newest first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Approval History</h3>
      
      <div className="space-y-4">
        {sortedHistory.map((entry, index) => {
          const config =
            actionConfig[entry.action as keyof typeof actionConfig] || actionConfig.SUBMIT;
          const Icon = config.icon;
          const isLast = index === sortedHistory.length - 1;

          return (
            <div key={entry.id} className="flex gap-4">
              {/* Timeline Line & Icon */}
              <div className="flex flex-col items-center">
                {/* Icon */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${config.iconBg} flex-shrink-0`}
                >
                  <Icon size={20} />
                </div>

                {/* Connecting Line */}
                {!isLast && <div className="w-0.5 h-full min-h-[40px] bg-gray-200 mt-2" />}
              </div>

              {/* Content Card */}
              <div className="flex-1 pb-6">
                <div className={`border-2 rounded-lg p-4 ${config.color}`}>
                  {/* Action Header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-sm">{config.label}</h4>
                      <p className="text-xs opacity-80 mt-0.5">
                        {entry.fromStatusStage || "DRAFT"} → {entry.toStatusStage}
                      </p>
                    </div>
                    <span className="text-xs opacity-70 whitespace-nowrap">
                      Step {entry.stepNumber}
                    </span>
                  </div>

                  {/* Actor Information */}
                  <div className="text-sm mb-2">
                    <p className="font-medium">{entry.actedByNameSnapshot}</p>
                    <p className="text-xs opacity-80">{entry.actedByPositionSnapshot}</p>
                  </div>

                  {/* Note */}
                  {entry.note && (
                    <div className="mt-2 p-2 bg-white/50 rounded text-xs italic">
                      "{entry.note}"
                    </div>
                  )}

                  {/* Timestamp */}
                  <div className="mt-3 text-xs opacity-70">
                    {new Date(entry.createdAt).toLocaleString("id-ID", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
