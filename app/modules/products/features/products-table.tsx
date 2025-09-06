import { Table, Button, Skeleton, notification } from "antd";
import type { Key } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../../../components/empty-state";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, getAllProducts } from "../api/products-api";
import ErrorComp from "~/components/error-comp";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Link } from "react-router";
import type { Product } from "~/types/global";

export default function ProductsTable() {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, isSuccess } = useQuery({
    queryKey: ["products"],
    queryFn: getAllProducts,
  });

  const deleteProductMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteProduct(id),
    onSuccess: (data) => {
      console.log("Response Data:", data);
      notification.success({
        message: "Success",
        description: "Product deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error: any) => {
      console.error("Error Details:", error);
      notification.error({
        message: "Error",
        description:
          error?.response?.data?.message || "Something went wrong. Try again.",
      });
    },
  });

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
      render: (_: any, record: Product) => (
        <div className="flex gap-2">
          <Link
            type="primary"
            to={`/dashboard/products/add-update-product/${record.id}`}
            className="!bg-orange-500 flex px-1 items-center justify-center !rounded-lg  !border-orange-500 hover:!bg-orange-500/90 hover:!border-orange-600"
          >
            <IconEdit className=" !stroke-white" stroke={1} size={16} />
          </Link>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              deleteProductMutation.mutate({ id: record.id });
            }}
            className="bg-orange-500 border-orange-500 hover:bg-orange-600 hover:border-orange-600"
            icon={<IconTrash stroke={1} size={16} />}
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
