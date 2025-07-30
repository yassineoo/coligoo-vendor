import { DatePicker } from "antd";
import DeliveryStats from "./features/delivery-stats";
import DeliveryCharts from "./features/delivery-charts";
import DeliveryInsights from "./features/delivery-insights";
import StatisticsByProvenance from "./features/statistics-by-provenance";

const { RangePicker } = DatePicker;

export default function DeliveryScreen() {
  return (
    <div className=" flex flex-col gap-8">
      <div className="flex justify-end">
        <RangePicker size="large" />
      </div>
      <div>
        <DeliveryStats />
      </div>
      <div className="flex justify-between">
        <DeliveryCharts />
        <DeliveryInsights />
      </div>
      <div>
        <StatisticsByProvenance />
      </div>
    </div>
  );
}
