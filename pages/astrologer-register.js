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
  "astroReg.tab5",
];
const tabDescriptions = [
  "astroReg.desc1",
  "astroReg.desc2",
  "astroReg.desc3",
  "astroReg.desc4",
  "astroReg.desc5",
];
const tabIcons = ["01", "02", "03", "04", "05"];

const initialFormData = {
  fullName: "",
  mobileNumber: "",
  email: "",
  gender: "",
  dateOfBirth: "",
  city: "",
  state: "",
  languagesKnown: "",
  expertise: [],
  yearsOfExperience: "",
  aboutYourself: "",
  consultationModes: [],
  aadharFront: [],
  aadharBack: [],
  panCard: [],
  addressProof: [],
  educationalCertificates: [],
  astrologyCertificate: [],
  numerologyCertificate: [],
  vastuCertificate: [],
  palmistryCertificate: [],
  graphologyCertificate: [],
  reikiCertificate: [],
  tarotCertificate: [],
  experienceLetter: [],
  mediaProof: [],
  clientTestimonials: [],
  passportPhoto: [],
  accountHolderName: "",
  bankName: "",
  accountNumber: "",
  ifscCode: "",
  branchName: "",
  upiId: "",
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

export default function AstrologerRegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const progress = useMemo(
    () => Math.round(((activeTab + 1) / tabs.length) * 100),
    [activeTab]
  );

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
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

  const updateFiles = (name, files, multiple = false) => {
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

    updateField(name, multiple ? selectedFiles : selectedFiles.slice(0, 1));
  };

  const validateTab = (tabIndex) => {
    const nextErrors = {};
    const required = (name, label) => {
      const value = formData[name];
      if (Array.isArray(value) ? value.length === 0 : !textValue(value)) {
        nextErrors[name] = t("register.required").replace("{field}", label);
      }
    };

    if (tabIndex === 0) {
      [
        ["fullName", t("astroReg.fullName")],
        ["mobileNumber", t("astroReg.mobileNumber")],
        ["email", t("astroReg.emailAddress")],
        ["gender", t("register.gender")],
        ["dateOfBirth", t("register.dateOfBirth")],
        ["city", t("astroReg.city")],
        ["state", t("astroReg.state")],
        ["languagesKnown", t("astroReg.languagesKnown")],
        ["expertise", t("astroReg.expertise")],
        ["yearsOfExperience", t("astroReg.yearsExperience")],
        ["aboutYourself", t("astroReg.aboutYourself")],
        ["consultationModes", t("astroReg.consultationModes")],
      ].forEach(([name, label]) => required(name, label));

      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        nextErrors.email = "Enter valid email address";
      }

      if (formData.mobileNumber && !/^[0-9]{10}$/.test(formData.mobileNumber)) {
        nextErrors.mobileNumber = "Mobile number must be 10 digits";
      }

      if (
        formData.yearsOfExperience &&
        Number(formData.yearsOfExperience) < 0
      ) {
        nextErrors.yearsOfExperience = "Experience cannot be negative";
      }
    }

    if (tabIndex === 1) {
      [
        ["aadharFront", t("astroReg.aadharFront")],
        ["aadharBack", t("astroReg.aadharBack")],
        ["panCard", t("astroReg.panCard")],
        ["addressProof", t("astroReg.addressProof")],
      ].forEach(([name, label]) => required(name, label));
    }

    if (tabIndex === 2) {
      required("educationalCertificates", t("astroReg.educationalCertificate"));
    }

    if (tabIndex === 3) {
      required("passportPhoto", t("astroReg.passportPhoto"));

      const supportingDocs = [
        ...formData.experienceLetter,
        ...formData.mediaProof,
        ...formData.clientTestimonials,
      ];

      if (supportingDocs.length === 0) {
        nextErrors.supportingDocuments =
          t("astroReg.supportingRequired");
      }
    }

    if (tabIndex === 4) {
      [
        ["accountHolderName", t("astroReg.accountHolderName")],
        ["bankName", t("astroReg.bankName")],
        ["accountNumber", t("astroReg.accountNumber")],
        ["ifscCode", t("astroReg.ifscCode")],
        ["branchName", t("astroReg.branchName")],
        ["digitalSignature", t("astroReg.digitalSignature")],
        ["declarationDate", t("astroReg.date")],
        ["password", t("auth.password")],
        ["confirmPassword", t("register.confirmPassword")],
      ].forEach(([name, label]) => required(name, label));

      if (formData.ifscCode && !/^[A-Z]{4}0[A-Z0-9]{6}$/i.test(formData.ifscCode)) {
        nextErrors.ifscCode = "Enter valid IFSC code";
      }

      if (formData.password && formData.password.length < 6) {
        nextErrors.password = t("auth.passwordMin");
      }

      if (formData.confirmPassword !== formData.password) {
        nextErrors.confirmPassword = t("register.passwordsMismatch");
      }

      if (!formData.declarationAccepted) {
        nextErrors.declarationAccepted = t("astroReg.declarationRequired");
      }
    }

    setErrors((prev) => ({ ...prev, ...nextErrors }));
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateTab(activeTab)) {
      toast.error(t("astroReg.requiredToast"));
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
      city: textValue(formData.city),
      state: textValue(formData.state),
      languagesKnown: textValue(formData.languagesKnown),
      expertise: formData.expertise,
      yearsOfExperience: Number(formData.yearsOfExperience || 0),
      aboutYourself: textValue(formData.aboutYourself),
      consultationModes: formData.consultationModes,
      identityVerification: {
        aadharFront: fileMeta(formData.aadharFront),
        aadharBack: fileMeta(formData.aadharBack),
        panCard: fileMeta(formData.panCard),
        addressProof: fileMeta(formData.addressProof),
      },
      educationCertification: {
        educationalCertificates: fileMeta(formData.educationalCertificates),
        astrologyCertificate: fileMeta(formData.astrologyCertificate),
        numerologyCertificate: fileMeta(formData.numerologyCertificate),
        vastuCertificate: fileMeta(formData.vastuCertificate),
        palmistryCertificate: fileMeta(formData.palmistryCertificate),
        graphologyCertificate: fileMeta(formData.graphologyCertificate),
        reikiCertificate: fileMeta(formData.reikiCertificate),
        tarotCertificate: fileMeta(formData.tarotCertificate),
      },
      experienceDocuments: {
        experienceLetter: fileMeta(formData.experienceLetter),
        mediaProof: fileMeta(formData.mediaProof),
        clientTestimonials: fileMeta(formData.clientTestimonials),
        passportPhoto: fileMeta(formData.passportPhoto),
      },
      bankDetails: {
        accountHolderName: textValue(formData.accountHolderName),
        bankName: textValue(formData.bankName),
        accountNumber: textValue(formData.accountNumber),
        ifscCode: textValue(formData.ifscCode).toUpperCase(),
        branchName: textValue(formData.branchName),
        upiId: textValue(formData.upiId),
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
    <div className="min-h-screen bg-[#050816] px-4 py-6 md:py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-7xl">
        <div className="astro-dark-surface mb-5 overflow-hidden rounded-3xl border border-white/10 bg-[#17112f] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 md:p-8 lg:p-10">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="w-fit rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase text-purple-100">
                  {t("register.astrologer")}
                </p>
                <Link
                  href="/register"
                  className="w-fit rounded-full border border-white/15 px-4 py-2 text-sm text-purple-100 transition hover:bg-white/10"
                >
                  {t("astroReg.back")}
                </Link>
              </div>

              <h1 className="mt-7 max-w-3xl text-3xl font-semibold leading-tight text-white md:text-5xl">
                {t("astroReg.title")}
              </h1>
              <p className="astro-muted mt-4 max-w-2xl text-sm leading-7 md:text-base">
                {t("astroReg.subtitle")}
              </p>
            </div>

            <div className="border-t border-white/10 bg-white/5 p-6 md:p-8 lg:border-l lg:border-t-0">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="astro-subtle text-sm">{t("astroReg.progress")}</p>
                    <p className="mt-1 text-3xl font-semibold text-white">
                      {progress}%
                    </p>
                  </div>
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-purple-300/30 bg-purple-500/20 text-lg font-semibold text-purple-100">
                    {activeTab + 1}/{tabs.length}
                  </div>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="astro-muted mt-4 text-sm">
                  {t("astroReg.currentStep")}: {t(tabs[activeTab])}
                </p>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-white/10 bg-[#0f1535] shadow-2xl"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr]">
            <div className="astro-dark-surface border-b border-white/10 bg-[#17112f] p-4 md:p-6 lg:border-b-0 lg:border-r">
              <div className="mb-5">
                <p className="text-sm font-semibold text-white">
                  {t("astroReg.stepsTitle")}
                </p>
                <p className="astro-subtle mt-1 text-sm">
                  {t("astroReg.stepsSubtitle")}
                </p>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
                {tabs.map((tab, index) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => {
                      if (index <= activeTab || validateTab(activeTab)) {
                        setActiveTab(index);
                      }
                    }}
                    className={`min-w-[250px] rounded-2xl border p-4 text-left transition lg:min-w-0 ${
                      activeTab === index
                        ? "border-purple-300/60 bg-purple-500/20 shadow-lg shadow-purple-950/30"
                        : "border-white/10 bg-white/5 hover:border-purple-300/40 hover:bg-white/10"
                    }`}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                          activeTab === index
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 text-purple-100"
                        }`}
                      >
                        {tabIcons[index]}
                      </span>
                      <span>
                        <span className="block text-sm font-semibold text-white">
                          {t(tab)}
                        </span>
                        <span className="astro-subtle mt-1 block text-xs leading-5">
                          {t(tabDescriptions[index])}
                        </span>
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 md:p-6 lg:p-8">
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-medium text-purple-300">
                {t("astroReg.step")} {activeTab + 1} of {tabs.length}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-white">
                {t(tabs[activeTab])}
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-300">
                {t(tabDescriptions[activeTab])}
              </p>
            </div>

            {activeTab === 0 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t("astroReg.fullName")} name="fullName" value={formData.fullName} onChange={updateField} error={errors.fullName} />
                <Input label={t("astroReg.mobileNumber")} name="mobileNumber" value={formData.mobileNumber} maxLength={10} onChange={(name, value) => updateField(name, value.replace(/\D/g, ""))} error={errors.mobileNumber} />
                <Input label={t("astroReg.emailAddress")} name="email" value={formData.email} onChange={updateField} error={errors.email} />
                <Select label={t("register.gender")} name="gender" value={formData.gender} onChange={updateField} options={["Male", "Female", "Other"]} error={errors.gender} />
                <Input label={t("register.dateOfBirth")} name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={updateField} error={errors.dateOfBirth} />
                <Input label={t("astroReg.city")} name="city" value={formData.city} onChange={updateField} error={errors.city} />
                <Input label={t("astroReg.state")} name="state" value={formData.state} onChange={updateField} error={errors.state} />
                <Input label={t("astroReg.languagesKnown")} name="languagesKnown" value={formData.languagesKnown} onChange={updateField} error={errors.languagesKnown} />
                <Input label={t("astroReg.yearsExperience")} name="yearsOfExperience" type="number" min="0" value={formData.yearsOfExperience} onChange={updateField} error={errors.yearsOfExperience} />
                <CheckboxGroup label={t("astroReg.consultationModes")} name="consultationModes" values={formData.consultationModes} options={consultationOptions} onChange={toggleArrayValue} error={errors.consultationModes} />
                <CheckboxGroup className="md:col-span-2" label={t("astroReg.expertise")} name="expertise" values={formData.expertise} options={expertiseOptions} onChange={toggleArrayValue} error={errors.expertise} />
                <Textarea className="md:col-span-2" label={t("astroReg.aboutYourself")} name="aboutYourself" value={formData.aboutYourself} onChange={updateField} error={errors.aboutYourself} />
              </section>
            )}

            {activeTab === 1 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload label={t("astroReg.aadharFront")} name="aadharFront" files={formData.aadharFront} onChange={updateFiles} error={errors.aadharFront} />
                <FileUpload label={t("astroReg.aadharBack")} name="aadharBack" files={formData.aadharBack} onChange={updateFiles} error={errors.aadharBack} />
                <FileUpload label={t("astroReg.panCard")} name="panCard" files={formData.panCard} onChange={updateFiles} error={errors.panCard} />
                <FileUpload label={t("astroReg.addressProof")} name="addressProof" files={formData.addressProof} onChange={updateFiles} error={errors.addressProof} />
              </section>
            )}

            {activeTab === 2 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FileUpload label={t("astroReg.educationalCertificate")} name="educationalCertificates" files={formData.educationalCertificates} onChange={updateFiles} error={errors.educationalCertificates} multiple />
                <FileUpload label={t("astroReg.astrologyCertificate")} name="astrologyCertificate" files={formData.astrologyCertificate} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.numerologyCertificate")} name="numerologyCertificate" files={formData.numerologyCertificate} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.vastuCertificate")} name="vastuCertificate" files={formData.vastuCertificate} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.palmistryCertificate")} name="palmistryCertificate" files={formData.palmistryCertificate} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.graphologyCertificate")} name="graphologyCertificate" files={formData.graphologyCertificate} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.reikiCertificate")} name="reikiCertificate" files={formData.reikiCertificate} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.tarotCertificate")} name="tarotCertificate" files={formData.tarotCertificate} onChange={updateFiles} multiple />
              </section>
            )}

            {activeTab === 3 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-300 mb-2">
                    {t("astroReg.supportingPrompt")}
                  </p>
                  {errors.supportingDocuments && (
                    <p className="text-red-400 text-xs mb-2">
                      {errors.supportingDocuments}
                    </p>
                  )}
                </div>
                <FileUpload label={t("astroReg.experienceLetter")} name="experienceLetter" files={formData.experienceLetter} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.mediaProof")} name="mediaProof" files={formData.mediaProof} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.clientTestimonials")} name="clientTestimonials" files={formData.clientTestimonials} onChange={updateFiles} multiple />
                <FileUpload label={t("astroReg.passportPhoto")} name="passportPhoto" files={formData.passportPhoto} onChange={updateFiles} error={errors.passportPhoto} />
              </section>
            )}

            {activeTab === 4 && (
              <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label={t("astroReg.accountHolderName")} name="accountHolderName" value={formData.accountHolderName} onChange={updateField} error={errors.accountHolderName} />
                <Input label={t("astroReg.bankName")} name="bankName" value={formData.bankName} onChange={updateField} error={errors.bankName} />
                <Input label={t("astroReg.accountNumber")} name="accountNumber" value={formData.accountNumber} onChange={updateField} error={errors.accountNumber} />
                <Input label={t("astroReg.ifscCode")} name="ifscCode" value={formData.ifscCode} onChange={(name, value) => updateField(name, value.toUpperCase())} error={errors.ifscCode} />
                <Input label={t("astroReg.branchName")} name="branchName" value={formData.branchName} onChange={updateField} error={errors.branchName} />
                <Input label={t("astroReg.upiId")} name="upiId" value={formData.upiId} onChange={updateField} />
                <Input label={t("auth.password")} name="password" type="password" value={formData.password} onChange={updateField} error={errors.password} />
                <Input label={t("register.confirmPassword")} name="confirmPassword" type="password" value={formData.confirmPassword} onChange={updateField} error={errors.confirmPassword} />
                <div className="md:col-span-2 bg-[#121735] border border-white/10 rounded-xl p-4">
                  <label className="flex items-start gap-3 text-sm text-gray-300">
                    <input
                      type="checkbox"
                      checked={formData.declarationAccepted}
                      onChange={(event) =>
                        updateField("declarationAccepted", event.target.checked)
                      }
                      className="mt-1 h-4 w-4 accent-purple-600"
                    />
                    <span>
                      {t("astroReg.declaration")}
                    </span>
                  </label>
                  {errors.declarationAccepted && (
                    <p className="text-red-400 text-xs mt-2">
                      {errors.declarationAccepted}
                    </p>
                  )}
                </div>
                <Input label={t("astroReg.digitalSignature")} name="digitalSignature" value={formData.digitalSignature} onChange={updateField} error={errors.digitalSignature} />
                <Input label={t("astroReg.date")} name="declarationDate" type="date" value={formData.declarationDate} onChange={updateField} error={errors.declarationDate} />
              </section>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-5 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={goBack}
              disabled={activeTab === 0 || loading}
              className="h-12 rounded-xl border border-white/10 px-5 text-gray-300 transition hover:border-purple-400 hover:text-white disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:text-gray-300"
            >
              {t("astroReg.backButton")}
            </button>
            {activeTab < tabs.length - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="h-12 rounded-xl bg-purple-600 px-7 font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-700"
              >
                {t("astroReg.continue")}
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex h-12 items-center justify-center gap-2 rounded-xl bg-purple-600 px-7 font-semibold text-white shadow-lg shadow-purple-950/30 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
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

function Input({ label, name, error, onChange, className = "", ...props }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <input
        {...props}
        name={name}
        onChange={(event) => onChange(name, event.target.value)}
        className={`mt-2 h-12 w-full rounded-2xl border bg-[#121735] px-4 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500 focus:bg-[#171d42] focus:ring-4 focus:ring-purple-500/10 ${
          error ? "border-red-500" : "border-white/10"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Select({ label, name, options, value, error, onChange }) {
  const { t } = useLanguage();

  return (
    <div>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <select
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        className={`mt-2 h-12 w-full rounded-2xl border bg-[#121735] px-4 text-white outline-none transition focus:border-purple-500 focus:bg-[#171d42] focus:ring-4 focus:ring-purple-500/10 ${
          error ? "border-red-500" : "border-white/10"
        }`}
      >
        <option value="">{t("register.selectGender")}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function Textarea({ label, name, value, error, onChange, className = "" }) {
  return (
    <div className={className}>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={(event) => onChange(name, event.target.value)}
        rows={4}
        className={`mt-2 min-h-32 w-full rounded-2xl border bg-[#121735] px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-purple-500 focus:bg-[#171d42] focus:ring-4 focus:ring-purple-500/10 ${
          error ? "border-red-500" : "border-white/10"
        }`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
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
      <p className="mb-2 text-sm font-medium text-gray-300">{label}</p>
      <div
        className={`grid grid-cols-1 gap-2 rounded-2xl border bg-[#121735] p-3 sm:grid-cols-2 lg:grid-cols-3 ${
          error ? "border-red-500" : "border-white/10"
        }`}
      >
        {options.map((option) => (
          <label
            key={option}
            className={`flex min-h-11 items-center gap-3 rounded-xl border px-3 text-sm transition ${
              values.includes(option)
                ? "border-purple-400 bg-purple-600/15 text-white"
                : "border-white/10 bg-white/5 text-gray-300 hover:border-purple-400"
            }`}
          >
            <input
              type="checkbox"
              checked={values.includes(option)}
              onChange={() => onChange(name, option)}
              className="h-4 w-4 accent-purple-600"
            />
            {option}
          </label>
        ))}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FileUpload({
  label,
  name,
  files,
  onChange,
  error,
  multiple = false,
}) {
  const { t } = useLanguage();

  return (
    <div>
      <label className="text-sm font-medium text-gray-300">{label}</label>
      <div
        className={`mt-2 rounded-2xl border bg-[#121735] p-4 transition ${
          error ? "border-red-500" : "border-white/10"
        }`}
      >
        <div className="rounded-xl border border-dashed border-white/20 bg-white/5 p-4">
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          multiple={multiple}
          onChange={(event) => onChange(name, event.target.files, multiple)}
          className="w-full text-sm text-gray-300 file:mr-3 file:rounded-full file:border-0 file:bg-purple-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
        />
          <p className="mt-3 text-xs text-gray-400">
            {t("astroReg.allowed")}
          </p>
        </div>
        {files.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {files.map((file) => (
              <FilePreview key={`${file.name}-${file.size}`} file={file} />
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

function FilePreview({ file }) {
  const isImage = file.type.startsWith("image/");
  const previewUrl = isImage ? URL.createObjectURL(file) : "";

  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt={file.name}
          className="h-12 w-12 rounded-lg object-cover"
          onLoad={() => URL.revokeObjectURL(previewUrl)}
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-600/30 text-xs font-semibold text-purple-200">
          PDF
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm text-white">{file.name}</p>
        <p className="text-xs text-gray-400">
          {(file.size / 1024).toFixed(1)} KB
        </p>
      </div>
    </div>
  );
}
