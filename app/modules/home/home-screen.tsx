import { Tabs } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OrdersScreen from "./orders/orders-screen";
import DeliveryScreen from "./delivery/delivery-screen";
import clsx from "clsx";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("orders");

  return (
    <div>
      <div className="flex gap-2 text-xl font-semibold ">
        <button
          className={clsx("px-4  py-2 rounded-lg transition-colors", {
            " active_tab": currentTab === "orders",
          })}
          onClick={() => setCurrentTab("orders")}
        >
          {t("tab_switcher.orders")}
        </button>
        <button
          className={clsx("px-4 py-2 rounded-lg transition-colors", {
            " active_tab": currentTab === "delivery",
          })}
          onClick={() => setCurrentTab("delivery")}
        >
          {t("tab_switcher.delivery")}
        </button>
      </div>

      {currentTab === "orders" && <OrdersScreen />}
      {currentTab === "delivery" && <DeliveryScreen />}
    </div>
  );
}
