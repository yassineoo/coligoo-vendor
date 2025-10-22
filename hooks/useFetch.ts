import { useCallback, useEffect, useRef, useState } from "react";

export type UseFetchOptions = Omit<RequestInit, "signal"> & {
  parseJson?: boolean;
  credentials?: RequestCredentials;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  auto?: boolean;
  getAuthToken?: () => string | null | Promise<string | null>;
  baseUrl?: string;
};

const DEFAULT_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useFetch<T = unknown>(
  inputUrl?: string | null,
  options?: UseFetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const controllerRef = useRef<AbortController | null>(null);
  const lastUrlRef = useRef<string | null>(inputUrl ?? null);
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      controllerRef.current?.abort();
    };
  }, []);

  const buildUrl = (u: string) => {
    if (/^https?:\/\//.test(u)) return u;
    const base = options?.baseUrl ?? DEFAULT_BASE;
    if (!base) return u;
    return base.replace(/\/+$/, "") + "/" + u.replace(/^\/+/, "");
  };

  const abort = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  }, []);

  const fetcher = useCallback(
    async (url?: string, opts?: UseFetchOptions) => {
      const resolvedUrl = url ?? inputUrl;
      if (!resolvedUrl)
        return Promise.reject(new Error("useFetch: no url provided"));
      const effectiveOpts: UseFetchOptions = {
        ...(options ?? {}),
        ...(opts ?? {}),
      };
      const {
        parseJson = true,
        timeout,
        retries = 0,
        retryDelay = 300,
        getAuthToken,
      } = effectiveOpts;
      const headers = new Headers(effectiveOpts.headers ?? {});
      if (getAuthToken) {
        const token = await getAuthToken();
        if (token) headers.set("Authorization", `Bearer ${token}`);
      }

      const attempt = async (attemptIndex: number): Promise<T> => {
        controllerRef.current?.abort();
        const ctrl = new AbortController();
        controllerRef.current = ctrl;
        const mergedInit: RequestInit = {
          method: effectiveOpts.method,
          headers,
          body: effectiveOpts.body,
          credentials: effectiveOpts.credentials,
          cache: effectiveOpts.cache,
          redirect: effectiveOpts.redirect,
          referrer: effectiveOpts.referrer,
          mode: effectiveOpts.mode,
          signal: ctrl.signal,
        };
        let timeoutId: number | null = null;
        if (timeout && timeout > 0) {
          const p = new Promise((_r, rej) => {
            timeoutId = window.setTimeout(() => {
              ctrl.abort();
              rej(new Error("Timeout"));
            }, timeout);
          });
          try {
            const res = (await Promise.race([
              fetch(buildUrl(resolvedUrl), mergedInit),
              p,
            ])) as Response;
            if (timeoutId) clearTimeout(timeoutId);
            if (!res.ok) {
              const text = await res.text().catch(() => null);
              throw {
                status: res.status,
                statusText: res.statusText,
                body: text,
              };
            }
            const payload = parseJson ? await res.json() : await res.text();
            return payload as T;
          } catch (err) {
            if ((err as any)?.name === "AbortError") throw { aborted: true };
            throw err;
          }
        } else {
          try {
            const res = await fetch(buildUrl(resolvedUrl), mergedInit);
            if (!res.ok) {
              const text = await res.text().catch(() => null);
              throw {
                status: res.status,
                statusText: res.statusText,
                body: text,
              };
            }
            const payload = parseJson ? await res.json() : await res.text();
            return payload as T;
          } catch (err) {
            if ((err as any)?.name === "AbortError") throw { aborted: true };
            throw err;
          }
        }
      };

      setLoading(true);
      setError(null);
      let lastErr: any = null;
      for (let i = 0; i <= retries; i++) {
        try {
          const result = await attempt(i);
          if (!isMounted.current) return Promise.reject(new Error("unmounted"));
          setData(result as T);
          lastUrlRef.current = resolvedUrl;
          setLoading(false);
          return result as T;
        } catch (err) {
          lastErr = err;
          if ((err as any)?.aborted) {
            setLoading(false);
            return Promise.reject({ aborted: true });
          }
          if ((err as any)?.status) {
            setError(err);
            setLoading(false);
            return Promise.reject(err);
          }
          if (i < retries) {
            const backoff = retryDelay * Math.pow(2, i);
            await sleep(backoff);
            continue;
          }
          setError(err);
          setLoading(false);
          return Promise.reject(err);
        }
      }
      return Promise.reject(lastErr ?? new Error("fetch failed"));
    },
    [inputUrl, options]
  );

  useEffect(() => {
    if (inputUrl && (options?.auto ?? true)) {
      fetcher(inputUrl, options).catch(() => {});
    }
  }, [inputUrl, options, fetcher]);

  const refetch = useCallback(
    (u?: string, opts?: UseFetchOptions) => {
      const target = u ?? lastUrlRef.current ?? inputUrl;
      if (!target) return Promise.reject(new Error("no url to refetch"));
      return fetcher(target, opts ?? options);
    },
    [fetcher, inputUrl, options]
  );

  return { data, error, loading, fetcher, refetch, abort } as const;
}

export default useFetch;
