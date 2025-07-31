import { Card } from "antd";
import { useTranslation } from "react-i18next";
import callIcon from "assets/icons/call.svg";
import packagingIcon from "assets/icons/packages.svg";
import weightIcon from "assets/icons/wieghts.svg";

type PriceAppliedInsightsProps = {
  callCenter?: number;
  packaging?: number;
  weight?: number;
};

export default function PriceAppliedInsights({
  callCenter = 0,
  packaging = 0,
  weight = 50,
}: PriceAppliedInsightsProps) {
  const { t } = useTranslation();

  const stats = [
    {
      key: "call_center",
      value: `${callCenter} DA`,
      label: t("price_applied_insights.call_center"),
      icon: callIcon,
      bgColor: "bg-blue-100",
    },
    {
      key: "packaging",
      value: `${packaging} DA`,
      label: t("price_applied_insights.packaging"),
      icon: packagingIcon,
      bgColor: "bg-cyan-100",
    },
    {
      key: "weight",
      value: `${weight} DA`,
      label: t("price_applied_insights.weight"),
      icon: weightIcon,
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="flex bg-white items-center justify-center rounded-2xl gap-6 w-fit">
      {stats.map((stat, index) => (
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
          {index < stats.length - 1 && (
            <div className="w-px h-12 bg-gray-300 mx-3" />
          )}
        </div>
      ))}
    </div>
  );
}
