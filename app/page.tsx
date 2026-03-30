"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  fetchProducts,
  fetchPromoProducts,
  fetchBestSellers,
  fetchNewArrivals,
  deleteProduct,
  type Product,
} from "@/libs/api/products";

// ─── Sub-components ──────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  color: string;
  icon: React.ReactNode;
}

const StatCard = ({ label, value, color, icon }: StatCardProps) => (
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
      {icon}
    </div>
  </div>
);

// ─── Icons ───────────────────────────────────────────────────────────────────

const LogoutIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const TotalProductsIcon = () => (
  <svg
    className="w-4 h-4 text-purple-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    />
  </svg>
);

const PromoIcon = () => (
  <svg
    className="w-4 h-4 text-green-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
    />
  </svg>
);

const BestSellerIcon = () => (
  <svg
    className="w-4 h-4 text-pink-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
    />
  </svg>
);

const NewArrivalsIcon = () => (
  <svg
    className="w-4 h-4 text-gray-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ─── Header ───────────────────────────────────────────────────────────────────

const TopBar = ({ onLogout }: { onLogout: () => void }) => (
  <header className="bg-white border-b border-gray-200 flex items-center px-5 h-17 sticky top-0 z-50">
    <div className="flex items-center gap-1.5">
      <div className="relative w-32 sm:w-40 md:w-48 h-12">
        <Image
          src="/dx-logo.svg"
          alt="Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </div>
    <div className="ml-auto flex items-center">
      <button
        onClick={onLogout}
        className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
      >
        <LogoutIcon />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  </header>
);

// ─── Product Card ─────────────────────────────────────────────────────────────

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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.salePrice ? (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₦{product.price}
                </span>
                <span className="text-xs font-medium text-[#BB3C2D]">
                  ₦{product.salePrice}
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-gray-700">
                ₦{product.price}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <Link
              href={`/products/edit/${product.id}`}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all"
            >
              <svg
                className="w-3.5 h-3.5 text-[#752B8C]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </Link>

            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
            >
              <svg
                className={`w-3.5 h-3.5 text-red-400 ${deleting ? "animate-spin" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {deleting ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const navBtnClass = (disabled: boolean) =>
    `px-3 py-1.5 text-xs rounded-md font-medium transition-all border ${
      disabled
        ? "text-gray-300 border-gray-100 cursor-not-allowed bg-white"
        : "text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600 bg-white hover:bg-purple-50"
    }`;

  return (
    <div className="flex items-center justify-center gap-1 mt-6 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navBtnClass(currentPage === 1)}
      >
        ← Prev
      </button>
      {Array.from({ length: totalPages }).map((_, i) => (
        <button
          key={i + 1}
          onClick={() => onPageChange(i + 1)}
          className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all border ${
            currentPage === i + 1
              ? "bg-[#752B8C] text-white border-[#752B8C]"
              : "text-gray-500 border-gray-200 hover:bg-purple-50"
          }`}
        >
          {i + 1}
        </button>
      ))}
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

// ─── Footer ───────────────────────────────────────────────────────────────────

const Footer = () => (
  <footer className="bg-[#F5F0F7] border-t border-gray-200 mt-12 py-10 px-5">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-[10px] text-gray-400">
        © 2026 DX Soft Limited. All Rights Reserved
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        <Link href="#">Privacy</Link>
        <Link href="#">Terms</Link>
        <Link href="#">Help</Link>
      </div>
    </div>
  </footer>
);

// ─── Main Page ───────────────────────────────────────────────────────────────

const tabs = ["All", "Promo", "Best seller", "New Arrivals"] as const;
type Tab = (typeof tabs)[number];

export default function ProductsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [counts, setCounts] = useState({ total: 0, promo: 0, best: 0, new: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (activeTab === "All")
        res = await fetchProducts({
          search: search || undefined,
          page: currentPage,
          limit: LIMIT,
        });
      else if (activeTab === "Promo") res = await fetchPromoProducts();
      else if (activeTab === "Best seller") res = await fetchBestSellers();
      else res = await fetchNewArrivals();

      setProducts(res.data);
      if (activeTab === "All") setTotalPages(res.pagination?.totalPages ?? 1);
      else setTotalPages(1);
    } catch (err) {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [activeTab, search, currentPage]);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [all, promo, best, newArr] = await Promise.all([
          fetchProducts(),
          fetchPromoProducts(),
          fetchBestSellers(),
          fetchNewArrivals(),
        ]);
        setCounts({
          total: all.pagination?.totalItems ?? all.data.length,
          promo: promo.data.length,
          best: best.data.length,
          new: newArr.data.length,
        });
      } catch {}
    };
    loadCounts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCounts((prev) => ({ ...prev, total: prev.total - 1 }));
  };

  const displayed =
    search && activeTab !== "All"
      ? products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : products;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar onLogout={handleLogout} />

      <div className="flex-1 mx-auto max-w-6xl w-full px-5 py-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-[11px] text-gray-400">Manage your inventory</p>
          </div>
          <Link
            href="/products/add"
            className="bg-[#752B8C] text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm"
          >
            + Add Product
          </Link>
        </div>

        <div className="flex gap-3 mb-5 overflow-x-auto pb-2">
          <StatCard
            label="Total"
            value={counts.total}
            color="bg-purple-100"
            icon={<TotalProductsIcon />}
          />
          <StatCard
            label="Promo"
            value={counts.promo}
            color="bg-green-100"
            icon={<PromoIcon />}
          />
          <StatCard
            label="Best Sellers"
            value={counts.best}
            color="bg-pink-100"
            icon={<BestSellerIcon />}
          />
          <StatCard
            label="New"
            value={counts.new}
            color="bg-gray-100"
            icon={<NewArrivalsIcon />}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-3 mb-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search Product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-black px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-purple-300"
          />
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${activeTab === tab ? "bg-[#752B8C] text-white" : "text-gray-500 hover:bg-gray-100"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-600 text-xs rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-48 bg-gray-100 animate-pulse rounded-xl"
                />
              ))
            : displayed.map((p) => (
                <ProductCard key={p.id} product={p} onDelete={handleDelete} />
              ))}
        </div>

        {!loading && activeTab === "All" && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
      <Footer />
    </div>
  );
}
