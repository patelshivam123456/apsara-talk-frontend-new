import { updatePassword } from "@/api/AuthApi";
import PageLayout from "@/components/PageLayout";
import { config } from "@/constants/URLConfig";
import { logout, restoreAuth } from "@/redux/slices/authSlice";
import { clearServerSession, serverFetchWithAuth } from "@/utils/authFetch";
import { stripAuthFields } from "@/utils/authState";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword({ profileData, serverIsLoggedIn }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);

  const initialUsername = profileData?.username || profileData?.email || "";

  const [formData, setFormData] = useState({
    username: initialUsername,
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

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

  const renderPasswordInput = (label, field, placeholder) => (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        type="password"
        value={formData[field]}
        onChange={(event) => handleChange(field, event.target.value)}
        className="w-full mt-2 bg-[#121735] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
        placeholder={placeholder}
      />
      {errors[field] && (
        <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <PageLayout
      title="Change Password"
      icon="🔐"
      serverIsLoggedIn={serverIsLoggedIn || !!profileData || isLoggedIn}
    >
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 space-y-5"
        >
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
              Account Security
            </p>
            <h2 className="text-xl font-semibold text-white">
              Update your password
            </h2>
          </div>

          <div>
            <label className="text-sm text-gray-300">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={(event) => handleChange("username", event.target.value)}
              className="w-full mt-2 bg-[#121735] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="text-red-400 text-xs mt-1">{errors.username}</p>
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
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {errors.form}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="submit"
              disabled={isSaving}
              className="cursor-pointer flex-1 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Updating..." : "Change Password"}
            </button>
            <Link
              href="/profile"
              className="text-center flex-1 py-3 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </PageLayout>
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
