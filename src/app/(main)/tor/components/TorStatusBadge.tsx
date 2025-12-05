"use client";

import { FileText, CheckCircle, RotateCcw, XCircle, FileEdit, Send } from "lucide-react";

interface TorStatusBadgeProps {
  status: string;
  isFinalApproved?: boolean;
  className?: string;
  showIcon?: boolean;
}

const statusConfig = {
  DRAFT: {
    label: "Draft",
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: FileEdit,
    description: "TOR is being created",
  },
  APPROVAL_1: {
    label: "Approval 1",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Send,
    description: "Awaiting first approval",
  },
  APPROVAL_2: {
    label: "Approval 2",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Send,
    description: "Awaiting second approval",
  },
  APPROVAL_3: {
    label: "Approval 3",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Send,
    description: "Awaiting third approval",
  },
  APPROVAL_4: {
    label: "Approval 4",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Send,
    description: "Awaiting fourth approval",
  },
  APPROVAL_4_1: {
    label: "Final Approval",
    color: "bg-blue-100 text-blue-700 border-blue-300",
    icon: Send,
    description: "Awaiting final approval",
  },
  REVISE: {
    label: "Needs Revision",
    color: "bg-orange-100 text-orange-700 border-orange-300",
    icon: RotateCcw,
    description: "Returned for revision",
  },
  APPROVED: {
    label: "Approved",
    color: "bg-green-100 text-green-700 border-green-300",
    icon: CheckCircle,
    description: "Fully approved",
  },
  REJECTED: {
    label: "Rejected",
    color: "bg-red-100 text-red-700 border-red-300",
    icon: XCircle,
    description: "TOR was rejected",
  },
};

export default function TorStatusBadge({
  status,
  isFinalApproved = false,
  className = "",
  showIcon = true,
}: TorStatusBadgeProps) {
  // Override status if final approved
  const effectiveStatus = isFinalApproved ? "APPROVED" : status;
  
  const config = statusConfig[effectiveStatus as keyof typeof statusConfig] || {
    label: status,
    color: "bg-gray-100 text-gray-700 border-gray-300",
    icon: FileText,
    description: "Unknown status",
  };

  const Icon = config.icon;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${config.color} ${className}`}
      title={config.description}
    >
      {showIcon && <Icon size={14} />}
      <span>{config.label}</span>
    </div>
  );
}
