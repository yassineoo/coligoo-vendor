import ProductsFilters from "./features/products-filters";
import ProductsTable from "./features/products-table";

export default function ProductsScreen() {
  return (
    <div className="p-6  w-full">
      <ProductsFilters />
      <ProductsTable />
    </div>
  );
}
