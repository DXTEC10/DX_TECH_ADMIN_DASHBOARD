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

// ─── Stat Icons ───────────────────────────────────────────────────────────────

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
        <div className="flex items-center justify-between">
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

          {/* Edit + Delete action icons */}
          <div className="flex items-center gap-1">
            {/* Edit icon — navigates to /products/edit/[id] */}
            <Link
              href={`/products/edit/${product.id}`}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all"
              title="Edit product"
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

            {/* Delete icon */}
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
              title="Delete product"
            >
              {deleting ? (
                <svg
                  className="w-3.5 h-3.5 text-gray-400 animate-spin"
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
                  className="w-3.5 h-3.5 text-red-400"
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
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Top Bar ──────────────────────────────────────────────────────────────────

const TopBar = () => (
  <header className="bg-white border-b border-gray-200 flex items-center px-5 h-17 sticky top-0 z-50">
    <div className="flex items-center gap-1.5">
      <div className="rounded mr-6xl flex items-center">
        <div className="relative w-32 sm:w-40 md:w-48 h-12">
          <Image
            src="/dx-logo.svg"
            alt="Logo"
            fill
            className="w-76 h-auto object-contain"
            priority
          />
        </div>
      </div>
    </div>
    <div className="ml-auto flex items-center gap-2"></div>
  </header>
);

// ─── Skeleton loader ──────────────────────────────────────────────────────────

const ProductSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
    <div className="h-40 bg-gray-100" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/3" />
    </div>
  </div>
);

// ─── Tabs config ──────────────────────────────────────────────────────────────

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
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={navBtnClass(currentPage === 1)}
      >
        ← Prev
      </button>
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
  <footer className="bg-[#F5F0F7] border-t border-gray-200 mt-12">
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Logo + tagline */}
        <div className="md:w-48 shrink-0">
          <div className="relative w-32 h-10 mb-2">
            <Image
              src="/dx-logo.svg"
              alt="TEC Logo"
              fill
              className="object-contain"
            />
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed mt-1">
            Soft Limited
            <br />
            FURNITURE HUB
          </p>
        </div>

        {/* Nav columns */}
        <div className="flex flex-1 flex-wrap gap-8">
          {/* Platform */}
          <div className="min-w-[100px]">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">
              Platform
            </h4>
            <ul className="space-y-2">
              {["About", "Features", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-gray-500 hover:text-[#752B8C] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="min-w-[100px]">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">
              Resources
            </h4>
            <ul className="space-y-2">
              {["Tools", "Newsletter", "FAQ"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-gray-500 hover:text-[#752B8C] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="min-w-[100px]">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">
              Products
            </h4>
            <ul className="space-y-2">
              {["Share feedback", "Helpdesk"].map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-xs text-gray-500 hover:text-[#752B8C] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legals */}
          <div className="min-w-[120px]">
            <h4 className="text-xs font-semibold text-gray-700 mb-3">Legals</h4>
            <ul className="space-y-2">
              {["Guides", "Terms & Conditions", "Privacy Policy"].map(
                (item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-xs text-gray-500 hover:text-[#752B8C] transition-colors"
                    >
                      {item}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex md:flex-col items-start gap-3 md:gap-2 md:items-end">
          <div className="flex gap-2">
            {/* WhatsApp */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
            {/* Facebook */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            {/* Instagram */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
            {/* Telegram */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
              </svg>
            </a>
            {/* X / Twitter */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center hover:opacity-80 transition-opacity"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-8 pt-5 border-t border-gray-200 text-center">
        <p className="text-[10px] text-gray-400">© 2025, All Rights Reserved</p>
      </div>
    </div>
  </footer>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("All");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [totalCount, setTotalCount] = useState(0);
  const [promoCount, setPromoCount] = useState(0);
  const [bestSellerCount, setBestSellerCount] = useState(0);
  const [newArrivalCount, setNewArrivalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const LIMIT = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, search]);

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

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [all, promo, best, newArr] = await Promise.all([
          fetchProducts(),
          fetchPromoProducts(),
          fetchBestSellers(),
          fetchNewArrivals(),
        ]);
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

  const handleDelete = async (id: number) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setTotalCount((c) => c - 1);
  };

  const displayed =
    search && activeTab !== "All"
      ? products.filter((p) =>
          p.name.toLowerCase().includes(search.toLowerCase()),
        )
      : products;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />

      <div className="flex-1 mx-auto max-w-6xl w-full px-5 py-5">
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
            icon={<TotalProductsIcon />}
          />
          <StatCard
            label="Promo Items"
            value={promoCount}
            color="bg-green-100"
            icon={<PromoIcon />}
          />
          <StatCard
            label="Best Sellers"
            value={bestSellerCount}
            color="bg-pink-100"
            icon={<BestSellerIcon />}
          />
          <StatCard
            label="New Arrivals"
            value={newArrivalCount}
            color="bg-gray-100"
            icon={<NewArrivalsIcon />}
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

          {!loading && activeTab === "All" && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
