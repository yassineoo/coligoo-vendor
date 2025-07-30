import { Card, Avatar } from "antd";
import { useTranslation } from "react-i18next";

type TopCardProps = {
  title: string;
  children: React.ReactNode;
};

function TopCard({ title, children }: TopCardProps) {
  return (
    <Card className="rounded-lg !border-0">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
        <div className="flex flex-col">{children}</div>
      </div>
    </Card>
  );
}

export default function OrdersTop() {
  const { t } = useTranslation();

  return (
    <div className="basis-[27%] flex flex-col gap-4">
      <TopCard title={t("orders_top.top_month")}>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-orange-500">
            {t("orders_top.november")}
          </span>
          <span className="text-base font-medium text-orange-500">
            {t("orders_top.year_2024")}
          </span>
        </div>
      </TopCard>

      <TopCard title={t("orders_top.top_year")}>
        <div className="flex flex-col">
          <span className="text-2xl font-semibold text-orange-500">
            {t("orders_top.year_2025")}
          </span>
          <span className="text-base font-medium text-orange-500">
            {t("orders_top.total_orders")}
          </span>
        </div>
      </TopCard>

      <TopCard title={t("orders_top.top_product")}>
        <div className="flex flex-col gap-2">
          <Avatar size={24} className="bg-gray-300" />
          <div className="flex flex-col">
            <span className="text-xs font-medium text-gray-900">
              {t("orders_top.product_name")}
            </span>
            <span className="text-xs text-gray-600">
              {t("orders_top.total_sale")}
            </span>
          </div>
        </div>
      </TopCard>
    </div>
  );
}
