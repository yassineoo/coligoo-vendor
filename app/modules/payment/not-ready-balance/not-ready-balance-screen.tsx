import NotReadyBalanceInsights from "./not-ready-balance-insights";
import NotReadyBalanceTable from "./not-ready-balance-table";

export default function NotReadyBalanceScreen() {
  return (
    <div className="space-y-4">
      <NotReadyBalanceInsights />
      <h2>More informtion </h2>
      <NotReadyBalanceTable />
    </div>
  );
}
