import { notFound } from "next/navigation";
import { fetchProductBySlug } from "@/features/products/api";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params;

  let product;
  try {
    product = await fetchProductBySlug(slug);
  } catch (error) {
    if (error instanceof Error && error.message === "NOT_FOUND") {
      notFound();
    }
    throw error;
  }

  return (
    <main className="mx-auto max-w-3xl p-4">
      <p className="text-sm text-gray-500">{product.category.name}</p>
      <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
      {product.description && (
        <p className="mt-4 text-gray-700">{product.description}</p>
      )}

      <h2 className="mt-8 text-lg font-semibold">バリエーション</h2>
      <div className="mt-2 divide-y divide-gray-200 rounded-lg border border-gray-200">
        {product.variants.map((variant) => (
          <div
            key={variant.id}
            className="flex items-center justify-between p-3"
          >
            <span>
              {variant.size} / {variant.color}
            </span>
            <span className="font-semibold">
              ¥{variant.price.toLocaleString()}
            </span>
            <span
              className={
                variant.is_in_stock ? "text-green-600" : "text-gray-400"
              }
            >
              {variant.is_in_stock ? "在庫あり" : "在庫切れ"}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
