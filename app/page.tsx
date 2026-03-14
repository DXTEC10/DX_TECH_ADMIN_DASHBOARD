"use client";
import { useState } from "react";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Bronze Sofa Set",
    price: "₦2,000,000",
    salePrice: "₦01,000",
    category: "Promo",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=280&fit=crop",
  },
  {
    id: 2,
    name: "Royal Parlor Set",
    price: "₦10,110,000",
    salePrice: "₦200,000",
    category: "Promo",
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=280&fit=crop",
  },
  {
    id: 3,
    name: "Light Decor Set",
    price: "₦10,000,000",
    salePrice: "₦900,000",
    category: "Promo",
    image:
      "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=280&fit=crop",
  },
  {
    id: 4,
    name: "Bedroom Sofa Set",
    price: "₦4,001,000",
    salePrice: null,
    category: "Normal",
    image:
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400&h=280&fit=crop",
  },
  {
    id: 5,
    name: "Parlor Sofa Set",
    price: "₦8,000,000",
    salePrice: null,
    category: "Normal",
    image:
      "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=400&h=280&fit=crop",
  },
  {
    id: 6,
    name: "Istanbul Sofa Set",
    price: "₦1,000,100",
    salePrice: null,
    category: "Normal",
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=280&fit=crop",
  },
  {
    id: 7,
    name: "Parla Sofa Set",
    price: "₦1,800,000",
    salePrice: null,
    category: "Normal",
    image:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=280&fit=crop",
  },
  {
    id: 8,
    name: "Royal Dinning Set",
    price: "₦2,000,000",
    salePrice: null,
    category: "Normal",
    image:
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=280&fit=crop",
  },
  {
    id: 9,
    name: "Riga Sofa Set",
    price: "₦1,800,000",
    salePrice: null,
    category: "Normal",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&h=280&fit=crop",
  },
];

const StatCard = ({ label, value, color }) => (
  <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-3 border border-gray-100 flex-1 min-w-0">
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide truncate">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-800 mt-0.5">{value}</p>
    </div>
    <div
      className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${color}`}
    >
      <div className="w-4 h-4 rounded-full bg-white opacity-60" />
    </div>
  </div>
);

const ProductCard = ({ product }) => (
  <div className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group">
    <div className="relative overflow-hidden h-40">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        onError={(e) => {
          e.target.src =
            "https://via.placeholder.com/400x280/f3f4f6/9ca3af?text=Product";
        }}
      />
    </div>
    <div className="p-3">
      <h3 className="text-sm font-semibold text-gray-800 mb-1">
        {product.name}
      </h3>
      <div className="flex items-center gap-2">
        {product.salePrice ? (
          <>
            <span className="text-xs text-gray-400 line-through">
              {product.price}
            </span>
            <span className="text-xs font-bold text-purple-600">
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

export default function ProductsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const tabs = ["All", "Promo", "Best seller", "New Arrivals"];

  const filtered = products.filter((p) => {
    const matchTab = activeTab === "All" || p.category === activeTab;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 flex items-center px-5 h-11 sticky top-0 z-50">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">D</span>
          </div>
          <span className="font-bold text-gray-800 text-sm tracking-tight">
            TEC
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg
              className="w-3.5 h-3.5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </button>
          <button className="w-7 h-7 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
            <svg
              className="w-3.5 h-3.5 text-gray-500"
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
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-5">
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
            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm shadow-purple-200"
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

        <div className="flex gap-3 mb-5">
          <StatCard label="Total Products" value="5" color="bg-purple-100" />
          <StatCard label="Promo Items" value="0" color="bg-green-100" />
          <StatCard label="Best Sellers" value="0" color="bg-pink-100" />
          <StatCard label="Low Airfirm" value="0" color="bg-gray-100" />
        </div>

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
                className="w-full pl-8 pr-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
              />
            </div>
            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 text-xs rounded-md font-medium transition-all ${
                    activeTab === tab
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative">
          <button className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="grid grid-cols-3 gap-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors">
            <svg
              className="w-3 h-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
