"use client";

/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

const CLIENT_ROLE_ID = 2;
const textValue = (value) => value?.trim?.() || "";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();

  const [registrationType, setRegistrationType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [robotChecked, setRobotChecked] = useState(false);

  // ALL FIELDS (UNCHANGED - for API payload)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    middleName: "",
    lastName: "",

    email: "",
    phone: "",

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

    // DOB basic check
    if (formData.dateOfBirth && isNaN(Date.parse(formData.dateOfBirth))) {
      newErrors.dateOfBirth = t("register.validDob");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        username: textValue(formData.username),
        password: formData.password,
        roleId: CLIENT_ROLE_ID,

        clientDto: {
          publicId: "",

          firstName: textValue(formData.firstName),
          middleName: textValue(formData.middleName),
          lastName: textValue(formData.lastName),

          email: textValue(formData.username),
          phone: textValue(formData.phone),

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
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.errorDescription ||
          error?.response?.data?.message ||
          error?.message ||
          t("register.somethingWrong")
      );
    } finally {
      setLoading(false);
    }
  };

  if (!registrationType) {
    return (
      <div className="min-h-screen bg-[#050816] px-4 py-6 md:py-8 flex items-center justify-center">
        <div className="fixed inset-0">
          <img
            src="/Astrosignup.jpg"
            alt=""
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[#050816]/80" />
        </div>

        <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#0f1535]/95 shadow-2xl backdrop-blur grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative min-h-64 overflow-hidden bg-[#0b1028] p-7 md:p-9">
            <img
              src="/Astrosignup.jpg"
              alt="ApsaraTalk registration"
              className="absolute inset-0 h-full w-full object-cover opacity-45"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/60 to-transparent" />
            <div className="relative flex h-full min-h-52 flex-col justify-end">
              <p className="text-sm font-medium text-purple-200">
                ApsaraTalk
              </p>
              <h1 className="mt-2 max-w-sm text-3xl font-semibold text-white md:text-4xl">
                {t("register.startPath")}
              </h1>
              <p className="mt-3 max-w-md text-sm leading-6 text-gray-200">
                {t("register.pathSubtitle")}
              </p>
            </div>
          </div>

          <div className="p-6 md:p-9">
            <div className="mb-7">
              <p className="text-sm font-medium text-purple-300">
                {t("register.registration")}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {t("register.chooseType")}
              </h2>
              <p className="mt-2 text-sm text-gray-300">
                {t("register.switchBefore")}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
            <button
              type="button"
              onClick={() => router.push("/astrologer-register")}
              className="group text-left bg-[#121735] border border-white/10 hover:border-purple-400 hover:bg-[#171d42] rounded-2xl p-5 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-lg font-semibold text-white">
                    {t("register.astrologer")}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-gray-300">
                    {t("register.astrologerDesc")}
                  </span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600/20 text-purple-200 transition group-hover:bg-purple-600 group-hover:text-white">
                  A
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setRegistrationType("client")}
              className="group text-left bg-[#121735] border border-white/10 hover:border-purple-400 hover:bg-[#171d42] rounded-2xl p-5 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <span className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-lg font-semibold text-white">
                    {t("register.client")}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-gray-300">
                    {t("register.clientDesc")}
                  </span>
                </span>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-pink-200 transition group-hover:bg-pink-500 group-hover:text-white">
                  C
                </span>
              </span>
            </button>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
              {t("register.alreadyAccount")}{" "}
              <Link href="/login" className="font-medium text-purple-300">
                {t("auth.login")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050816] px-4 py-6 md:py-8 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="fixed inset-0">
        <img
          src="/Astrosignup.jpg"
          alt=""
          className="h-full w-full object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-[#050816]/88" />
      </div>

      <div className="relative w-full max-w-7xl bg-[#0f1535]/95 rounded-3xl overflow-hidden shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] backdrop-blur">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative min-h-[720px] items-end bg-[#0b1028] p-10">
          <img
            src={"/Astrosignup.jpg"}
            className="absolute inset-0 w-full h-full object-cover opacity-55"
            alt="register"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-[#050816]/45 to-transparent" />
          <div className="relative max-w-md">
            <p className="text-sm font-medium text-purple-200">
              {t("register.clientRegistration")}
            </p>
            <h1 className="mt-2 text-4xl font-semibold leading-tight text-white">
              {t("register.createAccountTitle")}
            </h1>
            <p className="mt-4 text-sm leading-6 text-gray-200">
              {t("register.createAccountDesc")}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-5 md:p-8 lg:p-10">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-medium text-purple-300">
                {t("register.clientSignup")}
              </p>
            <h1 className="text-2xl font-semibold text-white">
              {t("register.welcomeTo")}{" "}
              <span className="text-xl md:text-2xl font-semibold">
                Apsara
                <span className="text-pink-400">Talk</span>
              </span>{" "}
              ✨
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              {t("register.createJourney")}
            </p>
            </div>
            <button
              type="button"
              onClick={() => setRegistrationType("")}
              className="h-10 rounded-xl border border-white/10 px-4 text-sm text-gray-300 hover:border-purple-400 hover:text-white"
            >
              {t("register.changeType")}
            </button>
          </div>

          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-5"
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
                className="absolute right-3 top-9 text-sm text-purple-200 hover:text-white"
              >
                {showPassword ? t("register.hide") : t("register.show")}
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
                className="absolute right-3 top-9 text-sm text-purple-200 hover:text-white"
              >
                {showConfirmPassword ? t("register.hide") : t("register.show")}
              </button>
            </div>

            {/* ROBOT CHECK */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 bg-[#121735] border border-white/10 rounded-xl p-3">
                <input
                  type="checkbox"
                  checked={robotChecked}
                  onChange={(e) => {
                    setRobotChecked(e.target.checked);
                    setErrors({ ...errors, robot: "" });
                  }}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-gray-300">{t("register.notRobot")}</span>
              </div>

              {errors.robot && (
                <p className="text-red-400 text-xs mt-2">{errors.robot}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full h-[52px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-950/30"
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

            <div className="md:col-span-2 text-center text-sm text-gray-400">
              {t("register.alreadyAccount")}{" "}
              <Link href="/login" className="font-medium text-purple-300">
                {t("auth.login")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ label, error, inputClassName = "", ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        {...props}
        className={`w-full mt-1 h-[44px] bg-[#121735] border rounded-xl px-3 text-white outline-none transition focus:border-purple-500 focus:bg-[#171d42] ${inputClassName}
        ${error ? "border-red-500" : "border-white/10"}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* SELECT */
function Select({ label, options, error, placeholder, ...props }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        {...props}
        className={`w-full mt-1 h-[44px] bg-[#121735] border rounded-xl px-3 text-white outline-none transition focus:border-purple-500 focus:bg-[#171d42]
        ${error ? "border-red-500" : "border-white/10"}`}
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map((option) => (
          <option key={option.value || option} value={option.value || option}>
            {option.label || option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
