"use client";

import { useEffect, useState } from "react";
import { fetchProducts } from "../api";
import type { Product } from "../types";

type UseProductsResult = {
  products: Product[];
  isLoading: boolean;
  error: string | null;
};

type FetchState = {
  page: number | null;
  products: Product[];
  error: string | null;
};

export function useProducts(page: number = 1): UseProductsResult {
  const [state, setState] = useState<FetchState>({
    page: null,
    products: [],
    error: null,
  });

  useEffect(() => {
    let isCancelled = false;

    fetchProducts(page)
      .then((response) => {
        if (!isCancelled) {
          setState({ page, products: response.data, error: null });
        }
      })
      .catch((err: unknown) => {
        if (!isCancelled) {
          setState({
            page,
            products: [],
            error:
              err instanceof Error ? err.message : "不明なエラーが発生しました",
          });
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [page]);

  return {
    products: state.products,
    isLoading: state.page !== page,
    error: state.error,
  };
}
