import type { PaginatedResponse, Product } from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchProducts(
  page: number = 1,
): Promise<PaginatedResponse<Product>> {
  const response = await fetch(`${API_BASE_URL}/products?page=${page}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `商品一覧の取得に失敗しました (status: ${response.status})`,
    );
  }

  return response.json();
}

export async function fetchProductBySlug(slug: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${slug}`, {
    cache: "no-store",
  });

  if (response.status === 404) {
    throw new Error("NOT_FOUND");
  }
  if (!response.ok) {
    throw new Error(
      `商品詳細の取得に失敗しました (status: ${response.status})`,
    );
  }

  const json = await response.json();
  return json.data;
}
