"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { fetchProduct, updateProduct, type Product } from "@/libs/api/products";

// ─── Category options (match your backend enum) ────────────────────────────

const CATEGORIES = [
  { value: "", label: "Select category" },
  { value: "BEDROOM_SETS", label: "Bedroom Sets" },
  { value: "BLINDS", label: "Blinds" },
  { value: "RIGID_LOCK", label: "Rigid Lock" },
  { value: "CENTER_TABLE", label: "Center Table" },
  { value: "DINING_SET", label: "Dining Set" },
  { value: "DINING_CHAIR", label: "Dining Chair" },
  { value: "OUTDOOR", label: "Outdoor" },
  { value: "OFFICE_FURNITURE", label: "Office Furniture" },
  { value: "TV_STANDS", label: "TV Stands" },
];

// ─── TopBar ───────────────────────────────────────────────────────────────────

const TopBar = () => (
  <header className="bg-white border-b border-gray-200 flex items-center px-5 h-16 sticky top-0 z-50">
    <div className="relative w-36 h-10">
      <Image
        src="/dx-logo.svg"
        alt="Logo"
        fill
        className="object-contain"
        priority
      />
    </div>
  </header>
);

// ─── Image Upload Slot ────────────────────────────────────────────────────────

interface ImageSlotProps {
  label: string;
  existingUrl?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  required?: boolean;
}

const ImageSlot = ({
  label,
  existingUrl,
  file,
  onChange,
  required,
}: ImageSlotProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const preview = file ? URL.createObjectURL(file) : existingUrl || null;

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold text-gray-600">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className={`relative group cursor-pointer rounded-lg border-2 border-dashed transition-all overflow-hidden flex items-center justify-center
          ${preview ? "border-transparent h-32" : "border-gray-200 hover:border-[#752B8C] h-32 bg-gray-50"}`}
      >
        {preview ? (
          <>
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-[10px] font-semibold">
                Change
              </span>
            </div>
            {file && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(null);
                }}
                className="absolute top-1.5 right-1.5 w-5 h-5 bg-white/90 rounded-full flex items-center justify-center shadow"
              >
                <svg
                  className="w-3 h-3 text-red-500"
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
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-1 text-gray-400">
            <svg
              className="w-6 h-6"
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
            <span className="text-[10px]">Click to upload</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </div>
    </div>
  );
};

// ─── Toggle ───────────────────────────────────────────────────────────────────

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color?: string;
}

const Toggle = ({
  label,
  description,
  checked,
  onChange,
  color = "bg-[#752B8C]",
}: ToggleProps) => (
  <label className="flex items-center justify-between gap-3 cursor-pointer group py-2.5 px-3 rounded-lg hover:bg-gray-50 transition-colors">
    <div>
      <p className="text-xs font-semibold text-gray-700">{label}</p>
      {description && (
        <p className="text-[10px] text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${checked ? color : "bg-gray-200"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`}
      />
    </button>
  </label>
);

// ─── Input ────────────────────────────────────────────────────────────────────

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
}

const Input = ({ label, hint, ...props }: InputProps) => (
  <div>
    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
      {label} {props.required && <span className="text-red-400">*</span>}
    </label>
    <input
      {...props}
      className="w-full text-sm text-gray-800 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all placeholder:text-gray-300"
    />
    {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
  </div>
);

// ─── Section heading ──────────────────────────────────────────────────────────

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 mt-1">
    {children}
  </h2>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ── Text fields ────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [badge, setBadge] = useState("");

  // ── Boolean fields ─────────────────────────────────────────────────────────
  const [hasDiscount, setHasDiscount] = useState(false);
  const [isPromo, setIsPromo] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);

  // ── Existing image URLs (from DB) ──────────────────────────────────────────
  const [existingMain, setExistingMain] = useState("");
  const [existingViews, setExistingViews] = useState<string[]>(
    Array(6).fill(""),
  );

  // ── New file selections (null = keep existing) ─────────────────────────────
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [viewFiles, setViewFiles] = useState<(File | null)[]>(
    Array(6).fill(null),
  );

  // ─── Load product using fetchProduct from @/libs/api/products ─────────────
  useEffect(() => {
    if (!productId) return;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const json = await fetchProduct(productId);
        const p: Product = json.data;

        setName(p.name ?? "");
        setDescription(p.description ?? "");
        setCategory(p.category ?? "");
        setPrice(p.price ?? "");
        setOldPrice(p.oldPrice ?? "");
        setSalePrice(p.salePrice ?? "");
        setBadge(p.badge ?? "");
        setHasDiscount(p.hasDiscount ?? false);
        setIsPromo(p.isPromo ?? false);
        setIsBestSeller(p.isBestSeller ?? false);
        setIsNewArrival(p.isNewArrival ?? false);
        setExistingMain(p.image ?? "");

        const views = [...(p.images ?? [])];
        while (views.length < 6) views.push("");
        setExistingViews(views.slice(0, 6));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        setLoading(false);
      }
    })();
  }, [productId]);

  // ─── Submit using updateProduct from @/libs/api/products ─────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccessMsg(null);

    try {
      await updateProduct(productId, {
        name,
        description,
        category,
        price,
        oldPrice: oldPrice || undefined,
        salePrice: salePrice || undefined,
        badge: badge || undefined,
        hasDiscount,
        isPromo,
        isBestSeller,
        isNewArrival,
        mainImage: mainFile ?? undefined,
        // Only pass view files that were newly selected; nulls are filtered
        // inside updateProduct already via payload.images?.filter(Boolean)
        images: viewFiles,
      });

      setSuccessMsg("Product updated successfully!");
      setTimeout(() => router.push("/"), 1400);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const updateViewFile = (index: number, file: File | null) => {
    setViewFiles((prev) => {
      const next = [...prev];
      next[index] = file;
      return next;
    });
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="mx-auto max-w-5xl px-5 py-7">
        {/* Breadcrumb */}
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#752B8C] transition-colors mb-5"
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
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-base font-bold text-gray-900">Edit Product</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {loading ? "Loading product data…" : `Editing: ${name}`}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
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
          </div>
        )}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-600 text-xs rounded-xl px-4 py-3 mb-5 flex items-center gap-2">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
            {successMsg} Redirecting…
          </div>
        )}

        {/* Loading skeleton */}
        {loading ? (
          <div className="grid grid-cols-3 gap-5 animate-pulse">
            <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-2 bg-gray-100 rounded w-20" />
                  <div className="h-8 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <div className="h-48 bg-gray-100 rounded-xl" />
              <div className="h-36 bg-gray-100 rounded-xl" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-5">
              {/* ── Left column ────────────────────────────────────────── */}
              <div className="col-span-2 space-y-5">
                {/* Basic info */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <SectionTitle>Basic Information</SectionTitle>
                  <Input
                    label="Product Name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bronze Sofa Set"
                  />
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                      Description
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Describe the product…"
                      className="w-full text-sm text-gray-800 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all resize-none placeholder:text-gray-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1.5">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-sm text-gray-800 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-300 transition-all"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input
                    label="Badge"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g. New, Hot, Sale"
                    hint="Short label shown on the product card"
                  />
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                  <SectionTitle>Pricing</SectionTitle>
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="Price"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. ₦1,000,000"
                    />
                    <Input
                      label="Old Price"
                      value={oldPrice}
                      onChange={(e) => setOldPrice(e.target.value)}
                      placeholder="e.g. ₦1,200,000"
                    />
                    <Input
                      label="Sale Price"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      placeholder="e.g. ₦800,000"
                    />
                  </div>
                  <Toggle
                    label="Has Discount"
                    description="Mark this product as discounted"
                    checked={hasDiscount}
                    onChange={setHasDiscount}
                  />
                </div>

                {/* View images */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <SectionTitle>Additional View Images</SectionTitle>
                  <p className="text-[10px] text-gray-400 mb-4">
                    Up to 6 gallery images. Leave slots empty to keep existing
                    ones.
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <ImageSlot
                        key={i}
                        label={`View ${i + 1}`}
                        existingUrl={existingViews[i] || undefined}
                        file={viewFiles[i]}
                        onChange={(f) => updateViewFile(i, f)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right column ───────────────────────────────────────── */}
              <div className="space-y-4">
                {/* Main image */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <SectionTitle>Main Image</SectionTitle>
                  <ImageSlot
                    label="Product Photo"
                    existingUrl={existingMain || undefined}
                    file={mainFile}
                    onChange={setMainFile}
                    required
                  />
                  <p className="text-[10px] text-gray-400 mt-2">
                    Leave unchanged to keep existing image.
                  </p>
                </div>

                {/* Flags */}
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <SectionTitle>Product Flags</SectionTitle>
                  <div className="divide-y divide-gray-50">
                    <Toggle
                      label="Promo"
                      description="Show in Promo section"
                      checked={isPromo}
                      onChange={setIsPromo}
                      color="bg-green-500"
                    />
                    <Toggle
                      label="Best Seller"
                      description="Show in Best Sellers"
                      checked={isBestSeller}
                      onChange={setIsBestSeller}
                      color="bg-pink-500"
                    />
                    <Toggle
                      label="New Arrival"
                      description="Show in New Arrivals"
                      checked={isNewArrival}
                      onChange={setIsNewArrival}
                      color="bg-blue-500"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#752B8C] hover:bg-[#5f2272] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm shadow-purple-200 disabled:opacity-60"
                  >
                    {saving ? (
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
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="w-full px-4 py-2.5 text-xs font-semibold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
