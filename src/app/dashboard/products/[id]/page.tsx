"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import productsApi from "@/app/api/products";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Tag,
  DollarSign,
  Hash,
  Image as ImageIcon,
  Palette,
  Scale,
} from "lucide-react";

export default function ProductViewPage() {
  const params = useParams() as { id?: string };
  const id = params?.id ?? "";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<any>(null);

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
      setProduct(p);
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

  async function handleDelete() {
    if (!id) return;
    if (!window.confirm("Supprimer ce produit ?")) return;
    setDeleting(true);
    try {
      await productsApi.deleteProduct(id);
      router.push("/dashboard/products");
    } catch (err: any) {
      alert(
        err?.body?.message ?? err?.message ?? "Erreur lors de la suppression"
      );
    } finally {
      setDeleting(false);
    }
  }

  function getVariationList(): Array<any> {
    if (!product) return [];

    if (
      product.variants &&
      typeof product.variants === "object" &&
      !Array.isArray(product.variants)
    ) {
      return Object.entries(product.variants).map(([key, v]: any) => ({
        id: key,
        name: v?.name ?? v?.color ?? "-",
        price: v?.price ?? "-",
        quantity: v?.quantity ?? v?.qty ?? "-",
      }));
    }

    if (Array.isArray(product.variables) && product.variables.length > 0) {
      return product.variables.map((v: any, i: number) => ({
        id: v.id ?? String(i),
        name: v?.name ?? v?.color ?? "-",
        price: v?.price ?? "-",
        quantity: v?.quantity ?? v?.qty ?? "-",
      }));
    }

    if (Array.isArray(product.variations) && product.variations.length > 0) {
      return product.variations.map((v: any, i: number) => ({
        id: v.id ?? String(i),
        name: v?.name ?? v?.color ?? "-",
        price: v?.price ?? "-",
        quantity: v?.quantity ?? v?.qty ?? "-",
      }));
    }

    return [];
  }

  function getImageSources(): string[] {
    if (!product) return [];

    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images
        .map((x: any) => {
          if (!x) return "";
          if (typeof x === "string") return x;
          return x.url ?? x.imageUrl ?? x.src ?? "";
        })
        .filter(Boolean);
    }

    if (Array.isArray(product.imagesUrl) && product.imagesUrl.length > 0) {
      return product.imagesUrl.filter(Boolean);
    }

    if (typeof product.image === "string" && product.image)
      return [product.image];
    if (typeof product.imageUrl === "string" && product.imageUrl)
      return [product.imageUrl];

    return [];
  }

  const variations = getVariationList();
  const imageSources = getImageSources();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 max-w-4xl">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/products"
              className="w-[34px] h-[34px] rounded-xl bg-delivery-orange shadow-sm flex items-center justify-center transition-colors"
              aria-label="Retour"
            >
              <img src="/icons/arrow-left.svg" className="w-[14px]" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {product?.productName ?? product?.name ?? "Détails du produit"}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href={`/dashboard/products/${id}/edit`}>
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-delivery-orange rounded-lg border border-delivery-orange  transition-colors">
                <Edit className="w-4 h-4" />
                Modifier
              </button>
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        </header>

        {error ? (
          <div className="p-6 bg-red-50 border border-red-200 rounded-xl mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        ) : !product ? (
          <div className="p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Aucun produit trouvé.</p>
          </div>
        ) : (
          <main className="space-y-6">
            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <Package className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Nom du produit
                        </h3>
                      </div>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      {product?.productName ?? product?.name ?? "-"}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-full">
                        <Tag className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          Catégorie
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">
                      {product?.category ?? "-"}
                    </p>
                  </div>

                  <div className="space-y-4 text-right lg:text-left">
                    <div className="flex items-center justify-between lg:justify-start gap-3">
                      <div className="p-2 bg-emerald-100 rounded-full">
                        <DollarSign className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Prix</h3>
                      </div>
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {product?.price !== undefined && product?.price !== null
                        ? `€${product.price}`
                        : "-"}
                    </p>
                  </div>

                  <div className="lg:col-span-3">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Hash className="w-5 h-5 text-gray-500" />
                      Alias
                    </h4>
                    <p className="text-sm text-gray-600">
                      {product?.productAlias ?? product?.alias ?? "-"}
                    </p>
                  </div>

                  <div className="lg:col-span-3">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Scale className="w-5 h-5 text-gray-500" />
                      Quantité en stock
                    </h4>
                    <p className="text-lg font-medium text-gray-900">
                      {product?.quantity ?? 0}
                    </p>
                  </div>

                  <div className="lg:col-span-3">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-gray-500" />
                      Description
                    </h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">
                      {product?.description ?? "-"}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Variations ({variations.length})
                </h2>
                {variations.length > 0 ? (
                  <div className="space-y-3">
                    {variations.map((v: any) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {v.name ?? "-"}
                          </h4>
                        </div>
                        <div className="text-right ml-4 space-y-1">
                          <p className="text-sm font-medium text-gray-900">
                            Prix: {v.price ?? "-"} €
                          </p>
                          <p className="text-sm text-gray-600">
                            Qté: {v.quantity ?? "-"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Palette className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    Aucune variation.
                  </div>
                )}
              </div>
            </section>

            <section className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Images ({imageSources.length})
                </h2>
                {imageSources.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageSources.map((src: string, i: number) => (
                      <div
                        key={i}
                        className="w-full aspect-square rounded-lg overflow-hidden border hover:shadow-md transition-shadow"
                      >
                        <img
                          src={src}
                          alt={`Image du produit ${i + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    Aucune image.
                  </div>
                )}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
