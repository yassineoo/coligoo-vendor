import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

type PriceAppliedRecord = {
  key: string;
  number: string;
  wilaya: string;
  homeDelivery: string;
  stopdesk: string;
  returned: string;
};

const data: PriceAppliedRecord[] = [
  {
    key: "1",
    number: "16",
    wilaya: "Alger",
    homeDelivery: "150 da",
    stopdesk: "600 da",
    returned: "400 da",
  },
  {
    key: "2",
    number: "16",
    wilaya: "Alger",
    homeDelivery: "150 da",
    stopdesk: "600 da",
    returned: "400 da",
  },
  {
    key: "3",
    number: "16",
    wilaya: "Alger",
    homeDelivery: "150 da",
    stopdesk: "600 da",
    returned: "400 da",
  },
  {
    key: "4",
    number: "16",
    wilaya: "Alger",
    homeDelivery: "150 da",
    stopdesk: "600 da",
    returned: "400 da",
  },
  {
    key: "5",
    number: "16",
    wilaya: "Alger",
    homeDelivery: "150 da",
    stopdesk: "600 da",
    returned: "400 da",
  },
  {
    key: "6",
    number: "16",
    wilaya: "Alger",
    homeDelivery: "150 da",
    stopdesk: "600 da",
    returned: "400 da",
  },
];

export default function PriceAppliedTable() {
  const { t } = useTranslation();

  const columns: ColumnsType<PriceAppliedRecord> = [
    {
      title: t("price_applied_table.number", "Number"),
      dataIndex: "number",
      key: "number",
      align: "center",
      width: 100,
      render: (text) => (
        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
          {text}
        </div>
      ),
    },
    {
      title: t("price_applied_table.wilaya", "Wilaya name"),
      dataIndex: "wilaya",
      key: "wilaya",
      align: "center",
      width: 140,
    },
    {
      title: t("price_applied_table.home_delivery", "Home Delivery"),
      dataIndex: "homeDelivery",
      key: "homeDelivery",
      align: "center",
      width: 140,
      render: (text) => (
        <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
          {text}
        </div>
      ),
    },
    {
      title: t("price_applied_table.stopdesk", "stopdesk"),
      dataIndex: "stopdesk",
      key: "stopdesk",
      align: "center",
      width: 140,
      render: (text) => (
        <div className="bg-cyan-100 text-cyan-800 px-2 py-1 rounded text-xs font-medium">
          {text}
        </div>
      ),
    },
    {
      title: t("price_applied_table.returned", "Returned"),
      dataIndex: "returned",
      key: "returned",
      align: "center",
      width: 140,
      render: (text) => (
        <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {text}
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table
        columns={columns}
        dataSource={data}
        className="[&_.ant-table-thead_.ant-table-cell]:bg-purple-50 [&_.ant-table-thead_.ant-table-cell]:font-normal [&_.ant-table-thead_.ant-table-cell]:text-center"
        size="middle"
      />
    </div>
  );
}
