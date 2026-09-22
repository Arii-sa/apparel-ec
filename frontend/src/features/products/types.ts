export type ProductVariant = {
  id: number;
  sku: string;
  size: string;
  color: string;
  price: number;
  stock_quantity: number;
  is_in_stock: boolean;
};

export type ProductCategory = {
  id: number;
  name: string;
  slug: string;
};

export type Product = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: ProductCategory;
  variants: ProductVariant[];
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
  };
};
