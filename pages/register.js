"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";
import OtpVerificationModal, { OTP_LENGTH } from "@/components/OtpVerificationModal";

const CLIENT_ROLE_ID = 2;
const textValue = (value) => value?.trim?.() || "";
const getPendingClientSignup = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const pendingSignup = JSON.parse(
      window.sessionStorage.getItem("apsaraPendingSignup") || "null"
    );

    return pendingSignup?.type === "client" ? pendingSignup : null;
  } catch {
    return null;
  }
};

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [registrationType, setRegistrationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [otpModalOpen, setOtpModalOpen] = useState(() =>
    Boolean(getPendingClientSignup())
  );
  const [robotChecked, setRobotChecked] = useState(false);

  // ALL FIELDS (UNCHANGED - for API payload)
  const [formData, setFormData] = useState(() => {
    const pendingSignup = getPendingClientSignup();

    return {
    username: "",
    password: "",
    confirmPassword: pendingSignup?.confirmPassword || "",
    firstName: "",
    middleName: "",
    lastName: "",

    email: pendingSignup?.email || "",
    phone: pendingSignup?.phone || "",

    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",

    gender: "",

    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    countryOfBirth: "",

    dateOfDeath: "",
    timeOfDeath: "",

    dateOfJoining: "",
    timeOfJoining: "",

    religion: "",
    caste: "",
    gotra: "",
    motherTongue: "",
    language: "",

    fatherName: "",
    motherName: "",

    spouseName: "",
    spouseRelationship: "",

    childName: "",

    otp: pendingSignup?.otp || "",
    ...(pendingSignup
      ? {
          username: pendingSignup.email || "",
          password: pendingSignup.password || "",
        }
      : {}),
    };
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    let newErrors = {};

    const fieldLabels = {
      username: t("register.email"),
      firstName: t("register.firstName"),
      phone: t("register.mobile"),
      gender: t("register.gender"),
      dateOfBirth: t("register.dateOfBirth"),
      placeOfBirth: t("register.birthPlace"),
      password: t("auth.password"),
      confirmPassword: t("register.confirmPassword"),
      otp: t("signup.otp"),
    };

    const requiredFields = Object.keys(fieldLabels);

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = t("register.required").replace(
          "{field}",
          fieldLabels[field]
        );
      }
    });

    // EMAIL VALIDATION (username treated as email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.username && !emailRegex.test(formData.username)) {
      newErrors.username = t("register.validEmail");
    }

    // PHONE VALIDATION
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = t("register.phoneDigits");
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = t("auth.passwordMin");
    }

    // CONFIRM PASSWORD MATCH
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = t("register.passwordsMismatch");
    }

    if (formData.otp && !new RegExp(`^[0-9]{${OTP_LENGTH}}$`).test(formData.otp)) {
      newErrors.otp = `OTP must be ${OTP_LENGTH} digits`;
    }

    // DOB basic check
    if (formData.dateOfBirth && isNaN(Date.parse(formData.dateOfBirth))) {
      newErrors.dateOfBirth = t("register.validDob");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      if (!new RegExp(`^[0-9]{${OTP_LENGTH}}$`).test(formData.otp)) {
        setOtpModalOpen(true);
      }
      return;
    }

    setLoading(true);

    try {
      const payload = {
        username: textValue(formData.username),
        password: formData.password,
        otp: textValue(formData.otp),
        roleId: CLIENT_ROLE_ID,

        clientDto: {
          publicId: "",

          firstName: textValue(formData.firstName),
          middleName: textValue(formData.middleName),
          lastName: textValue(formData.lastName),

          email: textValue(formData.username),
          phone: textValue(formData.phone),
          otp: textValue(formData.otp),

          gender: textValue(formData.gender),

          dateOfBirth: textValue(formData.dateOfBirth),
          placeOfBirth: textValue(formData.placeOfBirth),

          // keep backend-required structure intact
          timeOfBirth: "",
          countryOfBirth: "",

          address: "",
          city: "",
          state: "",
          pinCode: "",
          country: "India",

          dateOfDeath: "",
          timeOfDeath: "",

          dateOfJoining: "",
          timeOfJoining: "",

          religion: "",
          caste: "",
          gotra: "",
          motherTongue: "",
          language: "",

          fatherName: "",
          motherName: "",

          spouseName: "",
          spouseRelationship: "",

          childName: "",
        },
      };

      const res = await api.post("/authorization/auth/create-user", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      });

      if (!res?.success) {
        throw new Error(res?.message || t("register.failed"));
      }

      toast.success(res?.message || t("register.success"));
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("apsaraPendingSignup");
      }
      router.push("/login");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error?.response?.data?.errorDescription ||
        error?.response?.data?.message ||
        error?.message ||
        t("register.somethingWrong");

      toast.error(errorMessage);

      if (errorMessage.toLowerCase().includes("otp")) {
        setErrors((prev) => ({ ...prev, otp: errorMessage }));
        setOtpModalOpen(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (otp) => {
    setFormData((prev) => ({ ...prev, otp }));
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const handleOtpVerify = () => {
    if (!new RegExp(`^[0-9]{${OTP_LENGTH}}$`).test(formData.otp)) {
      setErrors((prev) => ({
        ...prev,
        otp: `OTP must be ${OTP_LENGTH} digits`,
      }));
      return;
    }

    setOtpModalOpen(false);
  };

  const selectedRegistrationType =
    registrationType || (router.query.type === "client" ? "client" : "");

  if (!selectedRegistrationType) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6ead7] px-3 py-4 text-stone-900 md:py-6">
        <div className="w-full max-w-4xl overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-52 overflow-hidden bg-[#fff4df] p-5 md:p-6">
            <img
              src="/Astrosignup.jpg"
              alt="ApsaraAstro registration"
              className="absolute inset-0 h-full w-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#fff7e8] via-[#fff7e8]/80 to-[#fff7e8]/35" />
            <div className="relative flex h-full min-h-40 flex-col justify-end">
              <p className="text-xs font-semibold uppercase text-amber-700">
                ApsaraAstro
              </p>
              <h1 className="mt-2 max-w-sm text-2xl font-semibold text-stone-950 md:text-3xl">
                {t("register.startPath")}
              </h1>
              <p className="mt-2 max-w-md text-sm leading-6 text-stone-600">
                {t("register.pathSubtitle")}
              </p>
            </div>
          </div>

          <div className="p-4 md:p-6">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase text-amber-700">
                {t("register.registration")}
              </p>
              <h2 className="mt-1 text-xl font-semibold text-stone-950">
                {t("register.chooseType")}
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                {t("register.switchBefore")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => router.push("/signup?type=astrologer")}
              className="group rounded-lg border border-amber-100 bg-[#fffbf5] p-4 text-left shadow-sm transition hover:border-amber-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-semibold text-stone-950">
                    {t("register.astrologer")}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-stone-600">
                    {t("register.astrologerDesc")}
                  </span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-semibold text-amber-900 transition group-hover:bg-amber-700 group-hover:text-white">
                  A
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push("/signup?type=client")}
              className="group rounded-lg border border-amber-100 bg-[#fffbf5] p-4 text-left shadow-sm transition hover:border-amber-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-300"
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-semibold text-stone-950">
                    {t("register.client")}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-stone-600">
                    {t("register.clientDesc")}
                  </span>
                </span>
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100 text-xs font-semibold text-rose-800 transition group-hover:bg-rose-600 group-hover:text-white">
                  C
                </span>
              </span>
            </button>
            </div>

            <div className="mt-5 rounded-lg border border-amber-100 bg-[#fffbf5] p-3 text-sm text-stone-600">
              {t("register.alreadyAccount")}{" "}
              <Link href="/login" className="font-medium text-amber-800">
                {t("auth.login")}
              </Link>
            </div>
          </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6ead7] px-3 py-4 text-stone-900 md:py-6">
      <ToastContainer position="top-right" autoClose={3000} />
      <OtpVerificationModal
        open={otpModalOpen}
        email={formData.username}
        otp={formData.otp}
        error={errors.otp}
        signupType="client"
        onChange={handleOtpChange}
        onVerify={handleOtpVerify}
      />
      <div className="grid w-full max-w-5xl overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative hidden min-h-[560px] overflow-hidden bg-[#fff4df] lg:block">
          <img
            src="/Astrosignup.jpg"
            alt="ApsaraAstro client signup"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="text-xs font-semibold uppercase text-amber-100">
              {t("register.clientRegistration")}
            </p>
            <h2 className="mt-2 max-w-sm text-3xl font-semibold leading-tight text-white">
              {t("register.createAccountTitle")}
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-amber-50">
              {t("register.createAccountDesc")}
            </p>
          </div>
        </div>

        <div>
        <div className="border-b border-amber-100 bg-[#fff7e8] p-4 md:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-amber-700">
                {t("register.clientSignup")}
              </p>
            <h1 className="mt-1 text-2xl font-semibold text-stone-950">
              {t("register.welcomeTo")}{" "}
              <span className="text-xl font-semibold md:text-2xl">
                Apsara
                <span className="text-rose-600">Talk</span>
              </span>
            </h1>
            <p className="mt-1 text-sm text-stone-600">
              {t("register.createJourney")}
            </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setRegistrationType("");
                router.push("/register");
              }}
              className="h-9 rounded-md border border-amber-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition hover:border-amber-400 hover:text-amber-800"
            >
              {t("register.changeType")}
            </button>
          </div>
        </div>

        <div className="p-4 md:p-5">
          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2"
          >
            <Input
              label={t("register.firstName")}
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />

            <Input
              label={t("register.middleName")}
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />

            <Input
              label={t("register.lastName")}
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <Input
              label={t("register.email")}
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />

            <Input
              label={t("register.mobile")}
              name="phone"
              maxLength={10}
              value={formData.phone}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  phone: e.target.value.replace(/\D/g, ""),
                });
                setErrors({ ...errors, phone: "" });
              }}
              error={errors.phone}
            />

            <Input
              label={t("register.dateOfBirth")}
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />

            <Input
              label={t("register.birthPlace")}
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              error={errors.placeOfBirth}
            />

            <Select
              label={t("register.gender")}
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder={t("register.selectGender")}
              options={[
                { value: "Male", label: t("register.male") },
                { value: "Female", label: t("register.female") },
                { value: "Other", label: t("register.other") },
              ]}
              error={errors.gender}
            />

            <div className="relative">
              <Input
                label={t("auth.password")}
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                inputClassName="pr-16"
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

            <div className="relative">
              <Input
                label={t("register.confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                inputClassName="pr-16"
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2 top-7 flex h-8 w-8 items-center justify-center rounded-full text-amber-800 transition hover:bg-amber-50 hover:text-amber-950"
                aria-label={
                  showConfirmPassword ? t("register.hide") : t("register.show")
                }
              >
                <PasswordVisibilityIcon visible={showConfirmPassword} />
              </button>
            </div>

            {/* ROBOT CHECK */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 rounded-sm border border-amber-100 bg-white p-2.5 shadow-sm shadow-amber-900/10">
                <input
                  type="checkbox"
                  checked={robotChecked}
                  onChange={(e) => {
                    setRobotChecked(e.target.checked);
                    setErrors({ ...errors, robot: "" });
                  }}
                  className="h-4 w-4 accent-amber-600"
                />
                <span className="text-sm text-stone-700">{t("register.notRobot")}</span>
              </div>

              {errors.robot && (
                <p className="mt-2 text-xs text-red-600">{errors.robot}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-amber-700 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    {t("register.creating")}
                  </>
                ) : (
                  t("register.createAccount")
                )}
              </button>
            </div>

            <div className="md:col-span-2 text-center text-sm text-stone-500">
              {t("register.alreadyAccount")}{" "}
              <Link href="/login" className="font-medium text-amber-800">
                {t("auth.login")}
              </Link>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ label, error, inputClassName = "", ...props }) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <input
        {...props}
        className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${inputClassName}
        ${error ? "border-red-500" : "border-amber-100"}`}
      />
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

/* SELECT */
function Select({ label, options, error, placeholder, ...props }) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <select
        {...props}
        className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15
        ${error ? "border-red-500" : "border-amber-100"}`}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
