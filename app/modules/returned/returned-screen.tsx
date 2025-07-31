import ReturnedTable from "./returned-table";

export default function ReturnedScreen() {
  return (
    <div className="flex flex-col gap-4">
      <h1>Returned need to Pickup</h1>
      <ReturnedTable />
    </div>
  );
}
