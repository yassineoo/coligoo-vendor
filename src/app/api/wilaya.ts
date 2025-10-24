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

export interface Wilaya extends AnyObj {
  code: string;
  name: string;
}

export interface City extends AnyObj {
  code: string;
  name: string;
  wilayaCode: string;
}

export interface ShippingFees extends AnyObj {
  wilayaCode: string;
  fee: number;
}

export async function getWilayas(): Promise<Wilaya[]> {
  return request("/api/v1/wilaya");
}

export async function getShippingFeesByCode(
  code: string
): Promise<ShippingFees> {
  return request(`/api/v1/wilaya/${code}/shipping-fees`);
}

export async function getAllShippingFees(): Promise<ShippingFees[]> {
  return request("/api/v1/wilaya/shipping-fees");
}

export async function getCitiesByCode(code: string): Promise<City[]> {
  return request(`/api/v1/wilaya/${code}/cities`);
}

export async function getAllCities(): Promise<City[]> {
  return request("/api/v1/wilaya/cities");
}

export default {
  getWilayas,
  getShippingFeesByCode,
  getAllShippingFees,
  getCitiesByCode,
  getAllCities,
};
