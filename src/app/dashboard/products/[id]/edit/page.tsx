"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import productsApi from "@/app/api/products";
import { Input } from "@/components/interface/input";
import { Textarea } from "@/components/interface/textarea";
import { Label } from "@/components/interface/label";
import { Button } from "@/components/interface/button";
import { Check, Plus, Trash2, AlertCircle } from "lucide-react";
import { LoaderComponent } from "@/components/loader/Loader";

type Variation = {
  id?: string;
  name: string;
  price: string | number;
  quantity: string | number;
};

export default function ProductEditPage() {
  const params = useParams() as { id?: string };
  const id = params?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [productName, setProductName] = useState("");
  const [productAlias, setProductAlias] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [description, setDescription] = useState("");
  const [variations, setVariations] = useState<Variation[]>([]);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    setError(null);
    try {
      const resp = await productsApi.getProductById(id);
      const p = resp?.data ?? resp;
      setProductName(p?.productName ?? p?.name ?? "");
      setProductAlias(p?.productAlias ?? p?.alias ?? "");
      setCategory(p?.category ?? "");
      setPrice(
        p?.price !== undefined && p?.price !== null ? String(p.price) : ""
      );
      setQuantity(
        p?.quantity !== undefined && p?.quantity !== null
          ? String(p.quantity)
          : ""
      );
      setDescription(p?.description ?? "");

      let vars: Variation[] = [];
      if (
        p?.variants &&
        typeof p.variants === "object" &&
        !Array.isArray(p.variants)
      ) {
        vars = Object.entries(p.variants).map(([key, v]: any, i) => ({
          id: key,
          name: v?.name ?? v?.color ?? "",
          price: v?.price ?? "",
          quantity: v?.quantity ?? v?.qty ?? "",
        }));
      } else if (Array.isArray(p?.variables)) {
        vars = p.variables.map((v: any, i: number) => ({
          id: v.id ?? String(i),
          name: v.name ?? v.color ?? "",
          price: v.price ?? "",
          quantity: v.quantity ?? v.qty ?? "",
        }));
      }
      setVariations(vars);
    } catch (err: any) {
      setError(
        err?.body?.message ??
          err?.message ??
          "Erreur lors du chargement du produit"
      );
    } finally {
      setLoading(false);
    }
  }

  function addVariation() {
    setVariations((p) => [
      ...p,
      { id: Date.now().toString(), name: "", price: "", quantity: "" },
    ]);
  }

  function updateVariation(idx: number, patch: Partial<Variation>) {
    setVariations((p) => p.map((v, i) => (i === idx ? { ...v, ...patch } : v)));
  }

  function removeVariation(idx: number) {
    setVariations((p) => p.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!id) return;
    setSaving(true);
    setError(null);
    try {
      const variantsObj =
        variations.length > 0
          ? variations.reduce<Record<string, any>>((acc, v) => {
              const key = v.id ?? Date.now().toString();
              acc[key] = {
                name: v.name || undefined,
                price:
                  v.price !== undefined && v.price !== ""
                    ? Number(v.price)
                    : undefined,
                quantity:
                  v.quantity !== undefined && v.quantity !== ""
                    ? Number(v.quantity)
                    : undefined,
              };
              return acc;
            }, {})
          : undefined;

      const payload: Record<string, any> = {
        productName: productName || undefined,
        productAlias: productAlias || undefined,
        category: category || undefined,
        description: description || undefined,
        price: price !== "" ? Number(price) : undefined,
        quantity: quantity !== "" ? Number(quantity) : undefined,
        hasVariables: !!variantsObj,
        variants: variantsObj,
        showAliasInOrder: false,
      };

      await productsApi.updateProduct(id, payload);
      router.push(`/dashboard/products/${id}`);
    } catch (err: any) {
      setError(
        err?.body?.message ?? err?.message ?? "Erreur lors de la sauvegarde"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <LoaderComponent isLoading={loading} />;
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href={`/dashboard/products/${id}`}
              className="w-[34px] h-[34px] rounded-xl bg-delivery-orange shadow-sm flex items-center justify-center transition-colors"
            >
              <img src="/icons/arrow-left.svg" className="w-[14px]" />
            </Link>

            <h1
              className="text-[20px] font-bold text-gray-900"
              style={{ fontSize: "20px" }}
            >
              Edit Product
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/dashboard/products/${id}`)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-delivery-orange text-white rounded-xl disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center gap-2 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-800 text-sm font-medium text-center">
              {error}
            </span>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Product name
              </Label>
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Alias
              </Label>
              <Input
                value={productAlias}
                onChange={(e) => setProductAlias(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Category
              </Label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-4 pr-10 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer transition-all"
                >
                  <option value="">-- choose --</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Home & Garden">Home & Garden</option>
                  <option value="Sports & Outdoors">Sports & Outdoors</option>
                  <option value="Books">Books</option>
                  <option value="Toys & Games">Toys & Games</option>
                  <option value="Health & Beauty">Health & Beauty</option>
                  <option value="Automotive">Automotive</option>
                  <option value="Jewelry">Jewelry</option>
                  <option value="Food & Beverages">Food & Beverages</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
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
              </div>
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Price
              </Label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Quantity
              </Label>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                Description
              </Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Variations
              </h3>
              <Button
                type="button"
                onClick={addVariation}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-delivery-orange text-white rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Add Variation
              </Button>
            </div>
            {variations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No variations added yet
              </div>
            ) : (
              <div className="space-y-4">
                {variations.map((v, i) => (
                  <div
                    key={v.id ?? i}
                    className="flex gap-4 items-end p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex-1">
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Name
                      </Label>
                      <Input
                        value={v.name}
                        onChange={(e) =>
                          updateVariation(i, { name: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="w-32">
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Price
                      </Label>
                      <Input
                        value={String(v.price)}
                        onChange={(e) =>
                          updateVariation(i, { price: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <div className="w-28">
                      <Label className="text-xs font-semibold text-gray-700 mb-2 block">
                        Qty
                      </Label>
                      <Input
                        value={String(v.quantity)}
                        onChange={(e) =>
                          updateVariation(i, { quantity: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeVariation(i)}
                      className="w-10 h-10 rounded-xl bg-red-100 hover:bg-red-200 flex items-center justify-center transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
