"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedIdentifier, setSubmittedIdentifier] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedIdentifier = identifier.trim();

    if (!trimmedIdentifier) {
      setError("Enter your email or username");
      return;
    }

    setError("");
    setIsSubmitting(true);

    window.setTimeout(() => {
      setSubmittedIdentifier(trimmedIdentifier);
      setIsSubmitting(false);
    }, 650);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6ead7] px-3 py-4 text-stone-900 md:py-6">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[520px] overflow-hidden bg-[#fff4df] md:block">
          <Image
            src="/Astrosignup.jpg"
            alt="Apsara Talk password reset"
            fill
            sizes="(min-width: 768px) 45vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-stone-950/30 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-white/20 bg-white/10 p-4 text-white backdrop-blur-md">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100">
              Account Recovery
            </p>
            <h2 className="mt-2 text-2xl font-semibold leading-tight">
              Restore access with a secure reset link.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Enter the email or username linked to your account and follow the instructions.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-amber-700">
              Forgot Password
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-950">
              Reset your{" "}
              <span className="text-xl font-semibold md:text-2xl">
                Apsara<span className="text-rose-600">Talk</span>
              </span>{" "}
              password
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              We will help you get back into your account. Use the email or username you registered with.
            </p>
          </div>

          {submittedIdentifier ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-stone-950">
                Check your reset instructions
              </h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                If an account exists for <span className="font-semibold text-stone-900">{submittedIdentifier}</span>, reset instructions will be sent shortly.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedIdentifier("");
                    setIdentifier("");
                  }}
                  className="flex h-10 flex-1 items-center justify-center rounded-md border border-amber-200 bg-white text-sm font-semibold text-amber-800 transition hover:border-amber-300 hover:text-amber-950"
                >
                  Try another account
                </button>
                <Link
                  href="/login"
                  className="flex h-10 flex-1 items-center justify-center rounded-md bg-amber-700 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-stone-700">
                  Email or Username
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(event) => {
                    setIdentifier(event.target.value);
                    setError("");
                  }}
                  className={`mt-1 h-10 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
                    error ? "border-red-500" : "border-amber-100"
                  }`}
                  placeholder="Enter email or username"
                />
                {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
              </div>

              <div className="rounded-lg border border-amber-100 bg-[#fffbf5] p-3 text-sm leading-6 text-stone-600">
                For your security, we only show a confirmation message. Check your email or contact support if you need help.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-amber-700 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Sending instructions...
                  </>
                ) : (
                  "Send reset instructions"
                )}
              </button>

              <div className="text-center text-sm text-stone-500">
                Remembered your password?{" "}
                <Link
                  href="/login"
                  className="font-medium text-amber-800 hover:text-amber-950"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
