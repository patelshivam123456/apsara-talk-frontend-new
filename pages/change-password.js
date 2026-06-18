import { updatePassword } from "@/api/AuthApi";
import ChatPanel from "@/components/ChatPanel";
import Header from "@/components/Header";
import NotificationPanel from "@/components/NotificationPanel";
import { config } from "@/constants/URLConfig";
import { logout, restoreAuth } from "@/redux/slices/authSlice";
import { clearServerSession, serverFetchWithAuth } from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword({ profileData }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const initialUsername = profileData?.username || profileData?.email || "";

  const [formData, setFormData] = useState({
    username: initialUsername,
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    oldPassword: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    if (profileData) {
      dispatch(
        restoreAuth({
          isLoggedIn: true,
          user: profileData,
        })
      );
    }
  }, [dispatch, profileData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
      form: "",
    }));
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.username.trim()) {
      nextErrors.username = "Username is required";
    }

    if (!formData.oldPassword.trim()) {
      nextErrors.oldPassword = "Current password is required";
    }

    if (!formData.password.trim()) {
      nextErrors.password = "New password is required";
    } else if (formData.password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      nextErrors.confirmPassword = "Confirm password is required";
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    if (
      formData.oldPassword &&
      formData.password &&
      formData.oldPassword === formData.password
    ) {
      nextErrors.password = "New password must be different";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);

      const result = await updatePassword({
        username: formData.username.trim(),
        password: formData.password,
        oldPassword: formData.oldPassword,
      });

      if (result?.success === false) {
        throw new Error(result?.message || "Failed to change password");
      }

      toast.success(result?.message || "Password changed successfully");
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        password: "",
        confirmPassword: "",
      }));
      await clearServerSession();
       dispatch(logout());
      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (error) {
      if (error?.response?.status === 401) {
        dispatch(logout());
      }

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";

      setErrors((prev) => ({
        ...prev,
        form: message,
      }));
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const renderPasswordInput = (label, field, placeholder) => (
    <div>
      <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]">
        {label}
      </label>
      <div className="relative mt-2">
        <input
          type={visiblePasswords[field] ? "text" : "password"}
          value={formData[field]}
          onChange={(event) => handleChange(field, event.target.value)}
          className="h-11 w-full rounded-sm border border-amber-100 bg-white px-3 pr-12 text-sm font-semibold text-[#211704] shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-[#8a7a55] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => togglePasswordVisibility(field)}
          className="absolute right-2 top-1.5 flex h-8 w-8 items-center justify-center rounded-full text-amber-800 transition hover:bg-amber-50 hover:text-amber-950"
          aria-label={visiblePasswords[field] ? "Hide password" : "Show password"}
        >
          <PasswordVisibilityIcon visible={visiblePasswords[field]} />
        </button>
      </div>
      {errors[field] && (
        <p className="mt-1 text-xs text-red-600">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen dashboard-bg text-[#211704]">
      <ChatPanel />
      <NotificationPanel />
      <Header profileData={profileData} />
      <ToastContainer position="top-right" autoClose={3000} />

      <main className="mx-auto w-full max-w-[1500px] px-3 pb-8 pt-28 sm:px-5 lg:px-8">
        <div className="mx-auto max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-[24px] border border-[#eadcae] bg-white/92 p-5 shadow-[0_22px_70px_rgba(87,60,12,0.12)] sm:p-7"
        >
          <div>
            <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#8a6106]">
              Account Security
            </p>
            <h1 className="text-2xl font-extrabold text-[#211704]">
              Update your password
            </h1>
            <p className="mt-2 text-sm leading-6 text-[#60481f]">
              Change your account password and sign in again with the new one.
            </p>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(event) => handleChange("username", event.target.value)}
              className="mt-2 h-11 w-full rounded-sm border border-amber-100 bg-white px-3 text-sm font-semibold text-[#211704] shadow-sm shadow-amber-900/10 outline-none transition placeholder:text-[#8a7a55] focus:border-amber-400 focus:ring-2 focus:ring-amber-500/15"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-600">{errors.username}</p>
            )}
          </div>

          {renderPasswordInput(
            "Current Password",
            "oldPassword",
            "Enter current password"
          )}
          {renderPasswordInput(
            "New Password",
            "password",
            "Enter new password"
          )}
          {renderPasswordInput(
            "Confirm New Password",
            "confirmPassword",
            "Re-enter new password"
          )}

          {errors.form && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errors.form}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-1 sm:flex-row">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 cursor-pointer rounded-full bg-[#dfff00] py-3 text-sm font-black text-[#211704] shadow-[0_14px_26px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Updating..." : "Change Password"}
            </button>
            <Link
              href="/profile"
              className="flex-1 rounded-full border border-[#d8ce76] bg-[#fbf8cc] py-3 text-center text-sm font-black text-[#3f3a15] transition hover:bg-[#f5efbf]"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
      </main>
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

      if (profileData) {
        return {
          props: {
            serverIsLoggedIn: true,
            profileData,
          },
        };
      }
    }
  } catch (error) {
    console.log("Change Password SSR Error:", error);
  }

  return {
    redirect: {
      destination: "/login",
      permanent: false,
    },
  };
}
