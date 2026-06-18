"use client";

import Link from "next/link";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/utils/api";

const textValue = (value) => value?.trim?.() || "";

export default function ResetPasswordPage() {
  const router = useRouter();
  const resetToken = useMemo(() => {
    const token = router.query.resetToken;
    return Array.isArray(token) ? token[0] || "" : token || "";
  }, [router.query.resetToken]);

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!textValue(resetToken)) {
      nextErrors.resetToken = "Reset token is missing or invalid.";
    }

    if (!formData.password) {
      nextErrors.password = "New password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/authorization/auth/reset-password", {
        username: "",
        password: formData.password,
        resetToken: textValue(resetToken),
      });

      if (!res?.success) {
        throw new Error(res?.message || "Unable to change password.");
      }

      toast.success(
        res?.message ||
          "New password has been updated successfully, please login again."
      );

      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      toast.error(
        error?.response?.data?.errorDescription ||
          error?.response?.data?.message ||
          error?.message ||
          "Unable to change password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6ead7] px-3 py-4 text-stone-900 md:py-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[520px] overflow-hidden bg-[#fff4df] md:block">
          <Image
            src="/Astrosignup.jpg"
            alt="ApsaraAstro password reset"
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
              Create a new secure password.
            </h2>
            <p className="mt-2 text-sm leading-6 text-white/78">
              Use the reset link from your email to update your account password.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-amber-700">
              Reset Password
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-950">
              Change your{" "}
              <span className="text-xl font-semibold md:text-2xl">
                <span className="text-white [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Apsara
                </span>
                <span className="text-[#dfff00] [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Astro
                </span>
              </span>{" "}
              password
            </h1>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Enter and confirm your new password to finish resetting your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errors.resetToken && (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {errors.resetToken}
              </div>
            )}

            <PasswordField
              label="New Password"
              value={formData.password}
              visible={showPassword}
              error={errors.password}
              placeholder="Enter new password"
              onChange={(value) => updateField("password", value)}
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            <PasswordField
              label="Confirm Password"
              value={formData.confirmPassword}
              visible={showConfirmPassword}
              error={errors.confirmPassword}
              placeholder="Confirm new password"
              onChange={(value) => updateField("confirmPassword", value)}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#dfff00] text-sm font-black text-[#211704] shadow-[0_14px_26px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Changing password...
                </>
              ) : (
                "Change Password"
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
        </div>
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  visible,
  error,
  placeholder,
  onChange,
  onToggle,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={`mt-1 h-10 w-full rounded-sm border bg-white px-3 pr-12 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
            error ? "border-red-500" : "border-amber-100"
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-2 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-amber-800 transition hover:bg-amber-50 hover:text-amber-950"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          <PasswordVisibilityIcon visible={visible} />
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

function PasswordVisibilityIcon({ visible }) {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      {visible ? (
        <>
          <path d="M2 2l20 20" />
          <path d="M10.6 10.6a2 2 0 002.8 2.8" />
          <path d="M9.9 4.2A10.6 10.6 0 0112 4c5 0 9 4 10 8a11.8 11.8 0 01-3.1 4.8" />
          <path d="M6.6 6.6A11.8 11.8 0 002 12c.6 2.1 2.1 4.1 4.1 5.5A10.5 10.5 0 0012 20a10.8 10.8 0 004.1-.8" />
        </>
      ) : (
        <>
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
          <circle cx="12" cy="12" r="3" />
        </>
      )}
    </svg>
  );
}
