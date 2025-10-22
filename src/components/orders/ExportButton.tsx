"use client";

import React, { useEffect, useRef, useState } from "react";
import { DownloadCloud } from "lucide-react";
import ordersApi from "@/app/api/orders";

type ExportButtonProps = {
  params?: Record<string, any>;
  fileName?: string;
  className?: string;
};

export default function ExportButton({
  params,
  fileName,
  className,
}: ExportButtonProps) {
  const [format, setFormat] = useState<"csv" | "excel">("csv");
  const [exporting, setExporting] = useState(false);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleExport = async (fmt: "csv" | "excel") => {
    try {
      setExporting(true);
      setOpen(false);
      const blob = await ordersApi.exportOrders(params ?? {}, fmt);
      const ext = fmt === "csv" ? "csv" : "xlsx";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName ?? "orders"}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error(err);
      alert(err?.message ?? "Erreur lors de l'export");
    } finally {
      setExporting(false);
    }
  };

  // close dropdown on outside click or Esc
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        disabled={exporting}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
      >
        <DownloadCloud className="w-4 h-4 mr-2" />
        {exporting ? "Export en cours…" : "Export"}
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Choisir le format d'export"
          className="absolute z-20 mt-2 w-48 rounded-md shadow-lg bg-white"
        >
          <div className="py-2 px-1">
            <button
              role="menuitem"
              onClick={() => {
                setFormat("csv");
                handleExport("csv");
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-b border-[#f2f2f2]`}
              disabled={exporting}
            >
              CSV
            </button>

            <button
              role="menuitem"
              onClick={() => {
                setFormat("excel");
                handleExport("excel");
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100`}
              disabled={exporting}
            >
              Excel (xlsx)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
