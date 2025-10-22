import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
}

interface ProductSelectorProps {
  availableProducts: Product[];
  selectedProducts: string[];
  onProductToggle: (productId: string) => void;
  onSelectAll: (ids?: string[]) => void;
  onRemoveProduct: (productId: string) => void;
}

export default function ProductSelector({
  availableProducts,
  selectedProducts,
  onProductToggle,
  onSelectAll,
  onRemoveProduct,
}: ProductSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setIsOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filtered = availableProducts.filter((p) =>
    p.name.toLowerCase().includes(normalizedSearch)
  );

  const allFilteredSelected =
    filtered.length > 0 &&
    filtered.every((p) => selectedProducts.includes(p.id));

  return (
    <div ref={containerRef} className="space-y-3 w-full">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setIsOpen((s) => !s);
        }}
        className="w-full min-h-[46px] bg-white border border-delivery-stroke shadow-sm rounded-lg px-4 py-3 flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen((s) => !s)}
      >
        <div className="flex items-center gap-2 flex-wrap">
          {selectedProducts.length === 0 ? (
            <span className="text-sm font-medium text-delivery-dark font-inter">
              Sélectionner
            </span>
          ) : (
            selectedProducts.map((id) => {
              const p = availableProducts.find((x) => x.id === id);
              return (
                <div
                  key={id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-delivery-orange bg-opacity-10 rounded-lg"
                >
                  <span className="text-sm font-medium text-delivery-dark font-inter">
                    {p?.name ?? id}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveProduct(id);
                    }}
                    aria-label={`Supprimer ${p?.name ?? id}`}
                    className="w-5 h-5 flex items-center justify-center hover:bg-delivery-orange hover:bg-opacity-20 rounded-full transition-colors"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 18L18 6M6 6l12 12"
                        stroke="#FF5A01"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              );
            })
          )}
        </div>

        <ChevronDown
          className={cn(
            "w-5 h-5 text-black transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </div>

      {isOpen && (
        <div className="bg-white rounded-lg border border-delivery-stroke shadow-lg p-4 space-y-3">
          <div className="flex items-center gap-3 h-10 px-3 rounded-lg bg-delivery-orange bg-opacity-10">
            <input
              type="text"
              placeholder="Rechercher"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 bg-transparent text-sm font-medium text-delivery-gray placeholder:text-delivery-gray font-inter focus:outline-none"
            />
            <button
              onClick={() => {
                setSearchTerm("");
              }}
              className="text-sm text-delivery-orange px-2 py-1 rounded"
            >
              Reset
            </button>
          </div>

          <div
            role="button"
            onClick={() => onSelectAll(filtered.map((p) => p.id))}
            className="flex items-center gap-3 h-10 px-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <div
                className={cn(
                  "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                  allFilteredSelected
                    ? "border-delivery-orange bg-delivery-orange"
                    : "border-gray-300 bg-gray-50"
                )}
              >
                {allFilteredSelected && (
                  <Check className="w-3 h-3 text-white" strokeWidth={2} />
                )}
              </div>
            </div>
            <span className="text-sm font-medium text-delivery-dark font-inter">
              Tout sélectionner
            </span>
          </div>

          <div className="max-h-64 overflow-auto space-y-1">
            {filtered.length === 0 ? (
              <div className="text-sm text-gray-500 px-2 py-3">
                Aucun produit
              </div>
            ) : (
              filtered.map((product) => {
                const isSelected = selectedProducts.includes(product.id);
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 h-10 px-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => onProductToggle(product.id)}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
                          isSelected
                            ? "border-delivery-orange bg-delivery-orange"
                            : "border-gray-300 bg-gray-50"
                        )}
                      >
                        {isSelected && (
                          <Check
                            className="w-3 h-3 text-white"
                            strokeWidth={2}
                          />
                        )}
                      </div>
                    </div>
                    <span className="text-sm font-medium text-delivery-dark font-inter">
                      {product.name}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
