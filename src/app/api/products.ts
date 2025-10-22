const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
const TOKEN_KEYS = ["app_token", "token"];

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getCookie(name: string) {
  try {
    if (typeof document === "undefined") return null;
    const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

function getToken() {
  try {
    if (typeof window === "undefined") return null;
    for (const k of TOKEN_KEYS) {
      const v = localStorage.getItem(k);
      if (v) return v;
    }
    for (const k of TOKEN_KEYS) {
      const c = getCookie(k);
      if (c) return c;
    }
    return null;
  } catch {
    return null;
  }
}

async function safeJson(res: Response) {
  const ct = res.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    const txt = await res.text().catch(() => null);
    if (!txt) return txt;
    try {
      return JSON.parse(txt);
    } catch {
      return txt;
    }
  } catch {
    return null;
  }
}

async function request(path: string, init?: RequestInit) {
  const url = buildUrl(path);
  const headers = new Headers(init?.headers ?? {});
  const token = getToken();
  if (token && !headers.has("Authorization"))
    headers.set("Authorization", `Bearer ${token}`);
  if (
    init &&
    init.body &&
    !(init.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json;charset=utf-8");
  }
  const res = await fetch(url, { ...init, headers });
  const body = await safeJson(res);
  if (!res.ok) {
    const err: any = new Error(res.statusText || `HTTP ${res.status}`);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
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

export async function createProduct(
  payload: Record<string, any>,
  images?: File[]
) {
  if (images && images.length) {
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    images.forEach((f, i) => fd.append("images", f, f.name || `img-${i}`));
    return request("/api/v1/products", { method: "POST", body: fd });
  }
  return request("/api/v1/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getProducts(params?: Record<string, any>) {
  return request(`/api/v1/products${qs(params)}`, { method: "GET" });
}

export async function getMyProducts(params?: Record<string, any>) {
  return request(`/api/v1/products/my-products${qs(params)}`, {
    method: "GET",
  });
}

export async function getProductById(id: string | number) {
  return request(`/api/v1/products/${id}`, { method: "GET" });
}

export async function updateProduct(
  id: string | number,
  payload: Record<string, any>,
  images?: File[]
) {
  if (images && images.length) {
    const fd = new FormData();
    fd.append("data", JSON.stringify(payload));
    images.forEach((f, i) => fd.append("images", f, f.name || `img-${i}`));
    return request(`/api/v1/products/${id}`, { method: "PATCH", body: fd });
  }
  return request(`/api/v1/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id: string | number) {
  return request(`/api/v1/products/${id}`, { method: "DELETE" });
}

export async function adminGetAllProducts(params?: Record<string, any>) {
  return request(`/api/v1/products/admin/all${qs(params)}`, { method: "GET" });
}

export default {
  createProduct,
  getProducts,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  adminGetAllProducts,
};
