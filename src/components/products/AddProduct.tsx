"use client";

import React, { useState } from "react";
import { Input } from "@/components/interface/input";
import { Label } from "@/components/interface/label";
import { Textarea } from "@/components/interface/textarea";
import { Checkbox } from "@/components/interface/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/interface/select";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import productsApi from "@/app/api/products";
import { toast, useToast } from "@/../hooks/use-toast";

export default function AddProduct() {
  useToast();
  const router = useRouter();
  const [hasVariables, setHasVariables] = useState(false);
  const [showAliasInOrder, setShowAliasInOrder] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<any>();
  const [variants, setVariants] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "GST2139",
    alias: "watch",
    description: "Water resistant",
    price: "00",
    quantity: "00",
  });
  const categories: any[] = [
    "Electronic",
    "Fashion & Apparel",
    "Home & Kitchen",
    "Groceries & Food",
  ];

  const handleAddVariant = () => {
    setVariants((v) => [
      ...v,
      {
        id: Date.now().toString(),
        typeName: "Ex: Color",
        typeValue: "Ex: Blue",
        typePrice: 7400,
        quantity: 9,
      },
    ]);
  };

  const handleVariantChange = (index: number, field: string, value: any) => {
    setVariants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (submitting) return;
    if (!formData.name || !formData.alias || !selectedCategory) {
      toast({
        title: "Missing fields",
        description: "Name, alias and category are required",
      });
      return;
    }
    setSubmitting(true);
    const t = toast({
      title: "Creating product",
      description: "Please wait...",
    });
    try {
      const payload: Record<string, any> = {
        product_name: formData.name,
        product_alias: formData.alias,
        category: selectedCategory,
        description: formData.description,
        price: formData.price,
        quantity: formData.quantity,
        has_variables: hasVariables,
        show_alias_in_order: showAliasInOrder ? 1 : 0,
      };
      if (hasVariables && variants.length > 0)
        payload.variables = JSON.stringify(variants);
      const res = await productsApi.createProduct(payload);
      t.update({
        title: "Product created",
        description: "Product created successfully",
      });
      router.push("/dashboard/products");
      return res;
    } catch (err: any) {
      const body = err?.body ?? err;
      const message =
        (Array.isArray(body?.message) && body.message.join(", ")) ||
        body?.message ||
        body?.fr ||
        body?.ar ||
        err?.message ||
        "Failed to create product";
      t.update({ title: "Creation failed", description: String(message) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-delivery-bg flex">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 p-6">
          <div className="flex items-center mb-6">
            <div className="w-8 h-8 bg-delivery-orange rounded-lg flex items-center justify-center mr-4">
              <ChevronLeft className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-medium text-gray-900 tracking-wide">
              Add Product
            </h1>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-100 rounded-xl p-12 max-w-4xl mx-auto"
          >
            <h2 className="text-2xl font-medium text-gray-900 mb-8 tracking-wide">
              Product information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="text-sm text-delivery-gray font-medium"
                >
                  Product name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-white border-delivery-stroke"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="alias"
                  className="text-sm text-delivery-gray font-medium"
                >
                  Product Alias
                </Label>
                <Input
                  id="alias"
                  value={formData.alias}
                  onChange={(e) =>
                    setFormData({ ...formData, alias: e.target.value })
                  }
                  className="bg-white border-delivery-stroke"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="category"
                  className="text-sm text-delivery-gray font-medium"
                >
                  Category
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={(value) => setSelectedCategory(value as any)}
                >
                  <SelectTrigger className="bg-white border-delivery-stroke">
                    <SelectValue placeholder="Electronic" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="text-sm text-delivery-gray font-medium"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="bg-white border-delivery-stroke min-h-[80px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <Label
                  htmlFor="price"
                  className="text-sm text-delivery-gray font-medium"
                >
                  Price
                </Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="bg-white border-delivery-stroke"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="quantity"
                  className="text-sm text-delivery-gray font-medium"
                >
                  Quantity
                </Label>
                <Input
                  id="quantity"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: e.target.value })
                  }
                  className="bg-white border-delivery-stroke"
                />
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="hasVariables"
                  checked={hasVariables}
                  onCheckedChange={(checked) => {
                    setHasVariables(checked as boolean);
                    if (checked && variants.length === 0) handleAddVariant();
                  }}
                  className="border-delivery-orange data-[state=checked]:bg-delivery-orange"
                />
                <Label
                  htmlFor="hasVariables"
                  className="text-lg text-delivery-gray"
                >
                  A product has variables
                </Label>
              </div>

              <div className="flex items-center space-x-3">
                <Checkbox
                  id="showAlias"
                  checked={showAliasInOrder}
                  onCheckedChange={(checked) =>
                    setShowAliasInOrder(checked as boolean)
                  }
                  className="border-delivery-orange data-[state=checked]:bg-delivery-orange"
                />
                <Label
                  htmlFor="showAlias"
                  className="text-lg text-delivery-gray"
                >
                  show Alias name in the order
                </Label>
              </div>
            </div>

            {hasVariables && (
              <div className="space-y-6 mb-8">
                {variants.map((variant, index) => (
                  <div
                    key={variant.id}
                    className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-white rounded-lg border"
                  >
                    <div className="space-y-2">
                      <Label className="text-sm text-delivery-gray font-medium">
                        Type name
                      </Label>
                      <Input
                        value={variant.typeName}
                        onChange={(e) =>
                          handleVariantChange(index, "typeName", e.target.value)
                        }
                        className="bg-white border-delivery-stroke"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-delivery-gray font-medium">
                        Type value
                      </Label>
                      <Input
                        value={variant.typeValue}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "typeValue",
                            e.target.value
                          )
                        }
                        className="bg-white border-delivery-stroke"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-delivery-gray font-medium">
                        Type price
                      </Label>
                      <Input
                        value={String(variant.typePrice)}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "typePrice",
                            Number(e.target.value)
                          )
                        }
                        className="bg-white border-delivery-stroke"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm text-delivery-gray font-medium">
                        Quantity
                      </Label>
                      <Input
                        value={String(variant.quantity)}
                        onChange={(e) =>
                          handleVariantChange(
                            index,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="bg-white border-delivery-stroke"
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddVariant}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Add Variant
                  </button>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-delivery-orange hover:bg-orange-600 text-white px-8 py-3 rounded-xl"
              >
                {submitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
