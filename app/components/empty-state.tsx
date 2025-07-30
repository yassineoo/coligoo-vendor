import { Empty as AntEmpty, Button } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { PlusOutlined } from "@ant-design/icons";

type EmptyStateProps = {
  title?: string;
  description?: string;
  showAddButton?: boolean;
  addButtonText?: string;
  addButtonLink?: string;
};

export default function EmptyState({
  title,
  description,
  showAddButton = false,
  addButtonText,
  addButtonLink = "#",
}: EmptyStateProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <AntEmpty
        image={AntEmpty.PRESENTED_IMAGE_SIMPLE}
        description={
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {title || t("order_lists.empty_state.title")}
            </h3>
            <p className="text-gray-500 mb-4">
              {description || t("order_lists.empty_state.description")}
            </p>
            {showAddButton && (
              <Link to={addButtonLink}>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
                >
                  {addButtonText || t("order_lists.add_order")}
                </Button>
              </Link>
            )}
          </div>
        }
      />
    </div>
  );
}
