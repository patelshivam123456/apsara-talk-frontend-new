"use client";
import PageLayout from "@/components/PageLayout";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch  = useDispatch();
  const router    = useRouter();

  const [notifs, setNotifs] = useState(true);
  const [emails, setEmails] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  return (
    <PageLayout title="Profile & Settings" icon="⚙️">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* Profile card */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-6 flex items-center gap-5">
          <img
            src={user?.image || "https://i.pravatar.cc/150?img=12"}
            className="w-20 h-20 rounded-full border-2 border-purple-500/40 object-cover"
          />
          <div>
            <h2 className="text-xl font-bold">{user?.name || "User"}</h2>
            <p className="text-sm text-gray-400 mt-0.5">CosmicPath Member ✨</p>
            <button className="mt-2 text-xs text-purple-400 hover:text-purple-300 transition">Edit Profile →</button>
          </div>
        </div>

        {/* Account details */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Account Details</p>
          <div className="space-y-3">
            {[
              { label: "Name",    value: user?.name || "—" },
              { label: "Email",   value: "user@cosmicpath.in" },
              { label: "Mobile",  value: "+91 98765 43210" },
              { label: "Sun Sign",value: "Aries ♈" },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
                <span className="text-xs text-gray-400">{label}</span>
                <span className="text-sm font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Preferences</p>
          <div className="space-y-3">
            {[
              { label: "Push Notifications", value: notifs, toggle: setNotifs },
              { label: "Email Updates",       value: emails, toggle: setEmails },
            ].map(({ label, value, toggle }) => (
              <div key={label} className="flex items-center justify-between py-2">
                <span className="text-sm">{label}</span>
                <button
                  onClick={() => toggle(!value)}
                  className={`w-11 h-6 rounded-full border transition-all duration-200 relative ${
                    value ? "bg-purple-600 border-purple-500" : "bg-white/10 border-white/20"
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200 ${value ? "left-5" : "left-0.5"}`} />
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
