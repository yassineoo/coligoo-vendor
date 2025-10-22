"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import ordersApi from "@/app/api/orders";

export enum OrderStatus {
  IN_PREPARATION = "in_preparation",
  CONFIRMED = "confirmed",
  DEPOSITED_AT_HUB = "deposited_at_hub",
  CANCELLED = "cancelled",
  DISPATCHED = "dispatched",
  COLLECTED = "collected",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  RETURNED = "returned",
  RETURNED_TO_HUB = "returned_to_hub",
  PAID = "paid",
}

export enum ReturnCause {
  FAILED_ATTEMPT_1 = "failed_attempt_1",
  FAILED_ATTEMPT_2 = "failed_attempt_2",
  FAILED_ATTEMPT_3 = "failed_attempt_3",
  FAILED_ATTEMPT_4 = "failed_attempt_4",
  SCHEDULED = "scheduled",
  NO_RESPONSE = "no_response",
  WRONG_NUMBER = "wrong_number",
  CLIENT_REFUSED = "client_refused",
  ADDRESS_NOT_FOUND = "address_not_found",
  CLIENT_NOT_AVAILABLE = "client_not_available",
  OTHER = "other",
}

export default function Returned() {
  const [returnedItems, setReturnedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isPerPageOpen, setIsPerPageOpen] = useState(false);
  const perPageRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    date: 80,
    tracking: 100,
    client: 120,
    contact: 100,
    wilaya: 100,
    address: 150,
    order: 150,
    totalPrice: 100,
    delivery: 100,
    condition: 120,
  });
  const router = useRouter();

  const handleLogout = () => {
    router.push("/signin");
  };

  useEffect(() => {
    const ac = new AbortController();
    const fetchReturned = async () => {
      setLoading(true);
      setError(null);
      try {
        const params: Record<string, any> = {
          page,
          perPage,
        };
        const res = await ordersApi.getOrders(params);
        const data = res?.data ?? [];
        const filtered = (data as any[]).filter((it) => {
          const s = it.status ?? it.statusLabel ?? it.state ?? "";
          return (
            s === OrderStatus.RETURNED || s === OrderStatus.RETURNED_TO_HUB
          );
        });
        setReturnedItems(
          filtered.map((it: any) => ({
            id: it.id ?? String(it._id ?? Math.random()),
            date:
              it.returnedAt || it.createdAt || it.date || it.updatedAt || "",
            tracking: it.orderId ?? "",
            client: `${it.firstname || ""} ${it.lastName || ""}`.trim() || "",
            contact: it.contactPhone || it.contactPhone2 || "",
            wilaya:
              it.toCity?.name ||
              it.fromCity?.name ||
              it.city ||
              it.wilaya ||
              "",
            address:
              it.address || it.deliveryAddress || it.client?.address || "",
            order: Array.isArray(it.productList)
              ? it.productList
                  .map((p: any) => `${p.name} x ${p.quantity || 1}`)
                  .join(", ")
              : it.orderDescription ||
                it.orderItems
                  ?.map((oi: any) => oi.name || oi.title)
                  .join(", ") ||
                "",
            totalPrice: (() => {
              const p = parseFloat(it.price || "0");
              const d = parseFloat(it.discount || "0");
              const s = parseFloat(it.shippingFee || "0");
              const total = p + s - d;
              return total > 0 ? `${total.toLocaleString()} DA` : "0 DA";
            })(),
            delivery: it.freeShipping
              ? "Free"
              : `${parseFloat(it.shippingFee || "0").toLocaleString()} DA`,
            condition:
              it.statusLabel || it.status || it.condition || "returned",
          }))
        );
        const meta = (res as any).meta ?? null;
        if (meta) {
          const last =
            meta.last_page ??
            meta.totalPages ??
            meta.total_pages ??
            Math.max(
              1,
              Math.ceil(
                (meta.total ?? filtered.length) / (meta.per_page ?? perPage)
              )
            );
          setTotalPages(Number(last));
        } else {
          setTotalPages(
            Math.max(1, Math.ceil((filtered.length ?? 0) / perPage))
          );
        }
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message ?? "Failed to load returned items");
        setReturnedItems([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchReturned();
    return () => ac.abort();
  }, [page, perPage]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        perPageRef.current &&
        !perPageRef.current.contains(event.target as Node)
      ) {
        setIsPerPageOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const goPrev = () => {
    setPage((p) => Math.max(1, p - 1));
  };

  const goNext = () => {
    setPage((p) => Math.min(totalPages, p + 1));
  };

  const gotoPage = (p: number) => {
    setPage(Math.max(1, Math.min(totalPages, p)));
  };

  const onPerPageChange = (v: number) => {
    setPerPage(v);
    setPage(1);
    setIsPerPageOpen(false);
  };

  const renderPageButtons = () => {
    const pages: number[] = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages.map((p) => (
      <button
        key={p}
        className={`w-8 h-8 text-sm border rounded flex items-center justify-center ${
          p === page
            ? "bg-orange-500 text-white"
            : "border-gray-300 hover:bg-gray-50"
        }`}
        onClick={() => gotoPage(p)}
      >
        {p}
      </button>
    ));
  };

  const columns = [
    { key: "date", label: "Date" },
    { key: "tracking", label: "Tracking" },
    { key: "client", label: "Client" },
    { key: "contact", label: "Contact" },
    { key: "wilaya", label: "Wilaya" },
    { key: "address", label: "Address" },
    { key: "order", label: "Order" },
    { key: "totalPrice", label: "Total price" },
    { key: "delivery", label: "Delivery" },
    { key: "condition", label: "condition" },
  ];

  const gridTemplateColumns = columns
    .map((c) => `${columnWidths[c.key]}px`)
    .join(" ");

  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[320px] flex items-center justify-center">
              <div className="text-sm text-gray-600">Loading...</div>
            </div>
          ) : error ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[320px] flex flex-col items-center justify-center gap-4">
              <div className="text-sm text-red-600">{error}</div>
              <button
                onClick={() => {
                  setPage(1);
                }}
                className="px-4 py-2 bg-orange-500 text-white rounded"
              >
                Retry
              </button>
            </div>
          ) : returnedItems.length === 0 ? (
            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-medium text-foreground font-roboto">
                You have no Returned yet
              </h1>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[640px] flex items-center justify-center">
                <EmptyState />
              </div>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1
                  className="text-[20px] font-medium text-black tracking-wide font-roboto"
                  style={{ fontSize: "20px" }}
                >
                  Returned need to Pickup
                </h1>
              </div>
              <div className="bg-white rounded-lg border border-[#D6D6D6] overflow-hidden max-w-6xl mx-auto">
                <div
                  style={{ backgroundColor: "#FDF4FF" }}
                  className="border-b border-[#D6D6D6]"
                >
                  <div
                    className="grid h-[42px] items-center px-6"
                    style={{ gridTemplateColumns }}
                  >
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="relative flex justify-center items-center px-2"
                        style={{
                          minWidth: `${columnWidths[column.key]}px`,
                          maxWidth: `${columnWidths[column.key]}px`,
                        }}
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
                <div className="px-6">
                  <div className="overflow-x-auto">
                    {returnedItems.map((item) => (
                      <div
                        key={item.id}
                        className="grid h-[58px] items-center border-b border-[#D6D6D6] hover:bg-gray-50"
                        style={{ gridTemplateColumns }}
                      >
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.date}px`,
                            maxWidth: `${columnWidths.date}px`,
                          }}
                        >
                          {item.date
                            ? new Date(item.date).toLocaleDateString()
                            : ""}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2 whitespace-nowrap"
                          style={{
                            minWidth: `${columnWidths.tracking}px`,
                            maxWidth: `${columnWidths.tracking}px`,
                          }}
                        >
                          <span className="bg-delivery-orange text-white px-2 py-1 rounded text-xs font-medium">
                            {item.tracking}
                          </span>
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.client}px`,
                            maxWidth: `${columnWidths.client}px`,
                          }}
                        >
                          {item.client}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.contact}px`,
                            maxWidth: `${columnWidths.contact}px`,
                          }}
                        >
                          {item.contact}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.wilaya}px`,
                            maxWidth: `${columnWidths.wilaya}px`,
                          }}
                        >
                          {item.wilaya}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.address}px`,
                            maxWidth: `${columnWidths.address}px`,
                          }}
                        >
                          {item.address}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.order}px`,
                            maxWidth: `${columnWidths.order}px`,
                          }}
                        >
                          {item.order}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.totalPrice}px`,
                            maxWidth: `${columnWidths.totalPrice}px`,
                          }}
                        >
                          {item.totalPrice}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.delivery}px`,
                            maxWidth: `${columnWidths.delivery}px`,
                          }}
                        >
                          {item.delivery}
                        </div>
                        <div
                          className="text-sm text-black font-roboto text-center truncate px-2"
                          style={{
                            minWidth: `${columnWidths.condition}px`,
                            maxWidth: `${columnWidths.condition}px`,
                          }}
                        >
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {item.condition}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white border-t border-[#D6D6D6] px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={goPrev}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Précédent
                      </button>
                      {renderPageButtons()}
                      <button
                        onClick={goNext}
                        className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center"
                      >
                        Prochain
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                    <div ref={perPageRef} className="relative">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Show</span>
                        <button
                          onClick={() => setIsPerPageOpen(!isPerPageOpen)}
                          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white flex items-center"
                        >
                          {perPage}
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
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                      {isPerPageOpen && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50">
                          <button
                            onClick={() => onPerPageChange(10)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            10
                          </button>
                          <button
                            onClick={() => onPerPageChange(25)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            25
                          </button>
                          <button
                            onClick={() => onPerPageChange(50)}
                            className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                          >
                            50
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
