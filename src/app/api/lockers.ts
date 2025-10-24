import { AnyObj } from "./auth";

const BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");

function buildUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

async function request<T = any>(path: string, init?: RequestInit): Promise<T> {
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
  let body: any;
  if (ct.includes("application/json")) {
    body = await res.json().catch(() => null);
  } else {
    const txt = await res.text().catch(() => null);
    body = txt;
  }
  if (!res.ok) throw { status: res.status, statusText: res.statusText, body };
  return body as T;
}

export type ClosetStatus =
  | "available"
  | "occupied"
  | "reserved"
  | "maintenance";

export interface Closet extends AnyObj {
  id: number;
  status: ClosetStatus;
  currentOrderId: number | null;
}

export interface OperatingHoursDay {
  open: string; // "HH:mm"
  close: string; // "HH:mm"
}

export type OperatingHours = {
  monday?: OperatingHoursDay;
  tuesday?: OperatingHoursDay;
  wednesday?: OperatingHoursDay;
  thursday?: OperatingHoursDay;
  friday?: OperatingHoursDay;
  saturday?: OperatingHoursDay;
  sunday?: OperatingHoursDay;
};

export interface LockerCityWilaya {
  code: string;
  name: string;
  ar_name: string;
}

export interface LockerCity {
  id: number;
  name: string;
  ar_name: string;
  wilaya?: LockerCityWilaya;
}

export interface LockerListItem extends AnyObj {
  id: number;
  referenceId: string;
  name: string;
  address: string;
  capacity: number;
  availableClosets: number;
  occupiedClosets: number;
  isFull: boolean;
}

export interface Locker extends AnyObj {
  id: number;
  referenceId: string;
  name: string;
  address: string;
  cityId: number;
  capacity: number;
  closets: Closet[];
  operatingHours: OperatingHours;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  city?: LockerCity;
  contactPhone?: string;
}

export interface LockerStatistics extends AnyObj {
  totalLockers: number;
  activeLockers: number;
  inactiveLockers: number;
  totalCapacity: number;
  totalAvailable: number;
  totalOccupied: number;
  occupancyRate: number;
}

export interface PaginatedMeta extends AnyObj {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> extends AnyObj {
  data: T[];
  meta: PaginatedMeta;
}

export interface CreateLockerPayload extends AnyObj {
  name: string;
  address: string;
  cityId: number;
  capacity: number;
  operatingHours?: OperatingHours;
  isActive?: boolean;
  contactPhone?: string;
}

export interface UpdateLockerPayload extends AnyObj {
  name?: string;
  address?: string;
  cityId?: number;
  capacity?: number;
  operatingHours?: OperatingHours;
  isActive?: boolean;
  contactPhone?: string;
}

export type LockersSortBy = "name" | "createdAt" | "capacity";
export type SortOrder = "ASC" | "DESC";

export interface GetAllLockersParams {
  page?: number;
  limit?: number;
  cityId?: number;
  wilayaCode?: string;
  isActive?: boolean;
  hasAvailableClosets?: boolean;
  search?: string;
  sortBy?: LockersSortBy;
  sortOrder?: SortOrder;
}

export interface UpdateClosetStatusPayload extends AnyObj {
  closetId: number;
  status: ClosetStatus;
  currentOrderId?: number | null;
}

export interface UpdateClosetStatusResponse extends AnyObj {
  id: number;
  referenceId: string;
  closets: Closet[];
}

export interface AssignOrderResponse extends AnyObj {
  locker: {
    id: number;
    referenceId: string;
    name: string;
  };
  closetId: number;
}

export interface AvailableClosetsResponse extends AnyObj {
  lockerId: number;
  referenceId: string;
  totalCapacity: number;
  availableCount: number;
  availableClosets: Closet[];
}

export interface OccupiedClosetsResponse extends AnyObj {
  lockerId: number;
  referenceId: string;
  totalCapacity: number;
  occupiedCount: number;
  occupiedClosets: Closet[];
}

export interface ClosetDetailsResponse extends AnyObj {
  lockerId: number;
  referenceId: string;
  closet: Closet;
}

export async function getLockerStatistics(): Promise<LockerStatistics> {
  return request("/api/v1/lockers/statistics");
}

export async function createLocker(
  payload: CreateLockerPayload
): Promise<Locker> {
  return request("/api/v1/lockers", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getAllLockers(
  params?: GetAllLockersParams
): Promise<PaginatedResponse<LockerListItem>> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.cityId !== undefined) query.set("cityId", String(params.cityId));
  if (params?.wilayaCode) query.set("wilayaCode", params.wilayaCode);
  if (params?.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params?.hasAvailableClosets !== undefined)
    query.set("hasAvailableClosets", String(params.hasAvailableClosets));
  if (params?.search) query.set("search", params.search);
  if (params?.sortBy) query.set("sortBy", params.sortBy);
  if (params?.sortOrder) query.set("sortOrder", params.sortOrder);

  const url = query.toString() ? `/api/v1/lockers?${query}` : "/api/v1/lockers";
  return request(url);
}

export async function getLockerByReference(
  referenceId: string
): Promise<Locker | AnyObj> {
  return request(
    `/api/v1/lockers/reference/${encodeURIComponent(referenceId)}`
  );
}

export async function getLockerById(id: number | string): Promise<Locker> {
  return request(`/api/v1/lockers/${id}`);
}

export async function updateLocker(
  id: number | string,
  payload: UpdateLockerPayload
): Promise<Locker | AnyObj> {
  return request(`/api/v1/lockers/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteLocker(id: number | string): Promise<AnyObj> {
  return request(`/api/v1/lockers/${id}`, { method: "DELETE" });
}

export async function toggleLocker(id: number | string): Promise<Locker> {
  return request(`/api/v1/lockers/${id}/toggle`, { method: "PATCH" });
}

export async function updateClosetStatus(
  lockerId: number | string,
  payload: UpdateClosetStatusPayload
): Promise<UpdateClosetStatusResponse> {
  return request(`/api/v1/lockers/${lockerId}/closets`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function assignOrderToLocker(
  lockerId: number | string,
  orderId: number | string
): Promise<AssignOrderResponse> {
  return request(`/api/v1/lockers/${lockerId}/assign-order/${orderId}`, {
    method: "POST",
  });
}

export async function releaseCloset(
  lockerId: number | string,
  closetId: number | string
): Promise<AnyObj> {
  return request(`/api/v1/lockers/${lockerId}/closets/${closetId}/release`, {
    method: "POST",
  });
}

export async function getAvailableClosets(
  lockerId: number | string
): Promise<AvailableClosetsResponse> {
  return request(`/api/v1/lockers/${lockerId}/closets/available`);
}

export async function getOccupiedClosets(
  lockerId: number | string
): Promise<OccupiedClosetsResponse> {
  return request(`/api/v1/lockers/${lockerId}/closets/occupied`);
}

export async function getClosetDetails(
  lockerId: number | string,
  closetId: number | string
): Promise<ClosetDetailsResponse> {
  return request(`/api/v1/lockers/${lockerId}/closets/${closetId}`);
}

export default {
  getLockerStatistics,
  createLocker,
  getAllLockers,
  getLockerByReference,
  getLockerById,
  updateLocker,
  deleteLocker,
  toggleLocker,
  updateClosetStatus,
  assignOrderToLocker,
  releaseCloset,
  getAvailableClosets,
  getOccupiedClosets,
  getClosetDetails,
};
