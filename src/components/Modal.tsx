"use client";

import { useEffect } from "react";
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-[#1f1f1f] rounded-2xl shadow-2xl ${sizeClasses[size]} w-full max-h-[90vh] overflow-hidden border border-[#333]`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-[#333]">
            <h2 className="text-xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[#333] transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-160px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

export interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

export function AlertModal({
  isOpen,
  onClose,
  title,
  message,
  type = "info",
}: AlertModalProps) {
  const icons = {
    success: <CheckCircle size={48} className="text-green-500" />,
    error: <AlertCircle size={48} className="text-red-500" />,
    warning: <AlertTriangle size={48} className="text-yellow-500" />,
    info: <Info size={48} className="text-blue-500" />,
  };

  const defaultTitles = {
    success: "Berhasil",
    error: "Error",
    warning: "Peringatan",
    info: "Informasi",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-4">
        <div className="flex justify-center">{icons[type]}</div>
        <h3 className="text-xl font-semibold text-white">
          {title || defaultTitles[type]}
        </h3>
        <p className="text-gray-300 whitespace-pre-line">{message}</p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-[#42ff6b] text-black rounded-lg font-medium hover:bg-[#38e05c] transition-colors"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Ya",
  cancelText = "Batal",
  type = "info",
}: ConfirmModalProps) {
  const icons = {
    danger: <AlertCircle size={48} className="text-red-500" />,
    warning: <AlertTriangle size={48} className="text-yellow-500" />,
    info: <Info size={48} className="text-blue-500" />,
  };

  const confirmButtonClasses = {
    danger: "bg-red-600 hover:bg-red-700",
    warning: "bg-yellow-600 hover:bg-yellow-700",
    info: "bg-blue-600 hover:bg-blue-700",
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="text-center space-y-4">
        <div className="flex justify-center">{icons[type]}</div>
        {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
        <p className="text-gray-300 whitespace-pre-line">{message}</p>
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#333] text-white rounded-lg font-medium hover:bg-[#444] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-6 py-3 text-white rounded-lg font-medium transition-colors ${confirmButtonClasses[type]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (value: string) => void;
  title?: string;
  message: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

export function PromptModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  defaultValue = "",
  placeholder = "",
  confirmText = "OK",
  cancelText = "Batal",
}: PromptModalProps) {
  const [value, setValue] = React.useState(defaultValue);

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
    }
  }, [isOpen, defaultValue]);

  const handleConfirm = () => {
    onConfirm(value);
    onClose();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleConfirm();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="space-y-4">
        {title && <h3 className="text-xl font-semibold text-white">{title}</h3>}
        <p className="text-gray-300 whitespace-pre-line">{message}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#42ff6b] focus:border-transparent"
          autoFocus
        />
        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-[#333] text-white rounded-lg font-medium hover:bg-[#444] transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 bg-[#42ff6b] text-black rounded-lg font-medium hover:bg-[#38e05c] transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Add missing React import at the top
import React from "react";
