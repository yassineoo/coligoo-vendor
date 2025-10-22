"use client";

import { useState } from "react";
import {
  Bell,
  Package,
  CheckCircle,
  DollarSign,
  TrendingUp,
  X,
} from "lucide-react";

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NotificationItem {
  id: string;
  type: "package" | "delivery" | "payment" | "withdrawal";
  title: string;
  description: string;
  isRead: boolean;
}

export default function NotificationPanel({
  isOpen,
  onClose,
}: NotificationPanelProps) {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      type: "package",
      title: "Final Package Status Changes",
      description:
        "Your package #123456 has been marked as Returned to Sender.",
      isRead: false,
    },
    {
      id: "2",
      type: "delivery",
      title: "Delivery Completions or Returns",
      description:
        "Package #789101 was successfully delivered to the customer in Algiers.",
      isRead: false,
    },
    {
      id: "3",
      type: "payment",
      title: "Payment Confirmations",
      description:
        "Payment of 5,000 DZD has been confirmed for delivered packages on April 30.",
      isRead: true,
    },
    {
      id: "4",
      type: "withdrawal",
      title: "Withdrawal Status Updates",
      description:
        "Your withdrawal request of 20,000 DZD has been processed and transferred to your",
      isRead: true,
    },
  ]);

  const getNotificationIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "package":
        return <Package className="w-6 h-6 text-delivery-orange" />;
      case "delivery":
        return <CheckCircle className="w-6 h-6 text-delivery-orange" />;
      case "payment":
        return <DollarSign className="w-6 h-6 text-delivery-orange" />;
      case "withdrawal":
        return <TrendingUp className="w-6 h-6 text-delivery-orange" />;
      default:
        return <Bell className="w-6 h-6 text-delivery-orange" />;
    }
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.isRead)
      : notifications;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute top-12 right-0 z-50 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-lg border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="text-base font-roboto text-center font-normal text-black flex-1">
            Notification
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab("all")}
                className={`text-xs font-medium font-roboto ${
                  activeTab === "all" ? "text-delivery-orange" : "text-black"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveTab("unread")}
                className={`text-xs font-medium font-roboto ${
                  activeTab === "unread" ? "text-delivery-orange" : "text-black"
                }`}
              >
                Unread
              </button>
            </div>
            <button
              onClick={markAllAsRead}
              className="text-xs font-medium font-roboto text-black hover:text-delivery-orange transition-colors"
            >
              Mark all as read
            </button>
          </div>

          <div className="relative">
            <div className="h-px bg-gray-200 w-full"></div>
            <div
              className={`absolute top-0 h-0.5 bg-delivery-orange rounded-t transition-all duration-200 ${
                activeTab === "all" ? "w-8 left-0" : "w-12 left-11"
              }`}
            ></div>
          </div>
        </div>

        <div className="max-h-80 overflow-y-auto">
          {filteredNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={`flex items-start p-4 hover:bg-gray-50 transition-colors ${
                index === 0 ? "bg-delivery-bg" : ""
              }`}
            >
              <div className="flex-shrink-0 w-11 h-11 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                {getNotificationIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold font-roboto text-black mb-2 break-words">
                  {notification.title}
                </h4>
                <p className="text-xs font-roboto text-black leading-relaxed break-words">
                  "{notification.description}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
