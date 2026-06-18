"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import { toast, ToastContainer } from "react-toastify";
import api from "@/utils/api";
import { stripAuthFields } from "@/utils/authState";
import {
  decodeAccessToken,
  extractAccessToken,
  setAccessToken,
} from "@/utils/tokenStore";
import { useLanguage } from "@/context/LanguageContext";

const ASTROLOGER_ROLE = "ROLE_ASTROLOGER";

function normalizeRoles(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((role) => String(role).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

function hasAstrologerRole(payload) {
  return [
    ...normalizeRoles(payload?.roles),
    ...normalizeRoles(payload?.authorities),
  ].includes(ASTROLOGER_ROLE);
}

async function loadLoggedInProfile(isAstrologer, fallbackUser) {
  if (isAstrologer) {
    try {
      const astrologerProfileRes = await api.get(
        "/authorization/astrologer/profile-me"
      );

      if (astrologerProfileRes?.success && astrologerProfileRes?.data) {
        return stripAuthFields(astrologerProfileRes.data);
      }
    } catch {
      try {
        const astrologersRes = await api.get(
          "/authorization/info/get-all-astrologers"
        );
        const astrologers = Array.isArray(astrologersRes?.data)
          ? astrologersRes.data
          : [];
        const match = astrologers.find((astro) =>
          [
            astro?.publicId,
            astro?.userId,
            astro?.username,
            astro?.email,
            astro?.phone,
          ].some((value) => value && String(value) === String(fallbackUser?.uid))
        );

        if (match) {
          return match;
        }
      } catch {
        return fallbackUser;
      }
    }

    return fallbackUser;
  }

  const profileRes = await api.get("/authorization/client/profile-me");

  return profileRes?.success && profileRes?.data
    ? stripAuthFields(profileRes.data)
    : null;
}

export default function LoginPage({ mode = "client" }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useLanguage();
  const isAstrologerLogin = mode === "astrologer";

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!formData.username.trim()) {
      newErrors.username = t("auth.usernameRequired");
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = t("auth.passwordRequired");
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = t("auth.passwordMin");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });

    // clear error while typing
    setErrors({ ...errors, [field]: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setIsLoggingIn(true);
      const res = await api.post("/authorization/auth/login", formData);

      if (!res.success) {
        throw new Error(res?.message || t("auth.loginFailed"));
      }

      toast.success(res?.message || t("auth.loginSuccessful"));

      const accessToken = extractAccessToken(res);

      if (accessToken) {
        setAccessToken(accessToken);
      }

      const tokenPayload = decodeAccessToken(accessToken);
      const isAstrologer = hasAstrologerRole(tokenPayload);
      const destination = isAstrologer ? "/astrologer-profile" : "/";

      if (isAstrologerLogin && !isAstrologer) {
        toast.info(t("auth.clientDetected"));
      }

      const fallbackUser = {
        username: formData.username,
        uid: tokenPayload?.uid,
        roles: tokenPayload?.roles,
        authorities: tokenPayload?.authorities,
      };
      const user =
        (await loadLoggedInProfile(isAstrologer, fallbackUser)) ||
        stripAuthFields(res.data) ||
        fallbackUser;

      dispatch(
        login({
          user: {
            ...user,
            roles: tokenPayload?.roles || user?.roles,
            authorities: tokenPayload?.authorities || user?.authorities,
          },
          accessToken,
        })
      );

      router.push(destination);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          t("auth.loginFailed")
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async () => {
    const username = formData.username.trim();

    if (!username) {
      setErrors((prev) => ({
        ...prev,
        username: t("auth.usernameRequired"),
      }));
      return;
    }

    try {
      setIsSendingReset(true);
      const res = await api.post("/authorization/auth/forgot-password", null, {
        params: { username },
      });

      if (!res?.success) {
        throw new Error(res?.message || t("auth.forgotPasswordFailed"));
      }
    console.log(res.message)
      toast.success(res?.message || t("auth.forgotPasswordSent"));
    } catch (error) {
      toast.error(
        error?.response?.data?.errorDescription ||
          error?.response?.data?.message ||
          error?.message ||
          t("auth.forgotPasswordFailed")
      );
    } finally {
      setIsSendingReset(false);
    }
  };
//  const handleLogin = (e) => {
//     e.preventDefault();

//     dispatch(
//       login({
//         name: formData.username,
//         image: "https://i.pravatar.cc/150?img=12",
//       })
//     );

//     router.push("/");
//   };
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6ead7] px-3 py-4 text-stone-900 md:py-6">
      <ToastContainer position="top-right" autoClose={2500} />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10 md:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT IMAGE */}
        <div className="relative hidden min-h-[520px] overflow-hidden bg-[#fff4df] md:block">
          <img
            src="/Astrosignup.jpg"
            alt="login"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/25 to-transparent" />
        </div>

        {/* RIGHT FORM */}
        <div className="p-4 md:p-6 lg:p-8">

          <div className="mb-6">
            <p className="text-xs font-semibold uppercase text-amber-700">
              {isAstrologerLogin ? t("auth.astrologerLogin") : t("auth.login")}
            </p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-950">
              {isAstrologerLogin ? t("auth.astrologerLogin") : t("auth.loginTitle")}{" "}
              <span className="text-xl font-semibold md:text-2xl">
                Apsara
                <span className="text-rose-600">Talk</span>
              </span>
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              {isAstrologerLogin
                ? t("auth.astrologerLoginSubtitle")
                : t("auth.loginSubtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">

            {/* USERNAME */}
            <div>
              <label className="text-xs font-medium text-stone-700">{t("auth.username")}</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
                  errors.username ? "border-red-500" : "border-amber-100"
                }`}
                placeholder={t("auth.enterUsername")}
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-600">{errors.username}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-medium text-stone-700">{t("auth.password")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 pr-12 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
                    errors.password ? "border-red-500" : "border-amber-100"
                  }`}
                  placeholder={t("auth.enterPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-amber-800 transition hover:bg-amber-50 hover:text-amber-950"
                  aria-label={showPassword ? t("register.hide") : t("register.show")}
                >
                  <PasswordVisibilityIcon visible={showPassword} />
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>

            {/* FORGOT */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isSendingReset}
                className="text-sm text-amber-800 hover:text-amber-950 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSendingReset
                  ? t("auth.sendingResetLink")
                  : t("auth.forgotPassword")}
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-amber-700 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingIn ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  {t("auth.signingIn")}
                </>
              ) : isAstrologerLogin ? (
                t("auth.openAstrologerProfile")
              ) : (
                t("auth.login")
              )}
            </button>

            {/* REGISTER */}
            <div className="text-center text-sm text-stone-500">
              {t("auth.noAccount")}{" "}
              <Link
                href="/register"
                className="font-medium text-amber-800 hover:text-amber-950"
              >
                {t("auth.registerNow")}
              </Link>
            </div>

          </form>
        </div>
      </div>
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
