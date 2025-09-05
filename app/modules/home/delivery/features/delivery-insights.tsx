import { Card } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const deliveryRateData = [
  { name: "Delivered", value: 84 },
  { name: "Remaining", value: 16 },
];

const wilayasData = [
  { name: "Alger", orders: 30 },
  { name: "Setif", orders: 20 },
  { name: "Oran", orders: 10 },
  { name: "Annaba", orders: 5 },
  { name: "Skikda", orders: 5 },
  { name: "Blida", orders: 5 },
];

const COLORS = ["#FF5901", "#FDF4FF"];

export default function DeliveryInsights() {
  return (
    <div className="flex flex-col gap-6 basis-[27%]">
      {/* Delivery Rate */}
      <Card className="bg-white rounded-xl p-4">
        <div className="flex flex-col items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">
            Delivery Rate
          </h3>
          <div className="relative w-40 h-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deliveryRateData}
                  cx="50%"
                  cy="100%"
                  startAngle={180}
                  endAngle={0}
                  innerRadius={60}
                  outerRadius={70}
                  dataKey="value"
                  stroke="none"
                >
                  {deliveryRateData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-end justify-center pb-4">
              <span className="text-2xl font-medium text-gray-800">84%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Wilayas */}
      <Card className="bg-white rounded-xl p-4">
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-gray-800">Top Wilayas</h3>
          <div className="space-y-3">
            {wilayasData.map((wilaya, index) => (
              <div
                key={wilaya.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-xs font-semibold text-gray-800 capitalize w-12">
                    {wilaya.name}
                  </span>
                  <div className="flex-1  h-4 rounded-sm relative">
                    <div
                      className=" h-full bg-linear-to-r from-orange  to-yellow/50 rounded-sm"
                      style={{
                        width: `${(wilaya.orders / Math.max(...wilayasData.map((w) => w.orders))) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-xs font-medium text-gray-600 ml-2">
                  {wilaya.orders} order{wilaya.orders !== 1 ? "s" : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
