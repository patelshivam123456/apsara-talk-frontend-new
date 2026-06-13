"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "@/utils/api";
import { useLanguage } from "@/context/LanguageContext";

const ASTROLOGER_ROLE_ID = 3;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "application/pdf"];
const expertiseOptions = [
  "Astrology",
  "Numerology",
  "Vastu",
  "Palmistry",
  "Graphology",
  "Reiki",
  "Tarot",
];
const consultationOptions = ["Chat", "Call", "Video"];

const tabs = [
  "astroReg.tab1",
  "astroReg.tab2",
  "astroReg.tab3",
  "astroReg.tab4",
];
const tabDescriptions = [
  "astroReg.desc1",
  "astroReg.desc2",
  "astroReg.desc3",
  "astroReg.desc4",
];
const tabIcons = ["01", "02", "03", "04"];

const initialFormData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  fullAddress: "",
  pincode: "",
  city: "",
  state: "",
  languagesKnown: [],
  expertise: [],
  aboutYourself: "",
  consultationModes: [],
  aadharFront: [],
  aadharBack: [],
  educationalCertificates: [],
  certificateDocuments: [],
  experienceLetter: [],
  passportPhoto: [],
  declarationAccepted: false,
  digitalSignature: "",
  declarationDate: "",
  password: "",
  confirmPassword: "",
};

const textValue = (value) => value?.trim?.() || "";
const fileMeta = (files) =>
  files.map((file) => ({
    name: file.name,
    size: file.size,
    type: file.type,
  }));
const requiredFields = [
  ["fullName", "astroReg.fullName"],
  ["email", "astroReg.emailAddress"],
  ["mobileNumber", "astroReg.mobileNumber"],
  ["pincode", "astroReg.pincode"],
  ["city", "astroReg.city"],
  ["state", "astroReg.state"],
  ["gender", "register.gender"],
  ["dateOfBirth", "register.dateOfBirth"],
];

export default function AstrologerRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [languageDraft, setLanguageDraft] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const progress = useMemo(
    () => Math.round(((activeTab + 1) / tabs.length) * 100),
    [activeTab]
  );
  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const fetchLocationByPincode = async (pincode) => {
    setPincodeLoading(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();
      const postOffice = data?.[0]?.PostOffice?.[0];

      if (!postOffice) {
        setErrors((prev) => ({
          ...prev,
          pincode: "Enter valid pincode",
        }));
        return;
      }

      setFormData((prev) =>
        prev.pincode === pincode
          ? {
              ...prev,
              city: postOffice.District || prev.city,
              state: postOffice.State || prev.state,
            }
          : prev
      );
      setErrors((prev) => ({ ...prev, city: "", state: "", pincode: "" }));
    } catch {
      setErrors((prev) => ({
        ...prev,
        pincode: "Unable to fetch city and state",
      }));
    } finally {
      setPincodeLoading(false);
    }
  };

  const updatePincode = (name, value) => {
    const pincode = value.replace(/\D/g, "").slice(0, 6);
    updateField(name, pincode);

    if (pincode.length === 6) {
      fetchLocationByPincode(pincode);
    }
  };

  const toggleArrayValue = (name, value) => {
    setFormData((prev) => {
      const current = prev[name];
      return {
        ...prev,
        [name]: current.includes(value)
          ? current.filter((item) => item !== value)
          : [...current, value],
      };
    });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const updateFiles = (name, files, multiple = false, maxFiles) => {
    const selectedFiles = Array.from(files || []);
    const invalidFile = selectedFiles.find(
      (file) => !ALLOWED_FILE_TYPES.includes(file.type)
    );

    if (invalidFile) {
      setErrors((prev) => ({
        ...prev,
        [name]: t("astroReg.invalidFile"),
      }));
      return;
    }

    const nextFiles = multiple
      ? [...formData[name], ...selectedFiles]
      : selectedFiles.slice(0, 1);
    updateField(name, maxFiles ? nextFiles.slice(0, maxFiles) : nextFiles);
  };

  const addLanguage = () => {
    const language = languageDraft.trim();

    if (!language) {
      return;
    }

    setFormData((prev) => ({
      ...prev,
      languagesKnown: prev.languagesKnown.some(
        (item) => item.toLowerCase() === language.toLowerCase()
      )
        ? prev.languagesKnown
        : [...prev.languagesKnown, language],
    }));
    setLanguageDraft("");
  };

  const removeLanguage = (language) => {
    updateField(
      "languagesKnown",
      formData.languagesKnown.filter((item) => item !== language)
    );
  };

  const removeFile = (name, fileIndex) => {
    updateField(
      name,
      formData[name].filter((_, index) => index !== fileIndex)
    );
  };

  const validateTab = (tabIndex) => {
    const nextErrors = {};

    if (tabIndex === 0) {
      requiredFields.forEach(([name, labelKey]) => {
        if (!textValue(formData[name])) {
          nextErrors[name] = t("register.required").replace(
            "{field}",
            t(labelKey)
          );
        }
      });

      if (!nextErrors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Enter valid email address";
      }

      if (!nextErrors.mobileNumber && !/^[0-9]{10}$/.test(formData.mobileNumber)) {
        nextErrors.mobileNumber = "Mobile number must be 10 digits";
      }

      if (!nextErrors.pincode && !/^[0-9]{6}$/.test(formData.pincode)) {
        nextErrors.pincode = "Pincode must be 6 digits";
      }
    }

    if (tabIndex === 3) {
      if (formData.password && formData.password.length < 6) {
        nextErrors.password = t("auth.passwordMin");
      }

      if (
        (formData.password || formData.confirmPassword) &&
        formData.confirmPassword !== formData.password
      ) {
        nextErrors.confirmPassword = t("register.passwordsMismatch");
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateTab(activeTab)) {
      toast.error(t("astroReg.fixFields"));
      return;
    }

    setActiveTab((prev) => Math.min(prev + 1, tabs.length - 1));
  };

  const goBack = () => {
    setActiveTab((prev) => Math.max(prev - 1, 0));
  };

  const buildPayload = () => ({
    username: textValue(formData.email),
    password: formData.password,
    roleId: ASTROLOGER_ROLE_ID,
    astrologerDto: {
      fullName: textValue(formData.fullName),
      mobileNumber: textValue(formData.mobileNumber),
      email: textValue(formData.email),
      gender: textValue(formData.gender),
      dateOfBirth: textValue(formData.dateOfBirth),
      address: textValue(formData.fullAddress),
      pincode: textValue(formData.pincode),
      city: textValue(formData.city),
      state: textValue(formData.state),
      languagesKnown: formData.languagesKnown.join(", "),
      expertise: formData.expertise,
      aboutYourself: textValue(formData.aboutYourself),
      consultationModes: formData.consultationModes,
      identityVerification: {
        aadharFront: fileMeta(formData.aadharFront),
        aadharBack: fileMeta(formData.aadharBack),
      },
      educationCertification: {
        educationalCertificates: fileMeta(formData.educationalCertificates),
        certificateDocuments: fileMeta(formData.certificateDocuments),
      },
      experienceDocuments: {
        experienceLetter: fileMeta(formData.experienceLetter),
        passportPhoto: fileMeta(formData.passportPhoto),
      },
      declaration: {
        accepted: formData.declarationAccepted,
        digitalSignature: textValue(formData.digitalSignature),
        date: textValue(formData.declarationDate),
        text:
          "I hereby declare that all information provided is true and I have no criminal record.",
      },
      verificationStatus: "PENDING",
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const allTabsValid = tabs.every((_, index) => validateTab(index));
    if (!allTabsValid) {
      toast.error(t("astroReg.fixFields"));
      return;
    }

    setLoading(true);

    try {
      const payload = buildPayload();
      const res = await api.post("/authorization/auth/create-user", payload, {
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
        },
      });

      if (!res?.success) {
        throw new Error(res?.message || t("astroReg.failed"));
      }

      if (typeof window !== "undefined") {
        const savedApplications = JSON.parse(
          window.localStorage.getItem("astrologerApplications") || "[]"
        );
        window.localStorage.setItem(
          "astrologerApplications",
          JSON.stringify([
            ...savedApplications,
            { ...payload.astrologerDto, submittedAt: new Date().toISOString() },
          ])
        );
      }

      toast.success(
        t("astroReg.success")
      );

      setTimeout(() => router.push("/login"), 1200);
    } catch (error) {
      toast.error(
        error?.response?.data?.errorDescription ||
          error?.response?.data?.message ||
          error?.message ||
          t("astroReg.unableSubmit")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6ead7] px-3 py-3 text-stone-900 md:py-5">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 overflow-hidden rounded-lg border border-amber-200 bg-[#fff9ef] shadow-lg shadow-amber-900/10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-4 md:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="w-fit rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase text-amber-800">
                  {t("register.astrologer")}
                </p>
                <Link
                  href="/register"
                  className="w-fit rounded-full border border-amber-200 bg-white px-3 py-1 text-xs text-stone-700 shadow-sm transition hover:border-amber-300 hover:text-amber-800"
                >
                  {t("astroReg.back")}
                </Link>
              </div>

              <h1 className="mt-4 max-w-3xl text-2xl font-semibold leading-tight text-stone-950 md:text-3xl">
                {t("astroReg.title")}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                {t("astroReg.subtitle")}
              </p>
            </div>

            <div className="border-t border-amber-100 bg-[#fff4df] p-4 md:p-5 lg:border-l lg:border-t-0">
              <div className="rounded-lg border border-amber-200 bg-white p-3 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-stone-500">{t("astroReg.progress")}</p>
                    <p className="mt-1 text-2xl font-semibold text-stone-950">
                      {progress}%
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-sm font-semibold text-amber-900">
                    {activeTab + 1}/{tabs.length}
                  </div>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-amber-100">
                  <div
                    className="h-full rounded-full bg-amber-600 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-3 text-xs text-stone-600">
                  {t("astroReg.currentStep")}: {t(tabs[activeTab])}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-lg border border-amber-200 bg-white shadow-lg shadow-amber-900/10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr]">
            <div className="border-b border-amber-100 bg-[#fff7e8] p-3 lg:border-b-0 lg:border-r">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-stone-900">
                  {t("astroReg.stepsTitle")}
                </p>
                <p className="mt-1 text-xs text-stone-500">
                  {t("astroReg.stepsSubtitle")}
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      if (index <= activeTab || validateTab(activeTab)) {
                        setActiveTab(index);
                      }
                    }}
                    className={`min-w-[210px] rounded-lg border p-2.5 text-left transition lg:min-w-0 ${
                      activeTab === index
                        ? "border-amber-300 bg-white shadow-sm"
                        : "border-amber-100 bg-[#fffbf5] hover:border-amber-300 hover:bg-white"
                    }`}
                  >
                    <span className="flex items-start gap-2.5">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                          activeTab === index
                            ? "bg-amber-600 text-white"
                            : "bg-amber-100 text-amber-900"
                        }`}
                      >
                        {tabIcons[index]}
                      </span>
                      <span>
                        <span className="block text-xs font-semibold text-stone-900">
                          {t(tab)}
                        </span>
                        <span className="mt-1 block text-[11px] leading-4 text-stone-500">
                          {t(tabDescriptions[index])}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 md:p-4 lg:p-5">
              <div className="mb-4 rounded-lg border border-amber-100 bg-[#fffbf5] p-3">
                <p className="text-xs font-medium text-amber-700">
                  {t("astroReg.step")} {activeTab + 1} of {tabs.length}
                </p>
                <h2 className="mt-1 text-lg font-semibold text-stone-950">
                  {t(tabs[activeTab])}
                </h2>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  {t(tabDescriptions[activeTab])}
                </p>
              </div>

            {activeTab === 0 && (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Input required label={t("astroReg.fullName")} name="fullName" value={formData.fullName} onChange={updateField} error={errors.fullName} />
                <Input required label={t("astroReg.mobileNumber")} name="mobileNumber" value={formData.mobileNumber} maxLength={10} onChange={(name, value) => updateField(name, value.replace(/\D/g, ""))} error={errors.mobileNumber} />
                <Input required label={t("astroReg.emailAddress")} name="email" value={formData.email} onChange={updateField} error={errors.email} />
                <Input required label={t("astroReg.pincode")} name="pincode" value={formData.pincode} maxLength={6} onChange={updatePincode} error={errors.pincode} helper={pincodeLoading ? t("astroReg.fetchingLocation") : ""} />
                <Input required label={t("astroReg.city")} name="city" value={formData.city} onChange={updateField} error={errors.city} />
                <Input required label={t("astroReg.state")} name="state" value={formData.state} onChange={updateField} error={errors.state} />
                <Select required label={t("register.gender")} name="gender" value={formData.gender} onChange={updateField} options={["Male", "Female", "Other"]} error={errors.gender} />
                <Input required label={t("register.dateOfBirth")} name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={updateField} error={errors.dateOfBirth} />
                <Textarea className="md:col-span-2" label={t("register.fullAddress")} name="fullAddress" value={formData.fullAddress} onChange={updateField} error={errors.fullAddress} />
                <LanguageInput label={t("astroReg.languagesKnown")} value={languageDraft} badges={formData.languagesKnown} onChange={setLanguageDraft} onAdd={addLanguage} onRemove={removeLanguage} error={errors.languagesKnown} />
                <CheckboxGroup label={t("astroReg.consultationModes")} name="consultationModes" values={formData.consultationModes} options={consultationOptions} onChange={toggleArrayValue} error={errors.consultationModes} />
                <CheckboxGroup className="md:col-span-2" label={t("astroReg.expertise")} name="expertise" values={formData.expertise} options={expertiseOptions} onChange={toggleArrayValue} error={errors.expertise} />
                <Textarea className="md:col-span-2" label={t("astroReg.aboutYourself")} name="aboutYourself" value={formData.aboutYourself} onChange={updateField} error={errors.aboutYourself} />
              </section>
            )}

            {activeTab === 1 && (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FileUpload label={t("astroReg.aadharFront")} name="aadharFront" files={formData.aadharFront} onChange={updateFiles} onRemove={removeFile} error={errors.aadharFront} />
                <FileUpload label={t("astroReg.aadharBack")} name="aadharBack" files={formData.aadharBack} onChange={updateFiles} onRemove={removeFile} error={errors.aadharBack} />
              </section>
            )}

            {activeTab === 2 && (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <FileUpload label={t("astroReg.educationalCertificate")} name="educationalCertificates" files={formData.educationalCertificates} onChange={updateFiles} onRemove={removeFile} />
                <FileUpload label={t("astroReg.certificateDocuments")} name="certificateDocuments" files={formData.certificateDocuments} onChange={updateFiles} onRemove={removeFile} multiple maxFiles={3} />
                <FileUpload label={t("astroReg.experienceLetter")} name="experienceLetter" files={formData.experienceLetter} onChange={updateFiles} onRemove={removeFile} />
                <FileUpload label={t("astroReg.passportPhoto")} name="passportPhoto" files={formData.passportPhoto} onChange={updateFiles} onRemove={removeFile} />
              </section>
            )}

            {activeTab === 3 && (
              <section className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="relative">
                  <Input label={t("auth.password")} name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={updateField} error={errors.password} inputClassName="pr-12" />
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
                  <Input label={t("register.confirmPassword")} name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={updateField} error={errors.confirmPassword} inputClassName="pr-12" />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-7 flex h-8 w-8 items-center justify-center rounded-full text-amber-800 transition hover:bg-amber-50 hover:text-amber-950"
                    aria-label={showConfirmPassword ? t("register.hide") : t("register.show")}
                  >
                    <PasswordVisibilityIcon visible={showConfirmPassword} />
                  </button>
                </div>
                <div className="md:col-span-2 rounded-lg border border-amber-100 bg-[#fffbf5] p-3">
                  <label className="flex items-start gap-3 text-xs leading-5 text-stone-600">
                    <input
                      type="checkbox"
                      checked={formData.declarationAccepted}
                      onChange={(event) =>
                        updateField("declarationAccepted", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-amber-600"
                    />
                    <span>
                      {t("astroReg.declaration")}
                    </span>
                  </label>
                  {errors.declarationAccepted && (
                    <p className="text-red-600 text-xs mt-2">
                      {errors.declarationAccepted}
                    </p>
                  )}
                </div>
                <Input label={t("astroReg.digitalSignature")} name="digitalSignature" value={formData.digitalSignature} onChange={updateField} error={errors.digitalSignature} />
                <Input label={t("astroReg.date")} name="declarationDate" type="date" value={formData.declarationDate} onChange={updateField} error={errors.declarationDate} />
              </section>
            )}

              <div className="mt-5 flex flex-col-reverse gap-3 border-t border-amber-100 pt-4 md:flex-row md:items-center md:justify-between">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={activeTab === 0 || loading}
                  className="h-9 rounded-md border border-amber-200 bg-white px-4 text-sm text-stone-700 shadow-sm transition hover:border-amber-400 hover:text-amber-800 disabled:opacity-40 disabled:hover:border-amber-200 disabled:hover:text-stone-700"
                >
                  {t("astroReg.backButton")}
                </button>
                {activeTab < tabs.length - 1 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="h-9 rounded-md bg-amber-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800"
                  >
                    {t("astroReg.continue")}
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex h-9 items-center justify-center gap-2 rounded-md bg-amber-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        {t("astroReg.submitting")}
                      </>
                    ) : (
                      t("astroReg.submit")
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  name,
  error,
  helper,
  required = false,
  onChange,
  className = "",
  inputClassName = "",
  ...props
}) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-stone-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <input
        {...props}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${inputClassName} ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      />
      {helper && !error && <p className="mt-1 text-xs text-amber-700">{helper}</p>}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
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

function LanguageInput({
  label,
  value,
  badges,
  error,
  onChange,
  onAdd,
  onRemove,
}) {
  return (
    <div>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <input
        value={value}
        placeholder="Add language and press Enter"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            onAdd();
          }
        }}
        className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      />
      {badges.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {badges.map((language) => (
            <span
              key={language}
              className="inline-flex max-w-full items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900"
            >
              <span className="truncate">{language}</span>
              <button
                type="button"
                onClick={() => onRemove(language)}
                className="flex h-4 w-4 items-center justify-center rounded-full text-amber-700 transition hover:bg-amber-100 hover:text-amber-950"
                aria-label={`Remove ${language}`}
              >
                x
              </button>
            </span>
          ))}
        </div>
      )}
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, name, options, value, error, required = false, onChange }) {
  const { t } = useLanguage();

  return (
    <div>
      <label className="text-xs font-medium text-stone-700">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className={`mt-1 h-9 w-full rounded-sm border bg-white px-3 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      >
        <option value="">{t("register.selectGender")}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Textarea({ label, name, value, error, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        rows={3}
        className={`mt-1 min-h-20 w-full rounded-sm border bg-white px-3 py-2 text-sm text-stone-900 shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15 ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      />
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

function CheckboxGroup({
  label,
  name,
  values,
  options,
  onChange,
  error,
  className = "",
}) {
  return (
    <div className={className}>
      <p className="mb-1 text-xs font-medium text-stone-700">{label}</p>
      <div
        className={`grid grid-cols-1 gap-1.5 rounded-sm border bg-white p-2 shadow-sm shadow-amber-900/10 sm:grid-cols-2 lg:grid-cols-3 ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      >
        {options.map((option) => (
          <label
            key={option}
            className={`flex min-h-8 items-center gap-2 rounded-sm border px-2.5 text-xs transition ${
              values.includes(option)
                ? "border-amber-300 bg-amber-50 text-amber-900"
                : "border-amber-100 bg-white text-stone-600 hover:border-amber-300"
            }`}
          >
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => onChange(name, option)}
              className="h-4 w-4 accent-amber-600"
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FileUpload({
  label,
  name,
  files,
  onChange,
  onRemove,
  error,
  multiple = false,
  maxFiles,
}) {
  const { t } = useLanguage();

  return (
    <div>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      <div
        className={`mt-1 rounded-sm border bg-white p-2.5 shadow-sm shadow-amber-900/10 transition ${
          error ? "border-red-500" : "border-amber-100"
        }`}
      >
        <div className="rounded-sm border border-dashed border-amber-200 bg-[#fffbf5] p-2.5">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple={multiple}
          onChange={(event) => {
            onChange(name, event.target.files, multiple, maxFiles);
            event.target.value = "";
          }}
          className="w-full text-xs text-stone-600 file:mr-3 file:rounded-sm file:border-0 file:bg-amber-700 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-amber-800"
        />
          <p className="mt-2 text-[11px] text-stone-500">
            {maxFiles
              ? `${t("astroReg.allowed")} | ${t("astroReg.maxFiles").replace(
                  "{count}",
                  maxFiles
                )}`
              : t("astroReg.allowed")}
          </p>
        </div>
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {files.map((file, index) => (
              <FilePreview
                key={`${file.name}-${file.size}-${index}`}
                file={file}
                onRemove={() => onRemove(name, index)}
              />
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FilePreview({ file, onRemove }) {
  const isImage = file.type.startsWith("image/");
  const previewUrl = isImage ? URL.createObjectURL(file) : "";

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-amber-200 bg-amber-50 py-1 pl-1 pr-2 text-amber-900">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.name}
          className="h-7 w-7 rounded-full object-cover"
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      ) : (
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200 text-[10px] font-semibold text-amber-900">
          PDF
        </div>
      )}
      <div className="min-w-0 max-w-[180px]">
        <p className="truncate text-xs font-medium">{file.name}</p>
      </div>
      <button
        type="button"
        onClick={onRemove}
        className="flex h-5 w-5 items-center justify-center rounded-full text-xs text-amber-700 transition hover:bg-amber-100 hover:text-amber-950"
        aria-label={`Remove ${file.name}`}
      >
        x
      </button>
    </div>
  );
}
