"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [robotChecked, setRobotChecked] =
    useState(false);

  // ALL FIELDS (UNCHANGED - for API payload)
  const [formData, setFormData] = useState({
    username: "",
    password: "",

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
    username: "User Name",
    password: "Password",
    firstName: "First Name",
    phone: "Phone",
    gender: "Gender",
    address: "Address",
    city: "City",
    state: "State",
    pinCode: "Pin Code",
  };

  const requiredFields = Object.keys(fieldLabels);

  requiredFields.forEach((field) => {
    if (!formData[field]?.trim()) {
      newErrors[field] =
        `${fieldLabels[field]} is required`;
    }
  });

  // EMAIL VALIDATION (username treated as email)
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (
    formData.username &&
    !emailRegex.test(formData.username)
  ) {
    newErrors.username =
      "Enter valid email address";
  }

  // PASSWORD
  if (
    formData.password &&
    formData.password.length < 6
  ) {
    newErrors.password =
      "Password must be at least 6 characters";
  }

  // PHONE
  const phoneRegex = /^[0-9]{10}$/;
  if (
    formData.phone &&
    !phoneRegex.test(formData.phone)
  ) {
    newErrors.phone =
      "Phone must be 10 digits";
  }

  // PIN CODE
  if (
    formData.pinCode &&
    !/^[0-9]{6}$/.test(formData.pinCode)
  ) {
    newErrors.pinCode =
      "Pin Code must be 6 digits";
  }

  // ROBOT CHECK
  if (!robotChecked) {
    newErrors.robot =
      "Please confirm you are not a robot";
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

          address: formData.address,
          city: formData.city,
          state: formData.state,
          pinCode: formData.pinCode,
          country: "India",

          gender: formData.gender,

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
          spouseRelationship:"",

          childName: "",
        },
      };

      const response = await fetch(
        "http://65.0.55.178:8080/authorization/auth/create-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

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
<a href="/">🏠</a>
          <div className="mb-3 mt-3">
            <h1 className="text-2xl font-semibold text-white">
              Welcome to <span className="text-xl md:text-2xl font-semibold">
            Apsara
            <span className="text-pink-400">Talk</span>
          </span> ✨
            </h1>
            <p className="text-gray-300">
              Create your account and start
              your journey.
            </p>
          </div>

          <form
            onSubmit={handleRegister}
            className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-5"
          >

            <Input
              label="User Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
              className="py-2"
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className="py-2"
            />

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
              label="Phone"
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
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              error={errors.address}
            />

            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
            />

            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              error={errors.state}
            />

            <Input
              label="Pin Code"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              error={errors.pinCode}
              className="py-3"
            />

            {/* <Input
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            /> */}

            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
              error={errors.gender}
            />

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
                <span className="text-gray-300">
                  I'm not a robot
                </span>
              </div>

              {errors.robot && (
                <p className="text-red-400 text-xs mt-2">
                  {errors.robot}
                </p>
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
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
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
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
}