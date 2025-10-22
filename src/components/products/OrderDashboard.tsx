"use client";

import React from "react";
import {
  BarChart3,
  Package,
  Clock,
  Truck,
  RotateCcw,
  MoreVertical,
} from "lucide-react";
import { useInView } from "react-intersection-observer";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
  delay: number;
  inView: boolean;
}

function StatCard({
  title,
  value,
  icon: Icon,
  bgColor,
  iconColor,
  delay,
  inView,
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-lg p-4 shadow-sm border border-gray-100 transition-all duration-500 ease-out ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center space-x-3">
        <div
          className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  mainValue: string;
  subValue: string;
  valueColor: string;
}

function MetricCard({
  title,
  mainValue,
  subValue,
  valueColor,
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h3 className="text-gray-500 text-base font-semibold mb-3">{title}</h3>
      <div className="space-y-1">
        <p className={`text-xl font-bold ${valueColor}`}>{mainValue}</p>
        <p className={`text-sm ${valueColor}`}>{subValue}</p>
      </div>
    </div>
  );
}

function TopProductCard() {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
      <h3 className="text-gray-500 text-base font-semibold mb-3">
        Top Product
      </h3>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0"></div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-gray-900 mb-1">
            X-Watch Pro 5
          </p>
          <p className="text-xs text-gray-500">Total sale : 2000</p>
        </div>
      </div>
    </div>
  );
}

function WeeklyChart() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const data = [
    { day: "Mon", value: 120 },
    { day: "Tue", value: 180 },
    { day: "Wed", value: 160 },
    { day: "Thu", value: 220 },
    { day: "Fri", value: 100 },
    { day: "Sat", value: 200 },
  ];
  const maxValue = 300;

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">This week</h2>
        <button className="p-2 hover:bg-gray-50 rounded-lg">
          <MoreVertical className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex items-end space-x-6 h-64 mb-4">
        <div className="flex flex-col justify-between h-full py-2 text-right min-w-[40px]">
          <span className="text-sm text-gray-400">300</span>
          <span className="text-sm text-gray-400">200</span>
          <span className="text-sm text-gray-400">100</span>
          <span className="text-sm text-gray-400">0</span>
        </div>

        <div className="flex-1 flex items-end justify-between h-full relative">
          <div className="absolute inset-0 flex flex-col justify-between py-2 pointer-events-none">
            <div className="w-full h-px bg-gray-100"></div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="w-full h-px bg-gray-100"></div>
            <div className="w-full h-px bg-gray-200"></div>
          </div>

          {data.map((item, index) => (
            <div
              key={item.day}
              className="flex flex-col items-center flex-1 h-full justify-end z-10"
            >
              <div
                className="w-7 bg-orange-500 rounded-t-md transition-[height] duration-700 ease-out"
                style={{
                  height: inView ? `${(item.value / maxValue) * 100}%` : "0%",
                  transitionDelay: `${index * 75}ms`,
                }}
              ></div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between text-sm text-gray-400 ml-[56px]">
        {data.map((item) => (
          <span key={item.day} className="text-center flex-1">
            {item.day}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function OrderDashboard() {
  const { ref: statsRef, inView: statsInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const { ref: sidebarRef, inView: sidebarInView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const stats = [
    {
      title: "Total orders",
      value: "100",
      icon: BarChart3,
      bgColor: "bg-purple-100",
      iconColor: "text-purple-600",
    },
    {
      title: "On hold",
      value: "21",
      icon: Package,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Sent",
      value: "23",
      icon: Clock,
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Delivered",
      value: "23",
      icon: Truck,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Returned",
      value: "23",
      icon: RotateCcw,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div
        ref={statsRef}
        className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            {...stat}
            inView={statsInView}
            delay={index * 100}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <WeeklyChart />
        </div>

        <div ref={sidebarRef} className="space-y-4">
          <div
            className={`transition-all duration-500 ease-out ${
              sidebarInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <MetricCard
              title="Top month"
              mainValue="November"
              subValue="2024"
              valueColor="text-orange-500"
            />
          </div>
          <div
            className={`transition-all duration-500 ease-out ${
              sidebarInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <MetricCard
              title="Top year"
              mainValue="2025"
              subValue="89k Total order"
              valueColor="text-orange-500"
            />
          </div>
          <div
            className={`transition-all duration-500 ease-out ${
              sidebarInView
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <TopProductCard />
          </div>
        </div>
      </div>
    </div>
  );
}
