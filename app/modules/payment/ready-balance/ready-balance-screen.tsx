import ReadyBalanceInsights from "./ready-balance-insights";
import ReadyBalanceTable from "./ready-balance-table";

export default function ReadyBalanceScreen() {
  return (
    <div className=" space-y-4">
      <ReadyBalanceInsights />
      <h2>More informtion </h2>
      <ReadyBalanceTable />
    </div>
  );
}
