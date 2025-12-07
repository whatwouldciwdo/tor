"use client";

import { useState, useCallback } from "react";

export interface UseModalReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export function useModal(initialState = false): UseModalReturn {
  const [isOpen, setIsOpen] = useState(initialState);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
}

// Hook for alert modal with message state
export interface UseAlertModalReturn extends UseModalReturn {
  showAlert: (message: string, type?: "success" | "error" | "warning" | "info") => void;
  alertMessage: string;
  alertType: "success" | "error" | "warning" | "info";
}

export function useAlertModal(): UseAlertModalReturn {
  const { isOpen, open, close, toggle } = useModal();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error" | "warning" | "info">("info");

  const showAlert = useCallback((message: string, type: "success" | "error" | "warning" | "info" = "info") => {
    setAlertMessage(message);
    setAlertType(type);
    open();
  }, [open]);

  return { isOpen, open, close, toggle, showAlert, alertMessage, alertType };
}

// Hook for confirm modal with callback
export interface UseConfirmModalReturn extends UseModalReturn {
  showConfirm: (message: string, onConfirm: () => void, type?: "danger" | "warning" | "info") => void;
  confirmMessage: string;
  confirmCallback: (() => void) | null;
  confirmType: "danger" | "warning" | "info";
}

export function useConfirmModal(): UseConfirmModalReturn {
  const { isOpen, open, close, toggle } = useModal();
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [confirmType, setConfirmType] = useState<"danger" | "warning" | "info">("info");

  const showConfirm = useCallback((
    message: string,
    onConfirm: () => void,
    type: "danger" | "warning" | "info" = "info"
  ) => {
    setConfirmMessage(message);
    setConfirmCallback(() => onConfirm);
    setConfirmType(type);
    open();
  }, [open]);

  return { isOpen, open, close, toggle, showConfirm, confirmMessage, confirmCallback, confirmType };
}

// Hook for prompt modal with value and callback
export interface UsePromptModalReturn extends UseModalReturn {
  showPrompt: (message: string, onConfirm: (value: string) => void, defaultValue?: string) => void;
  promptMessage: string;
  promptCallback: ((value: string) => void) | null;
  promptDefaultValue: string;
}

export function usePromptModal(): UsePromptModalReturn {
  const { isOpen, open, close, toggle } = useModal();
  const [promptMessage, setPromptMessage] = useState("");
  const [promptCallback, setPromptCallback] = useState<((value: string) => void) | null>(null);
  const [promptDefaultValue, setPromptDefaultValue] = useState("");

  const showPrompt = useCallback((
    message: string,
    onConfirm: (value: string) => void,
    defaultValue: string = ""
  ) => {
    setPromptMessage(message);
    setPromptCallback(() => onConfirm);
    setPromptDefaultValue(defaultValue);
    open();
  }, [open]);

  return { isOpen, open, close, toggle, showPrompt, promptMessage, promptCallback, promptDefaultValue };
}
