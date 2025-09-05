import { Table, Button, Skeleton } from "antd";
import type { Key } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../../../components/empty-state";
import { useQuery } from "@tanstack/react-query";
import { getAllProducts } from "../api/products-api";
import ErrorComp from "~/components/error-comp";

export default function ProductsTable() {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });
  console.log("products data", data?.data?.data?.length);

  const columns = [
    {
      title: t("products.table.product_name"),
      dataIndex: "productName",
      key: "productName",
      width: 120,
    },
    {
      title: t("products.table.product_alias"),
      dataIndex: "productAlias",
      key: "productAlias",
      width: 120,
    },
    {
      title: t("products.table.variables"),
      dataIndex: "variables",
      key: "variables",
      width: 80,
      render: (value: number[]) => (
        <div className="text-center">{value?.length || 0}</div>
      ),
    },
    {
      title: t("products.table.category"),
      dataIndex: "category",
      key: "category",
      width: 100,
    },
    {
      title: t("products.table.quantity"),
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      render: (value: number) => <div className="text-center">{value}</div>,
    },
    {
      title: t("products.table.actions"),
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
      {data?.data?.data?.length && isSuccess && (
        <Table
          columns={columns}
          dataSource={data?.data?.data}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      )}
      {data?.data?.data?.length === 0 && isSuccess && <EmptyState />}
      {isLoading && <Skeleton />}
      {isError && <ErrorComp error={error.message} />}
    </div>
  );
}
