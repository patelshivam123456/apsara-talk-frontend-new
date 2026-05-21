"use client";

import { useState } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { config } from "@/constants/URLConfig";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
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
      const response = await fetch(
        config.loginClient,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res?.message || "Login failed");
      }

      toast.success(res?.message || "Login successful");

      dispatch(
        login({
          name: res?.data?.username || formData.username,
          image: "https://i.pravatar.cc/150?img=12",
          token: res?.data?.token,
          user: res?.data,
        })
      );

      router.push("/");
    } catch (error) {
      toast.error(error?.message || "Login failed. Please try again.");
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
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl bg-[#0f1535] border border-white/10 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">

        {/* LEFT IMAGE */}
        <div className="relative hidden md:block">
          <img
            src="/Astrosignup.jpg"
            alt="login"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-8 md:p-12 text-white">

          <div className="mb-8">
            <h1 className="text-2xl font-semibold">Welcome Back to  <span className="text-xl md:text-2xl font-semibold">
            Apsara
            <span className="text-pink-400">Talk</span>
          </span> ✨</h1>
            <p className="text-gray-300 mt-2 text-sm">
              Enter your username and password to login
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* USERNAME */}
            <div>
              <label className="text-sm text-gray-300">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => handleChange("username", e.target.value)}
                className="w-full mt-2 bg-[#121735] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
                placeholder="Enter username"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm text-gray-300">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full mt-2 bg-[#121735] border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-purple-500"
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* FORGOT */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-purple-400 hover:text-purple-300"
              >
                Forgot Password?
              </button>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition font-medium"
            >
              Login
            </button>

            {/* REGISTER */}
            <div className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-purple-400 hover:text-purple-300"
              >
                Register Now
              </Link>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}