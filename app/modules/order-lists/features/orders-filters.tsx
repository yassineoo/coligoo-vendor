import { Button } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import {
  PlusOutlined,
  DownloadOutlined,
  FilterOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";

export default function OrdersFilters() {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex justify-between">
      <h1 className="text-2xl font-medium mb-4">{t("order_lists.header")}</h1>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 justify-end">
        <Button icon={<EditOutlined />} className="flex items-center gap-2">
          {t("order_lists.edit")}
        </Button>
        {/* Delete Button */}
        <Button icon={<DeleteOutlined />} className="flex items-center gap-2">
          {t("order_lists.delete")}
        </Button>

        {/* Filters Button */}
        <Button icon={<FilterOutlined />} className="flex items-center gap-2">
          {t("order_lists.filters")}
        </Button>

        {/* Export Button */}
        <Button icon={<DownloadOutlined />} className="flex items-center gap-2">
          {t("order_lists.export")}
        </Button>

        {/* Add Order Button */}
        <Link to="/dashboard/order-lists/add-update-orders">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600 flex items-center gap-2"
          >
            {t("order_lists.add_order")}
          </Button>
        </Link>

        {/* Edit Button */}
      </div>
    </div>
  );
}
