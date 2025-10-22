"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "@/../hooks/use-toast";
import ToastContainer from "@/components/ToastContainer";
import LogoutModal from "../modals/LogoutModal";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";
import { Filter, Trash2, Plus, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";
import ordersApi from "@/app/api/orders";
import ExportButton from "./ExportButton";
import FilterButton from "./FilterButton";
import Tooltip from "../interface/Tooltip";
import { OrderDb, OrdersResponse, UIOrder } from "../../../types/ordersTypes";
import { LoaderComponent } from "../loader/Loader";
import { cn } from "@/lib/utils";

const STATUS_MAP: Record<
  string,
  { label: string; textClass: string; bgClass: string }
> = {
  in_preparation: {
    label: "In preparation",
    textClass: "text-[#1E90FF]",
    bgClass: "bg-[#D6ECFF]",
  },
  confirmed: {
    label: "Confirmed",
    textClass: "text-[#0B8457]",
    bgClass: "bg-[#DFF6EE]",
  },
  deposited_at_hub: {
    label: "Deposited at hub",
    textClass: "text-[#6B46C1]",
    bgClass: "bg-[#F3E8FF]",
  },
  cancelled: {
    label: "Cancelled",
    textClass: "text-[#E02424]",
    bgClass: "bg-[#FFEAEA]",
  },
  dispatched: {
    label: "Dispatched",
    textClass: "text-[#0F766E]",
    bgClass: "bg-[#E6FFFA]",
  },
  collected: {
    label: "Collected",
    textClass: "text-[#065F46]",
    bgClass: "bg-[#ECFDF5]",
  },
  out_for_delivery: {
    label: "Out for delivery",
    textClass: "text-[#975A16]",
    bgClass: "bg-[#FFFAEB]",
  },
  delivered: {
    label: "Delivered",
    textClass: "text-[#007A3D]",
    bgClass: "bg-[#D4F4DD]",
  },
  returned: {
    label: "Returned",
    textClass: "text-[#B45309]",
    bgClass: "bg-[#FFFBEB]",
  },
  returned_to_hub: {
    label: "Returned to hub",
    textClass: "text-[#92400E]",
    bgClass: "bg-[#FFFAF0]",
  },
  paid: {
    label: "Paid",
    textClass: "text-[#065F46]",
    bgClass: "bg-[#ECFDF5]",
  },
};

function parseProductList(raw: unknown): string {
  if (raw == null) return "—";
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return parseProductList(parsed);
    } catch {
      return raw || "—";
    }
  }
  if (Array.isArray(raw)) {
    return raw
      .map((p) => {
        if (typeof p === "string") return p;
        if (p && typeof p === "object")
          return (
            (p as any).name ?? (p as any).product_name ?? JSON.stringify(p)
          );
        return String(p);
      })
      .join(", ");
  }
  if (typeof raw === "object") {
    return (raw as any).name ?? JSON.stringify(raw);
  }
  return String(raw);
}

function mapDbOrderToUI(o: OrderDb): UIOrder {
  const formattedDate = o.createdAt
    ? new Date(o.createdAt).toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "—";
  const tracking = o.orderId ?? String(o.id ?? "—");
  const client = [o.firstname, o.lastName].filter(Boolean).join(" ") || "—";
  const contact = o.contactPhone ?? o.contactPhone2 ?? "—";
  const wilya = o.fromCity?.name ?? o.toCity?.name ?? "—";
  const address = o.address ?? "—";
  const orderText = parseProductList(o.productList);
  const priceVal = Number(o.price ?? 0);
  const shippingVal = Number(o.shippingFee ?? 0);
  const totalPrice =
    priceVal || shippingVal
      ? `${(priceVal + shippingVal).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} DA`
      : "—";
  const delivery =
    o.deliveryman && typeof o.deliveryman === "object"
      ? `#${(o.deliveryman as any).id ?? "—"}`
      : o.deliveryman
      ? `#${o.deliveryman}`
      : "—";
  const status = o.status ?? "unknown";
  return {
    id: String(o.id ?? Math.random()),
    date: formattedDate,
    tracking,
    client,
    contact,
    wilya,
    address,
    orderText,
    totalPrice,
    delivery,
    status,
    note: o.note ?? "",
  };
}

export default function OrderLists() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [orders, setOrders] = useState<UIOrder[]>([]);
  const [hasData, setHasData] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [lastPage, setLastPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<number>(10);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    date: 100,
    tracking: 130,
    client: 90,
    contact: 80,
    wilya: 100,
    address: 120,
    orderText: 120,
    totalPrice: 80,
    delivery: 100,
    status: 100,
  });
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false);
  const pageSizeRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const columns = [
    { key: "date", label: "Date" },
    { key: "tracking", label: "Tracking" },
    { key: "client", label: "Client" },
    { key: "contact", label: "Contact" },
    { key: "wilya", label: "City" },
    { key: "address", label: "Address" },
    { key: "orderText", label: "Order" },
    { key: "totalPrice", label: "Total Price" },
    { key: "delivery", label: "Delivery" },
    { key: "status", label: "Status" },
  ];

  const gridTemplateColumns = `40px 
    ${columnWidths.date}px 
    ${columnWidths.tracking}px 
    ${columnWidths.client}px 
    ${columnWidths.contact}px 
    ${columnWidths.wilya}px 
    ${columnWidths.address}px 
    ${columnWidths.orderText}px 
    ${columnWidths.totalPrice}px 
    ${columnWidths.delivery}px 
    auto`;

  const handleResizeStart = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, column: string) => {
      e.preventDefault();
      e.stopPropagation();
      const startX = e.clientX;
      const startWidth = columnWidths[column];
      if (!startWidth || typeof startWidth !== "number") return;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        moveEvent.preventDefault();
        const delta = moveEvent.clientX - startX;
        const newWidth = startWidth + delta;
        if (newWidth > 50) {
          setColumnWidths((prev) => ({ ...prev, [column]: newWidth }));
        }
      };

      const handleMouseUp = () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
      };

      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";
    },
    [columnWidths]
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        pageSizeRef.current &&
        !pageSizeRef.current.contains(event.target as Node)
      ) {
        setIsPageSizeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchWithParams = async (
    params: Record<string, any> = {},
    ignoreExistingFilters = false
  ) => {
    setLoading(true);
    setError(null);
    try {
      const merged = ignoreExistingFilters
        ? {
            page: params.page ?? currentPage,
            limit: params.limit ?? pageSize,
            ...params,
          }
        : {
            page: params.page ?? currentPage,
            limit: params.limit ?? pageSize,
            ...filters,
            ...params,
          };

      if (merged.page && merged.page !== currentPage)
        setCurrentPage(Number(merged.page));
      if (merged.limit && merged.limit !== pageSize)
        setPageSize(Number(merged.limit));

      const res = (await ordersApi.getOrders(merged)) as OrdersResponse | any;
      const list = Array.isArray((res as any)?.data)
        ? (res as any).data
        : Array.isArray(res)
        ? res
        : [];
      const meta = (res as any)?.meta ?? {};
      const ui = (list as OrderDb[]).map(mapDbOrderToUI);
      setOrders(ui);
      setHasData(ui.length > 0);
      setSelectedOrders(
        (prev) => new Set([...prev].filter((id) => ui.some((o) => o.id === id)))
      );
      const totalItems = meta.total ?? meta.count ?? ui.length;
      const computedLastPage =
        meta.lastPage ??
        meta.totalPages ??
        (merged.limit ? Math.max(1, Math.ceil(totalItems / merged.limit)) : 1);
      setLastPage(computedLastPage);
      setTotal(totalItems ?? ui.length);
      if (!ui.some((o) => o.id === focusedId)) setFocusedId(null);
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch orders");
      setOrders([]);
      setHasData(false);
      setLastPage(1);
      setTotal(0);
      setFocusedId(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithParams({ page: currentPage, limit: pageSize });
  }, [currentPage, pageSize]);

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) next.delete(orderId);
      else next.add(orderId);
      return next;
    });
  };

  const toggleAllSelection = () => {
    if (selectedOrders.size === orders.length && orders.length > 0) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map((order) => order.id)));
    }
  };

  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  const isAllSelected =
    selectedOrders.size === orders.length && orders.length > 0;
  const isSomeSelected = selectedOrders.size > 0 && !isAllSelected;

  const handleApplyFilters = async (params: Record<string, any>) => {
    if (params?.__reset) {
      setFilters({});
      const mergedParams = {
        page: params.page ?? 1,
        limit: params.limit ?? pageSize,
      };
      await fetchWithParams(mergedParams, true);
      return;
    }
    const mergedFilters = { ...filters, ...params };
    const mergedParams = {
      ...mergedFilters,
      page: params.page ?? 1,
      limit: params.limit ?? pageSize,
    };
    const { page, limit, ...pureFilters } = mergedFilters;
    setFilters(pureFilters);
    await fetchWithParams(mergedParams);
  };

  const gotoPage = (p: number) => {
    if (p < 1) return;
    if (p > lastPage) return;
    setCurrentPage(p);
  };

  const handleDelete = async () => {
    if (selectedOrders.size === 0) return;
    try {
      const ids = Array.from(selectedOrders).map((id) => parseInt(id));
      await ordersApi.bulkDeleteOrders(ids);
      const remaining = orders.filter((o) => !selectedOrders.has(o.id));
      setOrders(remaining);
      setSelectedOrders(new Set());
      setTotal((prev) => Math.max(0, prev - ids.length));
      if (remaining.length === 0 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
      toast({
        title: "Success",
        description: "Orders deleted successfully",
        variant: "success",
      });
    } catch (err: any) {
      let errorMessage = "Failed to delete orders";
      if (err && typeof err === "object") {
        if (err.body && typeof err.body === "object" && err.body.message) {
          errorMessage = err.body.message;
        } else if (err.message) {
          errorMessage = err.message;
        }
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "error",
      });
    }
    setDeleteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 relative">
      <div
        className=" w-full mx-auto"
        style={{ maxWidth: "calc(100vw - 300px)" }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1
              className="font-semibold text-gray-900"
              style={{ fontSize: "20px" }}
            >
              {hasData ? "Table of orders" : "No orders"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDeleteModalOpen(true)}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
              disabled={selectedOrders.size === 0}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>

            <FilterButton
              initialParams={{ page: currentPage, limit: pageSize, ...filters }}
              onApply={handleApplyFilters}
            />

            <ExportButton
              params={{ page: currentPage, limit: pageSize, ...filters }}
              fileName="orders"
            />

            <button
              onClick={() => router.push("/dashboard/order-lists/create")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF5A01] border border-[#FF5A01] rounded-lg hover:bg-orange-600 transition"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center p-10">
            <LoaderComponent isLoading />
          </div>
        ) : error ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-red-600">
            Error: {error}
          </div>
        ) : hasData ? (
          <div className="bg-white rounded-lg shadow-sm border border-[#D6D6D6] overflow-hidden">
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div
                  style={{ backgroundColor: "#FDF4FF" }}
                  className="border-b border-[#D6D6D6]"
                >
                  <div
                    className="grid h-[42px] items-center"
                    style={{ gridTemplateColumns }}
                  >
                    <div className="w-[40px] flex justify-center items-center border-r border-[#EAECF0] bg-[#FCFCFD] px-2">
                      <div
                        className="relative w-[15px] h-[15px] border border-[#FF5A01] bg-[#F7FAFF] rounded flex items-center justify-center cursor-pointer"
                        onClick={toggleAllSelection}
                      >
                        {isSomeSelected && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute"
                          >
                            <path
                              d="M3.14697 5.89746H9.20076"
                              stroke="#FF5A01"
                              strokeWidth="1.48256"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {isAllSelected && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 12 11"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="absolute"
                          >
                            <path
                              d="M3.14697 5.89746H9.20076"
                              stroke="#FF5A01"
                              strokeWidth="1.48256"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="relative flex items-center px-2"
                        style={
                          column.key === "status"
                            ? {}
                            : {
                                minWidth: `${columnWidths[column.key]}px`,
                                maxWidth: `${columnWidths[column.key]}px`,
                              }
                        }
                      >
                        <span className="text-sm font-normal text-black font-roboto text-center truncate">
                          {column.label}
                        </span>
                        <div
                          className="resizer w-[2px] bg-gray-200 cursor-col-resize hover:bg-gray-300 absolute right-0 top-0 bottom-0 mx-[-0.5px]"
                          onMouseDown={(e) => handleResizeStart(e, column.key)}
                          style={{ height: "100%" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`grid h-[58px] items-center border-b border-[#D6D6D6] hover:bg-gray-50 hover:cursor-pointer ${
                      focusedId === order.id ? "bg-[#FFF8F0]" : ""
                    }`}
                    style={{ gridTemplateColumns }}
                    onClick={() => setFocusedId(order.id)}
                    onDoubleClick={() =>
                      router.push(`/dashboard/order-lists/${order.id}`)
                    }
                  >
                    <div className="w-[40px] flex justify-center items-center px-2 border-r border-[#EAECF0] bg-[#FCFCFD]">
                      <div
                        className="relative w-[15px] h-[15px] border border-[#FF5A01] bg-white rounded flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleOrderSelection(order.id);
                        }}
                      >
                        {selectedOrders.has(order.id) && (
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 15 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M4 7.5L6.5 10L11 5"
                              stroke="#FF5A01"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="text-[12px] text-black font-roboto truncate px-2 text-left"
                        style={
                          column.key === "status"
                            ? {}
                            : {
                                minWidth: `${columnWidths[column.key]}px`,
                                maxWidth: `${columnWidths[column.key]}px`,
                              }
                        }
                      >
                        {column.key === "tracking" ? (
                          <span className="inline-block whitespace-nowrap px-2 py-1 text-xs font-medium text-white bg-[#FF5A01] rounded">
                            {order[column.key as keyof UIOrder] as string}
                          </span>
                        ) : column.key === "status" ? (
                          (() => {
                            const info = STATUS_MAP[order.status] ?? {
                              label: order.status ?? "Unknown",
                              textClass: "text-gray-700",
                              bgClass: "bg-gray-100",
                            };
                            return (
                              <span
                                className={`inline-block px-3 w-full text-center py-1 text-sm font-medium ${info.textClass} ${info.bgClass} rounded-[9px]`}
                              >
                                {info.label}
                              </span>
                            );
                          })()
                        ) : column.key === "client" ? (
                          <div className="flex items-center">
                            <span className="truncate">{order.client}</span>
                            {order.note && (
                              <Tooltip content={order.note} position="bottom">
                                <MessageSquare className="w-3 h-3 ml-1 text-gray-400 hover:text-gray-600 z-1000" />
                              </Tooltip>
                            )}
                          </div>
                        ) : (
                          (order[column.key as keyof UIOrder] as string)
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-full justify-between items-center px-3 sm:px-[18px] py-3 border-t border-[#D6D6D6] bg-white">
              <div className="flex flex-1 w-full items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => gotoPage(Math.max(1, currentPage - 1))}
                  className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity"
                >
                  <svg
                    className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                    width="6"
                    height="10"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.16553 8.9375L1.26363 5.0356L5.16553 1.1337"
                      stroke="black"
                      strokeWidth="1.30063"
                    />
                  </svg>
                  <span className="font-roboto text-[10px] font-medium text-black hidden sm:inline">
                    Previous
                  </span>
                </button>

                {pages.map((p) => (
                  <button
                    key={p}
                    onClick={() => gotoPage(p)}
                    className={cn(
                      "font-roboto font-medium transition-all",
                      p === currentPage
                        ? "min-w-[36px] sm:min-w-[48px] h-[26px] px-2 sm:px-3 flex items-center justify-center text-xs rounded-[6.5px] border border-black bg-white"
                        : "text-[10px] text-black hover:opacity-70"
                    )}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => gotoPage(Math.min(lastPage, currentPage + 1))}
                  className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity"
                >
                  <span className="font-roboto text-[10px] font-medium text-black hidden sm:inline">
                    Next
                  </span>
                  <svg
                    className="w-2 h-2.5 stroke-black stroke-[1.3px]"
                    width="6"
                    height="10"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.604492 9.18359L4.50639 5.28169L0.604492 1.37979"
                      stroke="black"
                      strokeWidth="1.30063"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex items-center gap-3">
                <div ref={pageSizeRef} className="relative">
                  <button
                    onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
                    className="flex items-center px-2 sm:px-[11px] py-[8.3px] border border-[rgba(52,64,84,0.4)] rounded-[10px] hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-roboto text-[11px] font-medium text-[#344054] tracking-[0.346px] leading-[16.6px] mr-1">
                      {pageSize}
                    </span>
                    <svg
                      className="w-[17px] h-[17px]"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_609_30884)">
                        <path
                          d="M5.10742 6.55859L9.35742 10.8086L13.6074 6.55859"
                          stroke="#344054"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_609_30884">
                          <rect
                            width="17"
                            height="17"
                            fill="white"
                            transform="translate(0.857422 0.183594)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                  {isPageSizeOpen && (
                    <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg z-10 min-w-[60px]">
                      <button
                        onClick={() => {
                          setPageSize(10);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        10
                      </button>
                      <button
                        onClick={() => {
                          setPageSize(20);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        20
                      </button>
                      <button
                        onClick={() => {
                          setPageSize(50);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        50
                      </button>
                      <button
                        onClick={() => {
                          setPageSize(100);
                          setCurrentPage(1);
                          setIsPageSizeOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                      >
                        100
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow border border-gray-100 h-[420px] flex items-center justify-center">
            <div className="text-center max-w-md">
              <img
                src="/images/empty.png"
                alt="Empty illustration"
                className="w-56 h-44 mx-auto object-contain mb-6"
              />
              <div className="text-lg text-gray-900">No orders for now</div>
              <div className="text-sm text-gray-500 mt-2">
                Create your first order to get started.
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push("/dashboard/order-lists/create")}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-[#FF5A01] rounded-lg hover:bg-orange-600"
                >
                  <Plus className="w-4 h-4 mr-2" /> New Order
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={() => router.push("/signin")}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Are you sure you want to delete these orders?"
        description="This action cannot be undone"
      />
    </div>
  );
}
