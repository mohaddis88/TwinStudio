import React from 'react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'error' | 'success' | 'warning';
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  if (!toast) return null;

  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  return (
    <aside
      aria-label="Notification alert"
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-[#1B1410] border border-[#6B5545]/60 rounded-[20px] p-4 shadow-2xl backdrop-blur-md flex items-start gap-3 animate-in fade-in slide-in-from-bottom-3 duration-300"
    >
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-[#E5675F]" aria-hidden="true" />
        ) : isWarning ? (
          <AlertCircle className="w-5 h-5 text-[#E0A24A]" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[#5FB57A]" aria-hidden="true" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <h2 className="text-sm font-semibold text-[#F8F7F5] mb-0.5">{toast.title}</h2>
        )}
        <p className="text-xs text-[#E6D2BE] leading-relaxed break-words">{toast.message}</p>

        {toast.actionLabel && toast.onAction && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="text-xs font-semibold text-[#F8F7F5] underline underline-offset-4 hover:text-[#C8B4A0] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#967A68] rounded-[12px] py-0.5 transition-colors"
            >
              [{toast.actionLabel}]
            </button>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="shrink-0 text-[#C8B4A0] hover:text-[#F8F7F5] p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#967A68] transition-colors"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </aside>
  );
};
