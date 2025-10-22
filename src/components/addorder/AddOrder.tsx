// AddOrder.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createOrder as createOrderApi } from "@/app/api/orders";
import { getProducts } from "@/app/api/products";
import CustomerInfo from "./CustomerInfo";
import ProductSection from "./ProductSection";
import ValidationSection from "./ValidationSection";

type Wilaya = { code: string | number; name: string; ar_name?: string };
type City = { id: number; name: string; ar_name?: string };

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

interface Product {
  id: string;
  name: string;
  alias?: string;
  category?: string;
  price?: number;
  productCode?: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  phone1: string;
  phone2: string;
  fullAddress: string;
  note: string;
  returnFees: string;
  deliveryCosts: string;
  discount: string;
  totalToCollect: string;
  weight: string;
  height: string;
  width: string;
  length: string;
}

export default function AddOrder() {
  const router = useRouter();

  const [productSubmissionMode, setProductSubmissionMode] = useState<
    "orderItems" | "productList"
  >("orderItems");

  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [availableProductsLocal, setAvailableProductsLocal] = useState<
    Product[]
  >([]);
  const [productTableItems, setProductTableItems] = useState<ProductRow[]>([]);
  const [products, setProducts] = useState<CustomProduct[]>([]);

  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [toCities, setToCities] = useState<City[]>([]);

  const [toWilayaCode, setToWilayaCode] = useState<string | null>(null);
  const [toCityId, setToCityId] = useState<number | null>(null);

  const [loadingWilayas, setLoadingWilayas] = useState(false);
  const [loadingToCities, setLoadingToCities] = useState(false);

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    itemId: string;
    type: "product" | "tableItem";
  }>({ isOpen: false, itemId: "", type: "product" });

  const [orderType, setOrderType] = useState<"domicile" | "stopdesk">(
    "domicile"
  );
  const [paymentType, setPaymentType] = useState<"normal" | "exchange">(
    "normal"
  );

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phone1: "",
    phone2: "",
    fullAddress: "",
    note: "",
    returnFees: "0",
    deliveryCosts: "0",
    discount: "0",
    totalToCollect: "0",
    weight: "0",
    height: "0",
    width: "0",
    length: "0",
  });

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadedProducts, setLoadedProducts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [isProductDropdownOpen, setIsProductDropdownOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState("");

  function buildUrl(path: string) {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
      /\/+$/,
      ""
    );
    if (!base) return path;
    if (/^https?:\/\//.test(path)) return path;
    return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
  }

  function getAuthToken() {
    try {
      if (typeof window === "undefined") return null;
      return localStorage.getItem("app_token");
    } catch {
      return null;
    }
  }

  const fetchProducts = useCallback(() => {
    if (loadedProducts) return;
    setLoadingProducts(true);
    getProducts({ limit: 200 })
      .then((body) => {
        const rows: any[] = Array.isArray(body) ? body : body?.data ?? [];
        setAvailableProductsLocal(
          rows.map((p: any) => ({
            id: String(p.id),
            name:
              p.productName ??
              p.product_name ??
              p.name ??
              p.title ??
              String(p.id),
            alias: p.productAlias ?? p.alias ?? p.product_alias ?? "",
            category: p.category ?? p.category_name ?? "",
            price: p.price ? Number(p.price) : undefined,
            productCode: p.product_code ?? "",
          }))
        );
        setLoadedProducts(true);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoadingProducts(false);
      });
  }, [loadedProducts]);

  useEffect(() => {
    if (isProductDropdownOpen) {
      fetchProducts();
    }
  }, [isProductDropdownOpen, fetchProducts]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingWilayas(true);
      try {
        const url = buildUrl("/api/v1/wilaya");
        const token = getAuthToken();
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!mounted) return;
        setWilayas(Array.isArray(body) ? body : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWilayas(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!toWilayaCode) {
      setToCities([]);
      setToCityId(null);
      return;
    }
    let mounted = true;
    (async () => {
      setLoadingToCities(true);
      try {
        const url = buildUrl(`/api/v1/wilaya/${toWilayaCode}/cities`);
        const token = getAuthToken();
        const res = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = await res.json();
        if (!mounted) return;
        const list = Array.isArray(body) ? body : [];
        setToCities(list);
        if (list.length === 1) setToCityId(list[0].id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingToCities(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [toWilayaCode]);

  useEffect(() => {
    const newList: ProductRow[] = [];
    for (const id of selectedProducts) {
      const existing = productTableItems.find(
        (it) =>
          String(it.id) === id || (it.productName && it.productName === id)
      );
      if (existing) newList.push(existing);
      else {
        const prod =
          availableProductsLocal.find((p) => String(p.id) === id) || null;
        if (prod) {
          newList.push({
            id,
            productId: Number(prod.id),
            productName: prod.name,
            productAlias: prod.alias,
            category: prod.category,
            unitPrice: prod.price,
            quantity: "1",
          });
        }
      }
    }
    setProductTableItems(newList);
  }, [selectedProducts, availableProductsLocal]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleWilayaChange = (code: string | null) => {
    setToWilayaCode(code);
    setToCityId(null);
  };

  const handleProductChange = (id: string, field: string, value: any) => {
    setProductTableItems((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const handleCustomProductChange = (
    id: string,
    field: "name" | "quantity" | "price",
    value: string
  ) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const addProduct = () => {
    const newProduct: CustomProduct = {
      id: Date.now().toString(),
      name: "",
      quantity: "",
      price: "",
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const removeProductTableItem = (id: string) => {
    setProductTableItems((prev) => prev.filter((item) => item.id !== id));
    setSelectedProducts((prev) => prev.filter((x) => x !== id));
  };

  const openDeleteModal = (id: string, type: "product" | "tableItem") => {
    setDeleteModal({ isOpen: true, itemId: id, type });
  };

  const handleDeleteConfirm = () => {
    if (deleteModal.type === "product") removeProduct(deleteModal.itemId);
    else if (deleteModal.type === "tableItem")
      removeProductTableItem(deleteModal.itemId);
    setDeleteModal({ isOpen: false, itemId: "", type: "product" });
  };

  const removeSelectedProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleSelectAll = () => {
    const filteredProducts = availableProductsLocal.filter(
      (product) =>
        product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
        (product.alias &&
          product.alias
            .toLowerCase()
            .includes(productSearchQuery.toLowerCase()))
    );
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const subtotalNumber = useMemo(() => {
    const tableTotal = productTableItems.reduce((s, it) => {
      const priceNum = Number(it.unitPrice || 0) || 0;
      const qty = Number(it.quantity || 0) || 0;
      return s + priceNum * qty;
    }, 0);
    const customTotal = products.reduce((s, p) => {
      const priceNum =
        Number(String(p.price ?? "").replace(/[^0-9.-]+/g, "")) || 0;
      const qty = Number(p.quantity || 0) || 0;
      return s + priceNum * qty;
    }, 0);
    return tableTotal + customTotal;
  }, [productTableItems, products]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    if (!toCityId) {
      setError("Please select the destination city.");
      setSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      const orderId = `ORD-${new Date().getTime()}`;

      const productListFromCustom = products
        .filter((c) => c.name && Number(c.quantity) > 0)
        .map((c) => ({ name: c.name, quantity: Number(c.quantity) }));

      const orderItemsDetailed = productTableItems.map((it) => ({
        productId: it.productId ?? undefined,
        productName: it.productName,
        quantity: Number(it.quantity || 0) || 1,
        unitPrice:
          it.unitPrice !== undefined && it.unitPrice !== null
            ? Number(
                String(it.unitPrice).replace?.(/[^0-9.-]+/g, "") ?? it.unitPrice
              ) || undefined
            : undefined,
        totalPrice:
          (Number(String(it.unitPrice ?? 0).replace?.(/[^0-9.-]+/g, "") || 0) ||
            0) * (Number(it.quantity || 0) || 0) || undefined,
        size: it.size ?? undefined,
        color: it.color ?? undefined,
        itemNote: it.itemNote ?? undefined,
      }));

      const customItemsDetailed = products
        .filter((c) => c.name)
        .map((c) => ({
          productId: undefined,
          productName: c.name,
          quantity: Number(c.quantity || 0) || 1,
          unitPrice:
            Number(String(c.price ?? "").replace(/[^0-9.-]+/g, "")) ||
            undefined,
          totalPrice:
            (Number(String(c.price ?? "").replace(/[^0-9.-]+/g, "")) || 0) *
              (Number(c.quantity || 0) || 0) || undefined,
        }));

      const combinedOrderItems = [
        ...orderItemsDetailed,
        ...customItemsDetailed,
      ].filter(Boolean);

      const payload: any = {
        orderId,
        firstname: formData.firstName || "",
        lastName: formData.lastName || "",
        contactPhone: formData.phone1 || "",
        contactPhone2: formData.phone2 || null,
        address: formData.fullAddress || "",
        note: formData.note || "",
        toCityId: Number(toCityId),
        price: subtotalNumber > 0 ? subtotalNumber : 0.01,
        weight: formData.weight ? Number(formData.weight) : null,
        height: formData.height ? Number(formData.height) : null,
        width: formData.width ? Number(formData.width) : null,
        length: formData.length ? Number(formData.length) : null,
        isStopDesk: orderType === "stopdesk",
        freeShipping: false,
        hasExchange: paymentType === "exchange",
        paymentType:
          paymentType === "normal" ? "cash_on_delivery" : "cash_on_delivery",
      };

      if (productSubmissionMode === "orderItems") {
        if (!combinedOrderItems || combinedOrderItems.length === 0) {
          throw new Error("Add at least one detailed item from catalog.");
        }
        payload.orderItems = combinedOrderItems;
        payload.productList = null;
      } else {
        if (!productListFromCustom || productListFromCustom.length === 0) {
          throw new Error("Add at least one product to the list.");
        }
        payload.productList = productListFromCustom;
        payload.orderItems = null;
      }

      if (typeof createOrderApi === "function") {
        await createOrderApi(payload as any);
      } else {
        const token = getAuthToken();
        const url = buildUrl("/api/v1/orders");
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          let errText = `HTTP ${res.status}`;
          try {
            const json = await res.json();
            if (json?.message) {
              if (Array.isArray(json.message))
                errText = json.message.join(" • ");
              else errText = String(json.message);
            } else if (json?.error) errText = String(json.error);
          } catch {
            const txt = await res.text().catch(() => null);
            if (txt) errText = txt;
          }
          throw new Error(errText);
        }
      }

      setSuccess("Order created successfully");
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        phone1: "",
        phone2: "",
        fullAddress: "",
        note: "",
      }));
      setToWilayaCode(null);
      setToCityId(null);
      setSelectedProducts([]);
      setProductTableItems([]);
      setProducts([]);
      setAvailableProductsLocal([]);
      setLoadedProducts(false);
      setIsProductDropdownOpen(false);
      router.push("/dashboard/order-lists");
    } catch (err: any) {
      setError(err?.message ?? "Error creating the order");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => router.push("/dashboard/order-lists");

  return (
    <div className="min-h-screen p-6">
      <div className="w-full">
        <div className="flex flex-col gap-16 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="w-[34px] h-[34px] rounded-xl bg-delivery-orange shadow-sm flex items-center justify-center transition-colors"
              aria-label="Retour"
            >
              <img src="/icons/arrow-left.svg" className="w-[14px]" />
            </button>
            <h1
              className="font-medium text-black mb-0"
              style={{ fontSize: "20px" }}
            >
              Create order
            </h1>
          </div>
        </div>
        <div className="p-12 bg-[#F1F1F1] rounded-l">
          <CustomerInfo
            formData={formData}
            wilayas={wilayas}
            toCities={toCities}
            toWilayaCode={toWilayaCode}
            toCityId={toCityId}
            loadingWilayas={loadingWilayas}
            loadingToCities={loadingToCities}
            onInputChange={handleInputChange}
            onWilayaChange={handleWilayaChange}
            onCityChange={setToCityId}
          />

          <ProductSection
            productSubmissionMode={productSubmissionMode}
            selectedProducts={selectedProducts}
            availableProducts={availableProductsLocal}
            productTableItems={productTableItems}
            products={products}
            loadingProducts={loadingProducts}
            isProductDropdownOpen={isProductDropdownOpen}
            productSearchQuery={productSearchQuery}
            note={formData.note}
            deleteModal={deleteModal}
            onProductModeChange={setProductSubmissionMode}
            onProductDropdownToggle={() =>
              setIsProductDropdownOpen((prev) => !prev)
            }
            onCloseProductDropdown={() => setIsProductDropdownOpen(false)}
            onProductSearchChange={setProductSearchQuery}
            onToggleProductSelection={toggleProductSelection}
            onToggleSelectAll={toggleSelectAll}
            onRemoveSelectedProduct={removeSelectedProduct}
            onProductChange={handleProductChange}
            onCustomProductChange={handleCustomProductChange}
            onAddProduct={addProduct}
            onRemoveProduct={removeProduct}
            onRemoveProductTableItem={removeProductTableItem}
            onOpenDeleteModal={openDeleteModal}
            onCloseDeleteModal={() =>
              setDeleteModal({ isOpen: false, itemId: "", type: "product" })
            }
            onConfirmDelete={handleDeleteConfirm}
            onNoteChange={(v) => handleInputChange("note", v)}
          />

          <ValidationSection
            orderType={orderType}
            paymentType={paymentType}
            formData={formData}
            subtotalNumber={subtotalNumber}
            onOrderTypeChange={setOrderType}
            onPaymentTypeChange={setPaymentType}
            onInputChange={handleInputChange}
          />

          <div className="flex justify-center gap-4 pt-6">
            <button
              onClick={handleCancel}
              className="w-[118px] h-12 flex items-center justify-center rounded-[12.857px] bg-[#E1E1E1] hover:bg-[#d5d5d5] transition-colors"
            >
              <span className="text-[17px] font-medium text-black tracking-[0.429px]">
                Cancel
              </span>
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-[116px] h-12 flex items-center justify-center rounded-[15px] border-2 border-[#FF5A01] bg-[#FF5A01] hover:bg-[#e55101] transition-colors disabled:opacity-50"
            >
              <span className="text-base font-medium text-white leading-6 tracking-[0.5px]">
                {submitting ? "Submitting..." : "Validate"}
              </span>
            </button>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-100 border border-red-400 flex items-center justify-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-800 text-sm font-medium text-center">
                {error}
              </span>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 rounded-xl bg-green-100 border border-green-400 flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-800 text-sm font-medium text-center">
                {success}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
