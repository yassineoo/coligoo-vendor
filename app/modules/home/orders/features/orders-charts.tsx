import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Select } from "antd";
import { useState } from "react";

type ChartPeriod = "weekly" | "monthly" | "yearly";

const weeklyData = [
  { name: "Mon", orders: 150 },
  { name: "Tue", orders: 230 },
  { name: "Wed", orders: 180 },
  { name: "Thu", orders: 280 },
  { name: "Fri", orders: 320 },
  { name: "Sat", orders: 200 },
];

const monthlyData = [
  { name: "Week 1", orders: 1200 },
  { name: "Week 2", orders: 1800 },
  { name: "Week 3", orders: 1500 },
  { name: "Week 4", orders: 2200 },
];

const yearlyData = [
  { name: "Q1", orders: 15000 },
  { name: "Q2", orders: 18000 },
  { name: "Q3", orders: 22000 },
  { name: "Q4", orders: 25000 },
];

export default function OrdersCharts() {
  const [period, setPeriod] = useState<ChartPeriod>("weekly");

  const getData = () => {
    switch (period) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
      default:
        return weeklyData;
    }
  };

  const getMaxValue = () => {
    const data = getData();
    const maxValue = Math.max(...data.map((item) => item.orders));
    return Math.ceil(maxValue / 100) * 100; // Round up to nearest 100
  };

  return (
    <div className=" basis-[70%]  bg-white rounded-2xl flex flex-col justify-between p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Orders Overview</h3>
        <Select
          value={period}
          onChange={setPeriod}
          className="w-32"
          options={[
            { value: "weekly", label: "Weekly" },
            { value: "monthly", label: "Monthly" },
            { value: "yearly", label: "Yearly" },
          ]}
        />
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getData()}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="none"
              stroke="rgba(0, 0, 0, 0.05)"
              strokeWidth={1.5}
              horizontal={true}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 14,
                fill: "rgba(0, 0, 0, 0.4)",
                fontFamily: "Roboto",
              }}
            />
            <YAxis
              domain={[0, getMaxValue()]}
              axisLine={false}
              tickLine={false}
              tick={{
                fontSize: 14,
                fill: "rgba(0, 0, 0, 0.4)",
                fontFamily: "Inter",
              }}
              tickCount={5}
            />
            <Tooltip />
            <Bar
              dataKey="orders"
              fill="#FF5901"
              radius={[4, 4, 0, 0]}
              barSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
