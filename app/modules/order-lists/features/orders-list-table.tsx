import { Table } from "antd";
import type { Key } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../../../components/empty-state";

type OrderStatus = "delivered" | "in_preparation" | "cancelled";

type OrderData = {
  key: string;
  date: string;
  tracking: string;
  client: string;
  contact: string;
  wilaya: string;
  address: string;
  order: string;
  totalPrice: string;
  delivery: string;
  procedure: string;
  condition: OrderStatus;
};

type OrdersListTableProps = {
  orders?: OrderData[];
};

// Mock data - replace with actual data
const mockOrderData: OrderData[] = [
  {
    key: "1",
    date: "29-08-2025",
    tracking: "ZRKGH321A",
    client: "Hamza hamza",
    contact: "0549461543",
    wilaya: "Alger",
    address: "Bordj El Kiffan",
    order: "watch X5",
    totalPrice: "4500 dzd",
    delivery: "Stopdesk",
    procedure: "Change",
    condition: "delivered",
  },
  {
    key: "2",
    date: "29-08-2025",
    tracking: "ZRKGH321B",
    client: "Ahmed Ahmed",
    contact: "0549461544",
    wilaya: "Oran",
    address: "Oran Centre",
    order: "phone Y10",
    totalPrice: "3200 dzd",
    delivery: "Stopdesk",
    procedure: "Change",
    condition: "in_preparation",
  },
  {
    key: "3",
    date: "28-08-2025",
    tracking: "ZRKGH321C",
    client: "Sara Mohamed",
    contact: "0549461545",
    wilaya: "Constantine",
    address: "Ali Mendjeli",
    order: "laptop Z15",
    totalPrice: "8500 dzd",
    delivery: "Stopdesk",
    procedure: "Change",
    condition: "cancelled",
  },
];

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "delivered":
      return "#008001";
    case "in_preparation":
      return "#007BFF";
    case "cancelled":
      return "#B30000";
    default:
      return "#007BFF";
  }
};

const getStatusText = (status: OrderStatus, t: any) => {
  return t(`order_lists.status.${status}`);
};

export default function OrdersListTable({
  orders = mockOrderData,
}: OrdersListTableProps) {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const hasData = orders.length > 0;

  const columns = [
    {
      title: t("order_lists.table.date"),
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: t("order_lists.table.tracking"),
      dataIndex: "tracking",
      key: "tracking",
      width: 120,
      render: (text: string) => (
        <div className="bg-orange-500 text-white px-2 py-1 rounded text-xs text-center">
          {text}
        </div>
      ),
    },
    {
      title: t("order_lists.table.client"),
      dataIndex: "client",
      key: "client",
      width: 120,
    },
    {
      title: t("order_lists.table.contact"),
      dataIndex: "contact",
      key: "contact",
      width: 100,
    },
    {
      title: t("order_lists.table.wilaya"),
      dataIndex: "wilaya",
      key: "wilaya",
      width: 80,
    },
    {
      title: t("order_lists.table.address"),
      dataIndex: "address",
      key: "address",
      width: 120,
    },
    {
      title: t("order_lists.table.order"),
      dataIndex: "order",
      key: "order",
      width: 100,
    },
    {
      title: t("order_lists.table.total_price"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 100,
    },
    {
      title: t("order_lists.table.delivery"),
      dataIndex: "delivery",
      key: "delivery",
      width: 100,
    },
    {
      title: t("order_lists.table.procedure"),
      dataIndex: "procedure",
      key: "procedure",
      width: 100,
    },
    {
      title: t("order_lists.table.condition"),
      dataIndex: "condition",
      key: "condition",
      width: 120,
      render: (status: OrderStatus) => (
        <div
          className="px-3 py-1 rounded-lg text-white text-xs font-medium text-center"
          style={{ backgroundColor: getStatusColor(status) }}
        >
          {getStatusText(status, t)}
        </div>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200  ">
      {hasData ? (
        <Table
          columns={columns}
          dataSource={orders}
          rowSelection={rowSelection}
          pagination={{
            pageSize: 10,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          scroll={{ x: "max-content" }}
        />
      ) : (
        <EmptyState
          title={t("order_lists.empty_state.title")}
          description={t("order_lists.empty_state.description")}
          showAddButton={true}
          addButtonText={t("order_lists.add_order")}
          addButtonLink="/add-new-order"
        />
      )}
    </div>
  );
}
