import { Button, Menu } from "antd";
import {
  HomeOutlined,
  ProductOutlined,
  ShoppingOutlined,
  UndoOutlined,
  WalletOutlined,
  TagOutlined,
  CodeOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import logoText from "assets/logo-text.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

type MenuItem = {
  key: string;
  icon: React.ReactNode;
  label: React.ReactNode;
};

export default function SideBar() {
  const { t } = useTranslation();
  const menuItems: MenuItem[] = [
    {
      key: "dashboard/home",
      icon: <HomeOutlined />,
      label: <Link to="/dashboard/home">{t("side_bar.home")}</Link>,
    },
    {
      key: "dashboard/order-lists",
      icon: <ProductOutlined />,
      label: (
        <Link to="/dashboard/order-lists">{t("side_bar.order_lists")}</Link>
      ),
    },
    {
      key: "dashboard/product",
      icon: <ShoppingOutlined />,
      label: <Link to="/dashboard/product">{t("side_bar.product")}</Link>,
    },
    {
      key: "dashboard/returned",
      icon: <UndoOutlined />,
      label: <Link to="/dashboard/returned">{t("side_bar.returned")}</Link>,
    },
    {
      key: "dashboard/payment",
      icon: <WalletOutlined />,
      label: <Link to="/dashboard/payment">{t("side_bar.payment")}</Link>,
    },
    {
      key: "dashboard/price-applied",
      icon: <TagOutlined />,
      label: (
        <Link to="/dashboard/price-applied">{t("side_bar.price_applied")}</Link>
      ),
    },
    {
      key: "dashboard/development",
      icon: <CodeOutlined />,
      label: (
        <Link to="/dashboard/development">{t("side_bar.development")}</Link>
      ),
    },
    {
      key: "dashboard/settings",
      icon: <SettingOutlined />,
      label: <Link to="/dashboard/settings">{t("side_bar.settings")}</Link>,
    },
  ];

  return (
    <div className=" flex flex-col justify-between h-full py-12">
      <div className="flex flex-col gap-12">
        <div className=" px-6">
          <img src={logoText} alt="Logo" />
        </div>
        <div className="flex-1">
          <Menu
            mode="inline"
            defaultSelectedKeys={["dashboard/home"]}
            items={menuItems}
            className="!border-0 !shadow-none"
          />
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
