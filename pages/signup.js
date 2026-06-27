"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";
import { saveSignupDraft } from "@/redux/slices/signupDraftSlice";

const validTypes = ["client", "astrologer"];

const initialFormData = {
  username: "",
  password: "",
};

const textValue = (value) => value?.trim?.() || "";

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useLanguage();
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const loading = false;
  const [showPassword, setShowPassword] = useState(false);

  const signupType = useMemo(() => {
    const type = String(router.query.type || "").toLowerCase();
    return validTypes.includes(type) ? type : "client";
  }, [router.query.type]);

  const isAstrologer = signupType === "astrologer";

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    const type = String(router.query.type || "").toLowerCase();

    if (type === "astrologer") {
      router.replace("/astrologer-register");
      return;
    }

    if (!validTypes.includes(type)) {
      router.replace("/signup?type=client");
    }
  }, [router]);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const labels = {
      username: t("auth.username"),
      password: t("auth.password"),
    };

    Object.entries(labels).forEach(([name, label]) => {
      if (!textValue(formData[name])) {
        nextErrors[name] = t("register.required").replace("{field}", label);
      }
    });

    if (
      formData.username &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)
    ) {
      nextErrors.username = t("register.validEmail");
    }

    if (formData.password && formData.password.length < 6) {
      nextErrors.password = t("auth.passwordMin");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildSignupPayload = () => ({
    username: textValue(formData.username),
    password: formData.password,
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const payload = buildSignupPayload();
    dispatch(saveSignupDraft(payload));
    router.push(isAstrologer ? "/astrologer-register" : "/register?type=client");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6ead7] px-3 py-4 text-stone-900 md:py-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10 md:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[520px] overflow-hidden bg-[#fff4df] md:block">
          <img
            src="/Astrosignup.jpg"
            alt="ApsaraAstro signup"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="p-4 md:p-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-700">
                {isAstrologer ? t("register.astrologer") : t("register.client")}
              </p>
              <h1 className="mt-1 text-2xl font-semibold text-stone-950">
                {t("signup.title")}{" "}
                <span className="text-white [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Apsara
                </span>
                <span className="text-[#dfff00] [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Astro
                </span>
              </h1>
              <p className="mt-2 text-sm text-stone-600">
                {isAstrologer
                  ? t("signup.astrologerSubtitle")
                  : t("signup.clientSubtitle")}
              </p>
            </div>
            <Link
              href="/register"
              className="h-9 rounded-full border border-[#d8ce76] bg-[#fbf8cc] px-3 py-2 text-center text-sm font-black text-[#3f3a15] shadow-sm transition hover:bg-[#f5efbf] sm:w-[35%]"
            >
              {t("register.changeType")}
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t("auth.username")}
              name="username"
              value={formData.username}
              onChange={updateField}
              error={errors.username}
              placeholder={t("auth.enterUsername")}
            />

            <div className="relative">
              <Input
                label={t("auth.password")}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={updateField}
                error={errors.password}
                inputClassName="pr-12"
                placeholder={t("auth.enterPassword")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-7 flex h-8 w-8 items-center justify-center rounded-full text-amber-800 transition hover:bg-amber-50 hover:text-amber-950"
                aria-label={showPassword ? t("register.hide") : t("register.show")}
              >
                <PasswordVisibilityIcon visible={showPassword} />
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-[#dfff00] text-sm font-black text-[#211704] shadow-[0_14px_26px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {t("signup.creating")}
                </>
              ) : isAstrologer ? (
                t("signup.continueAstrologer")
              ) : (
                "Next"
              )}
            </button>

            <div className="text-center text-sm text-stone-500">
              {t("register.alreadyAccount")}{" "}
              <Link href="/login" className="font-medium text-amber-800">
                {t("auth.login")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  error,
  helper,
  onChange,
  inputClassName = "",
  ...props
}) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <input
        {...props}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${inputClassName} ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      />
      {helper && !error && <p className="mt-1 text-xs text-stone-500">{helper}</p>}
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
