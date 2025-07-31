import { Button } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router";

export default function ProductsFilters() {
  return (
    <div className="mb-6 flex justify-between">
      <h1 className="text-2xl font-medium mb-4">table of Product </h1>

      {/* Action Buttons */}
      <div className="flex items-center gap-4 justify-end">
        {/* Delete Button */}
        <Button icon={<DeleteOutlined />} className="flex items-center gap-2">
          Delete
        </Button>

        {/* Add Order Button */}
        <Link to="/dashboard/products/add-update-product">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600 flex items-center gap-2"
          >
            Add Product
          </Button>
        </Link>

        {/* Edit Button */}
      </div>
    </div>
  );
}
