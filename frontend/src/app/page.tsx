import { ProductList } from "@/features/products/components/ProductList";

export default function Home() {
  return (
    <main className="mx-auto max-w-6xl">
      <h1 className="p-4 text-2xl font-bold">商品一覧</h1>
      <ProductList />
    </main>
  );
}
