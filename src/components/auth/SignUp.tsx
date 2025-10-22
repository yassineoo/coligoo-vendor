"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import auth from "@/app/api/auth";
import { toast } from "@/../hooks/use-toast";
import SpeedBadge from "./SpeedBadge";

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

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: "",
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setErrors({
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: "",
    });

    let hasError = false;

    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Full Name is required." }));
      hasError = true;
    }
    if (!phone.trim()) {
      setErrors((prev) => ({ ...prev, phone: "Phone Number is required." }));
      hasError = true;
    }
    if (!email.trim()) {
      setErrors((prev) => ({ ...prev, email: "Email is required." }));
      hasError = true;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required." }));
      hasError = true;
    }
    if (!confirmPassword.trim()) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Confirm Password is required.",
      }));
      hasError = true;
    }

    if (hasError) return;

    if (password.length < 8) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 8 characters.",
      }));
      return;
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match.",
      }));
      return;
    }

    if (!agreeToTerms) {
      setErrors((prev) => ({
        ...prev,
        terms: "You must accept the Terms of Service.",
      }));
      return;
    }

    setSubmitting(true);
    const t = toast({
      title: "Creating account",
      description: "Please wait...",
      open: true,
      duration: 10000,
      variant: "default",
    });
    try {
      const payload = {
        fullName: name,
        phoneNumber: phone,
        email,
        password,
        captcha: captcha || undefined,
      };
      const res = await auth.registerVendor(payload);
      const token = res?.token ?? res?.accessToken ?? res?.data?.token ?? null;
      const userInfo = res?.userInfo ?? res?.data?.userInfo ?? null;
      if (token) {
        try {
          auth.setToken(token);
        } catch {}
      }
      if (userInfo) {
        try {
          localStorage.setItem("user", JSON.stringify(userInfo));
        } catch {}
      }
      t.update({
        title: "Account created",
        description: "Inscription réussie. Vous êtes connecté.",
        variant: "success",
        duration: 3000,
      });
      setTimeout(() => {
        router.push("/dashboard");
      }, 400);
      return res;
    } catch (err: any) {
      const message = parseApiError(err);
      t.update({
        title: "Registration failed",
        description: message,
        variant: "error",
        duration: 7000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 py-12 overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-6 sm:mb-8">
            <h1
              className="text-2xl md:text-[32px] text-delivery-orange font-semibold font-roboto mb-3"
              style={{ color: "#FF5901" }}
            >
              Sign Up
            </h1>
            <p className="text-sm md:text-base text-delivery-dark font-roboto">
              If you already have an account,{" "}
              <Link href="/signin" className="text-delivery-orange underline">
                sign in
              </Link>
            </p>
          </div>

          <form className="space-y-3 md:space-y-[8px]" onSubmit={onSubmit}>
            <div className="space-y-2">
              <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-[46px] px-4 md:px-[14px] border border-[#EDF1F3] rounded-[10px] bg-white text-sm md:text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                Phone Number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-12 md:h-[46px] px-4 md:px-[14px] border border-[#EDF1F3] rounded-[10px] bg-white text-sm md:text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 md:h-[46px] px-4 md:px-[14px] border border-[#EDF1F3] rounded-[10px] bg-white text-sm md:text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 md:h-[46px] px-4 md:px-[14px] pr-12 border border-[#EDF1F3] rounded-[10px] bg-white text-sm md:text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-12 md:h-[46px] px-4 md:px-[14px] pr-12 border border-[#EDF1F3] rounded-[10px] bg-white text-sm md:text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-[14px] top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#7C8BA0] font-roboto">
                Introduisez le code sur l'image
              </label>
              <div className="mb-2">
                <img
                  src="/images/captcha.png"
                  alt="CAPTCHA"
                  className="w-[180px] md:w-[198px] h-[71px] rounded-lg border border-[#EDF1F3]"
                />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  placeholder="Enter CAPTCHA"
                  className="w-full h-12 md:h-[46px] px-4 md:px-[14px] border border-[#EDF1F3] rounded-[10px] bg-white text-sm md:text-sm font-medium text-delivery-dark font-inter shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] focus:outline-none focus:ring-2 focus:ring-delivery-orange focus:border-delivery-orange"
                />
              </div>
            </div>

            <div className="flex items-start md:items-center gap-3">
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="sr-only"
                  id="agree"
                />
                <div
                  className={`w-6 h-6 rounded border border-[#EDF1F3] cursor-pointer flex items-center justify-center ${
                    agreeToTerms
                      ? "bg-delivery-orange border-delivery-orange"
                      : "bg-gray-50"
                  }`}
                  onClick={() => setAgreeToTerms(!agreeToTerms)}
                  role="checkbox"
                  aria-checked={agreeToTerms}
                >
                  {agreeToTerms && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </div>
              <p className="text-xs text-delivery-dark font-roboto">
                I agree to The{" "}
                <Link href="/terms" className="text-delivery-orange">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-delivery-orange">
                  Privacy Policy
                </Link>
              </p>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1 ml-9">{errors.terms}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full h-12 bg-delivery-orange text-white font-medium text-base font-roboto rounded-[14px] hover:bg-orange-600 transition-colors mt-6 md:mt-8 disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>
      </div>

      <div className="hidden lg:flex fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-br from-[#FF9B6A] to-[#FF8654] items-center justify-center p-6 lg:p-12">
        <div className="absolute inset-0">
          <img
            src="/auth/rectangle.png"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative w-full max-w-[507px] h-auto lg:h-[524px] flex items-center justify-center">
          <div className="absolute inset-0 lg:left-[31px] bg-white/21 backdrop-blur-[6.8px] border border-white/52 rounded-[46px] max-w-[412px] mx-auto"></div>

          <div>
            <SpeedBadge />
          </div>

          <div className="absolute left-[93px] top-[32px] z-10 max-w-[220px]">
            <h1
              className="text-[#fff] font-bold text-[32px] leading-tight lg:leading-[46px]"
              style={{
                fontFamily: "Roboto, -apple-system, sans-serif",
                color: "white",
              }}
            >
              Elevate your business with our delivery services
            </h1>
          </div>

          <img
            src="/auth/delivery.png"
            alt="Delivery Person"
            className="relative lg:absolute lg:left-[171px] lg:top-[30px] w-full max-w-[366px] h-auto lg:h-[494px] object-contain mt-16 lg:mt-0"
          />
        </div>
      </div>
    </div>
  );
}
