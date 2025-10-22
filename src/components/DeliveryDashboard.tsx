"use client";

import { useState, useEffect } from "react";
import {
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useInView } from "react-intersection-observer";
import "swiper/css";

interface DeliveryData {
  number: number;
  wilayaName: string;
  total: number;
  delivered: number;
  canceled: number;
  returned: number;
  change: number;
  deliveryRate: string;
}

const mockDeliveryData: DeliveryData[] = [
  {
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
];

const weeklyData = [
  { day: "Mon", value: 220 },
  { day: "Tue", value: 280 },
  { day: "Wed", value: 260 },
  { day: "Thu", value: 240 },
  { day: "Fri", value: 180 },
  { day: "Sat", value: 300 },
];

const topWilyat = [
  { name: "Alger", orders: 30 },
  { name: "Stif", orders: 20 },
  { name: "Oran", orders: 10 },
  { name: "Annaba", orders: 5 },
  { name: "Skikda", orders: 5 },
  { name: "Blida", orders: 5 },
];

const getStatusCardData = () => [
  {
    icon: Truck,
    label: "Ongoing Deliveries",
    value: "18",
    bgColor: "bg-orange-100",
    iconColor: "text-orange-600",
  },
  {
    icon: Clock,
    label: "In Preparation",
    value: "5400 da",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Package,
    label: "Dispatched",
    value: "600 da",
    bgColor: "bg-cyan-100",
    iconColor: "text-cyan-600",
  },
  {
    icon: CheckCircle,
    label: "Delivered",
    value: "05",
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    icon: XCircle,
    label: "Canceled",
    value: "02",
    bgColor: "bg-red-100",
    iconColor: "text-red-600",
  },
];

const StatusCard = ({ card }: any) => (
  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 h-full">
    <div className="flex items-center gap-4">
      <div
        className={`w-10 h-10 rounded-full ${card.bgColor} flex items-center justify-center flex-shrink-0`}
      >
        <card.icon className={`w-5 h-5 ${card.iconColor}`} />
      </div>
      <div>
        <div className="text-sm text-gray-700 font-roboto mb-1">
          {card.label}
        </div>
        <div className="text-xl font-bold text-gray-900">{card.value}</div>
      </div>
    </div>
  </div>
);

export default function DeliveryDashboard() {
  const [currentPage, setCurrentPage] = useState(3);
  const totalPages = 5;
  const maxValue = Math.max(...weeklyData.map((d) => d.value));
  const deliveryPercentage = 84;
  const circumference = 40 * 2 * Math.PI;

  const { ref: weekChartRef, inView: weekChartInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const { ref: rateChartRef, inView: rateChartInView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  const { ref: wilyatChartRef, inView: wilyatChartInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const rateOffset = circumference - (deliveryPercentage / 100) * circumference;

  return (
    <div className="space-y-6">
      <div className="md:hidden">
        <Swiper
          spaceBetween={16}
          slidesPerView={1.5}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            640: { slidesPerView: 3.2 },
          }}
        >
          {getStatusCardData().map((card, index) => (
            <SwiperSlide key={index}>
              <StatusCard card={card} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-6">
        {getStatusCardData().map((card, index) => (
          <StatusCard key={index} card={card} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6" ref={weekChartRef}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black font-roboto">
                This week
              </h2>
              <button className="p-2 hover:bg-gray-50 rounded-lg">
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 h-64 flex flex-col justify-between text-sm text-gray-400 pr-4">
                {[300, 200, 100, 0].map((v) => (
                  <span key={v}>{v}</span>
                ))}
              </div>
              <div className="ml-12 relative h-64 flex items-end justify-between">
                {weeklyData.map((item, index) => (
                  <div key={item.day} className="flex flex-col items-center">
                    <div
                      className="relative w-7 mb-4"
                      style={{ height: "200px" }}
                    >
                      <div
                        className="absolute bottom-0 w-full bg-delivery-orange rounded-t-md transform-origin-bottom transition-transform duration-1000 ease-out"
                        style={{
                          height: `${(item.value / maxValue) * 100}%`,
                          transform: weekChartInView
                            ? "scaleY(1)"
                            : "scaleY(0)",
                          transitionDelay: `${index * 100}ms`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-400 font-roboto">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
            ref={rateChartRef}
          >
            <h3 className="text-sm font-semibold text-black mb-6 text-center">
              Delivery rate
            </h3>
            <div className="flex justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg
                  className="w-32 h-32 transform -rotate-90"
                  viewBox="0 0 100 100"
                >
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#f3f4f6"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#FF5901"
                    strokeWidth="6"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={
                      rateChartInView ? rateOffset : circumference
                    }
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-black">
                    {deliveryPercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
            ref={wilyatChartRef}
          >
            <h3 className="text-xs font-semibold text-black mb-4">
              Top Wilyat
            </h3>
            <div className="space-y-2">
              {topWilyat.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div
                    className="px-2 py-1 rounded text-xs transform-origin-left transition-transform duration-700 ease-out"
                    style={{
                      background: `linear-gradient(90deg, #FF5A01 -2.57%, rgba(255, 205, 113, 0.00) 112.5%)`,
                      width: `${Math.max((item.orders / 30) * 100, 25)}%`,
                      transform: wilyatChartInView ? "scaleX(1)" : "scaleX(0)",
                      transitionDelay: `${index * 150}ms`,
                    }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-black text-xs">
                        {item.name}
                      </span>
                      <span className="text-black text-xs">
                        {item.orders} order
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-black font-roboto mb-4">
          Statistics by Province
        </h2>
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="hidden md:block bg-purple-50 border-b border-gray-200 px-6 py-3">
            <div className="grid grid-cols-8 gap-4 text-sm font-medium text-black font-roboto">
              {[
                "Number",
                "Wilaya Name",
                "Total",
                "Delivered",
                "Cancel",
                "Returned",
                "Change",
                "Delivery Rate",
              ].map((header) => (
                <div key={header} className="text-center">
                  {header}
                </div>
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {mockDeliveryData.map((row, index) => (
              <div
                key={index}
                className="px-6 py-4 grid grid-cols-2 md:grid-cols-8 gap-4 items-center text-sm"
              >
                <div className="md:hidden text-gray-500">Number</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.number}
                </div>
                <div className="md:hidden text-gray-500">Wilaya</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.wilayaName}
                </div>
                <div className="md:hidden text-gray-500">Total</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.total}
                </div>
                <div className="md:hidden text-gray-500">Delivered</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.delivered}
                </div>
                <div className="md:hidden text-gray-500">Canceled</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.canceled}
                </div>
                <div className="md:hidden text-gray-500">Returned</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.returned}
                </div>
                <div className="md:hidden text-gray-500">Change</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.change}
                </div>
                <div className="md:hidden text-gray-500">Rate</div>
                <div className="text-right md:text-center text-gray-900 font-roboto">
                  {row.deliveryRate}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] h-8 p-0 rounded-md text-sm transition-colors ${
                      currentPage === page
                        ? "bg-gray-900 text-white hover:bg-gray-800"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="p-1 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
