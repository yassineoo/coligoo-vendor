"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/app/api/auth";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  onSuccess?: () => void;
  callBackend?: boolean;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  onSuccess,
  callBackend = true,
}: LogoutModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const lastActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      lastActiveElement.current = document.activeElement as HTMLElement | null;
      setTimeout(() => {
        const btn =
          modalRef.current?.querySelector<HTMLButtonElement>(
            "[data-autofocus]"
          );
        btn?.focus();
      }, 0);
      document.documentElement.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      lastActiveElement.current?.focus?.();
    }
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        if (!loading) onClose();
      }

      if (e.key === "Tab") {
        const container = modalRef.current;
        if (!container) return;
        const focusable = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute("disabled"));

        if (focusable.length === 0) {
          e.preventDefault();
          return;
        }

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      if (callBackend) {
        try {
          await fetch("/api/v1/auth/logout", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });
        } catch {}
      }

      try {
        api.clearToken();
      } catch (e) {}

      try {
        onSuccess?.();
      } catch {}

      router.replace("/signin");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-hidden={false}
      role="presentation"
    >
      <div
        className="absolute inset-0 bg-[rgba(45,60,82,0.34)] backdrop-blur-sm"
        onClick={() => {
          if (!loading) onClose();
        }}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        className="relative bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 p-8 transform transition-all scale-100"
      >
        <button
          onClick={onClose}
          data-autofocus
          aria-label="Close logout dialog"
          className="absolute top-4 right-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          <X size={16} className="text-black" />
        </button>

        <div className="flex flex-col items-center text-center space-y-6">
          <div className="w-[115px] h-[115px] bg-[#FF5A01]/40 rounded-full flex items-center justify-center">
            <img
              src="/images/log-out.png"
              alt="Logout illustration"
              className="w-[115px] h-[115px] object-contain"
            />
          </div>

          <h2
            id="logout-title"
            className="text-xl font-semibold text-black font-roboto"
          >
            Are you sure you want to log out?
          </h2>

          <p className="text-gray-600 font-roboto">
            You will be signed out of this device. You can always sign back in
            later.
          </p>

          <div className="flex space-x-3 w-full pt-4">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gray-200 text-black font-medium rounded-xl hover:bg-gray-300 transition-colors font-roboto disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Cancel
            </button>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="flex-1 px-6 py-3 bg-delivery-orange text-white font-medium rounded-xl hover:bg-orange-600 transition-colors font-roboto disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-live="polite"
            >
              {loading ? (
                <>
                  <svg
                    aria-hidden="true"
                    className="w-4 h-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeOpacity="0.25"
                    />
                    <path
                      d="M22 12a10 10 0 00-10-10"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                  Logging out...
                </>
              ) : (
                "Log out"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
