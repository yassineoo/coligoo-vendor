import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

type WilayaStatistics = {
  key: string;
  number: number;
  wilayaName: string;
  total: number;
  delivered: number;
  canceled: number;
  returned: number;
  change: number;
  deliveryRate: string;
};

const data: WilayaStatistics[] = [
  {
    key: "1",
    number: 16,
    wilayaName: "Alger",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    key: "2",
    number: 16,
    wilayaName: "Oran",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    key: "3",
    number: 16,
    wilayaName: "Constantine",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    key: "4",
    number: 16,
    wilayaName: "Setif",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    key: "5",
    number: 16,
    wilayaName: "Annaba",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    key: "6",
    number: 16,
    wilayaName: "Blida",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
  {
    key: "7",
    number: 16,
    wilayaName: "Batna",
    total: 32,
    delivered: 26,
    canceled: 2,
    returned: 4,
    change: 0,
    deliveryRate: "80%",
  },
];

export default function StatisticsByProvenance() {
  const { t } = useTranslation();

  const columns: ColumnsType<WilayaStatistics> = [
    {
      title: t("statistics_table.number"),
      dataIndex: "number",
      key: "number",
      align: "center",
      width: 80,
    },
    {
      title: t("statistics_table.wilaya_name"),
      dataIndex: "wilayaName",
      key: "wilayaName",
      align: "center",
      width: 120,
    },
    {
      title: t("statistics_table.total"),
      dataIndex: "total",
      key: "total",
      align: "center",
      width: 80,
    },
    {
      title: t("statistics_table.delivered"),
      dataIndex: "delivered",
      key: "delivered",
      align: "center",
      width: 100,
    },
    {
      title: t("statistics_table.canceled"),
      dataIndex: "canceled",
      key: "canceled",
      align: "center",
      width: 80,
    },
    {
      title: t("statistics_table.returned"),
      dataIndex: "returned",
      key: "returned",
      align: "center",
      width: 80,
    },
    {
      title: t("statistics_table.change"),
      dataIndex: "change",
      key: "change",
      align: "center",
      width: 80,
    },
    {
      title: t("statistics_table.delivery_rate"),
      dataIndex: "deliveryRate",
      key: "deliveryRate",
      align: "center",
      width: 120,
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
