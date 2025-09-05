import { Button } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import logoText from "assets/logo-text.svg";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router";
import Home from "assets/icons/home.svg?react";
import Orders from "assets/icons/orders.svg?react";
import Products from "assets/icons/product.svg?react";
import Returned from "assets/icons/returned.svg?react";
import PriceApplied from "assets/icons/price-applied.svg?react";
import Development from "assets/icons/dev.svg?react";
import Settings from "assets/icons/setting.svg?react";
import Payment from "assets/icons/payment.svg?react";
import logout from "assets/icons/logout.svg?react";

import clsx from "clsx";

export default function SideBar() {
  const { t } = useTranslation();

  const { pathname } = useLocation();

  const isActiveRoute = (href: string) => {
    return pathname.includes(href);
  };

  const navItems = [
    {
      key: "home",
      href: "dashboard/home",
      icon: Home,
    },
    {
      key: "order-lists",
      href: "dashboard/order-lists",
      icon: Orders,
    },
    {
      key: "products",
      href: "dashboard/products",
      icon: Products,
    },
    {
      key: "returned",
      href: "dashboard/returned",
      icon: Returned,
    },
    {
      key: "payment",
      href: "dashboard/payment",
      icon: Payment,
    },
    {
      key: "price-applied",
      href: "dashboard/price-applied",
      icon: PriceApplied,
    },
    {
      key: "development",
      href: "dashboard/development",
      icon: Development,
    },
    {
      key: "settings",
      href: "dashboard/settings",
      icon: Settings,
    },
  ];

  return (
    <div className=" flex flex-col justify-between h-full py-12">
      <div className="flex flex-col gap-12">
        <div className=" px-6">
          <img src={logoText} alt="Logo" />
        </div>
        <div className=" flex-1 px-4 ">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.key}
                  to={item.href}
                  className={clsx(
                    "flex gap-2 group px-2 py-3 hover:bg-orange transition-colors relative hover:text-white rounded-[6px] font-semibold",
                    {
                      isActive: isActive, // Highlight active item
                      "text-gray-600": !isActive, // Default text color
                    }
                  )}
                >
                  <div>
                    <item.icon
                      className={clsx("w-6 h-6  group-hover:text-white", {
                        "group:text-white": isActive,
                        "text-black": !isActive,
                      })}
                    />
                  </div>
                  <span className="capitalize">{t(item.key)}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {/* logout button */}
      <Button
        icon={<LogoutOutlined />}
        className=" !pl-7 !text-orange !justify-start"
        type="link"
        size="large"
      >
        {t("side_bar.logout")}
      </Button>
    </div>
  );
}
