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

export interface ShippingFeePayload extends AnyObj {
  fromWilayaCode: string;
  toWilayaCode: string;
  desktopPrice: number;
  homePrice: number;
  returnPrice: number;
  isActive?: boolean;
}

export interface UpdateShippingFeePayload extends AnyObj {
  fromWilayaCode?: string;
  toWilayaCode?: string;
  desktopPrice?: number;
  homePrice?: number;
  returnPrice?: number;
  isActive?: boolean;
  zones?: ShippingZone[];
}

export interface PriceUpdatePayload extends AnyObj {
  desktopPrice: number;
  homePrice: number;
  returnPrice: number;
}

export interface ShippingFee extends AnyObj {
  id: string;
  fromWilayaCode: string;
  toWilayaCode: string;
  desktopPrice: number;
  homePrice: number;
  returnPrice: number;
  isActive: boolean;
  updatedAt?: string;
}

export interface ShippingZone extends AnyObj {
  id?: number;
  name: string;
  price: number;
  cityIds: number[];
  isActive?: boolean;
  shippingFeeId?: number;
}

export interface CreateShippingZonePayload extends AnyObj {
  name: string;
  price: number;
  shippingFeeId: number;
  cityIds: number[];
  isActive?: boolean;
}

export interface BulkCreateZonesPayload extends AnyObj {
  shippingFeeId: number;
  zones: {
    name: string;
    price: number;
    cityIds: number[];
  }[];
}

export interface UpdateShippingZonePayload extends AnyObj {
  name?: string;
  price?: number;
  cityIds?: number[];
  isActive?: boolean;
}

export async function createShippingFee(
  payload: ShippingFeePayload
): Promise<ShippingFee> {
  return request("/api/v1/shipping-fees", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAllShippingFees(params?: {
  fromWilayaCode?: string;
  toWilayaCode?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}): Promise<{ data: ShippingFee[]; meta: AnyObj }> {
  const query = new URLSearchParams();
  if (params?.fromWilayaCode)
    query.set("fromWilayaCode", params.fromWilayaCode);
  if (params?.toWilayaCode) query.set("toWilayaCode", params.toWilayaCode);
  if (params?.isActive !== undefined)
    query.set("isActive", params.isActive.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  const url = query.toString()
    ? `/api/v1/shipping-fees?${query}`
    : "/api/v1/shipping-fees";
  return request(url);
}

export async function initializeShippingFees(): Promise<AnyObj> {
  return request("/api/v1/shipping-fees/initialize", { method: "POST" });
}

export async function setAllShippingFees(
  payload: PriceUpdatePayload
): Promise<AnyObj> {
  return request("/api/v1/shipping-fees/set-all", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function setWilayaShippingFees(
  code: string,
  payload: PriceUpdatePayload
): Promise<AnyObj> {
  return request(`/api/v1/shipping-fees/set-wilaya/${code}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getShippingFeeByRoute(
  from: string,
  to: string
): Promise<ShippingFee> {
  return request(`/api/v1/shipping-fees/route/${from}/${to}`);
}

export async function getShippingFeeById(id: string): Promise<ShippingFee> {
  return request(`/api/v1/shipping-fees/${id}`);
}

export async function updateShippingFee(
  id: string,
  payload: UpdateShippingFeePayload
): Promise<ShippingFee> {
  return request(`/api/v1/shipping-fees/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteShippingFee(id: string): Promise<AnyObj> {
  return request(`/api/v1/shipping-fees/${id}`, { method: "DELETE" });
}

export async function toggleShippingFee(id: string): Promise<ShippingFee> {
  return request(`/api/v1/shipping-fees/${id}/toggle`, { method: "PATCH" });
}

export async function generateZonesForRoute(
  from: string,
  to: string
): Promise<AnyObj> {
  return request(`/api/v1/shipping-fees/zones/generate/${from}/${to}`, {
    method: "POST",
  });
}

export async function createShippingZone(
  payload: CreateShippingZonePayload
): Promise<ShippingZone> {
  return request("/api/v1/shipping-fees/zones", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function bulkCreateZones(
  payload: BulkCreateZonesPayload
): Promise<ShippingZone[]> {
  return request("/api/v1/shipping-fees/zones/bulk", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getZonesByRoute(
  from: string,
  to: string
): Promise<ShippingZone[]> {
  return request(`/api/v1/shipping-fees/zones/route/${from}/${to}`);
}

export async function getZoneById(id: number): Promise<ShippingZone> {
  return request(`/api/v1/shipping-fees/zones/${id}`);
}

export async function updateZone(
  id: number,
  payload: UpdateShippingZonePayload
): Promise<ShippingZone> {
  return request(`/api/v1/shipping-fees/zones/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteZone(id: number): Promise<AnyObj> {
  return request(`/api/v1/shipping-fees/zones/${id}`, { method: "DELETE" });
}

export async function toggleZone(id: number): Promise<ShippingZone> {
  return request(`/api/v1/shipping-fees/zones/${id}/toggle`, {
    method: "PATCH",
  });
}

export async function getShippingPrice(
  from: string,
  to: string,
  type: "desktop" | "home" | "return",
  cityId?: number
): Promise<number | AnyObj> {
  const query = new URLSearchParams();
  query.set("type", type);
  if (cityId) {
    query.set("cityId", cityId.toString());
  }
  const url = `/api/v1/shipping-fees/price/${from}/${to}?${query}`;
  return request(url);
}

export async function getShippingPriceDetails(
  from: string,
  to: string,
  cityId?: number
): Promise<AnyObj> {
  const query = new URLSearchParams();
  if (cityId) {
    query.set("cityId", cityId.toString());
  }
  const url = query.toString()
    ? `/api/v1/shipping-fees/price-details/${from}/${to}?${query}`
    : `/api/v1/shipping-fees/price-details/${from}/${to}`;
  return request(url);
}

export default {
  createShippingFee,
  getAllShippingFees,
  initializeShippingFees,
  setAllShippingFees,
  setWilayaShippingFees,
  getShippingFeeByRoute,
  getShippingFeeById,
  updateShippingFee,
  deleteShippingFee,
  toggleShippingFee,
  generateZonesForRoute,
  createShippingZone,
  bulkCreateZones,
  getZonesByRoute,
  getZoneById,
  updateZone,
  deleteZone,
  toggleZone,
  getShippingPrice,
  getShippingPriceDetails,
};
