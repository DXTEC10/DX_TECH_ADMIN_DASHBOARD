"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://dxtechbackend-stagging.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Invalid credentials.");

      if (data.token) {
        // 1. Set the cookie with proper production flags
        const isSecure = window.location.protocol === "https:";
        const cookieBase = `dx_token=${data.token}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
        document.cookie = isSecure ? `${cookieBase}; Secure` : cookieBase;

        // 2. Give the browser a tiny moment to register the cookie, then redirect
        router.refresh();
        router.push("/");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white font-sans">
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 xl:px-32">
        {/* LOGO */}
        <div className="mb-10">
          <div className="flex items-center gap-2 bg-[#6D318C] text-white px-4 py-2 w-fit rounded-lg">
            <span className="font-black text-2xl italic tracking-tighter">
              X
            </span>
            <span className="text-[11px] tracking-[0.3em] font-bold border-l border-white/30 pl-2">
              FURNITURE
            </span>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto md:mx-0">
          <header className="space-y-3">
            <h1 className="text-4xl font-bold text-black tracking-tight">
              Welcome back
            </h1>
            <p className="text-black/60 text-base leading-relaxed">
              Please enter your details to sign in.
            </p>
          </header>

          {error && (
            <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
              <AlertCircle size={18} />
              <p className="text-sm font-semibold">{error}</p>
            </div>
          )}

          <form className="mt-10 space-y-5" onSubmit={handleLogin}>
            {/* EMAIL FIELD */}
            <div className="group">
              <label className="block text-sm font-bold text-black mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-black font-medium placeholder:text-black/30"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PASSWORD FIELD */}
            <div className="group">
              <label className="block text-sm font-bold text-black mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/40"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-black font-medium placeholder:text-black/30"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/40 hover:text-[#6D318C]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-sm text-black font-medium cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-[#6D318C] focus:ring-[#6D318C]"
                />
                <span>Remember my password</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-bold text-[#6D318C] hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* PRIMARY BUTTON */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#7B349D] text-white rounded-xl font-bold shadow-lg hover:bg-[#6a2d88] transition-all"
            >
              {isLoading ? "Signing in..." : "Sign in"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <footer className="mt-12 text-center md:text-left">
            <p className="text-sm text-black/60 font-medium">
              Don't have an account yet?
              <Link
                href="/sign-up"
                className="ml-1 text-[#6D318C] font-extrabold hover:underline"
              >
                Signup now
              </Link>
            </p>
          </footer>
        </div>
      </div>

      {/* RIGHT SIDE (Visuals) */}
      <div className="hidden md:flex flex-1 relative p-6 bg-white overflow-hidden">
        <div className="relative h-full w-full rounded-[48px] overflow-hidden group shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
