"use client";

import { useState } from "react";
import { useCart } from "../context/CartContext";
import type { Product } from "@/features/products/types";

type AddToCartFormProps = {
  product: Product;
};

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    product.variants.find((v) => v.is_in_stock)?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState<string | null>(null);

  const selectedVariant =
    product.variants.find((v) => v.id === selectedVariantId) ?? null;

  function handleAddToCart() {
    if (!selectedVariant) return;

    addItem({
      productVariantId: selectedVariant.id,
      productName: product.name,
      sku: selectedVariant.sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: selectedVariant.price,
      quantity,
    });

    setAddedMessage("カートに追加しました");
    setTimeout(() => setAddedMessage(null), 2000);
  }

  return (
    <div className="mt-6 space-y-3 rounded-lg border border-gray-200 p-4">
      <div>
        <label htmlFor="variant" className="block text-sm font-medium">
          サイズ・カラーを選択
        </label>
        <select
          id="variant"
          value={selectedVariantId ?? ""}
          onChange={(e) => setSelectedVariantId(Number(e.target.value))}
          className="mt-1 w-full rounded border border-gray-300 p-2"
        >
          {product.variants.map((variant) => (
            <option
              key={variant.id}
              value={variant.id}
              disabled={!variant.is_in_stock}
            >
              {variant.size} / {variant.color} - ¥
              {variant.price.toLocaleString()}
              {!variant.is_in_stock && "(在庫切れ)"}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="quantity" className="block text-sm font-medium">
          数量
        </label>
        <input
          id="quantity"
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          className="mt-1 w-24 rounded border border-gray-300 p-2"
        />
      </div>

      {addedMessage && <p className="text-sm text-green-600">{addedMessage}</p>}

      <button
        onClick={handleAddToCart}
        disabled={!selectedVariant}
        className="w-full rounded bg-black py-2 text-white disabled:opacity-50"
      >
        カートに追加
      </button>
    </div>
  );
}
