import PageLayout from "@/components/PageLayout";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useState } from "react";
import { config } from "@/constants/URLConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ProfilePage({ profileData, serverIsLoggedIn, token }) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [notifs, setNotifs] = useState(true);
  const [emails, setEmails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState(profileData || {});
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = "/"; // hard redirect after logout
  };

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

      const response = await fetch(config.updateClientProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

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
      const response = await fetch(config.deleteClientProfile, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          clientId: profileData?.publicId,
        }),
      });

      const res = await response.json();

      if (res?.success) {
        toast.success("Profile deleted successfully");

        dispatch(logout());

        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else {
        toast.error(res?.message || "Failed to delete profile");
      }
    } catch (error) {
      console.log("Delete Profile Error:", error);

      toast.error("Something went wrong");
    }
  };

  const renderField = (label, field, disabled = false, type = "text") => (
    <div
      key={field}
      className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0 gap-4"
    >
      <span className="text-xs text-gray-400 min-w-[140px]">{label}</span>

      {isEditing && !disabled ? (
        <input
          type={type}
          value={formData?.[field] || ""}
          onChange={(e) => handleChange(field, e.target.value)}
          className="bg-[#121735] border border-white/10 rounded-lg px-3 py-2 text-sm w-full outline-none focus:border-purple-500"
        />
      ) : (
        <span className="text-sm font-medium text-right">
          {formData?.[field] || "—"}
        </span>
      )}
    </div>
  );

  return (
    <PageLayout title="Profile & Settings" icon="⚙️">
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="bg-[#0f1535] border border-white/10 rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-2">
              Delete Profile
            </h2>

            <p className="text-sm text-gray-300 mb-6">
              Are you sure you want to delete your profile? This action cannot
              be undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/20"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  handleDeleteProfile();
                }}
                className="cursor-pointer px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Profile Card */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
          {/* <img
            src={getInitials(profileData.firstName, profileData?.lastName)}
            className="w-20 h-20 rounded-full border-2 border-purple-500/40 object-cover"
          /> */}
          <div className="relative w-20 h-20">
            <div className="w-20 h-20 text-2xl font-bold flex items-center justify-center rounded-full border-2 border-purple-500/40 object-cover bg-[#121735]">
              {getInitials(profileData.firstName, profileData?.lastName)}
            </div>

            {/* Delete Icon */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="cursor-pointer absolute bottom-1 -right-1 w-7 h-7 rounded-full bg-white hover:bg-red-100 flex items-center justify-center text-white shadow-lg transition"
              title="Delete Profile"
            >
              🗑
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {formData?.firstName || "User"} {formData?.lastName || ""}
            </h2>

            <p className="text-sm text-gray-400 mt-0.5">CosmicPath Member ✨</p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={handleEditToggle}
                className="text-xs text-purple-400 hover:text-purple-300 transition"
              >
                {isEditing ? "Cancel Editing" : "Edit Profile →"}
              </button>

              {isEditing && (
                <button
                  onClick={handleUpdateProfile}
                  disabled={isSaving}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs transition disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            Account Details
          </p>

          <div className="space-y-3">
            {renderField("First Name", "firstName")}
            {renderField("Last Name", "lastName")}
            {renderField("Email", "email", true)}
            {renderField("Mobile", "phone")}
            {renderField("Gender", "gender")}
          </div>
        </div>

        {/* Personal Details */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            Personal Details
          </p>

          <div className="space-y-3">
            {renderField("Middle Name", "middleName")}
            {renderField("Address", "address")}
            {renderField("City", "city")}
            {renderField("State", "state")}
            {renderField("Pin Code", "pinCode")}
            {renderField("Country", "country")}
            {renderField("Date Of Birth", "dateOfBirth", false, "date")}
            {renderField("Time Of Birth", "timeOfBirth", false, "time")}
            {renderField("Place Of Birth", "placeOfBirth")}
          </div>
        </div>

        {/* Other Details */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            Other Details
          </p>

          <div className="space-y-3">
            {renderField("Religion", "religion")}
            {renderField("Caste", "caste")}
            {renderField("Gotra", "gotra")}
            {renderField("Mother Tongue", "motherTongue")}
            {renderField("Language", "language")}
            {renderField("Father Name", "fatherName")}
            {renderField("Mother Name", "motherName")}
            {renderField("Spouse Name", "spouseName")}
            {renderField("Child Name", "childName")}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">
            Preferences
          </p>

          <div className="space-y-3">
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
                className="flex items-center justify-between py-2"
              >
                <span className="text-sm">{label}</span>

                <button
                  onClick={() => toggle(!value)}
                  className={`w-11 h-6 rounded-full border transition-all relative ${
                    value
                      ? "bg-purple-600 border-purple-500"
                      : "bg-white/10 border-white/20"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                      value ? "left-5" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-3 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition text-sm font-semibold"
        >
          Logout
        </button>
      </div>
    </PageLayout>
  );
}

export async function getServerSideProps({ req }) {
  const serverIsLoggedIn = req.cookies?.isLoggedIn === "1";
  const token = req.cookies?.token || null;

  // 🔴 BLOCK UNAUTHENTICATED USERS BEFORE PAGE LOAD
  if (!serverIsLoggedIn || !token) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  let profileData = null;

  try {
    const response = await fetch(config.getClientProfile, {
      method: "GET",
      headers: {
        accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();

    if (res?.success) {
      profileData = res?.data;
    } else {
      return {
        redirect: {
          destination: "/login",
          permanent: false,
        },
      };
    }
  } catch (error) {
    console.log("Profile API Error:", error);

    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      serverIsLoggedIn,
      profileData,
      token,
    },
  };
}
