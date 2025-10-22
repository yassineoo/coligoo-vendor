import { AnyObj } from "./auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function request(path: string, init?: RequestInit) {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers ?? {});
  const token =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("app_token")
      : null;
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);
  if (init && init.body && !(init.body instanceof FormData)) {
    if (!headers.has("Content-Type"))
      headers.set("Content-Type", "application/json");
  }
  const res = await fetch(url, { ...init, headers });
  const ct = res.headers.get("content-type") ?? "";
  let body;
  if (ct.includes("application/json")) {
    body = await res.json().catch(() => null);
  } else {
    const txt = await res.text().catch(() => null);
    body = txt;
  }
  if (!res.ok) throw { status: res.status, statusText: res.statusText, body };
  return body;
}

export interface Settings extends AnyObj {
  id: number;
  freeWeightLimit: number;
  weightPricePerKg: number;
  maxWeightLimit: number;
  freeVolumeLimit: number;
  volumePricePerCm3: number;
  maxVolumeLimit: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsPayload extends AnyObj {
  freeWeightLimit: number;
  weightPricePerKg: number;
  maxWeightLimit: number;
  freeVolumeLimit: number;
  volumePricePerCm3: number;
  maxVolumeLimit: number;
}

export async function getSettings(): Promise<Settings> {
  return request("/api/v1/settings");
}

export async function updateSettings(
  payload: UpdateSettingsPayload
): Promise<Settings> {
  return request("/api/v1/settings", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export default {
  getSettings,
  updateSettings,
};
