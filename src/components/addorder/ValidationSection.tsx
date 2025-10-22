import React from "react";

interface FormData {
  returnFees: string;
  deliveryCosts: string;
  discount: string;
  weight: string;
  height: string;
  width: string;
  length: string;
}

interface ValidationSectionProps {
  orderType: "domicile" | "stopdesk";
  paymentType: "normal" | "exchange";
  formData: FormData;
  subtotalNumber: number;
  onOrderTypeChange: (type: "domicile" | "stopdesk") => void;
  onPaymentTypeChange: (type: "normal" | "exchange") => void;
  onInputChange: (field: keyof FormData, value: string) => void;
}

export default function ValidationSection({
  orderType,
  paymentType,
  formData,
  subtotalNumber,
  onOrderTypeChange,
  onPaymentTypeChange,
  onInputChange,
}: ValidationSectionProps) {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-[24px] mt-8 font-medium text-black tracking-[0.505px]">
        Validation
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
            Order type
          </label>
          <div className="flex gap-[29px]">
            <div className="flex p-[3px] rounded-lg bg-white">
              <button
                onClick={() => onOrderTypeChange("domicile")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium leading-[140%] tracking-[-0.14px] transition-colors ${
                  orderType === "domicile"
                    ? "bg-[#FF5A01] text-white"
                    : "text-[#7D7D7D]"
                }`}
              >
                Domicile
              </button>
              <button
                onClick={() => onOrderTypeChange("stopdesk")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium leading-[140%] tracking-[-0.14px] transition-colors ${
                  orderType === "stopdesk"
                    ? "bg-[#FF5A01] text-white"
                    : "text-[#7D7D7D]"
                }`}
              >
                Stopdesk
              </button>
            </div>

            <div className="flex p-[3px] rounded-lg bg-white">
              <button
                onClick={() => onPaymentTypeChange("normal")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium leading-[140%] tracking-[-0.14px] transition-colors ${
                  paymentType === "normal"
                    ? "bg-[#FF5A01] text-white"
                    : "text-[#7D7D7D]"
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => onPaymentTypeChange("exchange")}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium leading-[140%] tracking-[-0.14px] transition-colors ${
                  paymentType === "exchange"
                    ? "bg-[#FF5A01] text-white"
                    : "text-[#7D7D7D]"
                }`}
              >
                Exchange
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Return Fees
            </label>
            <input
              type="text"
              value={formData.returnFees}
              onChange={(e) => onInputChange("returnFees", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm text-[#6C7278] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Delivery Costs
            </label>
            <input
              type="text"
              value={formData.deliveryCosts}
              onChange={(e) => onInputChange("deliveryCosts", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm text-[#6C7278] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Discount
            </label>
            <input
              type="text"
              value={formData.discount}
              onChange={(e) => onInputChange("discount", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          {/* <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Weight (kg)
            </label>
            <input
              type="text"
              value={formData.weight}
              onChange={(e) => onInputChange("weight", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Height (cm)
            </label>
            <input
              type="text"
              value={formData.height}
              onChange={(e) => onInputChange("height", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Width (cm)
            </label>
            <input
              type="text"
              value={formData.width}
              onChange={(e) => onInputChange("width", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div>
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Length (cm)
            </label>
            <input
              type="text"
              value={formData.length}
              onChange={(e) => onInputChange("length", e.target.value)}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
            />
          </div> */}
          <div className="flex flex-col gap-0.5 w-[92px]">
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Total to collect
            </label>
            <input
              type="text"
              value={subtotalNumber.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
