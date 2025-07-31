import { Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useTranslation } from "react-i18next";

type NotReadyBalanceRecord = {
  key: string;
  ref: string;
  total: string;
  deliveryFee: string;
  cancelFee: string;
  packagingFee: string;
  weightFee: string;
};

const data: NotReadyBalanceRecord[] = [
  {
    key: "1",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "600 da",
    cancelFee: "0",
    packagingFee: "0",
    weightFee: "50da",
  },
  {
    key: "2",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "600 da",
    cancelFee: "0",
    packagingFee: "0",
    weightFee: "50da",
  },
  {
    key: "3",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "600 da",
    cancelFee: "0",
    packagingFee: "0",
    weightFee: "50da",
  },
  {
    key: "4",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "600 da",
    cancelFee: "0",
    packagingFee: "0",
    weightFee: "50da",
  },
  {
    key: "5",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "600 da",
    cancelFee: "0",
    packagingFee: "0",
    weightFee: "50da",
  },
  {
    key: "6",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "0",
    cancelFee: "150 da",
    packagingFee: "0",
    weightFee: "50da",
  },
  {
    key: "7",
    ref: "ZRKGH321A",
    total: "6000 da",
    deliveryFee: "0",
    cancelFee: "150 da",
    packagingFee: "0",
    weightFee: "50da",
  },
];

export default function NotReadyBalanceTable() {
  const { t } = useTranslation();

  const columns: ColumnsType<NotReadyBalanceRecord> = [
    {
      title: t("not_ready_balance_table.ref", "Ref"),
      dataIndex: "ref",
      key: "ref",
      align: "center",
      width: 120,
      render: (text) => (
        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs font-medium">
          {text}
        </div>
      ),
    },
    {
      title: t("not_ready_balance_table.total", "Total"),
      dataIndex: "total",
      key: "total",
      align: "center",
      width: 100,
    },
    {
      title: t("not_ready_balance_table.delivery_fee", "Delivery Fee"),
      dataIndex: "deliveryFee",
      key: "deliveryFee",
      align: "center",
      width: 120,
    },
    {
      title: t("not_ready_balance_table.cancel_fee", "Cancel Fee"),
      dataIndex: "cancelFee",
      key: "cancelFee",
      align: "center",
      width: 100,
    },
    {
      title: t("not_ready_balance_table.packaging_fee", "Packaging Fee"),
      dataIndex: "packagingFee",
      key: "packagingFee",
      align: "center",
      width: 120,
    },
    {
      title: t("not_ready_balance_table.weight_fee", "Weight Fee"),
      dataIndex: "weightFee",
      key: "weightFee",
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
