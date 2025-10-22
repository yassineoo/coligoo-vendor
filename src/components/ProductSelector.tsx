"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function ProductSelector({
  availableProducts = [],
  selectedProducts = [],
  onProductToggle,
  onSelectAll,
  onRemoveProduct,
}: {
  availableProducts: { id: string; name: string }[];
  selectedProducts: string[];
  onProductToggle: (id: string) => void;
  onSelectAll: () => void;
  onRemoveProduct: (name: string) => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <button onClick={onSelectAll} className="px-3 py-2 rounded-lg border">
          Toggle all
        </button>
        <div className="flex gap-2 flex-wrap">
          {selectedProducts.map((s) => (
            <motion.div
              key={s}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-2 py-1 rounded-full bg-gray-100 flex items-center gap-2"
            >
              <span className="text-sm">{s}</span>
              <button
                onClick={() => onRemoveProduct(s)}
                className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center"
              >
                ✕
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {availableProducts.map((p) => {
          const selected = selectedProducts.includes(p.id);
          return (
            <motion.button
              key={p.id}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border flex items-center justify-between ${
                selected ? "bg-delivery-orange text-white" : "bg-white"
              }`}
              onClick={() => onProductToggle(p.id)}
            >
              <span className="truncate">{p.name}</span>
              {selected && <Check className="w-4 h-4" />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
