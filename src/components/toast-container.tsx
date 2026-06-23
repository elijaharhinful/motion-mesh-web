'use client';

import { useToastStore } from '@/stores/toast.store';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICONS = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const COLORS = {
  success: 'border-green-500/30 bg-green-500/10 text-green-300',
  error:   'border-red-500/30 bg-red-500/10 text-red-300',
  info:    'border-blue-500/30 bg-blue-500/10 text-blue-300',
  warning: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
};

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const Icon = ICONS[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-xl animate-in slide-in-from-right-5 fade-in',
              COLORS[toast.type],
            )}
          >
            <Icon size={18} className="mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{toast.title}</p>
              {toast.message && <p className="text-xs opacity-80 mt-0.5">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
