"use client";

import React, { useEffect, useRef } from "react";
import { useToast } from "@/../hooks/use-toast";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";

type ToastItemType = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  open?: boolean;
  duration?: number;
  variant?: "default" | "success" | "error" | "warning" | "info";
};

export default function ToastContainer() {
  const { toasts, dismiss, remove } = useToast();
  const timers = useRef(new Map<string, number>());

  useEffect(() => {
    const clearIds: number[] = [];
    toasts?.forEach((t: ToastItemType) => {
      const id = t.id;
      const duration = typeof t.duration === "number" ? t.duration : 4000;
      if (t.open) {
        if (!timers.current.has(id)) {
          const tm = window.setTimeout(() => {
            try {
              dismiss(id);
            } catch {}
          }, duration);
          timers.current.set(id, tm);
          clearIds.push(tm);
        }
      } else {
        if (!timers.current.has(id + "_rm")) {
          const rm = window.setTimeout(() => {
            try {
              remove(id);
            } catch {}
          }, 300);
          timers.current.set(id + "_rm", rm);
          clearIds.push(rm);
        }
      }
    });
    return () => {
      timers.current.forEach((v) => clearTimeout(v));
      timers.current.clear();
      clearIds.forEach((c) => clearTimeout(c));
    };
  }, [toasts, dismiss, remove]);

  function Icon({ variant }: { variant?: ToastItemType["variant"] }) {
    if (variant === "success") return <CheckCircle className="w-5 h-5" />;
    if (variant === "error") return <XCircle className="w-5 h-5" />;
    if (variant === "warning") return <AlertTriangle className="w-5 h-5" />;
    if (variant === "info") return <Info className="w-5 h-5" />;
    return <Info className="w-5 h-5" />;
  }

  function variantStyle(v?: ToastItemType["variant"]) {
    const base = "border border-white/20 backdrop-blur-sm";
    if (v === "success")
      return `${base} bg-gradient-to-r from-emerald-50/80 via-emerald-50/90 to-emerald-100/80 shadow-lg shadow-emerald-200/50 text-emerald-800`;
    if (v === "error")
      return `${base} bg-gradient-to-r from-rose-50/80 via-rose-50/90 to-rose-100/80 shadow-lg shadow-rose-200/50 text-rose-800`;
    if (v === "warning")
      return `${base} bg-gradient-to-r from-amber-50/80 via-amber-50/90 to-amber-100/80 shadow-lg shadow-amber-200/50 text-amber-800`;
    if (v === "info")
      return `${base} bg-gradient-to-r from-sky-50/80 via-sky-50/90 to-sky-100/80 shadow-lg shadow-sky-200/50 text-sky-800`;
    return `${base} bg-white/80 shadow-lg shadow-gray-200/50 text-gray-800`;
  }

  function progressColor(v?: ToastItemType["variant"]) {
    if (v === "success") return "bg-emerald-500";
    if (v === "error") return "bg-rose-500";
    if (v === "warning") return "bg-amber-500";
    if (v === "info") return "bg-sky-500";
    return "bg-gray-500";
  }

  function descriptionColor(v?: ToastItemType["variant"]) {
    if (v === "success") return "text-emerald-700";
    if (v === "error") return "text-rose-700";
    if (v === "warning") return "text-amber-700";
    if (v === "info") return "text-sky-700";
    return "text-gray-600";
  }

  return (
    <>
      <style>{`
        @keyframes toast-enter {
          from {
            opacity: 0;
            transform: translateY(100%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes toast-exit {
          from {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          to {
            opacity: 0;
            transform: translateY(100%) scale(0.95);
          }
        }
        @keyframes toast-progress {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 w-[360px] sm:w-[420px] max-w-full"
      >
        {toasts?.map((t: any) => {
          const id: string = t.id;
          const open: boolean = t.open ?? true;
          const v = t.variant as ToastItemType["variant"];
          const duration = typeof t.duration === "number" ? t.duration : 4000;
          const animationClass = open
            ? "animate-toast-enter"
            : "animate-toast-exit";
          return (
            <div
              key={id}
              role="status"
              className={`pointer-events-auto ${variantStyle(
                v
              )} rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ease-out ${animationClass}`}
            >
              <div className="flex items-start gap-3 p-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-sm border border-white/30">
                    <Icon variant={v} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="text-sm font-semibold leading-5 truncate pr-2">
                      {t.title}
                    </div>
                    <button
                      aria-label="close"
                      onClick={() => {
                        try {
                          dismiss(id);
                          setTimeout(() => remove(id), 300);
                        } catch {}
                      }}
                      className="flex-shrink-0 ml-auto p-1.5 rounded-lg hover:bg-white/20 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {t.description && (
                    <p
                      className={`mt-1 text-xs leading-4 ${descriptionColor(
                        v
                      )}`}
                    >
                      {t.description}
                    </p>
                  )}
                  <div className="mt-3 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <div
                      className={`h-full ${progressColor(
                        v
                      )} rounded-full transition-all duration-300 ease-linear`}
                      style={{
                        animation: `toast-progress ${duration}ms linear forwards`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
