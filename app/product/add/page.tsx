"use client";
import { useState, useRef } from "react";
import Link from "next/link";

const ImageUploadSlot = ({ label, size = "md" }) => {
  const [preview, setPreview] = useState(null);
  const inputRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const heights = { lg: "h-36", md: "h-24", sm: "h-20" };

  return (
    <div
      className={`${heights[size]} rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-purple-300 hover:bg-purple-50/30 transition-all group relative overflow-hidden`}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      {preview ? (
        <>
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-[10px] font-medium">Change</span>
          </div>
        </>
      ) : (
        <>
          <div className="w-7 h-7 bg-gray-100 group-hover:bg-purple-100 rounded-lg flex items-center justify-center mb-1.5 transition-colors">
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-purple-500 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-[10px] text-gray-400 group-hover:text-purple-500 font-medium transition-colors">
            Upload
          </span>
          {label && (
            <span className="text-[9px] text-gray-300 mt-0.5">{label}</span>
          )}
        </>
      )}
    </div>
  );
};

const Toggle = ({ checked, onChange }) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-slider"></span>
  </label>
);

export default function AddProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    oldPrice: "",
    salePrice: "",
    discount: false,
    status: false,
  });

  const update = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

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

      <div className="max-w-2xl mx-auto px-5 py-5">
        <div className="flex items-center gap-3 mb-5">
          <Link
            href="/"
            className="w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
          >
            <svg
              className="w-3.5 h-3.5 text-gray-600"
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
          </Link>
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Add a new product to your catalogue and website
            </p>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Product added!");
          }}
          className="space-y-4"
        >
          {/* Main Image */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <ImageUploadSlot size="lg" />
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-purple-600 mb-3">
              Product Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 resize-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Category
                </label>
                <div className="relative">
                  <select
                    value={formData.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 appearance-none transition-all text-gray-500"
                  >
                    <option value="" disabled>
                      New Arrival
                    </option>
                    <option value="New Arrival">New Arrival</option>
                    <option value="Promo">Promo</option>
                    <option value="Best Seller">Best Seller</option>
                    <option value="Featured">Featured</option>
                  </select>
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-purple-600 mb-3">Pricing</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => update("price", e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Old Price (At full/average)
                  </label>
                  <input
                    type="text"
                    placeholder="0.00"
                    value={formData.oldPrice}
                    onChange={(e) => update("oldPrice", e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Sale Price
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="0.00"
                      value={formData.salePrice}
                      onChange={(e) => update("salePrice", e.target.value)}
                      className="flex-1 px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                    />
                    <Toggle
                      checked={formData.discount}
                      onChange={(e) => update("discount", e.target.checked)}
                    />
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">
                      Discount
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product View Images */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-purple-600">
              Product View Images
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5 mb-3">
              6 angles for product detail page
            </p>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {["View 1", "View 2", "View 3", "View 4"].map((view) => (
                <div key={view}>
                  <p className="text-[9px] text-gray-400 mb-1 font-medium">
                    {view}
                  </p>
                  <ImageUploadSlot size="sm" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["View 5", "View 6"].map((view) => (
                <div key={view}>
                  <p className="text-[9px] text-gray-400 mb-1 font-medium">
                    {view}
                  </p>
                  <ImageUploadSlot size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-purple-600 mb-2">
              Product Status
            </h2>
            <div className="flex items-center justify-between">
              <p className="text-[11px] text-gray-500">
                Make this product visible to customers
              </p>
              <Toggle
                checked={formData.status}
                onChange={(e) => update("status", e.target.checked)}
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pb-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-purple-200"
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
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
