"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { X, Filter as FilterIcon } from "lucide-react";

type City = { id: number; name: string };
type Vendor = { id: number; name: string };
type Deliveryman = { id: number; name: string };

type OrdersFilterParams = {
  page?: number;
  limit?: number;
  status?: string;
  fromCity?: string;
  toCity?: string;
  vendor?: string;
  deliveryman?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC" | "";
  __reset?: boolean;
};

type FilterButtonProps = {
  initialParams?: OrdersFilterParams;
  onApply?: (params: Record<string, any>) => void;
  className?: string;
};

function toNumberIfPossible(v: any) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function buildUrl(path: string) {
  const base = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://37.27.218.199:9000"
  ).replace(/\/+$/, "");
  if (!base) return path;
  if (/^https?:\/\//.test(path)) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

function getAuthToken() {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("app_token");
  } catch {
    return null;
  }
}

export default function FilterButton({
  initialParams,
  onApply,
  className,
}: FilterButtonProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const defaults: OrdersFilterParams = {
    page: 1,
    limit: 10,
    status: "",
    fromCity: "",
    toCity: "",
    vendor: "",
    deliveryman: "",
    dateFrom: "",
    dateTo: "",
    search: "",
    sortBy: "",
    sortOrder: "",
  };

  const [form, setForm] = useState<OrdersFilterParams>({
    ...defaults,
    ...(initialParams ?? {}),
  });

  const [cities, setCities] = useState<City[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [deliverymen, setDeliverymen] = useState<Deliveryman[]>([]);

  useEffect(() => {
    if (initialParams) {
      setForm((f) => ({ ...f, ...initialParams }));
    }
  }, [initialParams]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = buildUrl("/api/v1/wilaya");
        const token = getAuthToken();
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!Array.isArray(body) || !mounted) return;
        const wilayaCodes = body.map((w: any) => w.code);
        const cityPromises = wilayaCodes.map((code: string) =>
          fetch(buildUrl(`/api/v1/wilaya/${code}/cities`), {
            headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          }).then((r) => r.json())
        );
        const allCitiesResponses = await Promise.all(cityPromises);
        const allCities: City[] = allCitiesResponses.flatMap((resp) =>
          Array.isArray(resp)
            ? resp.map((c: any) => ({ id: c.id, name: c.name }))
            : []
        );
        if (mounted) setCities(allCities);
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = buildUrl("/api/v1/vendors");
        const token = getAuthToken();
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (mounted)
          setVendors(
            Array.isArray(body)
              ? body.map((v: any) => ({
                  id: v.id,
                  name: v.fullName || v.name,
                }))
              : []
          );
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const url = buildUrl("/api/v1/deliverymen");
        const token = getAuthToken();
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (mounted)
          setDeliverymen(
            Array.isArray(body)
              ? body.map((d: any) => ({
                  id: d.id,
                  name: d.fullName || d.name,
                }))
              : []
          );
      } catch (err) {
        console.error(err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const activeCount = useMemo(() => {
    const { page, limit, ...rest } = form as any;
    return Object.values(rest).filter(
      (v) => v !== undefined && v !== null && String(v).trim() !== ""
    ).length;
  }, [form]);

  const buildParams = useMemo(
    () => (f: OrdersFilterParams) => {
      const params: Record<string, any> = {};
      if (toNumberIfPossible(f.page) !== undefined)
        params.page = toNumberIfPossible(f.page);
      if (toNumberIfPossible(f.limit) !== undefined)
        params.limit = toNumberIfPossible(f.limit);
      if (f.status?.trim()) params.status = f.status.trim();
      const fromCityTrim = f.fromCity?.trim();
      if (fromCityTrim) {
        const fromCityObj = cities.find(
          (c) => c.name.toLowerCase() === fromCityTrim.toLowerCase()
        );
        if (fromCityObj) params.fromCityId = fromCityObj.id;
      }
      const toCityTrim = f.toCity?.trim();
      if (toCityTrim) {
        const toCityObj = cities.find(
          (c) => c.name.toLowerCase() === toCityTrim.toLowerCase()
        );
        if (toCityObj) params.toCityId = toCityObj.id;
      }
      const vendorTrim = f.vendor?.trim();
      if (vendorTrim) {
        const vendorObj = vendors.find(
          (v) => v.name.toLowerCase() === vendorTrim.toLowerCase()
        );
        if (vendorObj) params.vendorId = vendorObj.id;
      }
      const deliverymanTrim = f.deliveryman?.trim();
      if (deliverymanTrim) {
        const deliverymanObj = deliverymen.find(
          (d) => d.name.toLowerCase() === deliverymanTrim.toLowerCase()
        );
        if (deliverymanObj) params.deliverymanId = deliverymanObj.id;
      }
      if (f.dateFrom) params.dateFrom = f.dateFrom;
      if (f.dateTo) params.dateTo = f.dateTo;
      if (f.search && String(f.search).trim() !== "")
        params.search = String(f.search).trim();
      if (f.sortBy && f.sortBy !== "") params.sortBy = f.sortBy;
      if (f.sortOrder) params.sortOrder = f.sortOrder as "ASC" | "DESC";
      return params;
    },
    [cities, vendors, deliverymen]
  );

  function setField<K extends keyof OrdersFilterParams>(
    k: K,
    v: OrdersFilterParams[K]
  ) {
    setForm((s) => ({ ...s, [k]: v }));
  }

  function handleReset() {
    onApply?.({ page: 1, limit: 10, __reset: true });
    setForm(defaults);
    setOpen(false);
  }

  function handleApply() {
    const params = buildParams(form);
    onApply?.(params);
    setOpen(false);
  }

  return (
    <div className={className ?? ""}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        className="inline-flex gap-2 items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      >
        <FilterIcon className="w-4 h-4" />
        <span className="text-sm font-medium">Filter</span>
        {activeCount > 0 && (
          <span className="ml-1 inline-flex items-center justify-center text-xs font-semibold bg-[#f2f2f2] text-[#FF5A01] rounded-full w-5 h-5">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            aria-hidden
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm transition-opacity"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            className="fixed right-0 top-0 z-[80] h-screen w-full sm:w-[420px] md:w-[480px] bg-white shadow-2xl overflow-y-auto"
            style={{
              animation: "300ms cubic-bezier(.2,.8,.2,1) 0s 1 slide-in-right",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <style>{`
              @keyframes slide-in-right {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>

            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FFF5EF] rounded-md">
                  <FilterIcon className="w-5 h-5 text-[#FF5A01]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Filters
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col text-xs text-gray-600">
                  <span className="mb-1">Page</span>
                  <input
                    type="number"
                    min={1}
                    value={form.page ?? ""}
                    onChange={(e) =>
                      setField(
                        "page",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                  />
                </label>

                <label className="flex flex-col text-xs text-gray-600">
                  <span className="mb-1">Limit</span>
                  <input
                    type="number"
                    min={1}
                    value={form.limit ?? ""}
                    onChange={(e) =>
                      setField(
                        "limit",
                        e.target.value ? Number(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col text-xs text-gray-600">
                    <span className="mb-1">From City</span>
                    <select
                      value={form.fromCity ?? ""}
                      onChange={(e) => setField("fromCity", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                    >
                      <option value="">— Select From City —</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col text-xs text-gray-600">
                    <span className="mb-1">To City</span>
                    <select
                      value={form.toCity ?? ""}
                      onChange={(e) => setField("toCity", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                    >
                      <option value="">— Select To City —</option>
                      {cities.map((city) => (
                        <option key={city.id} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col text-xs text-gray-600">
                    <span className="mb-1">Vendor</span>
                    <select
                      value={form.vendor ?? ""}
                      onChange={(e) => setField("vendor", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                    >
                      <option value="">— Select Vendor —</option>
                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={vendor.name}>
                          {vendor.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col text-xs text-gray-600">
                    <span className="mb-1">Deliveryman</span>
                    <select
                      value={form.deliveryman ?? ""}
                      onChange={(e) => setField("deliveryman", e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                    >
                      <option value="">— Select Deliveryman —</option>
                      {deliverymen.map((deliveryman) => (
                        <option key={deliveryman.id} value={deliveryman.name}>
                          {deliveryman.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col text-xs text-gray-600">
                  <span className="mb-1">Date From</span>
                  <input
                    type="date"
                    value={form.dateFrom ?? ""}
                    onChange={(e) => setField("dateFrom", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                  />
                </label>

                <label className="flex flex-col text-xs text-gray-600">
                  <span className="mb-1">Date To</span>
                  <input
                    type="date"
                    value={form.dateTo ?? ""}
                    onChange={(e) => setField("dateTo", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                  />
                </label>
              </div>

              <div className="flex flex-col text-xs text-gray-600">
                <span className="mb-2">Status</span>
                <select
                  value={form.status ?? ""}
                  onChange={(e) => setField("status", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                >
                  <option value="">— All —</option>
                  <option value="in_preparation">in_preparation</option>
                  <option value="pending">pending</option>
                  <option value="shipped">shipped</option>
                  <option value="delivered">delivered</option>
                  <option value="cancelled">cancelled</option>
                </select>
              </div>

              <div className="flex flex-col text-xs text-gray-600">
                <span className="mb-2">Search</span>
                <input
                  type="text"
                  value={form.search ?? ""}
                  onChange={(e) => setField("search", e.target.value)}
                  placeholder="search term..."
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col text-xs text-gray-600">
                  <span className="mb-1">Sort By</span>
                  <select
                    value={form.sortBy ?? ""}
                    onChange={(e) => setField("sortBy", e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                  >
                    <option value="">— No sort —</option>
                    <option value="createdAt">createdAt</option>
                    <option value="price">price</option>
                    <option value="weight">weight</option>
                  </select>
                </label>

                <label className="flex flex-col text-xs text-gray-600">
                  <span className="mb-1">Order</span>
                  <select
                    value={form.sortOrder ?? ""}
                    onChange={(e) =>
                      setField(
                        "sortOrder",
                        e.target.value as "ASC" | "DESC" | ""
                      )
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#FFB28A]"
                  >
                    <option value="">— None —</option>
                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                  </select>
                </label>
              </div>

              <div className="pt-4 pb-8 flex items-center justify-between border-t">
                <div className="text-sm text-gray-500">
                  {activeCount > 0 ? (
                    <span>{activeCount} active filter(s)</span>
                  ) : (
                    <span>No active filters</span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Reset
                  </button>

                  <button
                    onClick={handleApply}
                    className="px-4 py-2 rounded-md bg-[#FF5A01] text-white text-sm shadow hover:brightness-95 transition"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
