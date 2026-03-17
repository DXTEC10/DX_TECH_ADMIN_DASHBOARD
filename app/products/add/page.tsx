"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createProduct } from "@/libs/api/products";
import Image from "next/image";

// ─── Sub-components ──────────────────────────────────────────────────────────

type SlotSize = "lg" | "md" | "sm";

interface ImageUploadSlotProps {
  label?: string;
  size?: SlotSize;
  onFileChange?: (file: File | null) => void;
}

const ImageUploadSlot = ({
  label,
  size = "md",
  onFileChange,
}: ImageUploadSlotProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setPreview(URL.createObjectURL(file));
      onFileChange?.(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onFileChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const heights: Record<SlotSize, string> = {
    lg: "h-36",
    md: "h-24",
    sm: "h-20",
  };

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
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="text-white text-[10px] font-medium">Change</span>
            <button
              type="button"
              onClick={handleRemove}
              className="text-white/80 hover:text-red-300 transition-colors"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
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

interface ToggleProps {
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

const Toggle = ({ checked, onChange, label }: ToggleProps) => (
  <label className="toggle-switch">
    <input type="checkbox" checked={checked} onChange={onChange} />
    <span className="toggle-slider" />
    {label && <span className="ml-2 text-[10px] text-gray-500">{label}</span>}
  </label>
);

const TopBar = () => (
  <header className="bg-white border-b border-gray-200 flex items-center px-5 h-17 sticky top-0 z-50">
    <div className="rounded mr-6xl flex items-center">
      <Image
        src={"/dx-logo.jpeg"}
        width={100}
        height={100}
        alt="Logo"
        className="w-40 h-12 object-contain"
      />
    </div>
  </header>
);

// ─── Form state type ──────────────────────────────────────────────────────────

interface FormState {
  name: string;
  description: string;
  category: string;
  price: string;
  oldPrice: string;
  salePrice: string;
  badge: string;
  hasDiscount: boolean;
  isPromo: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    category: "",
    price: "",
    oldPrice: "",
    salePrice: "",
    badge: "",
    hasDiscount: false,
    isPromo: false,
    isBestSeller: false,
    isNewArrival: false,
  });

  const [mainImage, setMainImage] = useState<File | null>(null);
  const [viewImages, setViewImages] = useState<(File | null)[]>(
    Array(6).fill(null),
  );

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = <K extends keyof FormState>(
    key: K,
    value: FormState[K],
  ) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateViewImage = (index: number, file: File | null) =>
    setViewImages((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) return setError("Product name is required.");
    if (!form.price.trim()) return setError("Price is required.");
    if (!mainImage) return setError("A main product image is required.");

    setSubmitting(true);
    try {
      await createProduct({
        name: form.name,
        description: form.description || undefined,
        category: form.category || undefined,
        price: form.price,
        oldPrice: form.oldPrice || undefined,
        salePrice: form.salePrice || undefined,
        badge: form.badge || undefined,
        hasDiscount: form.hasDiscount,
        isPromo: form.isPromo,
        isBestSeller: form.isBestSeller,
        isNewArrival: form.isNewArrival,
        mainImage,
        viewImages,
      });
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="max-w-2xl mx-auto px-5 py-5">
        {/* Page Header */}
        <div className="flex items-center gap-3 mb-5">
          <button
            type="button"
            onClick={() => router.back()}
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
          </button>
          <div>
            <h1 className="text-base font-bold text-gray-900">
              Add New Product
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Add a new product to your catalogue and website
            </p>
          </div>
        </div>

        {/* Global error banner */}
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
              type="button"
              onClick={() => setError(null)}
              className="ml-auto"
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
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Main Image */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <ImageUploadSlot
              size="lg"
              label="Main product image (required)"
              onFileChange={setMainImage}
            />
          </div>

          {/* Product Information */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-purple-600 mb-3">
              Product Information
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full text-black px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Description
                </label>
                <textarea
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full text-black  px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 resize-none placeholder-gray-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      value={form.category}
                      onChange={(e) => updateField("category", e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 appearance-none transition-all text-gray-500"
                    >
                      <option value="">Select category</option>
                      <option value="SOFA_SET">BEDROOM SETS</option>
                      <option value="DINING_SET">BLINDS</option>
                      <option value="BEDROOM_SET">RIGID LOCK</option>
                      <option value="PARLOR_SET">CENTER TABLE</option>
                      <option value="PARLOR_SET">DINNING SETS</option>
                      <option value="PARLOR_SET">DINNING CHAIR</option>
                      <option value="DECOR">OUTDOOR</option>
                      <option value="DECOR">OFICE FURNITURE</option>
                      <option value="DECOR">TV STANDS</option>
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

                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New, Hot, Sale"
                    value={form.badge}
                    onChange={(e) => updateField("badge", e.target.value)}
                    className="w-full text-black  px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                  />
                </div>
              </div>

              {/* Flags */}
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isPromo}
                    onChange={(e) => updateField("isPromo", e.target.checked)}
                    className="w-3.5 h-3.5 accent-purple-600"
                  />
                  <span className="text-[11px] text-gray-600">Promo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isBestSeller}
                    onChange={(e) =>
                      updateField("isBestSeller", e.target.checked)
                    }
                    className="w-3.5 h-3.5 accent-purple-600"
                  />
                  <span className="text-[11px] text-gray-600">Best Seller</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isNewArrival}
                    onChange={(e) =>
                      updateField("isNewArrival", e.target.checked)
                    }
                    className="w-3.5 h-3.5 accent-purple-600"
                  />
                  <span className="text-[11px] text-gray-600">New Arrival</span>
                </label>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h2 className="text-sm font-bold text-purple-600 mb-3">Pricing</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Price <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₦650,000"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="w-full text-black px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Old Price (At full/average)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₦800,000"
                    value={form.oldPrice}
                    onChange={(e) => updateField("oldPrice", e.target.value)}
                    className="w-full text-black px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    Sale Price
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="e.g. ₦500,000"
                      value={form.salePrice}
                      onChange={(e) => updateField("salePrice", e.target.value)}
                      className="flex-1 text-black px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 bg-gray-50 placeholder-gray-300 transition-all"
                    />
                    <Toggle
                      checked={form.hasDiscount}
                      onChange={(e) =>
                        updateField("hasDiscount", e.target.checked)
                      }
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
            <h2 className="text-sm font-bold text-purple-600">View Images</h2>
            <p className="text-[10px] text-gray-400 mt-0.5 mb-3">
              6 angles for product detail page
            </p>
            <div className="grid grid-cols-4 gap-2 mb-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i}>
                  <p className="text-[9px] text-gray-400 mb-1 font-medium">
                    View {i + 1}
                  </p>
                  <ImageUploadSlot
                    size="sm"
                    onFileChange={(f) => updateViewImage(i, f)}
                  />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[4, 5].map((i) => (
                <div key={i}>
                  <p className="text-[9px] text-gray-400 mb-1 font-medium">
                    View {i + 1}
                  </p>
                  <ImageUploadSlot
                    size="sm"
                    onFileChange={(f) => updateViewImage(i, f)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end pb-6">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white text-xs font-semibold px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-purple-200"
            >
              {submitting ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 animate-spin"
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
                  Saving…
                </>
              ) : (
                <>
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
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
