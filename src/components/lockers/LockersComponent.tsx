"use client";

import React, { useState, useRef, useEffect } from "react";
import { Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import LockerDetailsModal from "./LockerDetailsModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { useRouter } from "next/navigation";

interface Locker {
  id: string;
  name: string;
  code: string;
  wilaya: string;
  commune: string;
  address: string;
  compartments: number;
  occupied: number;
  available: number;
  status: "active" | "inactive";
  lastUpdate: string;
}

const mockLockers: Locker[] = Array.from({ length: 9 }, (_, i) => ({
  id: String(i + 1),
  name: "Algiers Center 01",
  code: "LKR-ALG-001",
  wilaya: "Alger",
  commune: "Bordj El Kiffan",
  address: "Rue Didouche Mourad",
  compartments: 20,
  occupied: 14,
  available: 6,
  status: "active",
  lastUpdate: "2025-09-28",
}));

export default function LockersComponent() {
  const router = useRouter();
  const [selectedLockers, setSelectedLockers] = useState<Set<string>>(
    new Set()
  );
  const [lockers, setLockers] = useState<Locker[]>(mockLockers);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWilaya, setSelectedWilaya] = useState("Alger");
  const [isWilayaOpen, setIsWilayaOpen] = useState(false);
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [selectedLocker, setSelectedLocker] = useState<Locker | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const wilayaRef = useRef<HTMLDivElement>(null);
  const pageSizeRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(lockers.length / pageSize);
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const startIndex = (currentPage - 1) * pageSize;

  const currentLockers = lockers.slice(startIndex, startIndex + pageSize);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wilayaRef.current &&
        !wilayaRef.current.contains(event.target as Node)
      ) {
        setIsWilayaOpen(false);
      }
      if (
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      ) {
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleLockerSelection = (lockerId: string) => {
    setSelectedLockers((prev) => {
      const next = new Set(prev);
      if (next.has(lockerId)) next.delete(lockerId);
      else next.add(lockerId);
      return next;
    });
  };

  const toggleAllSelection = () => {
    if (
      selectedLockers.size === currentLockers.length &&
      currentLockers.length > 0
    ) {
      setSelectedLockers(new Set());
    } else {
      setSelectedLockers(new Set(currentLockers.map((locker) => locker.id)));
    }
  };

  const isAllSelected =
    selectedLockers.size === currentLockers.length && currentLockers.length > 0;
  const isSomeSelected = selectedLockers.size > 0 && !isAllSelected;

  const gotoPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div
        className="w-full mx-auto"
        style={{ maxWidth: "calc(100vw - 300px)" }}
      >
        <div className="bg-white rounded-lg border border-[#D6D6D6] overflow-hidden">
          <div className="flex justify-between items-center px-5 py-3 h-[68px]">
            <h1 className="text-[20px] font-medium text-[#424242] capitalize tracking-wide">
              Lockers by Wilaya select
            </h1>
            <div ref={wilayaRef} className="relative">
              <button
                onClick={() => setIsWilayaOpen(!isWilayaOpen)}
                className="flex items-center justify-between w-[174px] h-[46px] px-3.5 border border-[rgba(52,64,84,0.4)] rounded-lg bg-white shadow-sm hover:bg-gray-50 transition"
              >
                <span className="text-sm font-medium text-[#1A1C1E] tracking-[-0.14px]">
                  {selectedWilaya}
                </span>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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
                <div className="absolute right-0 mt-1 w-[174px] bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                  {["Alger", "Oran", "Constantine", "Annaba"].map((wilaya) => (
                    <button
                      key={wilaya}
                      onClick={() => {
                        setSelectedWilaya(wilaya);
                        setIsWilayaOpen(false);
                      }}
                      className="block w-full text-left px-3.5 py-2 text-sm font-medium text-[#1A1C1E] hover:bg-gray-50 transition"
                    >
                      {wilaya}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              <div
                className="grid h-[42px] items-center border-y border-[#D6D6D6] bg-[#FDF4FF]"
                style={{
                  gridTemplateColumns:
                    "40px minmax(120px, 1fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(150px, 1.2fr) minmax(110px, 0.9fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(80px, 0.7fr)",
                }}
              >
                <div className="flex justify-center items-center border-r border-[#EAECF0] bg-[#FCFCFD] h-full">
                  <div
                    className="w-[14.826px] h-[14.826px] border-[0.741px] border-[#FF5A01] bg-[#F7FAFF] rounded-[4.448px] flex items-center justify-center cursor-pointer"
                    onClick={toggleAllSelection}
                  >
                    {(isSomeSelected || isAllSelected) && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 11 11"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
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
                </div>
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

              {currentLockers.map((locker) => (
                <div
                  key={locker.id}
                  className="grid h-[58px] items-center border-b border-[#D6D6D6] hover:bg-gray-50 cursor-pointer transition"
                  style={{
                    gridTemplateColumns:
                      "40px minmax(120px, 1fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(150px, 1.2fr) minmax(110px, 0.9fr) minmax(100px, 0.8fr) minmax(100px, 0.8fr) minmax(80px, 0.7fr)",
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
                        toggleLockerSelection(locker.id);
                      }}
                    >
                      {selectedLockers.has(locker.id) && (
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 15 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
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
                  <div className="px-2">
                    <div className="text-xs text-black font-roboto">
                      {locker.name}
                    </div>
                    <div className="text-[10px] text-[#807E7E] font-roboto">
                      {locker.code}
                    </div>
                  </div>
                  <div className="px-2 text-sm text-black text-center">
                    {locker.wilaya}
                  </div>
                  <div className="px-2 text-sm text-black">
                    {locker.commune}
                  </div>
                  <div className="px-2 text-sm text-black text-center">
                    {locker.address}
                  </div>
                  <div className="px-2 text-sm text-black text-center">
                    {locker.compartments}
                  </div>
                  <div className="px-2 flex justify-center">
                    <div className="relative inline-flex items-center">
                      <span className="appearance-none bg-[#DFFFEA] text-[#0B8457] text-sm font-medium px-3 py-1 rounded-lg cursor-pointer">
                        {locker.status}
                      </span>
                    </div>
                  </div>
                  <div className="px-2 text-sm text-black text-center">
                    {locker.lastUpdate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full justify-between items-center px-5 py-3 border-t border-[#D6D6D6] bg-white">
            <div className="flex flex-1 items-center justify-center gap-4">
              <button
                onClick={() => gotoPage(Math.max(1, currentPage - 1))}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <svg
                  className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                  width="6"
                  height="10"
                  viewBox="0 0 6 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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

              {pages.map((p) => (
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
                onClick={() => gotoPage(Math.min(totalPages, currentPage + 1))}
                className="flex items-center gap-2 hover:opacity-70 transition-opacity"
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
                  xmlns="http://www.w3.org/2000/svg"
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
                  xmlns="http://www.w3.org/2000/svg"
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
        </div>
      </div>

      {selectedLocker && (
        <LockerDetailsModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedLocker(null);
          }}
          locker={selectedLocker}
        />
      )}
    </div>
  );
}
