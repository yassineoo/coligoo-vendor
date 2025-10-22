"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface LockerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  locker: {
    id: string;
    name: string;
    code: string;
    wilaya: string;
    commune: string;
    address: string;
    compartments: number;
    occupied: number;
    available: number;
    status: string;
    lastUpdate: string;
  };
}

interface Compartment {
  id: number;
  status: "available" | "occupied" | "faulty";
}

const mockCompartments: Compartment[] = [
  { id: 1, status: "available" },
  { id: 2, status: "available" },
  { id: 3, status: "available" },
  { id: 4, status: "occupied" },
  { id: 5, status: "occupied" },
  { id: 6, status: "occupied" },
  { id: 7, status: "occupied" },
  { id: 8, status: "occupied" },
  { id: 9, status: "faulty" },
];

export default function LockerDetailsModal({
  isOpen,
  onClose,
  locker,
}: LockerDetailsModalProps) {
  const router = useRouter();
  const [shouldRender, setShouldRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const getCompartmentColor = (status: string) => {
    switch (status) {
      case "available":
        return "#4BDE7F";
      case "occupied":
        return "#FA923C";
      case "faulty":
        return "#F87170";
      default:
        return "#4BDE7F";
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-start justify-start transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-[rgba(45,60,82,0.34)] backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      <div
        className={`relative w-[577px] h-screen bg-white shadow-2xl overflow-y-auto transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white z-10 px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black capitalize tracking-wide">
              Locker information
            </h2>
            <button className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-[#FF5A01] border border-[#FF5A01] rounded-lg hover:bg-orange-600 transition">
              <svg
                width="17"
                height="17"
                viewBox="0 0 17 17"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <path
                  d="M3.83642 13.5172C3.41399 13.5172 3.01927 13.3718 2.73534 13.1017C2.37524 12.7624 2.20212 12.25 2.26444 11.696L2.52067 9.45227C2.56914 9.02985 2.82537 8.46892 3.12314 8.16422L8.80857 2.1464C10.2282 0.643672 11.7101 0.602122 13.2129 2.02175C14.7156 3.44137 14.7571 4.92332 13.3375 6.42605L7.65209 12.4439C7.36124 12.7555 6.82109 13.0463 6.39867 13.1156L4.16882 13.4965C4.05109 13.5034 3.94722 13.5172 3.83642 13.5172ZM11.0315 2.01482C10.4983 2.01482 10.0343 2.34722 9.56339 2.84582L3.87797 8.87057C3.73947 9.016 3.58019 9.36225 3.55249 9.56307L3.29627 11.8068C3.26857 12.0353 3.32397 12.2223 3.44862 12.34C3.57327 12.4577 3.76024 12.4993 3.98877 12.4646L6.21862 12.0838C6.41944 12.0491 6.75184 11.8691 6.89034 11.7237L12.5758 5.70585C13.4345 4.79175 13.7461 3.9469 12.4927 2.76965C11.9387 2.23642 11.4608 2.01482 11.0315 2.01482Z"
                  fill="white"
                />
                <path
                  d="M12.0079 7.5833C11.9941 7.5833 11.9733 7.5833 11.9594 7.5833C9.79884 7.36862 8.06066 5.7274 7.72826 3.58065C7.68671 3.29672 7.88061 3.03357 8.16453 2.9851C8.44846 2.94355 8.71161 3.13745 8.76008 3.42137C9.02323 5.09722 10.3805 6.38527 12.0702 6.55147C12.3542 6.57917 12.5619 6.8354 12.5342 7.11932C12.4996 7.38247 12.2711 7.5833 12.0079 7.5833Z"
                  fill="white"
                />
                <path
                  d="M14.5425 15.7546H2.07748C1.79356 15.7546 1.55811 15.5191 1.55811 15.2352C1.55811 14.9513 1.79356 14.7158 2.07748 14.7158H14.5425C14.8264 14.7158 15.0619 14.9513 15.0619 15.2352C15.0619 15.5191 14.8264 15.7546 14.5425 15.7546Z"
                  fill="white"
                />
              </svg>
              Edit
            </button>
          </div>
        </div>

        <div
          className={`px-6 py-8 space-y-8 transition-all duration-500 ${
            isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2 capitalize">
                Locker Name
              </div>
              <div className="text-xs text-black">{locker.name}</div>
              <div className="text-[10px] text-[#807E7E]">{locker.code}</div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2">
                  Wilaya
                </div>
                <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
                  {locker.wilaya}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2">
                  Commune
                </div>
                <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
                  {locker.commune}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2">
                  Address
                </div>
                <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
                  {locker.address}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2">
                  Compartments
                </div>
                <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
                  {locker.compartments}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2">
                  Occupied
                </div>
                <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
                  22
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2">
                  Available
                </div>
                <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
                  6
                </div>
              </div>
            </div>
          </div>

          <div className="w-full h-px bg-[rgba(124,139,160,0.1)]" />

          <div className="space-y-5">
            <div>
              <div className="text-lg text-[#7C8BA0] tracking-tight mb-5">
                Compartments
              </div>
              <div className="flex flex-wrap gap-3">
                {mockCompartments.map((compartment, index) => (
                  <div
                    key={compartment.id}
                    className="w-[50px] h-[50px] rounded flex items-center justify-center text-white text-lg font-medium transition-all duration-200 hover:scale-110 hover:shadow-lg cursor-pointer"
                    style={{
                      backgroundColor: getCompartmentColor(compartment.status),
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    {String(compartment.id).padStart(2, "0")}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-lg text-[#7C8BA0] tracking-tight mb-3">
                Explanations
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#4BDE7F]" />
                  <span className="text-sm font-medium text-black tracking-tight">
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#FA923C]" />
                  <span className="text-sm font-medium text-black tracking-tight">
                    Occupied
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded bg-[#F87170]" />
                  <span className="text-sm font-medium text-black tracking-tight">
                    Faulty
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-[#7C8BA0] tracking-tight mb-2 capitalize">
              Last Update
            </div>
            <div className="text-sm text-[#1A1C1E] font-medium tracking-tight">
              11-10-2025
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
