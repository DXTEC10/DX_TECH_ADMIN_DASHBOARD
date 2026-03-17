const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  price: string;
  oldPrice: string | null;
  salePrice: string | null;
  hasDiscount: boolean;
  badge: string | null;
  isPromo: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  image: string;
  imageBlurhash: string;
  images: string[];
  blurhashes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total?: number;
  page?: number;
}

export interface ProductResponse {
  success: boolean;
  data: Product;
}

export interface GetAllParams {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
}

// ─── GET all products ───────────────────────────────────────────────────────
export async function fetchProducts(
  params: GetAllParams = {},
): Promise<ProductsResponse> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  if (params.search) qs.set("search", params.search);

  const res = await fetch(`${BASE_URL}/products?${qs.toString()}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.statusText}`);
  return res.json();
}

// ─── GET promo products ─────────────────────────────────────────────────────
export async function fetchPromoProducts(): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/promo`, {
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Failed to fetch promo products: ${res.statusText}`);
  return res.json();
}

// ─── GET best sellers ───────────────────────────────────────────────────────
export async function fetchBestSellers(): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/best-sellers`, {
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Failed to fetch best sellers: ${res.statusText}`);
  return res.json();
}

// ─── GET new arrivals ───────────────────────────────────────────────────────
export async function fetchNewArrivals(): Promise<ProductsResponse> {
  const res = await fetch(`${BASE_URL}/products/new-arrivals`, {
    cache: "no-store",
  });
  if (!res.ok)
    throw new Error(`Failed to fetch new arrivals: ${res.statusText}`);
  return res.json();
}

// ─── GET one product ────────────────────────────────────────────────────────
export async function fetchProduct(
  idOrSlug: string | number,
): Promise<ProductResponse> {
  const res = await fetch(`${BASE_URL}/products/${idOrSlug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Failed to fetch product: ${res.statusText}`);
  return res.json();
}

// ─── POST create product ────────────────────────────────────────────────────
export interface CreateProductPayload {
  name: string;
  description?: string;
  category?: string;
  price: string;
  oldPrice?: string;
  salePrice?: string;
  hasDiscount?: boolean;
  badge?: string;
  isPromo?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  mainImage: File;
  images?: (File | null)[];
}

export async function createProduct(
  payload: CreateProductPayload,
): Promise<ProductResponse> {
  const form = new FormData();

  form.append("name", payload.name);
  form.append("price", payload.price);
  if (payload.description) form.append("description", payload.description);
  if (payload.category) form.append("category", payload.category);
  if (payload.oldPrice) form.append("oldPrice", payload.oldPrice);
  if (payload.salePrice) form.append("salePrice", payload.salePrice);
  if (payload.badge) form.append("badge", payload.badge);

  form.append("hasDiscount", String(payload.hasDiscount ?? false));
  form.append("isPromo", String(payload.isPromo ?? false));
  form.append("isBestSeller", String(payload.isBestSeller ?? false));
  form.append("isNewArrival", String(payload.isNewArrival ?? false));

  form.append("mainImage", payload.mainImage);

  payload.images?.filter(Boolean).forEach((file, i) => {
    form.append(`view${i + 1}`, file as File);
  });

  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    body: form,
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data?.error ?? `Failed to create product: ${res.statusText}`,
    );
  return data;
}

// ─── PATCH update product ───────────────────────────────────────────────────
export interface UpdateProductPayload extends Partial<
  Omit<CreateProductPayload, "mainImage">
> {
  mainImage?: File;
}

export async function updateProduct(
  id: number,
  payload: UpdateProductPayload,
): Promise<ProductResponse> {
  const form = new FormData();

  if (payload.name) form.append("name", payload.name);
  if (payload.price) form.append("price", payload.price);
  if (payload.description !== undefined)
    form.append("description", payload.description ?? "");
  if (payload.category) form.append("category", payload.category);
  if (payload.oldPrice !== undefined)
    form.append("oldPrice", payload.oldPrice ?? "");
  if (payload.salePrice !== undefined)
    form.append("salePrice", payload.salePrice ?? "");
  if (payload.badge !== undefined) form.append("badge", payload.badge ?? "");
  if (payload.hasDiscount !== undefined)
    form.append("hasDiscount", String(payload.hasDiscount));
  if (payload.isPromo !== undefined)
    form.append("isPromo", String(payload.isPromo));
  if (payload.isBestSeller !== undefined)
    form.append("isBestSeller", String(payload.isBestSeller));
  if (payload.isNewArrival !== undefined)
    form.append("isNewArrival", String(payload.isNewArrival));
  if (payload.mainImage) form.append("mainImage", payload.mainImage);

  payload.images?.filter(Boolean).forEach((file, i) => {
    form.append(`view${i + 1}`, file as File);
  });

  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH",
    body: form,
  });

  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data?.error ?? `Failed to update product: ${res.statusText}`,
    );
  return data;
}

// ─── DELETE product ─────────────────────────────────────────────────────────
export async function deleteProduct(
  id: number,
): Promise<{ success: boolean; data: Product }> {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(
      data?.error ?? `Failed to delete product: ${res.statusText}`,
    );
  return data;
}
