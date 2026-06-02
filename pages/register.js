"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { config } from "@/constants/URLConfig";

export default function RegisterPage() {
  const router = useRouter();

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
      username: "Email",
      firstName: "First Name",
      phone: "Mobile",
      gender: "Gender",
      dateOfBirth: "Date of Birth",
      placeOfBirth: "Birth Place",
      password: "Password",
      confirmPassword: "Confirm Password",
    };

    const requiredFields = Object.keys(fieldLabels);

    requiredFields.forEach((field) => {
      if (!formData[field]?.trim()) {
        newErrors[field] = `${fieldLabels[field]} is required`;
      }
    });

    // EMAIL VALIDATION (username treated as email)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (formData.username && !emailRegex.test(formData.username)) {
      newErrors.username = "Enter valid email address";
    }

    // PHONE VALIDATION
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    if (formData.password && formData.password.length < 6) {
  newErrors.password = "Password must be at least 6 characters";
}

// CONFIRM PASSWORD MATCH
if (formData.confirmPassword !== formData.password) {
  newErrors.confirmPassword = "Passwords do not match";
}

    // DOB basic check
    if (formData.dateOfBirth && isNaN(Date.parse(formData.dateOfBirth))) {
      newErrors.dateOfBirth = "Enter valid date of birth";
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
        username: formData.username,
        password: formData.password,

        clientDto: {
          publicId: "",

          firstName: formData.firstName,
          middleName: formData.middleName,
          lastName: formData.lastName,

          email: formData.username,
          phone: formData.phone,

          gender: formData.gender,

          dateOfBirth: formData.dateOfBirth || "",
          placeOfBirth: formData.placeOfBirth || "",

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

      const response = await fetch(config.registerClient, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      toast.success("Registration Successful ✅");
      router.push("/login");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center px-4 py-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="w-full max-w-7xl bg-[#0f1535] rounded-3xl overflow-hidden shadow-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-2">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex relative items-center justify-center bg-[#0b1028]">
          <img
            src={"/Astrosignup.jpg"}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
            alt="register"
          />
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="p-6 md:p-10">
          <div className="mb-3">
            <h1 className="text-2xl font-semibold text-white">
              Welcome to{" "}
              <span className="text-xl md:text-2xl font-semibold">
                Apsara
                <span className="text-pink-400">Talk</span>
              </span>{" "}
              ✨
            </h1>
            <p className="text-gray-300">
              Create your account and start your journey.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5"
          >
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              error={errors.firstName}
            />

            <Input
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />

            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />

            <Input
              label="Email"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />

            <Input
              label="Mobile"
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
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              error={errors.dateOfBirth}
            />

            <Input
              label="Birth Place"
              name="placeOfBirth"
              value={formData.placeOfBirth}
              onChange={handleChange}
              error={errors.placeOfBirth}
            />

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              error={errors.gender}
            />

            <div className="relative">
  <Input
    label="Password"
    type={showPassword ? "text" : "password"}
    name="password"
    value={formData.password}
    onChange={handleChange}
    error={errors.password}
    className="py-2 pr-10"
  />

  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    className="absolute right-3 top-9 text-sm text-gray-300"
  >
    {showPassword ? "Hide" : "Show"}
  </button>
</div>

<div className="relative">
  <Input
    label="Confirm Password"
    type={showConfirmPassword ? "text" : "password"}
    name="confirmPassword"
    value={formData.confirmPassword}
    onChange={handleChange}
    error={errors.confirmPassword}
    className="py-2 pr-10"
  />

  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    className="absolute right-3 top-9 text-sm text-gray-300"
  >
    {showConfirmPassword ? "Hide" : "Show"}
  </button>
</div>

            {/* ROBOT CHECK */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 bg-[#121735] border border-white/10 rounded-xl p-2">
                <input
                  type="checkbox"
                  checked={robotChecked}
                  onChange={(e) => {
                    setRobotChecked(e.target.checked);
                    setErrors({ ...errors, robot: "" });
                  }}
                  className="w-4 h-4 accent-purple-600"
                />
                <span className="text-gray-300">I&apos;m not a robot</span>
              </div>

              {errors.robot && (
                <p className="text-red-400 text-xs mt-2">{errors.robot}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer w-full h-[50px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </div>

            <div className="md:col-span-2 text-center text-gray-400">
              Already have an account?{" "}
              <Link href="/login" className="text-purple-400">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* INPUT */
function Input({ label, error, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <input
        {...props}
        className={`w-full mt-1 h-[40px] bg-[#121735] border rounded-xl px-3 text-white outline-none
        ${error ? "border-red-500" : "border-white/10"}`}
      />
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

/* SELECT */
function Select({ label, options, error, ...props }) {
  return (
    <div>
      <label className="text-sm text-gray-300">{label}</label>
      <select
        {...props}
        className={`w-full mt-1 h-[40px] bg-[#121735] border rounded-xl px-3 text-white
        ${error ? "border-red-500" : "border-white/10"}`}
      >
        <option value="">Select {label}</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}
