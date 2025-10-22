"use client";

import React, { useEffect } from "react";
import useFetch from "@/../hooks/useFetch";
import { getPersistedToken } from "@/app/api/auth";

export type Wilaya = { code: string; name: string; ar_name?: string };
export type City = { id: number; name: string; ar_name?: string };

export function useWilayas() {
  const { data, loading, error, refetch } = useFetch<Wilaya[]>(
    "/api/v1/wilaya",
    {
      getAuthToken: getPersistedToken,
      parseJson: true,
      auto: true,
    }
  );

  return {
    wilayas: data ?? [],
    loading,
    error,
    refetch,
  } as const;
}

export function useCities(wilayaCode?: string | null) {
  const { data, loading, error, fetcher, refetch } = useFetch<City[] | null>(
    null,
    {
      getAuthToken: getPersistedToken,
      parseJson: true,
      auto: false,
    }
  );

  useEffect(() => {
    if (!wilayaCode) return;
    fetcher(`/api/v1/wilaya/${wilayaCode}/cities`).catch(() => {});
  }, [wilayaCode, fetcher]);

  return {
    cities: data ?? [],
    loading,
    error,
    refetch,
  } as const;
}

export function CitiesFetcher({
  wilayaCode,
  onCities,
  children,
}: {
  wilayaCode?: string | null;
  onCities?: (cities: City[]) => void;
  children?: (state: {
    cities: City[];
    loading: boolean;
    error: any;
  }) => React.ReactNode;
}) {
  const { cities, loading, error } = useCities(wilayaCode);

  useEffect(() => {
    if (onCities && !loading) onCities(cities);
  }, [cities, loading, onCities]);

  if (children) return <>{children({ cities, loading, error })}</>;

  return null;
}
