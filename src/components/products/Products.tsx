"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { Checkbox } from "@/components/interface/checkbox";
import {
  Home,
  Package,
  ShoppingBag,
  RefreshCw,
  Wallet,
  Tag,
  Code,
  Settings,
  Trash2,
  Plus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import productsApi from "@/app/api/products";
import { toast } from "@/../hooks/use-toast";
import ToastContainer from "@/components/ToastContainer";
import { LoaderComponent } from "../loader/Loader";
import { cn } from "@/lib/utils";
import DeleteConfirmationModal from "../modals/DeleteConfirmationModal";

type Product = {
  id: string;
  name: string;
  alias: string;
  options: number;
  costRange: string;
  category: string;
  inStock: number;
  raw: any;
};

type Meta = {
  totalPages?: number;
};

export default function Products() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [search, setSearch] = useState("");
  const [isLimitOpen, setIsLimitOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const limitRef = useRef<HTMLDivElement>(null);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 200,
    alias: 150,
    options: 100,
    costRange: 120,
    category: 150,
    inStock: 100,
  });

  const sidebarItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: Package, label: "Order Lists", path: "/order-lists" },
    { icon: ShoppingBag, label: "Product", path: "/products" },
    { icon: RefreshCw, label: "Returned", path: "/returned" },
    { icon: Wallet, label: "Payment", path: "/payment" },
    { icon: Tag, label: "Price applied", path: "/price-applied" },
    { icon: Code, label: "Development", path: "/development" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  useEffect(() => {
    fetchProducts();
  }, [page, limit, search]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        limitRef.current &&
        !limitRef.current.contains(event.target as Node)
      ) {
        setIsLimitOpen(false);
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
    [columnWidths, setColumnWidths]
  );

  async function fetchProducts() {
    setLoading(true);
    setError(null);
    try {
      const resp = await productsApi.getProducts({ page, limit, search });
      const data = resp?.data ?? resp;
      const mapped = (data || []).map((p: any) => ({
        id: String(p.id ?? p._id ?? ""),
        name: p.productName ?? p.name ?? "",
        alias: p.productAlias ?? p.alias ?? "",
        options: p.hasVariables
          ? Array.isArray(p.variables)
            ? p.variables.length
            : 1
          : 0,
        costRange:
          p.price !== undefined && p.price !== null
            ? typeof p.price === "string"
              ? `DA ${p.price}`
              : `DA ${String(p.price)}`
            : "-",
        category: p.category ?? "",
        inStock: p.quantity ?? 0,
        raw: p,
      }));
      setProducts(mapped);
      setMeta(resp?.meta ?? null);
      if (selectAll) setSelectedProducts(mapped.map((m: Product) => m.id));
    } catch (err: any) {
      const msg =
        err?.body?.message ??
        err?.message ??
        "Erreur lors du chargement des produits";
      setError(msg);
      toast({
        title: "Erreur",
        description: msg,
        variant: "error",
        open: true,
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSelectAll(checked: boolean) {
    setSelectAll(checked);
    if (checked) {
      setSelectedProducts(products.map((p) => p.id));
    } else {
      setSelectedProducts([]);
    }
  }

  function handleSelectProduct(productId: string, checked: boolean) {
    if (checked) {
      setSelectedProducts((s) => Array.from(new Set([...s, productId])));
    } else {
      setSelectedProducts((s) => s.filter((id) => id !== productId));
      setSelectAll(false);
    }
  }

  const handleDeleteConfirm = async () => {
    if (pendingDeleteIds.length === 0) return;
    setDeleting(true);
    try {
      await Promise.all(
        pendingDeleteIds.map((id) => productsApi.deleteProduct(id))
      );
      setSelectedProducts([]);
      setSelectAll(false);
      await fetchProducts();
      toast({
        title: "Suppression",
        description: `${pendingDeleteIds.length} produit(s) supprimé(s)`,
        variant: "success",
        open: true,
        duration: 5000,
      });
    } catch (err: any) {
      const msg =
        err?.body?.message ?? err?.message ?? "Erreur lors de la suppression";
      toast({
        title: "Erreur",
        description: msg,
        variant: "error",
        open: true,
        duration: 5000,
      });
    } finally {
      setDeleting(false);
      setIsDeleteModalOpen(false);
      setPendingDeleteIds([]);
    }
  };

  function handleBulkDelete() {
    if (selectedProducts.length === 0) {
      toast({ title: "Aucun produit sélectionné", open: true, duration: 4000 });
      return;
    }
    setPendingDeleteIds(selectedProducts);
    setIsDeleteModalOpen(true);
  }

  function handleSingleDelete(productId: string) {
    setPendingDeleteIds([productId]);
    setIsDeleteModalOpen(true);
  }

  const numItems = pendingDeleteIds.length;
  const deleteTitle =
    numItems === 1
      ? "Are you sure you want to delete this product?"
      : `Are you sure you want to delete these ${numItems} products?`;
  const deleteDescription = "This action cannot be undone";

  function gotoPage(p: number) {
    if (p < 1) return;
    if (meta?.totalPages && p > meta.totalPages) return;
    setPage(p);
  }

  const gridTemplateColumns = `2.5rem 
    ${columnWidths.name}px 
    ${columnWidths.alias}px 
    ${columnWidths.options}px 
    ${columnWidths.costRange}px 
    ${columnWidths.category}px 
    ${columnWidths.inStock}px 
    auto`;

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "alias", label: "Product Alias" },
    { key: "options", label: "Options" },
    { key: "costRange", label: "Cost Range" },
    { key: "category", label: "Category" },
    { key: "inStock", label: "In Stock" },
  ];

  const totalPages = meta?.totalPages ?? 1;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <ToastContainer />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={deleteTitle}
        description={deleteDescription}
      />
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          {products.length === 0 && !loading ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-medium text-gray-900 tracking-wide">
                  You have no Product yet
                </h1>
                <div className="flex items-center space-x-3">
                  <button
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                  <Link
                    href="/add-product"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-delivery-orange border border-delivery-orange rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 h-[600px] flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="mb-8">
                    <img
                      src="/images/empty.png"
                      alt="Empty state illustration"
                      className="w-64 h-56 mx-auto object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg text-gray-900 font-normal capitalize">
                      "Looks like there are no products listed yet.
                    </p>
                    <p className="text-lg text-gray-900 font-normal capitalize">
                      Time to start adding your items!"
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1
                  className="font-semibold text-gray-900"
                  style={{ fontSize: "20px" }}
                >
                  table of Products
                </h1>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleBulkDelete}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={selectedProducts.length === 0 || deleting}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                  <Link
                    href="/dashboard/products/create"
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-delivery-orange border border-delivery-orange rounded-lg hover:bg-orange-600 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#D6D6D6]">
                <div
                  style={{ backgroundColor: "#FDF4FF" }}
                  className="border-b border-[#D6D6D6]"
                >
                  <div
                    className="grid h-[42px] items-center"
                    style={{ gridTemplateColumns }}
                  >
                    <div className="w-10 flex justify-center items-center border-r border-[#EAECF0] bg-[#FCFCFD] px-2">
                      <div className="relative w-[15px] h-[15px] border border-delivery-orange bg-[#F7FAFF] rounded flex items-center justify-center">
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 12 12"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M3.14697 5.89746H9.20076"
                            stroke="#FF5A01"
                            strokeWidth="1.48256"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                    {columns.map((column) => (
                      <div
                        key={column.key}
                        className="relative flex justify-center items-center px-2"
                        style={{
                          minWidth: `${columnWidths[column.key]}px`,
                          maxWidth: `${columnWidths[column.key]}px`,
                        }}
                      >
                        <span className="text-[14px] font-normal text-black font-roboto text-center truncate">
                          {column.label}
                        </span>
                        <div
                          className="resizer w-[2px] bg-gray-200 cursor-col-resize hover:bg-gray-300 absolute right-0 top-0 bottom-0 mx-[-0.5px]"
                          onMouseDown={(e) => handleResizeStart(e, column.key)}
                          style={{ height: "100%" }}
                        />
                      </div>
                    ))}
                    <div className="text-sm font-normal text-black font-roboto text-center px-4">
                      Actions
                    </div>
                  </div>
                </div>

                <div>
                  {loading ? (
                    <div className="flex justify-center items-center p-10">
                      <LoaderComponent isLoading />
                    </div>
                  ) : (
                    products.map((product) => (
                      <div
                        key={product.id}
                        className="grid h-[58px] items-center border-b border-[#D6D6D6] hover:bg-gray-50"
                        style={{ gridTemplateColumns }}
                      >
                        <div className="w-10 flex justify-center items-center px-2">
                          <div className="relative w-[15px] h-[15px] border border-delivery-orange bg-[#F7FAFF] rounded flex items-center justify-center">
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={(checked: boolean) =>
                                handleSelectProduct(product.id, checked)
                              }
                              className="w-full h-full border-0 bg-transparent data-[state=checked]:bg-delivery-orange data-[state=checked]:text-white"
                            />
                          </div>
                        </div>
                        {columns.map((column) => (
                          <div
                            key={column.key}
                            className="text-[12px] text-black font-roboto truncate px-2 text-center"
                            style={{
                              minWidth: `${columnWidths[column.key]}px`,
                              maxWidth: `${columnWidths[column.key]}px`,
                            }}
                          >
                            {
                              product[column.key as keyof Product] as
                                | string
                                | number
                            }
                          </div>
                        ))}
                        <div className="flex items-center space-x-2 px-4 justify-end">
                          <Link
                            href={`/dashboard/products/${product.id}/edit`}
                            className="w-8 h-8 bg-orange-100 hover:bg-orange-200 rounded-xl flex items-center justify-center transition-colors"
                          >
                            <img
                              src={"/icons/edit.svg"}
                              alt="edit"
                              className="w-4 h-4"
                            />
                          </Link>

                          <button
                            onClick={() => handleSingleDelete(product.id)}
                            className="w-8 h-8 bg-red-100 hover:bg-red-200 rounded-xl flex items-center justify-center transition-colors"
                            disabled={deleting}
                          >
                            <img
                              src={"/icons/trash.svg"}
                              alt="delete"
                              className="w-4 h-4"
                            />
                          </button>
                          <Link
                            href={`/dashboard/products/${product.id}`}
                            className="w-8 h-8 bg-[#06A3B1]/20 hover:bg-[#06A3B1]/40 rounded-xl flex items-center justify-center transition-colors"
                          >
                            <img
                              src={"/icons/info-circle.svg"}
                              alt="more infos"
                              className="w-4 h-4"
                            />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex w-full justify-between items-center px-3 sm:px-[18px] py-3 border-t border-[#D6D6D6] bg-white">
                  <div className="flex flex-1 items-center justify-center gap-2 sm:gap-4">
                    <button
                      onClick={() => gotoPage(Math.max(1, page - 1))}
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
                        Précédent
                      </span>
                    </button>

                    {pages.map((p) => (
                      <button
                        key={p}
                        onClick={() => gotoPage(p)}
                        className={cn(
                          "font-roboto font-medium transition-all",
                          p === page
                            ? "min-w-[36px] sm:min-w-[48px] h-[26px] px-2 sm:px-3 flex items-center justify-center text-xs rounded-[6.5px] border border-black bg-white"
                            : "text-[10px] text-black hover:opacity-70"
                        )}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      onClick={() => gotoPage(Math.min(totalPages, page + 1))}
                      className="flex items-center gap-1 sm:gap-2 hover:opacity-70 transition-opacity"
                    >
                      <span className="font-roboto text-[10px] font-medium text-black hidden sm:inline">
                        Prochaine
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
                    <div ref={limitRef} className="relative">
                      <button
                        onClick={() => setIsLimitOpen(!isLimitOpen)}
                        className="flex items-center px-2 sm:px-[11px] py-[8.3px] border border-[rgba(52,64,84,0.4)] rounded-[10px] hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-roboto text-[11px] font-medium text-[#344054] tracking-[0.346px] leading-[16.6px] mr-1">
                          {limit}
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
                      {isLimitOpen && (
                        <div className="absolute right-0 mt-1 bg-white border border-gray-300 rounded-[10px] shadow-lg z-50 min-w-[60px]">
                          <button
                            onClick={() => {
                              setLimit(10);
                              setPage(1);
                              setIsLimitOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                          >
                            10
                          </button>
                          <button
                            onClick={() => {
                              setLimit(25);
                              setPage(1);
                              setIsLimitOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
                          >
                            25
                          </button>
                          <button
                            onClick={() => {
                              setLimit(50);
                              setPage(1);
                              setIsLimitOpen(false);
                            }}
                            className="block w-full text-left px-3 py-2 text-[11px] font-roboto font-medium text-[#344054] hover:bg-gray-50 transition-colors"
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
          {error && <div className="mt-4 text-red-600">{error}</div>}
        </main>
      </div>
    </div>
  );
}
