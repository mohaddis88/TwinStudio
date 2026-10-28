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
      className="fixed bottom-6 right-6 z-50 max-w-md w-[calc(100vw-3rem)] bg-[var(--surface)] border border-[var(--border)] rounded-[16px] p-4 flex items-start gap-3 text-[var(--text)]"
      style={{ boxShadow: 'var(--elev-3)' }}
    >
      <div className="shrink-0 mt-0.5">
        {isError ? (
          <AlertCircle className="w-5 h-5 text-[var(--status-error)]" aria-hidden="true" />
        ) : isWarning ? (
          <AlertCircle className="w-5 h-5 text-[var(--status-warning)]" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="w-5 h-5 text-[var(--status-success)]" aria-hidden="true" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        {toast.title && (
          <h2 className="text-sm font-semibold text-[var(--text-main)] mb-0.5">{toast.title}</h2>
        )}
        <p className="text-xs text-[var(--text-secondary)] leading-relaxed break-words">{toast.message}</p>

        {toast.actionLabel && toast.onAction && (
          <div className="mt-2.5">
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                onDismiss();
              }}
              className="text-xs font-semibold text-[var(--text-main)] underline underline-offset-4 hover:text-[var(--border-focus)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-[12px] py-0.5 transition-colors cursor-pointer"
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
        className="shrink-0 text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] transition-colors cursor-pointer"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </aside>
  );
};
