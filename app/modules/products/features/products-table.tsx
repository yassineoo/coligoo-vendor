import { Table, Button } from "antd";
import type { Key } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../../../components/empty-state";

type ProductData = {
  key: string;
  productName: string;
  productAlias: string;
  options: number;
  costRange: string;
  category: string;
  inStock: number;
};

type ProductsTableProps = {
  products?: ProductData[];
};

// Mock data - replace with actual data
const mockProductData: ProductData[] = [
  {
    key: "1",
    productName: "GTS2139",
    productAlias: "watch",
    options: 3,
    costRange: "DA 2,000 – 2,000",
    category: "Electronic",
    inStock: 9,
  },
  {
    key: "2",
    productName: "PRO5674",
    productAlias: "phone",
    options: 5,
    costRange: "DA 15,000 – 25,000",
    category: "Electronic",
    inStock: 15,
  },
  {
    key: "3",
    productName: "LAP9821",
    productAlias: "laptop",
    options: 8,
    costRange: "DA 80,000 – 120,000",
    category: "Electronic",
    inStock: 3,
  },
  {
    key: "4",
    productName: "HDP3456",
    productAlias: "headphones",
    options: 2,
    costRange: "DA 3,500 – 8,000",
    category: "Electronic",
    inStock: 22,
  },
];

export default function ProductsTable({
  products = mockProductData,
}: ProductsTableProps) {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const hasData = products.length > 0;

  const columns = [
    {
      title: t("products_table.table.product_name"),
      dataIndex: "productName",
      key: "productName",
      width: 120,
    },
    {
      title: t("products_table.table.product_alias"),
      dataIndex: "productAlias",
      key: "productAlias",
      width: 120,
    },
    {
      title: t("products_table.table.options"),
      dataIndex: "options",
      key: "options",
      width: 80,
      render: (value: number) => <div className="text-center">{value}</div>,
    },
    {
      title: t("products_table.table.cost_range"),
      dataIndex: "costRange",
      key: "costRange",
      width: 150,
    },
    {
      title: t("products_table.table.category"),
      dataIndex: "category",
      key: "category",
      width: 100,
    },
    {
      title: t("products_table.table.in_stock"),
      dataIndex: "inStock",
      key: "inStock",
      width: 80,
      render: (value: number) => <div className="text-center">{value}</div>,
    },
    {
      title: t("products_table.table.actions"),
      key: "actions",
      width: 120,
      render: () => (
        <div className="flex gap-2">
          <Button
            type="primary"
            size="small"
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
            icon={
              <img
                src="/app/components/icons/info-circle-icon.svg"
                alt="info"
                className="w-4 h-4 filter brightness-0 invert"
              />
            }
          />
          <Button
            type="primary"
            size="small"
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
            icon={
              <img
                src="/app/components/icons/edit-icon.svg"
                alt="edit"
                className="w-4 h-4 filter brightness-0 invert"
              />
            }
          />
          <Button
            type="primary"
            size="small"
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
            icon={
              <img
                src="/app/components/icons/trash-icon.svg"
                alt="delete"
                className="w-4 h-4 filter brightness-0 invert"
              />
            }
          />
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200  ">
      {hasData ? (
        <Table
          columns={columns}
          dataSource={products}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      ) : (
        <EmptyState
          title={t("products_table.empty_state.title")}
          description={t("products_table.empty_state.description")}
          showAddButton={true}
          addButtonText={t("products_table.add_product")}
          addButtonLink="/add-new-product"
        />
      )}
    </div>
  );
}
