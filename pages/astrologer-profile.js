"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PageLayout from "@/components/PageLayout";
import api from "@/utils/api";
import { hasStoredRole } from "@/utils/tokenStore";

const ASTROLOGER_ROLE = "ROLE_ASTROLOGER";

const emptyProfile = {
  publicId: "",
  fullName: "",
  displayName: "",
  email: "",
  mobileNo: "",
  gender: "",
  dateOfBirth: "",
  dateOfJoining: "",
  religion: "",
  motherTongue: "",
  address: "",
  city: "",
  state: "",
  pinCode: "",
  country: "",
  specialization: "",
  expertise: [],
  languagesKnown: [],
  consultationModes: [],
  yearsOfExperience: "",
  educationalQualification: "",
  aboutYourself: "",
  aadhaarNo: "",
  aadhaarFileUuid: "",
  educationalQualificationFileUuid: "",
  experienceFileUuid: "",
  profileCompletionPercentage: "",
  profileStatus: "",
};

const arrayFields = new Set([
  "expertise",
  "languagesKnown",
  "consultationModes",
]);

const summaryFields = [
  ["Status", "profileStatus"],
  ["Completion", "profileCompletionPercentage", "%"],
  ["Experience", "yearsOfExperience", " yrs"],
  ["Joined", "dateOfJoining"],
];

const sections = [
  {
    title: "Personal Details",
    description: "Core identity shown on the astrologer account.",
    fields: [
      ["Full Name", "fullName"],
      ["Display Name", "displayName"],
      ["Gender", "gender", "select", ["Male", "Female", "Other"]],
      ["Date Of Birth", "dateOfBirth", "date"],
      ["Religion", "religion"],
      ["Mother Tongue", "motherTongue"],
    ],
  },
  {
    title: "Contact And Address",
    description: "Contact information and service location.",
    fields: [
      ["Email", "email", "email"],
      ["Mobile Number", "mobileNo", "tel"],
      ["Address", "address", "textarea"],
      ["City", "city"],
      ["State", "state"],
      ["Pin Code", "pinCode"],
      ["Country", "country"],
    ],
  },
  {
    title: "Professional Profile",
    description: "Experience, skills, languages, and consultation setup.",
    fields: [
      ["Specialization", "specialization"],
      ["Years Of Experience", "yearsOfExperience", "number"],
      ["Educational Qualification", "educationalQualification"],
      ["Expertise", "expertise", "array"],
      ["Languages Known", "languagesKnown", "array"],
      ["Consultation Modes", "consultationModes", "array"],
      ["About Yourself", "aboutYourself", "textarea-wide"],
    ],
  },
  {
    title: "Verification Documents",
    description: "Reference numbers returned by the profile API.",
    fields: [
      ["Aadhaar Number", "aadhaarNo"],
      ["Aadhaar File UUID", "aadhaarFileUuid"],
      [
        "Education Certificate UUID",
        "educationalQualificationFileUuid",
      ],
      ["Experience File UUID", "experienceFileUuid"],
    ],
  },
];

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

function isAstrologerUser(user) {
  return [
    ...normalizeRoles(user?.roles),
    ...normalizeRoles(user?.authorities),
  ].includes(ASTROLOGER_ROLE);
}

function normalizeArray(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeProfile(profile = {}) {
  const sourceProfile = profile || {};
  const normalized = { ...emptyProfile, ...sourceProfile };

  Object.keys(emptyProfile).forEach((key) => {
    if (arrayFields.has(key)) {
      normalized[key] = normalizeArray(sourceProfile[key]);
      return;
    }

    normalized[key] = sourceProfile[key] ?? "";
  });

  return normalized;
}

function getInitials(name) {
  const parts = String(name || "")
    .split(" ")
    .filter(Boolean);

  return `${parts[0]?.charAt(0) || ""}${parts[1]?.charAt(0) || ""}`
    .toUpperCase();
}

function formatValue(value, suffix = "") {
  if (value === null || value === undefined || value === "") {
    return "Not added";
  }

  return `${value}${suffix}`;
}

export default function AstrologerProfilePage() {
  const router = useRouter();
  const { isLoggedIn, isAuthLoaded, user } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState(() => normalizeProfile(user));
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [hasChanges, setHasChanges] = useState(false);

  const userIsAstrologer =
    isAstrologerUser(user) || hasStoredRole(ASTROLOGER_ROLE);

  useEffect(() => {
    if (!isAuthLoaded) {
      return;
    }

    if (!isLoggedIn) {
      router.replace("/astrologer-login");
      return;
    }

    if (!userIsAstrologer) {
      router.replace("/profile");
    }
  }, [isAuthLoaded, isLoggedIn, router, userIsAstrologer]);

  useEffect(() => {
    if (!isAuthLoaded || !isLoggedIn || !userIsAstrologer) {
      return;
    }

    let cancelled = false;

    async function loadProfile() {
      setIsLoading(true);

      try {
        const profileRes = await api.get(
          "/authorization/astrologer/profile-me"
        );

        if (cancelled) {
          return;
        }

        const nextProfile = normalizeProfile(profileRes?.data || user || {});
        setFormData(nextProfile);
        setHasChanges(false);
      } catch (error) {
        if (!cancelled) {
          setFormData(normalizeProfile(user || {}));
          toast.error(
            error?.response?.data?.message ||
              "Unable to load latest astrologer profile."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [isAuthLoaded, isLoggedIn, user, userIsAstrologer]);

  const displayName =
    formData.displayName || formData.fullName || user?.fullName || "Astrologer";

  const completion = Number(formData.profileCompletionPercentage) || 0;

  const filledFields = useMemo(() => {
    const values = Object.entries(formData).filter(([key, value]) => {
      if (key === "profileCompletionPercentage") {
        return false;
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== "";
    });

    return values.length;
  }, [formData]);

  const updateField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };

  const updateArrayField = (name, value) => {
    updateField(name, normalizeArray(value));
  };

  const handleChat = () => {
    router.push("/chat");
  };

  const handleCall = () => {
    if (formData.mobileNo) {
      window.location.href = `tel:${formData.mobileNo}`;
      return;
    }

    toast.info("Mobile number is not available for calling.");
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const res = await api.put(
        "/authorization/astrologer/profile-me",
        formData,
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );

      if (res?.data) {
        setFormData(normalizeProfile(res.data));
      }

      setHasChanges(false);
      toast.success(res?.message || "Profile updated successfully.");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.errorDescription ||
          "Profile is editable here, but the update API did not accept the save request."
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAuthLoaded || !isLoggedIn || !userIsAstrologer) {
    return null;
  }

  return (
    <PageLayout title="Astrologer Profile" icon="🔭">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mx-auto max-w-6xl pb-5 text-stone-900">
        <section className="overflow-hidden rounded-lg border border-amber-200 bg-[#fffaf0] shadow-sm">
          <div className="grid gap-4 border-b border-amber-100 bg-[#fff6e4] p-4 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-start">
            <div className="flex min-w-0 gap-3">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-amber-300 bg-white text-base font-semibold text-amber-900">
                {getInitials(displayName) || "AP"}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-xl font-semibold text-stone-950">
                    {displayName}
                  </h2>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {formatValue(formData.profileStatus)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-stone-600">
                  {formatValue(formData.specialization)} ·{" "}
                  {formatValue(formData.city)}, {formatValue(formData.state)}
                </p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-stone-600">
                  {formData.aboutYourself ||
                    "Complete your astrologer profile so clients can understand your experience and consultation style."}
                </p>
              </div>
            </div>

            <div className="w-full rounded-md border border-amber-200 bg-white p-3 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-medium text-stone-500">
                    Availability
                  </p>
                  <p className="text-sm font-semibold text-stone-900">
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOnline((value) => !value)}
                  aria-pressed={isOnline}
                  className={`relative h-6 w-11 rounded-full transition ${
                    isOnline ? "bg-emerald-500" : "bg-stone-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                      isOnline ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleChat}
                  disabled={!isOnline}
                  className="h-9 rounded-sm bg-amber-500 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  Chat
                </button>
                <button
                  type="button"
                  onClick={handleCall}
                  disabled={!isOnline}
                  className="h-9 rounded-sm border border-amber-300 bg-white px-4 text-sm font-semibold text-amber-900 shadow-sm transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:border-stone-200 disabled:text-stone-400"
                >
                  Call
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
            {summaryFields.map(([label, key, suffix]) => (
              <div
                key={key}
                className="rounded-md border border-amber-100 bg-white p-3"
              >
                <p className="text-xs font-medium text-stone-500">{label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-stone-950">
                  {formatValue(formData[key], suffix)}
                </p>
              </div>
            ))}
          </div>

          <div className="px-4 pb-4">
            <div className="rounded-md border border-amber-100 bg-white p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-stone-600">
                  API profile completion
                </p>
                <p className="text-xs font-semibold text-amber-800">
                  {completion}%
                </p>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-amber-100">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all"
                  style={{ width: `${Math.min(completion, 100)}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-stone-500">
                {filledFields} profile values are currently available from the
                account data.
              </p>
            </div>
          </div>
        </section>

        {isLoading ? (
          <div className="mt-4 rounded-lg border border-amber-200 bg-white p-5 text-sm text-stone-600">
            Loading astrologer profile...
          </div>
        ) : (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            {sections.map((section) => (
              <section
                key={section.title}
                className="rounded-lg border border-amber-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-4">
                  <h3 className="text-base font-semibold text-stone-950">
                    {section.title}
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-stone-500">
                    {section.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {section.fields.map(([label, name, type, options]) => (
                    <ProfileField
                      key={name}
                      label={label}
                      name={name}
                      type={type}
                      options={options}
                      value={formData[name]}
                      onChange={updateField}
                      onArrayChange={updateArrayField}
                    />
                  ))}
                </div>
              </section>
            ))}

            <div className="sticky bottom-3 z-10 rounded-lg border border-amber-200 bg-white/95 p-3 shadow-lg shadow-amber-900/10 backdrop-blur">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-stone-500">
                  {hasChanges
                    ? "You have unsaved edits."
                    : "All visible API profile data is shown above."}
                </p>
                <button
                  type="submit"
                  disabled={isSaving || !hasChanges}
                  className="h-9 rounded-sm bg-amber-500 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}

function ProfileField({
  label,
  name,
  type = "text",
  options = [],
  value,
  onChange,
  onArrayChange,
}) {
  const isTextarea = type === "textarea" || type === "textarea-wide";
  const wrapperClass =
    type === "textarea-wide" ? "md:col-span-2" : "";

  if (type === "array") {
    return (
      <div className={wrapperClass}>
        <label className="text-xs font-medium text-stone-700">{label}</label>
        <input
          value={normalizeArray(value).join(", ")}
          onChange={(event) => onArrayChange(name, event.target.value)}
          placeholder="Add comma separated values"
          className="mt-1 h-9 w-full rounded-sm border border-amber-100 bg-[#fffdf8] px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {normalizeArray(value).map((item) => (
            <span
              key={item}
              className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs text-amber-900"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={wrapperClass}>
        <label className="text-xs font-medium text-stone-700">{label}</label>
        <select
          value={value || ""}
          onChange={(event) => onChange(name, event.target.value)}
          className="mt-1 h-9 w-full rounded-sm border border-amber-100 bg-[#fffdf8] px-3 text-sm text-stone-900 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15"
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={wrapperClass}>
      <label className="text-xs font-medium text-stone-700">{label}</label>
      {isTextarea ? (
        <textarea
          value={value || ""}
          onChange={(event) => onChange(name, event.target.value)}
          rows={type === "textarea-wide" ? 5 : 3}
          className="mt-1 w-full resize-y rounded-sm border border-amber-100 bg-[#fffdf8] px-3 py-2 text-sm leading-6 text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15"
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) => onChange(name, event.target.value)}
          className="mt-1 h-9 w-full rounded-sm border border-amber-100 bg-[#fffdf8] px-3 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15"
        />
      )}
    </div>
  );
}
