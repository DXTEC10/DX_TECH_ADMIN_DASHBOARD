"use client";

import React, { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  AtSign,
  User,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SignupPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Updated state to include email
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organisationName: "",
    password: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://dxtechbackend-stagging.up.railway.app/api/auth/signup",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Registration failed. Please try again.",
        );
      }

      if (data.token) {
        localStorage.setItem("dx_token", data.token);
      }

      alert("Account created successfully!");
      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white font-sans selection:bg-purple-100">
      {/* LEFT SIDE: SIGNUP FORM */}
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 xl:px-32">
        <div className="mb-10 animate-in fade-in slide-in-from-left duration-700">
          <div className="flex items-center gap-2 bg-[#6D318C] text-white px-4 py-2 w-fit rounded-lg shadow-sm">
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
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Create your account
            </h1>
            <p className="text-gray-500 text-base leading-relaxed">
              Join our network of elite designers and start building
              extraordinary spaces today.
            </p>
          </header>

          {/* ERROR ALERT */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
              <AlertCircle size={18} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="mt-10 space-y-5" onSubmit={handleSignup}>
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 group-focus-within:text-purple-700 transition-colors">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jane Doe"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900"
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 group-focus-within:text-purple-700 transition-colors">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  required
                  placeholder="jane@company.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Organisation Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 group-focus-within:text-purple-700 transition-colors">
                Organisation name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <AtSign size={18} />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Your company or studio name"
                  className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      organisationName: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5 group-focus-within:text-purple-700 transition-colors">
                Create Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="At least 8 characters"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#7B349D] text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6a2d88] transition-all active:scale-[0.98] disabled:opacity-70"
            >
              {isLoading ? "Creating account..." : "Get Started"}
              {!isLoading && <ArrowRight size={18} />}
            </button>
          </form>

          <footer className="mt-12 text-center md:text-left">
            <p className="text-sm text-gray-500 font-medium">
              Already have an account?
              <Link
                href="/login"
                className="ml-1 text-purple-800 font-extrabold hover:text-purple-600 transition-colors hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </footer>
        </div>
      </div>

      {/* RIGHT SIDE: BRAND VISUALS (No changes needed) */}
      <div className="hidden md:flex flex-1 relative p-6 bg-white overflow-hidden">
        <div className="relative h-full w-full rounded-[48px] overflow-hidden group shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80"
            alt="Designer Studio"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
