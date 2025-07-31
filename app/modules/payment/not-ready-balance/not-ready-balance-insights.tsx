import { Card } from "antd";
import { useTranslation } from "react-i18next";

type NotReadyBalanceInsightsProps = {
  totalIncome?: number;
  notReadyAmount?: number;
  totalCosts?: number;
  deliveredCount?: number;
  canceledCount?: number;
};

export default function NotReadyBalanceInsights({
  totalIncome = 6000,
  notReadyAmount = 5400,
  totalCosts = 600,
  deliveredCount = 5,
  canceledCount = 2,
}: NotReadyBalanceInsightsProps) {
  const { t } = useTranslation();

  const totalStat = {
    key: "total",
    value: `${totalIncome} DA`,
    label: t("not_ready_balance_insights.total_income", "Total income"),
    icon: "/icons/dollar-circle.svg",
    bgColor: "bg-orange-100",
  };

  const balanceStats = [
    {
      key: "notReady",
      value: `${notReadyAmount} DA`,
      label: t("not_ready_balance_insights.not_ready_amount", "Not ready"),
      icon: "/icons/money-receive.svg",
      bgColor: "bg-blue-100",
    },
    {
      key: "costs",
      value: `${totalCosts} DA`,
      label: t("not_ready_balance_insights.total_costs", "Total costs"),
      icon: "/icons/money-send.svg",
      bgColor: "bg-cyan-100",
    },
    {
      key: "delivered",
      value: deliveredCount,
      label: t("not_ready_balance_insights.delivered", "Delivered"),
      icon: "/icons/box-tick.svg",
      bgColor: "bg-green-100",
    },
    {
      key: "canceled",
      value: canceledCount,
      label: t("not_ready_balance_insights.canceled", "Canceled"),
      icon: "/icons/box-remove.svg",
      bgColor: "bg-red-100",
    },
  ];

  return (
    <div className="flex justify-between">
      {/* Total Income Card */}
      <Card className="bg-white !border-0 !py-3 !basis-[19%]">
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center justify-center w-10 h-10 ${totalStat.bgColor} rounded-full`}
          >
            <img src={totalStat.icon} alt="" className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <div className="text-lg font-semibold text-gray-900">
              {totalStat.value}
            </div>
            <p className="text-sm font-medium text-black m-0">
              {totalStat.label}
            </p>
          </div>
        </div>
      </Card>

      {/* Balance Stats Cards */}
      <div className="flex bg-white basis-[80%] items-center justify-center rounded-2xl gap-6">
        {balanceStats.map((stat, index) => (
          <div key={stat.key} className="flex items-center">
            <Card className="!border-0">
              <div className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 ${stat.bgColor} rounded-full`}
                >
                  <img src={stat.icon} alt="" className="w-6 h-6" />
                </div>
                <div className="flex flex-col">
                  <div className="text-lg font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <p className="text-sm font-medium text-black m-0">
                    {stat.label}
                  </p>
                </div>
              </div>
            </Card>
            {index < balanceStats.length - 1 && (
              <div className="w-px h-12 bg-gray-300 mx-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
