import ReturnLink from "~/components/return-link";
import AddUpdateProductForm from "./add-update-product-form";
import { useQuery } from "@tanstack/react-query";
import { getProductById } from "./api/add-update-product";
import { Skeleton } from "antd";
import ErrorComp from "~/components/error-comp";
import type { Product } from "~/types/global";

export default function AddUpdateProductScreen({ id }: { id?: string }) {
  const { data, isLoading, isError, isSuccess, error } = useQuery({
    queryKey: ["Product", { id }],
    queryFn: () => getProductById(id),
  });
  return (
    <div className="flex flex-col gap-8">
      <ReturnLink text="Add Product" url="/dashboard/products" />
      {isLoading && <Skeleton />}
      {isError && <ErrorComp error={error.message} />}
      {isSuccess && data && (
        <AddUpdateProductForm product={data.data as Product} type="update" />
      )}
      {!id && <AddUpdateProductForm type="add" />}
    </div>
  );
}
