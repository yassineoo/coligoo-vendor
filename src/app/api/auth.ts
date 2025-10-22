export type AnyObj = Record<string, any>;
const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
const TOKEN_KEY = "app_token";

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) return res.json();
  const txt = await res.text().catch(() => null);
  try {
    return txt ? JSON.parse(txt) : txt;
  } catch {
    return txt;
  }
}

function persistToken(token: string | null) {
  try {
    if (typeof localStorage !== "undefined") {
      if (token === null) localStorage.removeItem(TOKEN_KEY);
      else localStorage.setItem(TOKEN_KEY, token);
    }
  } catch {}
  try {
    if (typeof document !== "undefined") {
      if (token === null) document.cookie = `${TOKEN_KEY}=;path=/;max-age=0`;
      else
        document.cookie = `${TOKEN_KEY}=${token};path=/;max-age=${
          60 * 60 * 24 * 30
        }`;
    }
  } catch {}
}

export function getPersistedToken(): string | null {
  try {
    if (typeof localStorage !== "undefined") {
      const t = localStorage.getItem(TOKEN_KEY);
      if (t) return t;
    }
  } catch {}
  try {
    if (typeof document !== "undefined") {
      const match = document.cookie.match(
        new RegExp(`(^| )${TOKEN_KEY}=([^;]+)`)
      );
      if (match) return match[2];
    }
  } catch {}
  return null;
}

function extractToken(resp: AnyObj) {
  if (!resp) return null;
  if (typeof resp === "string") return resp;
  if (resp.token) return resp.token;
  if (resp.accessToken) return resp.accessToken;
  if (resp.data?.token) return resp.data.token;
  if (resp.data?.accessToken) return resp.data.accessToken;
  if (resp.access_token) return resp.access_token;
  return null;
}

async function request(path: string, init?: RequestInit) {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers ?? {});
  const token = getPersistedToken();
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);
  if (init && init.body && !(init.body instanceof FormData)) {
    if (!headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  const body = await safeJson(res);
  if (!res.ok) throw { status: res.status, statusText: res.statusText, body };
  const maybeToken = extractToken(body);
  if (maybeToken) persistToken(maybeToken);
  return body;
}

export async function login(payload: {
  phone?: string;
  email?: string;
  password?: string;
}) {
  const res = await request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const token = extractToken(res);
  if (token) persistToken(token);
  return res;
}

export async function loginAdmin(payload: { email: string; password: string }) {
  const res = await request("/api/v1/auth/login-admin", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  const token = extractToken(res);
  if (token) persistToken(token);
  return res;
}

export async function registerVendor(payload: AnyObj) {
  return request("/api/v1/auth/register-vendor", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function registerDeliveryMen(payload: AnyObj) {
  return request("/api/v1/auth/register-delivery-men", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function checkPhone(payload: { phone: string }) {
  return request("/api/v1/auth/check-phone", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function changePhone(payload: AnyObj) {
  return request("/api/v1/auth/change-phone", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function checkAuth() {
  return request("/api/v1/auth/check-auth", { method: "GET" });
}

export async function verifyEmail(payload: AnyObj) {
  return request("/api/v1/auth/verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resendVerifyEmail(payload: AnyObj) {
  return request("/api/v1/auth/resend-verify-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function forgetPassword(payload: AnyObj) {
  return request("/api/v1/auth/forget-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyPasswordOtp(payload: AnyObj) {
  return request("/api/v1/auth/verify-password-otp", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload: AnyObj) {
  return request("/api/v1/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function sendResetLink(payload: AnyObj) {
  return request("/api/v1/auth/send-reset-link", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verifyResetToken(payload: AnyObj) {
  return request("/api/v1/auth/verify-reset-token", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function resetPasswordWithToken(payload: AnyObj) {
  return request("/api/v1/auth/reset-password-with-token", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function contact(payload: AnyObj) {
  return request("/api/v1/auth/contact", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function setToken(token: string | null) {
  persistToken(token);
}

export function clearToken() {
  persistToken(null);
}

export default {
  request,
  buildUrl,
  getPersistedToken,
  setToken,
  clearToken,
  login,
  loginAdmin,
  registerVendor,
  registerDeliveryMen,
  checkPhone,
  changePhone,
  checkAuth,
  verifyEmail,
  resendVerifyEmail,
  forgetPassword,
  verifyPasswordOtp,
  resetPassword,
  sendResetLink,
  verifyResetToken,
  resetPasswordWithToken,
  contact,
};
