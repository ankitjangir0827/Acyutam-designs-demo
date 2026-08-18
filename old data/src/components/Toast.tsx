"use client";

import { AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import type React from "react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  message?: string;
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg shadow-2xl border backdrop-blur-xl transition-all duration-300 transform translate-y-0 ${
            toast.type === "success"
              ? "bg-[#181d18]/95 border-emerald-500/40 text-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.15)]"
              : toast.type === "error"
                ? "bg-[#221313]/95 border-red-500/40 text-red-100 shadow-[0_10px_30px_rgba(239,68,68,0.15)]"
                : "bg-[#1a1924]/95 border-primary/40 text-on-surface shadow-[0_10px_30px_rgba(255,119,34,0.15)]"
          }`}
        >
          <div className="shrink-0 mt-0.5">
            {toast.type === "success" && (
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            )}
            {toast.type === "error" && (
              <AlertTriangle className="w-5 h-5 text-red-400" />
            )}
            {toast.type === "info" && <Info className="w-5 h-5 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm leading-tight text-white">
              {toast.title}
            </h4>
            {toast.message && (
              <p className="text-xs text-on-surface-variant/80 mt-1">
                {toast.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-on-surface-variant hover:text-white p-1 rounded transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
