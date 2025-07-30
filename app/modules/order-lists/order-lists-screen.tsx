import { useState } from "react";
import OrdersFilters from "./features/orders-filters";
import OrdersListTable from "./features/orders-list-table";

type OrderStatus = "delivered" | "in_preparation" | "cancelled";

type OrderData = {
  key: string;
  date: string;
  tracking: string;
  client: string;
  contact: string;
  wilaya: string;
  address: string;
  order: string;
  totalPrice: string;
  delivery: string;
  procedure: string;
  condition: OrderStatus;
};

export default function OrderListsScreen() {
  const [orders] = useState<OrderData[]>([]); // Empty for testing empty state

  return (
    <div className="p-6  w-full">
      {/* Header and Filters Section */}
      <OrdersFilters />

      {/* Table Section */}
      <OrdersListTable />
    </div>
  );
}
