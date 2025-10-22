"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";
import auth from "@/app/api/auth";
import { toast, useToast } from "@/../hooks/use-toast";

function parseApiError(err: any) {
  if (!err) return "Unknown error";
  const body = err?.body ?? err;
  if (body == null) return err?.message ?? String(err);
  if (typeof body === "string") return body;
  if (Array.isArray(body.message)) return body.message.join(", ");
  if (typeof body.message === "string") return body.message;
  if (body.fr || body.ar) return body.fr ?? body.ar;
  if (body?.data?.message) {
    if (Array.isArray(body.data.message)) return body.data.message.join(", ");
    return String(body.data.message);
  }
  return err?.message ?? JSON.stringify(body);
}

export default function ForgotPassword() {
  useToast();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? "";
  const router = useRouter();

  const [verifying, setVerifying] = useState<boolean>(!!token);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setVerifying(false);
      return;
    }
    let mounted = true;
    setVerifying(true);
    auth
      .verifyResetToken({ token })
      .then(() => {
        if (!mounted) return;
        setTokenValid(true);
      })
      .catch(() => {
        if (!mounted) return;
        setTokenValid(false);
      })
      .finally(() => {
        if (!mounted) return;
        setVerifying(false);
      });
    return () => {
      mounted = false;
    };
  }, [token]);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (submitting) return;

    if (!token) {
      toast({ title: "Token missing", description: "Token not found in URL." });
      return;
    }

    if (!newPassword || newPassword.length < 8) {
      toast({
        title: "Invalid password",
        description: "Password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Mismatch", description: "Passwords do not match." });
      return;
    }

    setSubmitting(true);
    const t = toast({
      title: "Resetting password",
      description: "Please wait...",
    });
    try {
      await auth.resetPasswordWithToken({ token, newPassword });
      t.update({
        title: "Password reset",
        description: "Your password was reset successfully.",
      });

      router.push("/signin");
    } catch (err: any) {
      t.update({ title: "Reset failed", description: parseApiError(err) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F7FB] px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <Image
            src="/logo.svg"
            alt="logo"
            width={0}
            height={0}
            sizes="100vw"
            className="mx-auto mb-4 w-[80px] h-[70px] md:w-[110px] md:h-[100px]"
          />
          <h1 className="text-2xl font-semibold text-[#FF5901]">
            Reset your password
          </h1>
          <p className="text-sm text-[#6B7280] mt-2">
            Enter a new password for your account.
          </p>
        </div>

        {verifying && (
          <div className="text-center py-8">
            <div className="animate-pulse text-sm text-gray-500">
              Verifying link…
            </div>
          </div>
        )}

        {!verifying && tokenValid === false && (
          <div className="text-center py-6">
            <div className="text-red-600 font-semibold mb-2">
              Invalid or expired link
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              The reset link is invalid or has expired. You can request a new
              one.
            </p>
            <div className="flex justify-center gap-2">
              <button
                onClick={() => router.push("/signin")}
                className="px-4 py-2 rounded-lg border border-[#E6E9EE]"
              >
                Back to sign in
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-4 py-2 rounded-lg bg-[#FF5901] text-white"
              >
                Home
              </button>
            </div>
          </div>
        )}

        {!verifying && tokenValid === true && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-[#7C8BA0]">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-[46px] px-[14px] text-sm bg-white border border-[#EDF1F3] rounded-[10px] pr-12 focus:ring-2 focus:ring-[#FF5901]"
                  placeholder="At least 8 characters"
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#ACB5BB]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#7C8BA0]">
                Confirm password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[46px] px-[14px] text-sm bg-white border border-[#EDF1F3] rounded-[10px] focus:ring-2 focus:ring-[#FF5901]"
                placeholder="Repeat your password"
                minLength={8}
                required
              />
            </div>

            <div>
              <button
                disabled={submitting}
                type="submit"
                className="w-full h-12 bg-[#FF5901] text-white rounded-[14px] font-medium hover:bg-[#E64F01] disabled:opacity-60"
              >
                {submitting ? "Resetting…" : "Reset password"}
              </button>
            </div>
          </form>
        )}

        {!verifying && token === "" && (
          <div className="text-center py-6">
            <div className="text-red-600 font-semibold mb-2">
              No token provided
            </div>
            <p className="text-sm text-[#6B7280] mb-4">
              You opened this page without a reset token. Please use the link
              from your email.
            </p>
            <button
              onClick={() => router.push("/signin")}
              className="inline-block px-6 py-2 rounded-lg bg-[#FF5901] text-white"
            >
              Go to sign in
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
