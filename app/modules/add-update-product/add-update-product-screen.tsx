import ReturnLink from "~/components/return-link";
import AddUpdateProductForm from "./add-update-product-form";

export default function AddUpdateProductScreen() {
  return (
    <div className="flex flex-col gap-8">
      <ReturnLink text="Add Product" url="/dashboard/products" />
      <AddUpdateProductForm />
    </div>
  );
}
