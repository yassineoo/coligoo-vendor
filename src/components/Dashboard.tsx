"use client";

import { useState, useRef, useEffect } from "react";
import DeliveryDashboard from "../components/DeliveryDashboard";
import OrderDashboard from "./products/OrderDashboard";

const tabs = [{ name: "Orders" }, { name: "Delivery" }];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const activeTabRef = useRef<HTMLButtonElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({
    left: 0,
    width: 0,
  });

  useEffect(() => {
    if (activeTabRef.current) {
      setIndicatorStyle({
        left: activeTabRef.current.offsetLeft,
        width: activeTabRef.current.offsetWidth,
      });
    }
  }, [activeTab]);

  return (
    <div className="m-6">
      <div className="mb-6">
        <div className="relative flex space-x-8 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              ref={activeTab === tab.name ? activeTabRef : null}
              onClick={() => setActiveTab(tab.name)}
              className={`pb-3 text-xl font-medium transition-colors ${
                activeTab === tab.name
                  ? "text-delivery-orange"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
          <span
            className="absolute bottom-[-1.5px] h-[3px] bg-delivery-orange rounded-full transition-all duration-300 ease-in-out"
            style={indicatorStyle}
          />
        </div>
      </div>

      {activeTab === "Orders" && <OrderDashboard />}
      {activeTab === "Delivery" && <DeliveryDashboard />}
    </div>
  );
}
