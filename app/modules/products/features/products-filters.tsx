import { Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { IconPlus, IconTrash } from "@tabler/icons-react";

export default function ProductsFilters() {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex justify-between">
      <h1 className="text-2xl font-medium mb-4">{t("products.title")}</h1>

      <div className="flex items-center gap-4 justify-end">
        {/* Delete Button */}
        <Button
          icon={<IconTrash size={20} />}
          className="flex  items-center gap-2 !h-10"
        >
          {t("products.actions.delete")}
        </Button>

        {/* Add Order Button */}
        <Link to="/dashboard/products/add-update-product">
          <Button
            type="primary"
            icon={<IconPlus size={20} />}
            className="bg-orange-500 !h-10 border-none hover:bg-orange-600 hover:border-orange-600 flex items-center gap-2"
          >
            {t("products.add_product")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
