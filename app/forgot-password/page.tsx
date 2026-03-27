"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AtSign,
  ArrowRight,
  ArrowLeft,
  MailCheck,
  AlertCircle,
} from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://dxtechbackend-stagging.up.railway.app/api/auth/forgot-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Email not found. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white font-sans selection:bg-purple-100">
      <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 xl:px-32">
        <div className="mb-10">
          <Link
            href="/login"
            className="flex items-center gap-2 bg-[#6D318C] text-white px-4 py-2 w-fit rounded-lg shadow-sm"
          >
            <span className="font-black text-2xl italic tracking-tighter">
              X
            </span>
            <span className="text-[11px] tracking-[0.3em] font-bold border-l border-white/30 pl-2">
              FURNITURE
            </span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto md:mx-0">
          {!isSubmitted ? (
            <>
              <header className="space-y-3">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                  Forgot password?
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                  No worries! Enter the email associated with your organisation
                  and we'll send you a link.
                </p>
              </header>

              {error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} />
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5 group-focus-within:text-purple-700 transition-colors">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                      <AtSign size={18} />
                    </div>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-gray-900"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <button
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#7B349D] text-white rounded-xl font-bold shadow-lg shadow-purple-200 hover:bg-[#6a2d88] transition-all disabled:opacity-70"
                >
                  {isLoading ? "Sending link..." : "Send Reset Link"}
                  {!isLoading && <ArrowRight size={18} />}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center md:text-left animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-purple-100 text-purple-700 rounded-2xl flex items-center justify-center mb-6 mx-auto md:mx-0">
                <MailCheck size={32} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-3">
                Check your email
              </h1>
              <p className="text-gray-500 mb-8">
                We've sent a link to{" "}
                <span className="font-semibold text-gray-900">{email}</span>.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-purple-800 font-bold hover:underline"
              >
                Didn't get it? Try again
              </button>
            </div>
          )}

          <footer className="mt-12 text-center md:text-left">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-purple-800 transition-colors"
            >
              <ArrowLeft size={16} /> Back to Sign in
            </Link>
          </footer>
        </div>
      </div>

      {/* Visual side matches the theme */}
      <div className="hidden md:flex flex-1 relative p-6 bg-white overflow-hidden">
        <div className="relative h-full w-full rounded-[48px] overflow-hidden group shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80"
            alt="Living Room"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-16 left-0 right-0 px-12 text-center text-white">
            <h2 className="text-2xl font-semibold mb-4">Secure & Seamless.</h2>
            <p className="text-white/80 text-sm max-w-sm mx-auto">
              We take your data security seriously. Resetting your password
              ensures your workspace remains private.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
