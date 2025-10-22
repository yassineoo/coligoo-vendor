"use client";

import TariffBreakdown from "../components/TariffBreakdown";
import { useRouter } from "next/navigation";

export default function PriceApplied() {
  const router = useRouter();
  // 

  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <main className="flex-1 p-6">
        <TariffBreakdown />
      </main>
    </div>
  );
}
