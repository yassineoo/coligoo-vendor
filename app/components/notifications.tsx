import { Button, Dropdown, Tabs, type MenuProps } from "antd";
import notificationBill from "assets/icons/notification-bing.svg";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function Notifications() {
  return (
    <Dropdown
      className=" !hover:bg-none"
      popupRender={() => <NotificationsPopup />}
      trigger={["click"]}
    >
      <img
        src={notificationBill}
        alt="Notifications"
        className="cursor-pointer"
      />
    </Dropdown>
  );
}

function NotificationsPopup() {
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState("1");
  const tabItems = [
    {
      key: "1",
      label: t("notifications.all"),
    },
    {
      key: "2",
      label: t("notifications.unread"),
    },
  ];

  const handleTabChange = (activeKey: string) => {
    console.log("Active tab changed to:", activeKey);
    setCurrentTab(activeKey);
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-[30rem] flex flex-col gap-4">
      <p className=" text-xl text-center">{t("notifications.title")}</p>
      <div className=" font-medium flex justify-between">
        <Tabs
          onChange={handleTabChange}
          defaultActiveKey="1"
          items={tabItems}
          className=" !hover:bg-none !text-xl  !w-fit"
        />
        <Button
          type="text"
          className="!font-medium hover:!bg-transparent !p-0"
          size="large"
        >
          {t("notifications.mark_all_read")}
        </Button>
      </div>
    </div>
  );
}
