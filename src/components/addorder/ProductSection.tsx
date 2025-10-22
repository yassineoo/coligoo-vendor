import React, { useRef, useEffect } from "react";
import { ChevronDown, X, Check, Trash2, Plus } from "lucide-react";
import DeleteConfirmationModal from "@/components/modals/DeleteConfirmationModal";

type Product = {
  id: string;
  name: string;
  alias?: string;
  category?: string;
  price?: number;
  productCode?: string;
};

interface ProductRow {
  id: string;
  productId?: number;
  productName: string;
  productAlias?: string;
  category?: string;
  unitPrice?: number | string;
  quantity: string;
  size?: string;
  color?: string;
  itemNote?: string;
}

interface CustomProduct {
  id: string;
  name: string;
  quantity: string;
  price: string;
}

interface ProductSectionProps {
  productSubmissionMode: "orderItems" | "productList";
  selectedProducts: string[];
  availableProducts: Product[];
  productTableItems: ProductRow[];
  products: CustomProduct[];
  loadingProducts: boolean;
  isProductDropdownOpen: boolean;
  productSearchQuery: string;
  note: string;
  deleteModal: {
    isOpen: boolean;
    itemId: string;
    type: "product" | "tableItem";
  };
  onProductModeChange: (mode: "orderItems" | "productList") => void;
  onProductDropdownToggle: () => void;
  onCloseProductDropdown: () => void;
  onProductSearchChange: (query: string) => void;
  onToggleProductSelection: (id: string) => void;
  onToggleSelectAll: () => void;
  onRemoveSelectedProduct: (id: string) => void;
  onProductChange: (id: string, field: string, value: any) => void;
  onCustomProductChange: (
    id: string,
    field: "name" | "quantity" | "price",
    value: string
  ) => void;
  onAddProduct: () => void;
  onRemoveProduct: (id: string) => void;
  onRemoveProductTableItem: (id: string) => void;
  onOpenDeleteModal: (id: string, type: "product" | "tableItem") => void;
  onCloseDeleteModal: () => void;
  onConfirmDelete: () => void;
  onNoteChange: (value: string) => void;
}

export default function ProductSection({
  productSubmissionMode,
  selectedProducts,
  availableProducts,
  productTableItems,
  products,
  loadingProducts,
  isProductDropdownOpen,
  productSearchQuery,
  note,
  deleteModal,
  onProductModeChange,
  onProductDropdownToggle,
  onCloseProductDropdown,
  onProductSearchChange,
  onToggleProductSelection,
  onToggleSelectAll,
  onRemoveSelectedProduct,
  onProductChange,
  onCustomProductChange,
  onAddProduct,
  onRemoveProduct,
  onRemoveProductTableItem,
  onOpenDeleteModal,
  onCloseDeleteModal,
  onConfirmDelete,
  onNoteChange,
}: ProductSectionProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  console.log(productTableItems);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onCloseProductDropdown();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onCloseProductDropdown]);

  const filteredProducts = availableProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
      (product.alias &&
        product.alias.toLowerCase().includes(productSearchQuery.toLowerCase()))
  );

  const isAllSelected =
    filteredProducts.length > 0 &&
    selectedProducts.length === filteredProducts.length;

  return (
    <>
      <div className="flex flex-col gap-6">
        <h2 className="text-[24px] mt-6 font-medium text-black tracking-[0.505px]">
          Type of product
        </h2>

        <div className="flex flex-col gap-[18px]">
          <div className="flex items-center gap-3.5">
            <button
              onClick={() => onProductModeChange("orderItems")}
              className="flex items-center gap-3.5"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg width="25" height="24" viewBox="0 0 25 24" fill="none">
                  <circle
                    cx="12.1382"
                    cy="12"
                    r="10"
                    stroke={
                      productSubmissionMode === "orderItems"
                        ? "#FF5A01"
                        : "#D0D5DD"
                    }
                    strokeWidth="1.5"
                  />
                  {productSubmissionMode === "orderItems" && (
                    <circle
                      cx="12.168"
                      cy="12"
                      r="4.23"
                      fill="#FF5A01"
                      stroke="#FF5A01"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              </div>
              <span className="text-[18px] text-[#7C8BA0] leading-[140%] tracking-[-0.2px]">
                Product list
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3.5">
            <button
              onClick={() => onProductModeChange("productList")}
              className="flex items-center gap-3.5"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                  <circle
                    cx="12.1382"
                    cy="12.7236"
                    r="10"
                    stroke={
                      productSubmissionMode === "productList"
                        ? "#FF5A01"
                        : "#D0D5DD"
                    }
                    strokeWidth="1.5"
                  />
                  {productSubmissionMode === "productList" && (
                    <circle
                      cx="12.168"
                      cy="12.7237"
                      r="4.23"
                      fill="#FF5A01"
                      stroke="#FF5A01"
                      strokeWidth="1.5"
                    />
                  )}
                </svg>
              </div>
              <span className="text-[18px] text-[#7C8BA0] leading-[140%] tracking-[-0.2px]">
                New Product
              </span>
            </button>
          </div>
        </div>

        {productSubmissionMode === "orderItems" && (
          <div className="flex flex-col gap-0.5" ref={dropdownRef}>
            <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
              Product
            </label>
            <div className="relative">
              <button
                onClick={onProductDropdownToggle}
                className="h-[46px] w-full px-3.5 rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px] flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-wrap">
                  {selectedProducts.length === 0 ? (
                    <span className="text-[#1A1C1E]">select</span>
                  ) : (
                    selectedProducts.map((productId) => {
                      const product = availableProducts.find(
                        (p) => p.id === productId
                      );
                      if (!product) return null;
                      return (
                        <div
                          key={productId}
                          className="flex items-center gap-5 px-2.5 py-1 rounded-lg bg-[rgba(255,90,1,0.2)]"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span className="text-xs text-black">
                            {product.alias}
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveSelectedProduct(productId);
                            }}
                            className="flex items-center justify-center cursor-pointer hover:opacity-75"
                          >
                            <X className="w-4 h-4 text-[#FF5A01]" />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
                <ChevronDown
                  className={`transition-transform ${
                    isProductDropdownOpen ? "rotate-180" : ""
                  } w-6 h-6 text-black`}
                />
              </button>

              {isProductDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] z-10 max-h-[289px] overflow-auto">
                  <div className="p-3.5 flex flex-col gap-2.5">
                    <div className="px-3 py-2 rounded-lg bg-[rgba(255,90,1,0.1)]">
                      <input
                        type="text"
                        placeholder="search"
                        value={productSearchQuery}
                        onChange={(e) => onProductSearchChange(e.target.value)}
                        className="w-full bg-transparent text-sm text-[#7C8BA0] leading-[140%] tracking-[-0.14px] outline-none placeholder:text-[#7C8BA0]"
                      />
                    </div>

                    <button
                      onClick={onToggleSelectAll}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-[18px] h-[18px] rounded-[4px] border border-[#D0D5DD] bg-[#F7FAFF] flex items-center justify-center">
                        {isAllSelected && (
                          <Check className="w-4 h-4 text-[#FF5A01]" />
                        )}
                      </div>
                      <span className="text-sm text-[#1A1C1E] leading-[140%] tracking-[-0.14px]">
                        Select all
                      </span>
                    </button>

                    {loadingProducts ? (
                      <div className="text-sm text-[#7C8BA0] px-3 py-2">
                        Loading...
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="text-sm text-[#7C8BA0] px-3 py-2">
                        No products
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => onToggleProductSelection(product.id)}
                          className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-[18px] h-[18px] rounded-[5.4px] border border-[#FF5A01] bg-[#FF5A01] flex items-center justify-center">
                            {selectedProducts.includes(product.id) && (
                              <Check className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm text-[#1A1C1E] leading-[140%] tracking-[-0.14px]">
                            {product.alias || product.name}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedProducts.length > 0 && (
              <div className="mt-3 rounded-xl bg-white p-5 md:p-8">
                <div className="flex flex-col gap-4">
                  {productTableItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
                    >
                      <div className="flex flex-col md:flex-row gap-4 flex-1">
                        <div className="flex flex-col gap-0.5 flex-1">
                          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                            Product name
                          </label>
                          <div className="text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]">
                            {item.productName}
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                            Product Alias
                          </label>
                          <div className="text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px] capitalize">
                            {item.productAlias || "—"}
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                            Category
                          </label>
                          <div className="text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]">
                            {item.category || "—"}
                          </div>
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                            Price
                          </label>
                          <input
                            type="text"
                            value={String(item.unitPrice ?? "")}
                            onChange={(e) =>
                              onProductChange(
                                item.id,
                                "unitPrice",
                                e.target.value
                              )
                            }
                            className="h-[46px] px-3.5 rounded-[10px] border border-[#EDF1F3] bg-[#F7F7FB] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
                          />
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1">
                          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                            Quantity
                          </label>
                          <input
                            type="text"
                            value={item.quantity}
                            onChange={(e) =>
                              onProductChange(
                                item.id,
                                "quantity",
                                e.target.value
                              )
                            }
                            className="h-[46px] px-3.5 rounded-[10px] border border-[#EDF1F3] bg-[#F7F7FB] shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
                          />
                        </div>
                      </div>
                      <button
                        onClick={() => onOpenDeleteModal(item.id, "tableItem")}
                        className="p-2 rounded-[10px] bg-[rgba(255,0,0,0.2)] hover:bg-[rgba(255,0,0,0.3)] transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-[#FF0000]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {productSubmissionMode === "productList" && (
          <div className="flex flex-col gap-3">
            {products.length === 0 && (
              <button
                onClick={onAddProduct}
                className="p-2 rounded-[10px] flex justify-center items-center text-center bg-[rgba(0,255,43,0.2)] hover:bg-[rgba(0,255,43,0.3)] transition-colors"
              >
                <Plus className="w-5 h-5 text-[#007213]" />
              </button>
            )}
            {products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col md:flex-row items-end gap-2"
              >
                <div className="flex-1 flex flex-col md:flex-row gap-1.5 w-full">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                      Product
                    </label>
                    <input
                      type="text"
                      value={product.name}
                      onChange={(e) =>
                        onCustomProductChange(
                          product.id,
                          "name",
                          e.target.value
                        )
                      }
                      className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
                    />
                  </div>
                  <div className="w-full md:w-[180px] flex flex-col gap-0.5">
                    <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                      Quantity
                    </label>
                    <input
                      type="text"
                      value={product.quantity}
                      onChange={(e) =>
                        onCustomProductChange(
                          product.id,
                          "quantity",
                          e.target.value
                        )
                      }
                      className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
                    />
                  </div>
                  <div className="w-full md:w-[180px] flex flex-col gap-0.5">
                    <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
                      Price
                    </label>
                    <input
                      type="text"
                      value={product.price}
                      onChange={(e) =>
                        onCustomProductChange(
                          product.id,
                          "price",
                          e.target.value
                        )
                      }
                      className="h-[46px] px-3.5 py-[18px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px]"
                    />
                  </div>
                </div>
                <div className="flex gap-[2.689px] self-end mb-1.5 md:self-auto">
                  <button
                    onClick={() => onOpenDeleteModal(product.id, "product")}
                    className="p-2 rounded-[10px] bg-[rgba(255,0,0,0.2)] hover:bg-[rgba(255,0,0,0.3)] transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-[#FF0000]" />
                  </button>
                  <button
                    onClick={onAddProduct}
                    className="p-2 rounded-[10px] bg-[rgba(0,255,43,0.2)] hover:bg-[rgba(0,255,43,0.3)] transition-colors"
                  >
                    <Plus className="w-5 h-5 text-[#007213]" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-0.5">
          <label className="text-xs font-medium text-[#7C8BA0] leading-[160%] tracking-[-0.24px] font-['Plus_Jakarta_Sans']">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => onNoteChange(e.target.value)}
            className="h-[107px] px-3.5 py-[27px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-sm font-medium text-[#1A1C1E] leading-[140%] tracking-[-0.14px] resize-none"
          />
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={onCloseDeleteModal}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
