import { Table } from "antd";
import type { Key } from "antd/es/table/interface";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import EmptyState from "../../components/empty-state";

type ReturnedStatus = "returned_to_hub" | "returned_to_sender" | "refunded";

type ReturnedData = {
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
  condition: ReturnedStatus;
};

type ReturnedTableProps = {
  returnedItems?: ReturnedData[];
};

// Mock data - replace with actual data
const mockReturnedData: ReturnedData[] = [
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
    condition: "returned_to_hub",
  },
  {
    key: "2",
    date: "28-08-2025",
    tracking: "ZRKGH321B",
    client: "Ahmed Ahmed",
    contact: "0549461544",
    wilaya: "Oran",
    address: "Oran Centre",
    order: "phone Y10",
    totalPrice: "3200 dzd",
    delivery: "Stopdesk",
    condition: "returned_to_hub",
  },
  {
    key: "3",
    date: "27-08-2025",
    tracking: "ZRKGH321C",
    client: "Sara Mohamed",
    contact: "0549461545",
    wilaya: "Constantine",
    address: "Ali Mendjeli",
    order: "laptop Z15",
    totalPrice: "8500 dzd",
    delivery: "Stopdesk",
    condition: "returned_to_hub",
  },
];

const getStatusColor = (status: ReturnedStatus) => {
  switch (status) {
    case "returned_to_hub":
      return "#003F80";
    case "returned_to_sender":
      return "#B30000";
    case "refunded":
      return "#008001";
    default:
      return "#003F80";
  }
};

const getStatusText = (status: ReturnedStatus, t: any) => {
  return t(`returned_table.status.${status}`);
};

export default function ReturnedTable({
  returnedItems = mockReturnedData,
}: ReturnedTableProps) {
  const { t } = useTranslation();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);

  const hasData = returnedItems.length > 0;

  const columns = [
    {
      title: t("returned_table.table.date"),
      dataIndex: "date",
      key: "date",
      width: 100,
    },
    {
      title: t("returned_table.table.tracking"),
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
      title: t("returned_table.table.client"),
      dataIndex: "client",
      key: "client",
      width: 120,
    },
    {
      title: t("returned_table.table.contact"),
      dataIndex: "contact",
      key: "contact",
      width: 100,
    },
    {
      title: t("returned_table.table.wilaya"),
      dataIndex: "wilaya",
      key: "wilaya",
      width: 80,
    },
    {
      title: t("returned_table.table.address"),
      dataIndex: "address",
      key: "address",
      width: 120,
    },
    {
      title: t("returned_table.table.order"),
      dataIndex: "order",
      key: "order",
      width: 100,
    },
    {
      title: t("returned_table.table.total_price"),
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 100,
    },
    {
      title: t("returned_table.table.delivery"),
      dataIndex: "delivery",
      key: "delivery",
      width: 100,
    },
    {
      title: t("returned_table.table.condition"),
      dataIndex: "condition",
      key: "condition",
      width: 140,
      render: (status: ReturnedStatus) => (
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
    <div className="bg-white rounded-lg border border-gray-200">
      {hasData ? (
        <Table
          columns={columns}
          dataSource={returnedItems}
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
          title={t("returned_table.empty_state.title")}
          description={t("returned_table.empty_state.description")}
          showAddButton={false}
          addButtonText=""
          addButtonLink=""
        />
      )}
    </div>
  );
}
