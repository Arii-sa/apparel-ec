import type { Product } from "../types";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const prices = product.variants.map((variant) => variant.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : null;
  const hasStock = product.variants.some((variant) => variant.is_in_stock);

  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      <p className="text-xs text-gray-500">{product.category.name}</p>
      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
      {minPrice !== null && (
        <p className="mt-2 text-base font-bold">
          ¥{minPrice.toLocaleString()} 〜
        </p>
      )}
      <p
        className={`mt-1 text-sm ${hasStock ? "text-green-600" : "text-gray-400"}`}
      >
        {hasStock ? "在庫あり" : "在庫切れ"}
      </p>
    </div>
  );
}
