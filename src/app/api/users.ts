type QueryParams = Record<string, string | number | boolean | undefined | null>;

async function buildUrl(path: string, params?: QueryParams) {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  const url = base ? `${base}${path.startsWith("/") ? "" : "/"}${path}` : path;
  if (!params) return url;
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(
      ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
    )
    .join("&");
  return qs ? `${url}${url.includes("?") ? "&" : "?"}${qs}` : url;
}

function getAuthToken(): string | null {
  try {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("app_token");
  } catch {
    return null;
  }
}

async function parseResponse(res: Response) {
  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const errMessage =
      (json?.message &&
        (Array.isArray(json.message)
          ? json.message.join(" • ")
          : String(json.message))) ||
      json?.error ||
      text ||
      `HTTP ${res.status}`;
    const err = new Error(errMessage);
    (err as any).status = res.status;
    (err as any).body = json ?? text;
    throw err;
  }

  return json;
}

async function request<T = any>(
  path: string,
  options: {
    method?: string;
    params?: QueryParams;
    body?: any;
    isFormData?: boolean;
    headers?: Record<string, string>;
  } = {}
): Promise<T> {
  const url = await buildUrl(path, options.params);
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...(options.headers ?? {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    if (options.isFormData) {
      body = options.body as FormData;
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify(options.body);
    }
  }

  const res = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  return parseResponse(res);
}

export interface IUser {
  id?: number;
  nom?: string;
  prenom?: string;
  email?: string;
  sex?: string;
  dob?: string;
  phoneNumber?: string;
  img?: string | null;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
  [k: string]: any;
}

export interface IPaginatedUsers {
  data: IUser[];
  meta?: {
    total?: number;
    page?: number;
    lastPage?: number;
    limit?: number;
  };
}

const usersApi = {
  getUsers: (params?: {
    page?: number;
    pageSize?: number;
    nom?: string;
    blocked?: string;
    orderBy?: string;
    order?: "ASC" | "DESC";
    q?: string;
  }) =>
    request<IPaginatedUsers>("/api/v1/users", {
      method: "GET",
      params,
    }),

  changeInfo: (payload: Record<string, any> | FormData) => {
    if (payload instanceof FormData) {
      return request("/api/v1/users/change-info", {
        method: "PATCH",
        body: payload,
        isFormData: true,
      });
    }
    const fd = new FormData();
    Object.entries(payload ?? {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      if (v instanceof File || v instanceof Blob) {
        fd.append(k, v as File | Blob);
      } else if (Array.isArray(v)) {
        fd.append(k, JSON.stringify(v));
      } else {
        fd.append(k, String(v));
      }
    });
    return request("/api/v1/users/change-info", {
      method: "PATCH",
      body: fd,
      isFormData: true,
    });
  },

  changePassword: (payload: { oldPassword: string; newPassword: string }) =>
    request("/api/v1/users/change-password", {
      method: "PATCH",
      body: payload,
    }),

  updateUserById: (id: string | number, payload: Record<string, any>) =>
    request(`/api/v1/users/${id}`, { method: "PATCH", body: payload }),

  deleteUserById: (id: string | number) =>
    request(`/api/v1/users/${id}`, { method: "DELETE" }),

  getUserInfo: () =>
    request<IUser>("/api/v1/users/user-info", { method: "GET" }),

  deleteAccount: () =>
    request("/api/v1/users/delete-account", { method: "DELETE" }),
};

export default usersApi;
