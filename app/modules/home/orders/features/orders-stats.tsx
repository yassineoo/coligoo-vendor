import { Card, Statistic } from "antd";
import {
  BarChartOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type OrdersStatsProps = {
  totalOrders?: number;
  onHoldOrders?: number;
  sentOrders?: number;
  deliveredOrders?: number;
  returnedOrders?: number;
};

export default function OrdersStats({
  totalOrders = 23,
  onHoldOrders = 23,
  sentOrders = 23,
  deliveredOrders = 23,
  returnedOrders = 23,
}: OrdersStatsProps) {
  const { t } = useTranslation();

  const totalStat = {
    key: "total",
    value: totalOrders,
    label: t("orders_stats.total_orders"),
    icon: <BarChartOutlined className="text-lg text-gray-700" />,
    bgColor: "bg-purple-50",
  };

  const statusStats = [
    {
      key: "onHold",
      value: onHoldOrders,
      label: t("orders_stats.on_hold"),
      icon: <PlusOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-blue-100",
    },
    {
      key: "sent",
      value: sentOrders,
      label: t("orders_stats.sent"),
      icon: <ClockCircleOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-cyan-100",
    },
    {
      key: "delivered",
      value: deliveredOrders,
      label: t("orders_stats.delivered"),
      icon: <CheckCircleOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-green-100",
    },
    {
      key: "returned",
      value: returnedOrders,
      label: t("orders_stats.returned"),
      icon: <MinusCircleOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="flex  justify-between">
      {/* Total Orders Card */}
      <Card className="bg-white !border-0 !py-3 !basis-[19%]">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-10 h-10 ${totalStat.bgColor} rounded-full`}
          >
            {totalStat.icon}
          </div>
          <div className="flex flex-col">
            <Statistic
              value={totalStat.value}
              valueStyle={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#232323",
              }}
            />
            <p className="text-sm font-medium text-black m-0">
              {totalStat.label}
            </p>
          </div>
        </div>
      </Card>

      {/* Status Stats Cards */}
      <div className="flex bg-white basis-[80%] items-center justify-center rounded-2xl gap-6">
        {statusStats.map((stat, index) => (
          <div key={stat.key} className="flex items-center">
            <Card className=" !border-0">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-full`}
                >
                  {stat.icon}
                </div>
                <div className="flex flex-col">
                  <Statistic
                    value={stat.value}
                    valueStyle={{
                      fontSize: "18px",
                      fontWeight: 600,
                      color: "#232323",
                    }}
                  />
                  <p className="text-sm font-medium text-black m-0">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
            {index < statusStats.length - 1 && (
              <div className="w-px h-12 bg-gray-300 mx-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
