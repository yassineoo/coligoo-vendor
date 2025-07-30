import { Tabs } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import OrdersScreen from "./orders/orders-screen";
import DeliveryScreen from "./delivery/delivery-screen";

export default function HomeScreen() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("orders");
  const items = [
    {
      key: "orders",
      label: t("tab_switcher.orders"),
    },
    {
      key: "delivery",
      label: t("tab_switcher.delivery"),
    },
  ];

  const handleTabChange = (activeKey: string) => {
    console.log("Active tab changed to:", activeKey);
    setCurrentTab(activeKey);
  };

  return (
    <div>
      <Tabs
        defaultActiveKey={"orders"}
        items={items}
        onChange={handleTabChange}
        size="large"
        className="!w-fit"
      />
      {currentTab === "orders" && <OrdersScreen />}
      {currentTab === "delivery" && <DeliveryScreen />}
    </div>
  );
}
