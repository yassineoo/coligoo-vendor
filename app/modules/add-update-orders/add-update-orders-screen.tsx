import ReturnLink from "~/components/return-link";
import AddUpdateOrdersForm from "./features/add-update-orders-form";

export default function AddUpdateOrdersScreen() {
  return (
    <div className="flex flex-col gap-8">
      <ReturnLink text="Add order" url="/dashboard/order-lists" />
      <AddUpdateOrdersForm />
    </div>
  );
}
