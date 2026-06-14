import PublicPageLayout from "@/components/PublicPageLayout";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import { logout, restoreAuth } from "@/redux/slices/authSlice";
import { useEffect, useState } from "react";
import { config } from "@/constants/URLConfig";
import {
  clearServerSession,
  fetchWithAuth,
  serverFetchWithAuth,
} from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PROFILE_COMPLETION_FIELDS = [
  "firstName",
  "lastName",
  "email",
  "phone",
  "gender",
  "dateOfBirth",
  "timeOfBirth",
  "placeOfBirth",
  "address",
  "city",
  "state",
  "pinCode",
  "country",
  "religion",
  "motherTongue",
  "language",
  "fatherName",
  "motherName",
];

const clampPercentage = (value) => Math.min(100, Math.max(0, value));

const calculateProfileCompletion = (profile = {}) => {
  const completedFields = PROFILE_COMPLETION_FIELDS.filter((field) => {
    const value = profile?.[field];

    if (value === null || value === undefined) {
      return false;
    }

    return String(value).trim().length > 0;
  }).length;

  return Math.round((completedFields / PROFILE_COMPLETION_FIELDS.length) * 100);
};

const getProfileCompletionPercentage = (profile = {}) => {
  const apiPercentage = Number(profile?.profileCompletionPercentage);

  if (Number.isFinite(apiPercentage)) {
    return clampPercentage(Math.round(apiPercentage));
  }

  return calculateProfileCompletion(profile);
};

export default function ProfilePage({
  profileData,
  serverIsLoggedIn,
}) {
  const router = useRouter();
  const { isLoggedIn, isAuthLoaded } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [notifs, setNotifs] = useState(true);
  const [emails, setEmails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState(profileData || {});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!isAuthLoaded || !isLoggedIn) {
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetchWithAuth(
          config.getClientProfile,
          {
            method: "GET",
            headers: {
              accept: "*/*",
            },
          },
          {
            onRefreshFailed: () => dispatch(logout()),
          }
        );

        const profileRes = await response.json();

        if (profileRes?.success) {
          const profile = stripAuthFields(profileRes.data);
          setFormData(profile || {});
          dispatch(
            restoreAuth({
              isLoggedIn: true,
              user: profile,
            })
          );
        }
      } catch (error) {
        console.log("Profile API Error:", error);
      }
    }

    loadProfile();
  }, [dispatch, isAuthLoaded, isLoggedIn]);

  useEffect(() => {
    if (!isAuthLoaded) {
      return;
    }

    if (!isLoggedIn && !serverIsLoggedIn) {
      router.replace("/login");
    }
  }, [isAuthLoaded, isLoggedIn, router, serverIsLoggedIn]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleUpdateProfile = async () => {
    try {
      setIsSaving(true);

      const payload = {
        publicId: formData?.publicId || "",
        firstName: formData?.firstName || "",
        middleName: formData?.middleName || "",
        lastName: formData?.lastName || "",
        email: formData?.email || "",
        phone: formData?.phone || "",
        address: formData?.address || "",
        city: formData?.city || "",
        state: formData?.state || "",
        pinCode: formData?.pinCode || "",
        country: formData?.country || "",
        gender: formData?.gender || "",
        dateOfBirth: formData?.dateOfBirth || "",
        timeOfBirth: formData?.timeOfBirth || "",
        placeOfBirth: formData?.placeOfBirth || "",
        countryOfBirth: formData?.countryOfBirth || "",
        dateOfDeath: formData?.dateOfDeath || "",
        timeOfDeath: formData?.timeOfDeath || "",
        dateOfJoining: formData?.dateOfJoining || "",
        timeOfJoining: formData?.timeOfJoining || "",
        religion: formData?.religion || "",
        caste: formData?.caste || "",
        gotra: formData?.gotra || "",
        motherTongue: formData?.motherTongue || "",
        language: formData?.language || "",
        fatherName: formData?.fatherName || "",
        motherName: formData?.motherName || "",
        spouseName: formData?.spouseName || "",
        spouseRelationship: formData?.spouseRelationship || "",
        childName: formData?.childName || "",
      };

      const response = await fetchWithAuth(
        config.updateClientProfile,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
          body: JSON.stringify(payload),
        },
        {
          onRefreshFailed: () => dispatch(logout()),
        }
      );

      const res = await response.json();

      if (res?.success) {
        setIsEditing(false);
      } else {
        alert(res?.message || "Failed to update profile");
      }
    } catch (error) {
      console.log("Update Profile Error:", error);
      alert("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  const handleDeleteProfile = async () => {
    try {
      setIsDeleting(true);
      const url = `${config.deleteClientProfile}?clientId=${formData?.publicId}`;

      const response = await fetchWithAuth(
        url,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        },
        {
          onRefreshFailed: () => dispatch(logout()),
        }
      );

      const res = await response.json();

      if (res?.success) {
        toast.success("Profile deleted successfully");

        await clearServerSession();
        dispatch(logout());

        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      } else {
        toast.error(res?.message || "Failed to delete profile");
      }
    } catch (error) {
      console.log("Delete Profile Error:", error);

      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  const accountFields = [
    { label: "First Name", field: "firstName" },
    { label: "Middle Name", field: "middleName" },
    { label: "Last Name", field: "lastName" },
    { label: "Email", field: "email", disabled: true },
    { label: "Mobile", field: "phone" },
    { label: "Gender", field: "gender" },
  ];

  const birthFields = [
    { label: "Date Of Birth", field: "dateOfBirth", type: "date" },
    { label: "Time Of Birth", field: "timeOfBirth", type: "time" },
    { label: "Place Of Birth", field: "placeOfBirth" },
    { label: "Country Of Birth", field: "countryOfBirth" },
  ];

  const locationFields = [
    { label: "Address", field: "address" },
    { label: "City", field: "city" },
    { label: "State", field: "state" },
    { label: "Pin Code", field: "pinCode" },
    { label: "Country", field: "country" },
  ];

  const familyFields = [
    { label: "Religion", field: "religion" },
    { label: "Caste", field: "caste" },
    { label: "Gotra", field: "gotra" },
    { label: "Mother Tongue", field: "motherTongue" },
    { label: "Language", field: "language" },
    { label: "Father Name", field: "fatherName" },
    { label: "Mother Name", field: "motherName" },
    { label: "Spouse Name", field: "spouseName" },
    { label: "Child Name", field: "childName" },
  ];

  const profileCompletionPercentage = getProfileCompletionPercentage(formData);
  const completedRequiredFields = PROFILE_COMPLETION_FIELDS.filter((field) =>
    String(formData?.[field] || "").trim()
  ).length;
  const displayName =
    `${formData?.firstName || "Apsara"} ${formData?.lastName || "Member"}`.trim();
  const completionStrokeStyle = {
    background: `conic-gradient(#dfff00 ${profileCompletionPercentage * 3.6}deg, #efe6c7 0deg)`,
  };

  const renderField = (label, field, disabled = false, type = "text") => (
    <div
      key={field}
      className="rounded-[18px] border border-[#eadcae] bg-[#fffdf8] px-4 py-3 text-[#211704] transition focus-within:border-[#d8ce76] focus-within:bg-white"
    >
      <label className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
        {label}
      </label>

      {isEditing && !disabled ? (
        <input
          type={type}
          value={formData?.[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          className="mt-2 h-10 w-full bg-transparent text-sm font-semibold text-[#211704] outline-none placeholder:text-[#8a7a55]"
        />
      ) : (
        <p className="mt-2 min-h-6 break-words text-sm font-semibold text-[#211704]">
          {formData?.[field] || "Not added"}
        </p>
      )}
    </div>
  );

  const renderSection = (title, description, fields) => (
    <section className="rounded-[24px] border border-[#eadcae] bg-white/92 p-5 shadow-[0_18px_42px_rgba(107,82,12,0.13)]">
      <div className="mb-5">
        <h3 className="text-base font-extrabold text-[#211704]">{title}</h3>
        <p className="mt-1 text-sm text-[#60481f]">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {fields.map(({ label, field, disabled, type }) =>
          renderField(label, field, disabled, type)
        )}
      </div>
    </section>
  );

  if (!isAuthLoaded && !serverIsLoggedIn) {
    return null;
  }

  if (!isLoggedIn && !serverIsLoggedIn) {
    return null;
  }

  return (
    <PublicPageLayout
      eyebrow="Account center"
      title="Profile & Settings"
      description="Keep your personal, birth, contact, and family details ready for faster, more accurate guidance."
      profileData={profileData}
    >
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-md rounded-[24px] border border-[#eadcae] bg-white p-6 text-[#211704] shadow-xl">
            <h2 className="mb-2 text-lg font-extrabold">
              Deactivate Profile
            </h2>

            <p className="mb-6 text-sm leading-6 text-[#60481f]">
              Are you sure you want to deactivate your profile? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
                className="rounded-full border border-[#eadcae] bg-[#fffdf8] px-4 py-2 text-sm font-bold text-[#60481f] hover:bg-[#fff8dc] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteProfile}
                disabled={isDeleting}
                className="flex min-w-20 items-center justify-center gap-2 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="overflow-hidden rounded-[28px] border border-[#eadcae] bg-white/92 text-[#211704] shadow-[0_22px_70px_rgba(87,60,12,0.12)]">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.8fr]">
            <div className="p-6 md:p-8">
              <div className="flex flex-col gap-5 sm:flex-row ">
                <div className="relative h-24 w-24 shrink-0 rounded-full border-4 border-[#d8ce76] bg-[#211704] shadow-2xl">
                  <div className="flex h-full w-full items-center justify-center rounded-full text-3xl font-black text-[#dfff00]">
                    {getInitials(formData?.firstName, formData?.lastName) || "AT"}
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  {/* <p className="text-xs uppercase tracking-[0.22em] text-teal-300">
                    Premium Client Profile
                  </p> */}
                  <h2 className="break-words text-3xl font-extrabold text-[#211704]">
                    {displayName}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-[#60481f]">
                    Keep your birth, contact, and family details complete for a
                    sharper consultation experience.
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={handleEditToggle}
                      className="cursor-pointer rounded-full bg-[#dfff00] px-5 py-2.5 text-sm font-bold text-[#312d1e] shadow-[0_14px_26px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
                    >
                      {isEditing ? "Cancel Editing" : "Edit Profile"}
                    </button>

                    {isEditing && (
                      <button
                        onClick={handleUpdateProfile}
                        disabled={isSaving}
                        className="cursor-pointer rounded-full bg-[#211704] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#3a2909] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    )}

                    <Link
                      href="/change-password"
                      className="rounded-full border border-[#d8ce76] bg-[#fffdf8] px-5 py-2.5 text-sm font-bold text-[#60481f] transition hover:bg-[#fff8dc]"
                    >
                      Change Password
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#eadcae] bg-[#fff8dc] p-6 text-[#211704] lg:border-l lg:border-t-0 md:p-8">
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div
                  className="grid h-40 w-40 place-items-center rounded-full p-3"
                  style={completionStrokeStyle}
                >
                  <div className="grid h-full w-full place-items-center rounded-full bg-white">
                    <div>
                      <p className="text-4xl font-extrabold text-[#211704]">
                        {profileCompletionPercentage}%
                      </p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-[#8a6106]">
                        Complete
                      </p>
                    </div>
                  </div>
                </div>

                <p className="mt-5 text-sm font-bold text-[#211704]">
                  {completedRequiredFields} of {PROFILE_COMPLETION_FIELDS.length} key fields complete
                </p>
                <p className="mt-2 text-sm leading-6 text-[#60481f]">
                  Add missing details to raise your profile score and improve
                  personalization.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {renderSection(
            "Account Details",
            "Primary identity and contact information for your account.",
            accountFields
          )}
          {renderSection(
            "Birth Profile",
            "Astrology-ready details used for more accurate guidance.",
            birthFields
          )}
          {renderSection(
            "Location Details",
            "Current address and regional profile information.",
            locationFields
          )}
          {renderSection(
            "Family And Culture",
            "Personal context that helps tailor recommendations.",
            familyFields
          )}
        </div>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-[24px] border border-[#eadcae] bg-white/92 p-5 shadow-[0_18px_42px_rgba(107,82,12,0.10)]">
            <div className="mb-4">
              <h3 className="text-base font-extrabold text-[#211704]">Preferences</h3>
              <p className="mt-1 text-sm text-[#60481f]">
                Control how ApsaraTalk keeps you updated.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                {
                  label: "Push Notifications",
                  value: notifs,
                  toggle: setNotifs,
                },
                {
                  label: "Email Updates",
                  value: emails,
                  toggle: setEmails,
                },
              ].map(({ label, value, toggle }) => (
                <div
                  key={label}
                  className="flex items-center justify-between rounded-[18px] border border-[#eadcae] bg-[#fffdf8] px-4 py-4"
                >
                  <span className="text-sm font-bold text-[#211704]">{label}</span>

                  <button
                    onClick={() => toggle(!value)}
                    className={`relative h-6 w-11 cursor-pointer rounded-full border transition-all ${
                      value
                        ? "border-[#d8ce76] bg-[#dfff00]"
                        : "border-[#eadcae] bg-[#fff8dc]"
                    }`}
                    aria-pressed={value}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                        value ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-red-200 bg-red-50 p-5">
            <h3 className="text-base font-extrabold text-[#211704]">Account Actions</h3>
            <p className="mt-1 text-sm leading-6 text-red-700">
              Deactivation removes access to your profile and saved consultation
              details.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="mt-5 w-full cursor-pointer rounded-full border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-100"
            >
              Deactivate Account
            </button>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}

export async function getServerSideProps(context) {
  try {
    const { response } = await serverFetchWithAuth(
      config.getClientProfile,
      {
        method: "GET",
        headers: {
          accept: "*/*",
        },
      },
      { req: context.req, res: context.res }
    );

    if (response.ok) {
      const profileRes = await response.json();
      const profileData = profileRes?.success
        ? stripAuthFields(profileRes.data)
        : null;

      return {
        props: {
          serverIsLoggedIn: !!profileData,
          profileData,
        },
      };
    }
  } catch (error) {
    console.log("Profile SSR Error:", error);
  }

  return {
    props: {
      serverIsLoggedIn: false,
      profileData: null,
    },
  };
}
