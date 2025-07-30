import { Button, Dropdown, Tabs, type MenuProps } from "antd";
import notificationBill from "assets/icons/notification-bing.svg";
import { useState } from "react";

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
  const [currentTab, setCurrentTab] = useState("1");
  const tabItems = [
    {
      key: "1",
      label: "All",
    },
    {
      key: "2",
      label: "Unread",
    },
  ];

  const handleTabChange = (activeKey: string) => {
    console.log("Active tab changed to:", activeKey);
    setCurrentTab(activeKey);
  };
  return (
    <div className="p-4 bg-white rounded-lg shadow-lg w-96 flex flex-col gap-4">
      <p className=" text-xl text-center">Notifications</p>
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
          Mark all as read
        </Button>
      </div>
    </div>
  );
}
