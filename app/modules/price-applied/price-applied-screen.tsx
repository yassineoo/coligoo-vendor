import PriceAppliedInsights from "./price-applied-insights";
import PriceAppliedTable from "./price-applied-table";

export default function PriceAppliedScreen() {
  return (
    <div className="space-y-4">
      <h1>Tariff Breakdown:</h1>
      <PriceAppliedInsights />
      <PriceAppliedTable />
    </div>
  );
}
