"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
} from "react";

export type ToastType = "cart" | "wishlist" | "error" | "success";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      const id = `toast-${Date.now()}-${counterRef.current++}`;
      setToasts((prev) => [...prev.slice(-2), { id, message, type }]);
      setTimeout(() => removeToast(id), 2800);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ─── Toast Container UI ───────────────────────────────────────

const icons: Record<ToastType, string> = {
  cart: "🛒",
  wishlist: "❤️",
  success: "✅",
  error: "❌",
};

const colors: Record<ToastType, string> = {
  cart: "border-l-[#B91C1C]",
  wishlist: "border-l-pink-500",
  success: "border-l-green-500",
  error: "border-l-red-500",
};

function ToastContainer({
  toasts,
  removeToast,
}: {
  toasts: Toast[];
  removeToast: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-24 right-4 z-[9999] flex flex-col gap-2 md:bottom-8"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`flex items-center gap-3 bg-white rounded-xl shadow-xl border border-zinc-100 border-l-4 ${colors[t.type]} px-4 py-3 min-w-[240px] max-w-[320px] animate-slide-up`}
          role="alert"
        >
          <span className="text-lg shrink-0">{icons[t.type]}</span>
          <span className="text-sm font-medium text-zinc-800 flex-1">
            {t.message}
          </span>
          <button
            onClick={() => removeToast(t.id)}
            className="text-zinc-400 hover:text-zinc-600 transition-colors shrink-0"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
