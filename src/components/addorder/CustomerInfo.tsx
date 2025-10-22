import React from "react";
import { ChevronDown } from "lucide-react";

type Wilaya = { code: string | number; name: string; ar_name?: string };
type City = { id: number; name: string; ar_name?: string };

interface FormData {
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  fullAddress: string;
  note: string;
}

interface CustomerInfoProps {
  formData: FormData;
  wilayas: Wilaya[];
  toCities: City[];
  toWilayaCode: string | null;
  toCityId: number | null;
  loadingWilayas: boolean;
  loadingToCities: boolean;
  onInputChange: (field: keyof FormData, value: string) => void;
  onWilayaChange: (code: string | null) => void;
  onCityChange: (id: number | null) => void;
}

export default function CustomerInfo({
  formData,
  wilayas,
  toCities,
  toWilayaCode,
  toCityId,
  loadingWilayas,
  loadingToCities,
  onInputChange,
  onWilayaChange,
  onCityChange,
}: CustomerInfoProps) {
  return (
    <div className="flex flex-col">
      <h2 className="text-2xl font-medium text-black tracking-[0.505px]">
        Customer information
      </h2>

      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              First name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Last name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Phone number 01
            </label>
            <input
              type="text"
              value={formData.phone1}
              onChange={(e) => onInputChange("phone1", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Phone number 02
            </label>
            <input
              type="text"
              value={formData.phone2}
              onChange={(e) => onInputChange("phone2", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-7">
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Wilaya
            </label>
            <div className="relative">
              <select
                value={toWilayaCode ?? ""}
                onChange={(e) => {
                  const v = e.target.value || null;
                  onWilayaChange(v);
                }}
                disabled={loadingWilayas}
                className="h-[46px] w-full px-3.5 pr-10 rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5A01] focus:border-transparent"
              >
                <option value="">Select Wilaya</option>
                {wilayas.map((w) => (
                  <option key={String(w.code)} value={String(w.code)}>
                    {w.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-[#7C8BA0]" />
            </div>
          </div>
          <div className="flex flex-col gap-0.5">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Commune
            </label>
            <div className="relative">
              <select
                value={toCityId !== null ? String(toCityId) : ""}
                onChange={(e) =>
                  onCityChange(e.target.value ? Number(e.target.value) : null)
                }
                disabled={!toWilayaCode || loadingToCities}
                className="h-[46px] w-full px-3.5 pr-10 rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px] appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF5A01] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Select Commune</option>
                {toCities.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none w-5 h-5 text-[#7C8BA0]" />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
            Full Address
          </label>
          <input
            type="text"
            value={formData.fullAddress}
            onChange={(e) => onInputChange("fullAddress", e.target.value)}
            className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
          />
        </div>
      </div>
    </div>
  );
}
