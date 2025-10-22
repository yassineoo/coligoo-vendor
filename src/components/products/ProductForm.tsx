"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/interface/input";
import { Textarea } from "@/components/interface/textarea";
import { Label } from "@/components/interface/label";
import { Button } from "@/components/interface/button";
import { Check, Plus, X, Trash2 } from "lucide-react";
import productsApi from "@/app/api/products";

type Variation = { id: string; name: string; price: string; qty: string };

export default function ProductForm() {
  const [productName, setProductName] = useState("");
  const [productAlias, setProductAlias] = useState("");
  const [category, setCategory] = useState("Electronics");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [variations, setVariations] = useState<Variation[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const addVariation = () =>
    setVariations((p) => [
      ...p,
      { id: Date.now().toString(), name: "", price: "", qty: "" },
    ]);
  const removeVariation = (id: string) =>
    setVariations((p) => p.filter((v) => v.id !== id));
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setImages((p) => [...p, ...Array.from(files)]);
    if (fileRef.current) fileRef.current.value = "";
  };
  const removeImage = (idx: number) =>
    setImages((p) => p.filter((_, i) => i !== idx));

  const resetForm = () => {
    setProductName("");
    setProductAlias("");
    setCategory("Electronics");
    setPrice("");
    setQuantity("");
    setDescription("");
    setVariations([]);
    setImages([]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const variantsObj =
        variations.length > 0
          ? variations.reduce<Record<string, any>>((acc, v) => {
              acc[v.id] = {
                name: v.name || undefined,
                price: v.price ? Number(v.price) : undefined,
                quantity: v.qty ? Number(v.qty) : undefined,
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

      if (images.length) {
        const fd = new FormData();
        fd.append("data", JSON.stringify(payload));
        images.forEach((f, i) => fd.append("images", f, f.name || `img-${i}`));
        await productsApi.createProduct(fd as unknown as Record<string, any>, images);
      } else {
        await productsApi.createProduct(payload);
      }

      setSuccess("Produit créé avec succès");
      resetForm();
    } catch (err: any) {
      setError(
        err?.body?.message ??
          err?.message ??
          "Erreur lors de la création du produit"
      );
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-md space-y-6"
    >
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3 bg-green-50 rounded-md text-green-800 border border-green-100"
          >
            {success}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <Label htmlFor="name" className="text-xs">
            Product name
          </Label>
          <Input
            id="name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="alias" className="text-xs">
            Alias
          </Label>
          <Input
            id="alias"
            value={productAlias}
            onChange={(e) => setProductAlias(e.target.value)}
          />
        </div>

        <div>
          <Label className="text-xs">Category</Label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 rounded-lg border px-3"
          >
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
        </div>

        <div>
          <Label className="text-xs">Price</Label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 1999.00"
          />
        </div>

        <div>
          <Label className="text-xs">Quantity</Label>
          <Input
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <Label className="text-xs">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Variations</h3>
          <Button
            type="button"
            onClick={addVariation}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add variation
          </Button>
        </div>

        <div className="space-y-2">
          <AnimatePresence>
            {variations.map((v) => (
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex gap-2 items-end"
              >
                <div className="flex-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    value={v.name}
                    onChange={(e) =>
                      setVariations((p) =>
                        p.map((x) =>
                          x.id === v.id ? { ...x, name: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
                <div className="w-36">
                  <Label className="text-xs">Price</Label>
                  <Input
                    value={v.price}
                    onChange={(e) =>
                      setVariations((p) =>
                        p.map((x) =>
                          x.id === v.id ? { ...x, price: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
                <div className="w-28">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    value={v.qty}
                    onChange={(e) =>
                      setVariations((p) =>
                        p.map((x) =>
                          x.id === v.id ? { ...x, qty: e.target.value } : x
                        )
                      )
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeVariation(v.id)}
                  className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs">Images</Label>
        <div className="flex gap-3 items-center">
          <input
            ref={fileRef}
            multiple
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="images_input"
          />
          <label
            htmlFor="images_input"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add files
          </label>
          <div className="flex gap-2 overflow-x-auto">
            {images.map((f, i) => (
              <motion.div
                key={f.name + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-20 h-20 rounded-md overflow-hidden relative border"
              >
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-white shadow flex items-center justify-center"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="flex justify-end gap-3">
        <Button variant="outline" type="button" onClick={resetForm}>
          Reset
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading ? (
            "Saving..."
          ) : (
            <>
              <Check className="w-4 h-4" /> Save product
            </>
          )}
        </Button>
      </div>
    </form>
  );
}


