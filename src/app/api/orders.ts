import {
  DbOrders,
  OrdersInsert,
  OrdersUpdate,
  OrderTrackingInsert,
} from "@/../types/types";
import { getPersistedToken } from "./auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  if (!BASE) return path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function safeJson(res: Response) {
  const txt = await res.text().catch(() => null);
  if (!txt) return null;
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
}

async function request(
  path: string,
  init?: RequestInit,
  opts?: { skipAuth?: boolean }
) {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers ?? {});
  const token = getPersistedToken();
  if (token && !headers.has("Authorization") && !opts?.skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    init &&
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json;charset=utf-8");
  }
  const res = await fetch(url, { ...init, headers });
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    const body = await safeJson(res);
    if (!res.ok) throw { status: res.status, statusText: res.statusText, body };
    return body;
  }
  if (!res.ok) {
    const text = await res.text().catch(() => null);
    throw { status: res.status, statusText: res.statusText, body: text };
  }
  return res.blob();
}

function qs(params?: Record<string, any>) {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null && v !== ""
  );
  if (!entries.length) return "";
  return `?${new URLSearchParams(
    Object.fromEntries(entries.map(([k, v]) => [k, String(v)]))
  ).toString()}`;
}

function ensureNumber(v: any): number | null {
  if (v === undefined || v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function createOrder(payload: OrdersInsert): Promise<DbOrders> {
  const body: any = { ...payload };
  const toCityIdNum = ensureNumber(body.toCityId);
  if (toCityIdNum === null) {
    throw new Error("toCityId sont requis et doivent être des nombres.");
  }
  body.toCityId = toCityIdNum;
  if (Array.isArray(body.orderItems) && Array.isArray(body.productList)) {
    delete body.productList;
  }
  const computeFromOrderItems = (items: any[] | undefined) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    return items.reduce((s, it) => {
      const unit = ensureNumber(it.unitPrice) ?? 0;
      const qty = ensureNumber(it.quantity) ?? 0;
      return s + unit * qty;
    }, 0);
  };
  const computeFromProductList = (pl: any[] | undefined) => {
    if (!Array.isArray(pl) || pl.length === 0) return 0;
    return 0;
  };
  let computedPrice = 0;
  computedPrice += computeFromOrderItems(body.orderItems);
  computedPrice += computeFromProductList(body.productList);
  if (body.price === undefined || body.price === null || body.price === "") {
    body.price = computedPrice > 0 ? computedPrice : 0.01;
  } else {
    const pnum = ensureNumber(body.price);
    body.price =
      pnum !== null ? pnum : computedPrice > 0 ? computedPrice : 0.01;
  }
  body.weight = ensureNumber(body.weight);
  body.height = ensureNumber(body.height);
  body.width = ensureNumber(body.width);
  body.length = ensureNumber(body.length);
  body.isStopDesk = Boolean(body.isStopDesk);
  body.freeShipping = Boolean(body.freeShipping);
  body.hasExchange = Boolean(body.hasExchange);
  const resp = (await request(`/api/v1/orders`, {
    method: "POST",
    body: JSON.stringify(body),
  })) as any;
  return resp?.data ?? resp;
}

export async function getOrders(
  params?: Record<string, any>
): Promise<{ data: DbOrders[]; meta?: any }> {
  const resp = (await request(`/api/v1/orders${qs(params)}`, {
    method: "GET",
  })) as any;
  return { data: resp?.data ?? resp ?? [], meta: resp?.meta ?? null };
}

export async function getMyOrders(
  params?: Record<string, any>
): Promise<{ data: DbOrders[]; meta?: any }> {
  const resp = (await request(`/api/v1/orders/my-orders${qs(params)}`, {
    method: "GET",
  })) as any;
  return { data: resp?.data ?? resp ?? [], meta: resp?.meta ?? null };
}

export async function getMyDeliveries(
  params?: Record<string, any>
): Promise<{ data: DbOrders[]; meta?: any }> {
  const resp = (await request(`/api/v1/orders/my-deliveries${qs(params)}`, {
    method: "GET",
  })) as any;
  return { data: resp?.data ?? resp ?? [], meta: resp?.meta ?? null };
}

export async function getOrderById(id: number): Promise<DbOrders> {
  const resp = (await request(`/api/v1/orders/${id}`, {
    method: "GET",
  })) as any;
  return resp?.data ?? resp;
}

export async function updateOrder(
  id: number,
  payload: OrdersUpdate
): Promise<DbOrders> {
  const resp = (await request(`/api/v1/orders/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  })) as any;
  return resp?.data ?? resp;
}

export async function updateOrderStatus(
  id: number,
  status: DbOrders["status"]
): Promise<any> {
  const resp = (await request(`/api/v1/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  })) as any;
  return resp?.data ?? resp;
}

export async function assignDeliveryman(
  id: number,
  deliverymanId: number | null
): Promise<any> {
  const resp = (await request(`/api/v1/orders/${id}/assign-deliveryman`, {
    method: "PATCH",
    body: JSON.stringify({ deliverymanId }),
  })) as any;
  return resp?.data ?? resp;
}

export async function bulkUpdateOrders(
  orderIds: number[],
  updateData: OrdersUpdate
): Promise<any> {
  const resp = (await request(`/api/v1/orders/bulk-update`, {
    method: "POST",
    body: JSON.stringify({ orderIds, updateData }),
  })) as any;
  return resp?.data ?? resp;
}

export async function bulkDeleteOrders(ids: number[]): Promise<any> {
  const resp = (await request(`/api/v1/orders/bulk`, {
    method: "DELETE",
    body: JSON.stringify({ orderIds: ids }),
  })) as any;
  return resp?.data ?? resp;
}

export async function cancelOrder(id: number): Promise<any> {
  const resp = (await request(`/api/v1/orders/${id}/cancel`, {
    method: "PATCH",
  })) as any;
  return resp?.data ?? resp;
}

export async function getOrderTracking(id: number): Promise<any> {
  const resp = (await request(`/api/v1/orders/${id}/tracking`, {
    method: "GET",
  })) as any;
  return resp?.data ?? resp;
}

export async function addOrderTracking(
  id: number,
  payload: OrderTrackingInsert
): Promise<any> {
  const resp = (await request(`/api/v1/orders/${id}/tracking`, {
    method: "POST",
    body: JSON.stringify(payload),
  })) as any;
  return resp?.data ?? resp;
}

export async function uploadDeliveryProof(id: number): Promise<any> {
  const resp = (await request(`/api/v1/orders/${id}/delivery-proof`, {
    method: "POST",
  })) as any;
  return resp?.data ?? resp;
}

export async function getOrdersAnalytics(
  params?: Record<string, any>
): Promise<any> {
  const resp = (await request(`/api/v1/orders/analytics${qs(params)}`, {
    method: "GET",
  })) as any;
  return resp?.data ?? resp;
}

export async function exportOrders(
  params?: Record<string, any>,
  format: "csv" | "excel" = "csv"
): Promise<Blob> {
  const p = { ...(params ?? {}), format };
  const result = (await request(`/api/v1/orders/export${qs(p)}`, {
    method: "GET",
  })) as unknown;
  return result as Blob;
}

const ordersApi = {
  createOrder,
  getOrders,
  getMyOrders,
  getMyDeliveries,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  assignDeliveryman,
  bulkUpdateOrders,
  bulkDeleteOrders,
  cancelOrder,
  getOrderTracking,
  addOrderTracking,
  uploadDeliveryProof,
  getOrdersAnalytics,
  exportOrders,
};

export default ordersApi;
