"use client";

import { useProducts } from "../hooks/useProducts";
import { ProductCard } from "./ProductCard";

export function ProductList() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) {
    return <p className="p-4 text-gray-500">読み込み中...</p>;
  }

  if (error) {
    return <p className="p-4 text-red-500">エラー: {error}</p>;
  }

  if (products.length === 0) {
    return <p className="p-4 text-gray-500">商品が見つかりませんでした</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
