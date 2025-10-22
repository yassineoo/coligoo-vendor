"use client";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/interface/tabs";
import {
  DollarSign,
  TrendingDown,
  TrendingUp,
  CheckCircle,
  XCircle,
  Edit,
  Eye,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  bgColor: string;
  iconColor: string;
}

interface OrderData {
  ref: string;
  total: string;
  deliveryFee: string;
  cancelFee: string;
  packagingFee: string;
  weightFee: string;
}

interface PaymentData {
  date: string;
  total: string;
  deliveryFee: string;
  cancelFee: string;
  packagingFee: string;
  weightFee: string;
}

export default function Payment() {
  const router = useRouter();

  const statCards: StatCard[] = [
    {
      title: "Total income",
      value: "6000 DA",
      icon: DollarSign,
      bgColor: "bg-orange-100",
      iconColor: "text-delivery-orange",
    },
    {
      title: "Ready amount",
      value: "5400 da",
      icon: TrendingUp,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total costs",
      value: "600 da",
      icon: TrendingDown,
      bgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
    },
    {
      title: "Delivered",
      value: "05",
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      title: "Cancelled",
      value: "02",
      icon: XCircle,
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
    },
  ];

  const orderData: OrderData[] = [
    {
      ref: "230420241",
      total: "6000 da",
      deliveryFee: "600 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      ref: "230420241",
      total: "6000 da",
      deliveryFee: "600 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      ref: "230420241",
      total: "6000 da",
      deliveryFee: "600 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      ref: "230420241",
      total: "6000 da",
      deliveryFee: "600 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      ref: "230420241",
      total: "6000 da",
      deliveryFee: "600 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      ref: "230420241",
      total: "6000 da",
      deliveryFee: "0",
      cancelFee: "150 da",
      packagingFee: "0",
      weightFee: "50da",
    },
  ];

  const paymentData: PaymentData[] = [
    {
      date: "29-08-2025",
      total: "16000 da",
      deliveryFee: "500 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      date: "29-08-2025",
      total: "16000 da",
      deliveryFee: "500 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      date: "29-08-2025",
      total: "16000 da",
      deliveryFee: "500 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      date: "29-08-2025",
      total: "16000 da",
      deliveryFee: "500 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      date: "29-08-2025",
      total: "16000 da",
      deliveryFee: "500 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
    {
      date: "29-08-2025",
      total: "16000 da",
      deliveryFee: "500 da",
      cancelFee: "0",
      packagingFee: "0",
      weightFee: "50da",
    },
  ];

  const StatisticsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      {statCards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <div className="flex items-center">
            <div className={`p-3 rounded-full ${card.bgColor} mr-4`}>
              <card.icon className={`w-6 h-6 ${card.iconColor}`} />
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-900 mb-1">
                {card.title}
              </h3>
              <p className="text-sm text-gray-600">{card.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const DataTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-medium text-gray-900">More information</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Ref
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Delivery Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Cancel Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Packaging Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Weight Fee
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orderData.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 text-xs font-medium bg-delivery-orange text-white rounded-md">
                    {order.ref}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.deliveryFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.cancelFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.packagingFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {order.weightFee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <button className="px-3 py-1 text-gray-500 hover:text-gray-700">
            ← Previous
          </button>
          <span className="mx-4">1</span>
          <span className="mx-4">2</span>
          <button className="px-3 py-1 bg-gray-900 text-white rounded">
            3
          </button>
          <span className="mx-4">4</span>
          <span className="mx-4">5</span>
          <button className="px-3 py-1 text-gray-500 hover:text-gray-700">
            Next →
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );

  const PaymentTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-purple-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Total
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Delivery Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Cancel Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Packaging Fee
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-900 capitalize">
                Weight Fee
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-900 capitalize">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paymentData.map((payment, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.date}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.total}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.deliveryFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.cancelFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.packagingFee}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {payment.weightFee}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="p-2 bg-delivery-orange text-white rounded-full hover:bg-orange-600 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="flex items-center text-sm text-gray-600">
          <button className="px-3 py-1 text-delivery-orange hover:text-orange-600 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Previous
          </button>
          <div className="flex items-center mx-4 space-x-2">
            <button className="w-6 h-6 bg-delivery-orange text-white text-xs rounded flex items-center justify-center">
              1
            </button>
            <button className="w-6 h-6 text-delivery-orange text-xs hover:bg-orange-50 rounded flex items-center justify-center">
              2
            </button>
            <button className="w-6 h-6 text-delivery-orange text-xs hover:bg-orange-50 rounded flex items-center justify-center">
              3
            </button>
            <button className="w-6 h-6 text-delivery-orange text-xs hover:bg-orange-50 rounded flex items-center justify-center">
              4
            </button>
            <button className="w-6 h-6 text-delivery-orange text-xs hover:bg-orange-50 rounded flex items-center justify-center">
              5
            </button>
          </div>
          <button className="px-3 py-1 text-delivery-orange hover:text-orange-600 flex items-center">
            Next
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
        <div className="text-sm text-gray-600">
          <select className="border border-gray-300 rounded px-2 py-1">
            <option>10</option>
            <option>20</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <div className="flex-1 flex flex-col">
        {/* Page Content */}
        <main className="flex-1 p-6">
          <Tabs defaultValue="ready" className="w-full">
            {/* Custom Tab List */}
            <TabsList className="bg-transparent border-0 p-0 h-auto mb-6">
              <div className="relative">
                <div className="flex gap-8 border-b border-gray-200">
                  <TabsTrigger
                    value="ready"
                    className="relative pb-4 text-xl font-medium text-delivery-orange font-roboto bg-transparent shadow-none border-0 rounded-none px-0 data-[state=active]:bg-transparent data-[state=active]:text-delivery-orange"
                  >
                    Ready balance
                  </TabsTrigger>
                  <TabsTrigger
                    value="balance"
                    className="relative pb-4 text-xl font-medium text-gray-900 font-roboto bg-transparent shadow-none border-0 rounded-none px-0 data-[state=active]:bg-transparent data-[state=active]:text-gray-900"
                  >
                    Balance not yet ready
                  </TabsTrigger>
                  <TabsTrigger
                    value="payment"
                    className="relative pb-4 text-xl font-medium text-gray-900 font-roboto bg-transparent shadow-none border-0 rounded-none px-0 data-[state=active]:bg-transparent data-[state=active]:text-delivery-orange"
                  >
                    My Payment
                  </TabsTrigger>
                </div>
                <div className="absolute bottom-0 left-0 w-32 h-1 bg-delivery-orange rounded-t-lg transition-transform duration-200" />
              </div>
            </TabsList>

            <TabsContent value="ready" className="mt-0">
              <StatisticsCards />
              <DataTable />
            </TabsContent>

            <TabsContent value="balance" className="mt-0">
              <StatisticsCards />
              <DataTable />
            </TabsContent>

            <TabsContent value="payment" className="mt-0">
              <PaymentTable />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
