"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { LoaderComponent } from "../loader/Loader";
import EmptyState from "../EmptyState";
import {
  getAllLockers,
  type LockerListItem,
  type PaginatedResponse,
} from "@/app/api/lockers";
import { getWilayas, type Wilaya } from "@/app/api/wilaya";

type UILocker = {
  id: string;
  name: string;
  code: string;
  wilaya: string;
  commune: string;
  address: string;
  compartments: number;
  status: "active" | "inactive";
  lastUpdate: string;
};

export default function LockersComponent() {
  const [selectedLockers, setSelectedLockers] = useState<Set<string>>(
    new Set()
  );
  const [lockers, setLockers] = useState<UILocker[]>([]);
  const [meta, setMeta] = useState<PaginatedResponse<LockerListItem>["meta"]>({
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [selectedWilayaCode, setSelectedWilayaCode] = useState<string>("");
  const [selectedWilayaName, setSelectedWilayaName] = useState<string>("All");
  const [isWilayaOpen, setIsWilayaOpen] = useState(false);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const wilayaRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const pages = useMemo(
    () => Array.from({ length: meta.totalPages ?? 0 }, (_, i) => i + 1),
    [meta.totalPages]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wilayaRef.current &&
        !wilayaRef.current.contains(event.target as Node)
      )
        setIsWilayaOpen(false);
      if (
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      )
        setIsPageSizeOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const w = await getWilayas();
        if (!alive) return;
        setWilayas(w);
      } catch {
        setWilayas([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getAllLockers({
          page: currentPage,
          limit: pageSize,
          wilayaCode: selectedWilayaCode || undefined,
        });
        if (!alive) return;
        const uiData: UILocker[] = (res.data ?? []).map((l: any) => ({
          id: String(l.id),
          name: l.name,
          code: l.referenceId,
          wilaya: l.city?.wilaya?.name ?? "-",
          commune: l.city?.name ?? "-",
          address: l.address ?? "-",
          compartments: l.capacity,
          status: l.isActive === false ? "inactive" : "active",
          lastUpdate: l.updatedAt
            ? new Date(l.updatedAt).toLocaleDateString()
            : "-",
        }));
        setLockers(uiData);
        setMeta(res.meta);
        setSelectedLockers(new Set());
      } catch {
        setLockers([]);
        setMeta({
          total: 0,
          page: 1,
          limit: pageSize,
          totalPages: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [currentPage, pageSize, selectedWilayaCode]);

  const isAllSelected =
    selectedLockers.size === lockers.length && lockers.length > 0;
  const isSomeSelected = selectedLockers.size > 0 && !isAllSelected;

  const toggleAllSelection = () => {
    if (isAllSelected) setSelectedLockers(new Set());
    else setSelectedLockers(new Set(lockers.map((l) => l.id)));
  };

  const gotoPage = (p: number) => {
    if (p < 1 || p > (meta.totalPages ?? 1)) return;
    setCurrentPage(p);
  };

  const pagesToRender = pages.length ? pages : [1];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <LoaderComponent isLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div
        className="w-full mx-auto"
        style={{ maxWidth: "calc(100vw - 300px)" }}
      >
        <div className="bg-white rounded-lg border border-[#D6D6D6] overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3 h-[68px]">
            <h1 className="text-[20px] font-medium text-[#424242] capitalize tracking-wide">
              Lockers by Wilaya
            </h1>
            <div ref={wilayaRef} className="relative">
              <button
                onClick={() => setIsWilayaOpen(!isWilayaOpen)}
                className="flex items-center justify-between w-[220px] h-[46px] px-3.5 border border-[rgba(52,64,84,0.4)] rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-[#1A1C1E] tracking-[-0.14px]">
                  {selectedWilayaName}
                </span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M6 9L12 15L18 9"
                    stroke="black"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {isWilayaOpen && (
                <div className="absolute right-0 mt-1 w-[260px] max-h-72 overflow-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  <button
                    key="__all"
                    onClick={() => {
                      setSelectedWilayaCode("");
                      setSelectedWilayaName("All");
                      setCurrentPage(1);
                      setIsWilayaOpen(false);
                    }}
                    className={cn(
                      "block w-full text-left px-3.5 py-2 text-sm font-medium hover:bg-gray-50 transition",
                      selectedWilayaCode === ""
                        ? "text-[#FF5A01]"
                        : "text-[#1A1C1E]"
                    )}
                  >
                    All
                  </button>
                  {wilayas.map((w) => (
                    <button
                      key={w.code}
                      onClick={() => {
                        setSelectedWilayaCode(w.code);
                        setSelectedWilayaName(w.name);
                        setCurrentPage(1);
                        setIsWilayaOpen(false);
                      }}
                      className={cn(
                        "block w-full text-left px-3.5 py-2 text-sm font-medium hover:bg-gray-50 transition",
                        selectedWilayaCode === w.code
                          ? "text-[#FF5A01]"
                          : "text-[#1A1C1E]"
                      )}
                    >
                      {w.name} ({w.code})
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {lockers.length === 0 ? (
            <div className="p-8 flex flex-col items-center justify-center">
              <EmptyState />
              <p className="mt-4 text-sm text-gray-600">No data available.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-full">
                  <div
                    className="grid items-center border-y border-[#D6D6D6] bg-[#FDF4FF] h-[42px]"
                    style={{
                      gridTemplateColumns:
                        "40px 1.1fr 0.8fr 0.9fr 1.4fr 0.7fr 0.9fr 0.8fr",
                    }}
                  >
                    <div className="flex justify-center items-center border-r border-[#EAECF0] bg-[#FCFCFD] h-full" />
                    <div className="px-2 text-sm font-normal text-black">
                      Locker Name
                    </div>
                    <div className="px-2 text-sm font-normal text-black text-center">
                      Wilaya
                    </div>
                    <div className="px-2 text-sm font-normal text-black">
                      Commune
                    </div>
                    <div className="px-2 text-sm font-normal text-black text-center">
                      Address
                    </div>
                    <div className="px-2 text-sm font-normal text-black text-center">
                      Compartments
                    </div>
                    <div className="px-2 text-sm font-normal text-black text-center">
                      Status
                    </div>
                    <div className="px-2 text-sm font-normal text-black text-center">
                      Last Update
                    </div>
                  </div>

                  {lockers.map((locker) => (
                    <div
                      key={locker.id}
                      className="grid items-center border-b border-[#D6D6D6] hover:bg-gray-50 transition h-[58px]"
                      style={{
                        gridTemplateColumns:
                          "40px 1.1fr 0.8fr 0.9fr 1.4fr 0.7fr 0.9fr 0.8fr",
                      }}
                    >
                      <div
                        className="flex justify-center items-center border-r border-[#EAECF0] bg-[#FCFCFD] h-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div
                          className="w-[14.826px] h-[14.826px] border-[0.741px] border-[#FF5A01] bg-white rounded-[4.448px] flex items-center justify-center cursor-pointer transition-all hover:bg-[#FFF8F5]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLockers((prev) => {
                              const next = new Set(prev);
                              if (next.has(locker.id)) next.delete(locker.id);
                              else next.add(locker.id);
                              return next;
                            });
                          }}
                        >
                          {selectedLockers.has(locker.id) && (
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 15 15"
                              fill="none"
                            >
                              <path
                                d="M4 7.5L6.5 10L11 5"
                                stroke="#FF5A01"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="px-2 overflow-hidden">
                        <div className="text-xs text-black font-roboto truncate">
                          {locker.name}
                        </div>
                        <div className="text-[10px] text-[#807E7E] font-roboto truncate">
                          {locker.code}
                        </div>
                      </div>

                      <div className="px-2 text-sm text-black text-center overflow-hidden">
                        <span className="truncate inline-block max-w-full">
                          {locker.wilaya}
                        </span>
                      </div>

                      <div className="px-2 text-sm text-black overflow-hidden">
                        <span className="truncate inline-block max-w-full">
                          {locker.commune}
                        </span>
                      </div>

                      <div className="px-2 text-sm text-black text-center overflow-hidden">
                        <span className="truncate inline-block max-w-full">
                          {locker.address}
                        </span>
                      </div>

                      <div className="px-2 text-sm text-black text-center">
                        {locker.compartments}
                      </div>

                      <div className="px-2 flex justify-center">
                        <span
                          className={cn(
                            "text-sm font-medium px-3 py-1 rounded-lg",
                            locker.status === "active"
                              ? "bg-[#DFFFEA] text-[#0B8457]"
                              : "bg-[#FFEDEB] text-[#C03C0B]"
                          )}
                        >
                          {locker.status}
                        </span>
                      </div>

                      <div className="px-2 text-sm text-black text-center">
                        {locker.lastUpdate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex w-full justify-between items-center px-5 py-3 border-t border-[#D6D6D6] bg-white">
                <div className="flex items-center gap-3">
                  <div
                    className="w-[14.826px] h-[14.826px] border-[0.741px] border-[#FF5A01] bg-[#F7FAFF] rounded-[4.448px] flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      if (isAllSelected) setSelectedLockers(new Set());
                      else
                        setSelectedLockers(new Set(lockers.map((l) => l.id)));
                    }}
                  >
                    {(isSomeSelected || isAllSelected) && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 11 11"
                        fill="none"
                      >
                        <path
                          d="M2.16138 5.18945H8.21516"
                          stroke="#FF5A01"
                          strokeWidth="1.48256"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-xs text-[#555]">
                    {selectedLockers.size} selected
                  </span>
                </div>

                <div className="flex flex-1 items-center justify-center gap-4">
                  <button
                    onClick={() => gotoPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity disabled:opacity-40"
                  >
                    <svg
                      className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                    >
                      <path
                        d="M5.16553 8.9375L1.26363 5.0356L5.16553 1.1337"
                        stroke="black"
                        strokeWidth="1.30063"
                      />
                    </svg>
                    <span className="font-roboto text-[10px] font-medium text-black">
                      Précédent
                    </span>
                  </button>

                  {(pagesToRender.length ? pagesToRender : [1]).map((p) => (
                    <button
                      key={p}
                      onClick={() => gotoPage(p)}
                      className={cn(
                        "font-roboto font-medium transition-all",
                        p === currentPage
                          ? "min-w-[48px] h-[26px] px-3 flex items-center justify-center text-xs rounded-md border border-black bg-white"
                          : "text-[10px] text-black hover:opacity-70"
                      )}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    onClick={() =>
                      gotoPage(Math.min(meta.totalPages || 1, currentPage + 1))
                    }
                    disabled={currentPage >= (meta.totalPages || 1)}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity disabled:opacity-40"
                  >
                    <span className="font-roboto text-[10px] font-medium text-black">
                      Prochain
                    </span>
                    <svg
                      className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                      width="6"
                      height="10"
                      viewBox="0 0 6 10"
                      fill="none"
                    >
                      <path
                        d="M0.604492 9.18359L4.50639 5.28169L0.604492 1.37979"
                        stroke="black"
                        strokeWidth="1.30063"
                      />
                    </svg>
                  </button>
                </div>

                <div ref={pageSizeRef} className="relative">
                  <button
                    onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                    className="flex items-center px-3 py-2 border border-[rgba(52,64,84,0.4)] rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-roboto text-[11px] font-medium text-[#344054] tracking-wide mr-1">
                      {pageSize}
                    </span>
                    <svg
                      className="w-4 h-4"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                    >
                      <path
                        d="M5.10742 6.55859L9.35742 10.8086L13.6074 6.55859"
                        stroke="#344054"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  {isPageSizeOpen && (
                    <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[60px]">
                      {[5, 10, 20, 50].map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setPageSize(size);
                            setCurrentPage(1);
                            setIsPageSizeOpen(false);
                          }}
                          className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
