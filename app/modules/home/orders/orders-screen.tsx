import { DatePicker } from "antd";
import OrdersStats from "./features/orders-stats";
import OrdersCharts from "./features/orders-charts";
import OrdersTop from "./features/orders-top";
const { RangePicker } = DatePicker;
export default function OrdersScreen() {
  return (
    <div className=" flex flex-col gap-8">
      <div className="flex justify-end">
        <RangePicker size="large" />
      </div>
      <div>
        <OrdersStats />
      </div>
      <div className="flex justify-between">
        <OrdersCharts />
        <OrdersTop />
      </div>
    </div>
  );
}
