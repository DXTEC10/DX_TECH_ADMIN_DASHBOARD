"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  fetchProducts,
  fetchPromoProducts,
  fetchBestSellers,
  fetchNewArrivals,
  deleteProduct,
  type Product,
} from "@/libs/api/products";
import Image from "next/image";

// ─── Sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ label, value, color }: StatCardProps) => (
  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100 flex-1 min-w-0">
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${color}`}
    >
      <div className="w-4 h-4 rounded-full bg-white opacity-60" />
    </div>
  </div>
);

interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
}

const ProductCard = ({ product, onDelete }: ProductCardProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm(`Delete "${product.name}"?`)) return;
    setDeleting(true);
    try {
      await onDelete(product.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group relative">
      <div className="relative overflow-hidden h-40">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/400x280/f3f4f6/9ca3af?text=Product";
          }}
        />
        {/* Delete button */}
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="absolute top-2 right-2 w-6 h-6 bg-white/90 hover:bg-red-50 border border-gray-200 hover:border-red-200 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-sm"
        >
          {deleting ? (
            <svg
              className="w-3 h-3 text-gray-400 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          ) : (
            <svg
              className="w-3 h-3 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          )}
        </button>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-[#BB3C2D] text-white text-[9px] font-semibold px-2 py-0.5 rounded-full">
            {product.badge}
          </span>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          {product.salePrice ? (
            <>
              <span className="text-xs text-gray-400 line-through">
                {product.price}
              </span>
              <span className="text-xs font-medium text-[#BB3C2D]">
                {product.salePrice}
              </span>
            </>
          ) : (
            <span className="text-xs font-semibold text-gray-700">
              {product.price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const TopBar = () => (
  <header className="bg-white border-b border-gray-200 flex items-center px-5 h-17 sticky top-0 z-50">
    <div className="flex items-center gap-1.5">
      <div className="rounded mr-6xl flex items-center">
        <Image
          src={"/dx-logo.jpeg"}
          width={100}
          height={100}
          alt="Logo"
          className="w-40 h-12 object-contain"
        />
      </div>
    </div>
    <div className="ml-auto flex items-center gap-2"></div>
  </header>
);

// ─── Skeleton loader ─────────────────────────────────────────────────────────

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-40 bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

// ─── Tabs config ─────────────────────────────────────────────────────────────

const tabs = ["All", "Promo", "Best seller", "New Arrivals"] as const;
type Tab = (typeof tabs)[number];

// ─── Pagination ───────────────────────────────────────────────────────────────

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPages = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 4) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const navBtnClass = (disabled: boolean) =>
    `px-3 py-1.5 text-xs rounded-md font-medium transition-all border ${
      disabled
        ? "text-gray-300 border-gray-100 cursor-not-allowed bg-white"
        : "text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600 bg-white hover:bg-purple-50"
    }`;

  return (
    <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navBtnClass(currentPage === 1)}
      >
        ← Prev
      </button>

      {/* Page numbers */}
      {getPages().map((p, i) =>
        p === "..." ? (
          <span
            key={`ellipsis-${i}`}
            className="px-2 py-1.5 text-xs text-gray-400 select-none"
          >
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all border ${
              currentPage === p
                ? "bg-[#752B8C] text-white border-[#752B8C] shadow-sm shadow-purple-200"
                : "text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600 bg-white hover:bg-purple-50"
            }`}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={navBtnClass(currentPage === totalPages)}
      >
        Next →
      </button>
    </div>
  );
};

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Counts for stat cards
  const [totalCount, setTotalCount] = useState(0);
  const [promoCount, setPromoCount] = useState(0);
  const [bestSellerCount, setBestSellerCount] = useState(0);
  const [newArrivalCount, setNewArrivalCount] = useState(0);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  // ── Reset page when tab or search changes ──────────────────────────────────
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

  // ── Load products based on active tab ──────────────────────────────────────
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let data: Product[] = [];

      if (activeTab === "All") {
        const res = await fetchProducts({
          search: search || undefined,
          page: currentPage,
          limit: LIMIT,
        });
        data = res.data;
        // Backend wraps pagination info under res.pagination
        setTotalPages(res.pagination?.totalPages ?? 1);
      } else if (activeTab === "Promo") {
        const res = await fetchPromoProducts();
        data = res.data;
        setTotalPages(1);
      } else if (activeTab === "Best seller") {
        const res = await fetchBestSellers();
        data = res.data;
        setTotalPages(1);
      } else if (activeTab === "New Arrivals") {
        const res = await fetchNewArrivals();
        data = res.data;
        setTotalPages(1);
      }

      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, currentPage]);

  // ── Load stat counts on mount ──────────────────────────────────────────────
  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [all, promo, best, newArr] = await Promise.all([
          fetchProducts(),
          fetchPromoProducts(),
          fetchBestSellers(),
          fetchNewArrivals(),
        ]);
        // Use pagination.totalItems for the real total, not just the page slice
        setTotalCount(all.pagination?.totalItems ?? all.data.length);
        setPromoCount(promo.data.length);
        setBestSellerCount(best.data.length);
        setNewArrivalCount(newArr.data.length);
      } catch {
        // silently fail stat counts
      }
    };
    loadCounts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // ── Delete handler ─────────────────────────────────────────────────────────
  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotalCount((c) => c - 1);
  };

  // ── Client-side search filter for non-All tabs ─────────────────────────────
  const displayed =
    search && activeTab !== "All"
      ? products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : products;

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="mx-auto max-w-6xl px-5 py-5">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Manage your inventory
            </p>
          </div>
          <Link
            href="/products/add"
            className="inline-flex items-center gap-1.5 bg-[#752B8C] text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm shadow-purple-200"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Product
          </Link>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mb-5">
          <StatCard
            label="Total Products"
            value={totalCount}
            color="bg-purple-100"
          />
          <StatCard
            label="Promo Items"
            value={promoCount}
            color="bg-green-100"
          />
          <StatCard
            label="Best Sellers"
            value={bestSellerCount}
            color="bg-pink-100"
          />
          <StatCard
            label="New Arrivals"
            value={newArrivalCount}
            color="bg-gray-100"
          />
        </div>

        {/* Search + Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search Product"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full text-black pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
              />
            </div>
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#752B8C] text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {error}
            <button
              onClick={loadProducts}
              className="ml-auto font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-3">
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <ProductSkeleton key={i} />
              ))
            ) : displayed.length > 0 ? (
              displayed.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDelete={handleDelete}
                />
              ))
            ) : (
              <div className="col-span-3 py-16 flex flex-col items-center gap-2 text-gray-400">
                <svg
                  className="w-10 h-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <p className="text-sm font-medium">No products found</p>
              </div>
            )}
          </div>

          {/* Pagination — only shown on All tab */}
          {!loading && activeTab === "All" && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
}
