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
