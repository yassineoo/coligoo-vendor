import { Tabs } from "antd";
import { useState } from "react";
import ReadyBalanceScreen from "./ready-balance/ready-balance-screen";
import NotReadyBalanceScreen from "./not-ready-balance/not-ready-balance-screen";
import MyPaymentScreen from "./my-payment/my-payment-screen";
import clsx from "clsx";

export default function PaymentScreen() {
  const [currentTab, setCurrentTab] = useState("ready-balance");

  return (
    <div className=" space-y-8">
      <div className="flex gap-2 text-xl font-semibold ">
        <button
          className={clsx("px-4  py-2 rounded-lg transition-colors", {
            " active_tab": currentTab === "ready-balance",
          })}
          onClick={() => setCurrentTab("ready-balance")}
        >
          Ready Balance
        </button>
        <button
          className={clsx("px-4 py-2 rounded-lg transition-colors", {
            " active_tab": currentTab === "not-ready-balance",
          })}
          onClick={() => setCurrentTab("not-ready-balance")}
        >
          Not Ready Balance
        </button>
        <button
          className={clsx("px-4 py-2 rounded-lg transition-colors", {
            " active_tab": currentTab === "my-payments",
          })}
          onClick={() => setCurrentTab("my-payments")}
        >
          My Payments
        </button>
      </div>
      {currentTab === "ready-balance" && <ReadyBalanceScreen />}
      {currentTab === "not-ready-balance" && <NotReadyBalanceScreen />}
      {currentTab === "my-payments" && <MyPaymentScreen />}
    </div>
  );
}
