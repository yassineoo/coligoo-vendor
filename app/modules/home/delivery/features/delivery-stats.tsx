import { Card, Statistic } from "antd";
import {
  TruckOutlined,
  ClockCircleOutlined,
  SendOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";

type DeliveryStatsProps = {
  ongoingDeliveries?: number;
  inPreparation?: number;
  dispatched?: number;
  delivered?: number;
  canceled?: number;
};

export default function DeliveryStats({
  ongoingDeliveries = 18,
  inPreparation = 5400,
  dispatched = 600,
  delivered = 5,
  canceled = 2,
}: DeliveryStatsProps) {
  const { t } = useTranslation();

  const totalStat = {
    key: "ongoing",
    value: ongoingDeliveries,
    label: t("delivery_stats.ongoing_deliveries"),
    icon: <TruckOutlined className="text-lg text-gray-700" />,
    bgColor: "bg-orange-100",
  };

  const statusStats = [
    {
      key: "preparation",
      value: `${inPreparation} da`,
      label: t("delivery_stats.in_preparation"),
      icon: <ClockCircleOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-blue-100",
    },
    {
      key: "dispatched",
      value: `${dispatched} da`,
      label: t("delivery_stats.dispatched"),
      icon: <SendOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-cyan-100",
    },
    {
      key: "delivered",
      value: delivered.toString().padStart(2, "0"),
      label: t("delivery_stats.delivered"),
      icon: <CheckCircleOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-green-100",
    },
    {
      key: "canceled",
      value: canceled.toString().padStart(2, "0"),
      label: t("delivery_stats.canceled"),
      icon: <CloseCircleOutlined className="text-lg text-gray-700" />,
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="flex justify-between">
      {/* Ongoing Deliveries Card */}
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
