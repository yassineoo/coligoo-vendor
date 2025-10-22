"use client";

import { useState } from "react";
import {
  Receipt,
  Package,
  Weight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./interface/button";

interface TariffData {
  number: number;
  wilayaName: string;
  homeDelivery: number;
  stopdesk: number;
  returned: number;
}

const mockData: TariffData[] = [
  {
    number: 16,
    wilayaName: "Alger",
    homeDelivery: 600,
    stopdesk: 400,
    returned: 400,
  },
  {
    number: 16,
    wilayaName: "Alger",
    homeDelivery: 600,
    stopdesk: 400,
    returned: 400,
  },
  {
    number: 16,
    wilayaName: "Alger",
    homeDelivery: 600,
    stopdesk: 400,
    returned: 400,
  },
  {
    number: 16,
    wilayaName: "Alger",
    homeDelivery: 600,
    stopdesk: 400,
    returned: 400,
  },
  {
    number: 16,
    wilayaName: "Alger",
    homeDelivery: 600,
    stopdesk: 400,
    returned: 400,
  },
  {
    number: 16,
    wilayaName: "Alger",
    homeDelivery: 600,
    stopdesk: 400,
    returned: 400,
  },
];

export default function TariffBreakdown() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 5;

  const getSummaryCardData = () => [
    {
      icon: Receipt,
      label: "Call Center",
      value: "0 DA",
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Package,
      label: "Packaging",
      value: "0 DA",
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      icon: Weight,
      label: "Weight ( kg)",
      value: "50 DA",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  const getPriceColor = (type: "home" | "stopdesk" | "returned") => {
    switch (type) {
      case "home":
        return "bg-green-100 text-green-800";
      case "stopdesk":
        return "bg-blue-100 text-blue-800";
      case "returned":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-red-100 border border-red-200 rounded-lg p-4">
        <p className="text-red-700 text-center font-roboto">
          If you have any questions about tariff changes, feel free to reach out
          to your local office.
        </p>
      </div>

      <div>
        <h1 className="text-xl font-medium text-black font-roboto">
          Tariff Breakdown:
        </h1>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-8">
        <div className="flex flex-col md:flex-row gap-6 items-center justify-center">
          {getSummaryCardData().map((card, index) => (
            <div key={index} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center`}
              >
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-700 font-roboto mb-1">
                  {card.label}
                </div>
                <div className="text-base font-semibold text-gray-900 font-inter">
                  {card.value}
                </div>
              </div>
              {index < getSummaryCardData().length - 1 && (
                <div className="hidden md:block w-px h-10 bg-gray-300 ml-6" />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-purple-50 border-b border-gray-200 px-6 py-3">
          <div className="grid grid-cols-5 gap-4 text-sm font-medium text-black font-roboto">
            <div className="text-center">Number</div>
            <div className="text-center">Wilaya Name</div>
            <div className="text-center">Home Delivery</div>
            <div className="text-center">Stopdesk</div>
            <div className="text-center">Returned</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {mockData.map((row, index) => (
            <div key={index} className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="text-center text-sm text-gray-900 font-roboto">
                  {row.number}
                </div>
                <div className="text-center text-sm text-gray-900 font-roboto">
                  {row.wilayaName}
                </div>
                <div className="text-center">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(
                      "home"
                    )}`}
                  >
                    {row.homeDelivery} da
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(
                      "stopdesk"
                    )}`}
                  >
                    {row.stopdesk} da
                  </span>
                </div>
                <div className="text-center">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getPriceColor(
                      "returned"
                    )}`}
                  >
                    {row.returned} da
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[32px] h-8 p-0 ${
                    currentPage === page
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {page}
                </Button>
              ))}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
