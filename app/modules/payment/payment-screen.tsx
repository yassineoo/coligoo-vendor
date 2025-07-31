import { Tabs } from "antd";
import { useState } from "react";
import ReadyBalanceScreen from "./ready-balance/ready-balance-screen";
import NotReadyBalanceScreen from "./not-ready-balance/not-ready-balance-screen";
import MyPaymentScreen from "./my-payment/my-payment-screen";

export default function PaymentScreen() {
  const [currentTab, setCurrentTab] = useState("ready-balance");
  const items = [
    {
      key: "ready-balance",
      label: "Ready Balance",
    },
    {
      key: "not-ready-balance",
      label: "Not Ready Balance",
    },
    {
      key: "my-payments",
      label: "My Payments",
    },
  ];

  const handleTabChange = (activeKey: string) => {
    console.log("Active tab changed to:", activeKey);
    setCurrentTab(activeKey);
  };
  return (
    <div>
      <Tabs
        defaultActiveKey={"ready-balance"}
        items={items}
        onChange={handleTabChange}
        size="large"
        className="!w-fit"
      />
      {currentTab === "ready-balance" && <ReadyBalanceScreen />}
      {currentTab === "not-ready-balance" && <NotReadyBalanceScreen />}
      {currentTab === "my-payments" && <MyPaymentScreen />}
    </div>
  );
}
