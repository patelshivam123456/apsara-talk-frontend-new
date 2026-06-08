"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";
import {
  canAccessRoute,
  getPrimaryDashboardRoute,
  getUserRoles,
} from "@/utils/roleAccess";
import { getStoredRoles } from "@/utils/tokenStore";

const sidebarMenus = [
  { label: "Home",                  icon: "🏠", route: "/" },
  { label: "Explore Astrologers",   icon: "🔭", route: "/astrologers" },
  { label: "Chat / Sessions",       icon: "💬", route: "/chat" },
  { label: "Kundli / Reports",      icon: "📜", route: "/kundli" },
  { label: "Daily Horoscope",       icon: "⭐", route: "/horoscope" },
  { label: "Compatibility",         icon: "❤️", route: "/compatibility" },
  { label: "Ask the Universe (AI)", icon: "🤖", route: "/ask-universe" },
  { label: "Voice Guidance",        icon: "🎙️", route: "/voice-guidance" },
  { label: "My Activity",           icon: "📊", route: "/activity" },
  { label: "Saved Insights",        icon: "🔖", route: "/saved-insights" },
  { label: "Wallet & Payments",     icon: "💰", route: "/wallet" },
  { label: "Profile & Settings",    icon: "⚙️", route: "/profile" },
];

const astrologerMenus = [
  { label: "Our Profile",           icon: "🔭", route: "/astrologer-profile" },
  { label: "Our Clients",           icon: "💬", route: "/chat" },
  { label: "My Activity",           icon: "📊", route: "/activity" },
];

export default function AppSidebar({ currentRoute }) {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const roles = [
    ...new Set([
      ...getUserRoles(user),
      ...getStoredRoles(),
    ]),
  ];
  const isAdmin = roles.includes("ROLE_ADMIN");
  const isAstrologer = roles.includes("ROLE_ASTROLOGER") && !isAdmin;
  const menuItems = isAstrologer ? astrologerMenus : sidebarMenus;

  const handleNav = (item) => {
    setOpen(false);
    if (!isLoggedIn && item.route !== "/" && item.route !== "/astrologers") {
      setShowModal(true);
    } else if (isLoggedIn && !canAccessRoute(item.route, roles)) {
      router.push(getPrimaryDashboardRoute(roles));
    } else {
      router.push(item.route);
    }
  };

  return (
    <>
      {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden w-9 h-9 flex items-center justify-center rounded-xl bg-[#050816] border border-white/10 text-gray-300 hover:text-white text-lg"
      >
        ☰
      </button>

      {/* Sidebar panel */}
      <aside
        className={`${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:sticky lg:top-0 left-0 top-0 h-screen w-64 lg:w-60 z-50 lg:z-auto transition-transform duration-300 lg:border-r border-white/10 bg-[#050816] p-4 flex flex-col overflow-y-auto shrink-0`}
      >
        {/* Logo row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full border border-[#ffb86c] flex items-center justify-center text-[#ffb86c] text-lg">
              ✦
            </div>
            <span className="text-sm font-semibold text-white">ApsaraTalk</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white text-lg"
          >
            ✕
          </button>
        </div>

        {/* Menu items */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const active = currentRoute === item.route;
            return (
              <button
                key={item.label}
                onClick={() => handleNav(item)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                  active
                    ? "bg-purple-600/30 border border-purple-500/40 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Free chat promo */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-linear-to-br from-[#1b1b52] to-[#0b1027] p-4">
          <h3 className="text-sm font-semibold mb-1">
            {isAstrologer ? "Client Queue" : "First Chat Free"}
          </h3>
          <p className="text-xs text-gray-300 leading-5">
            {isAstrologer
              ? "Review your waiting clients and active sessions."
              : "Get 5 minutes FREE with your first astrologer."}
          </p>
          <button
            onClick={() => handleNav({ route: isAstrologer ? "/chat" : "/astrologers" })}
            className="mt-3 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold transition"
          >
            {isAstrologer ? "Open Clients" : "Claim Now"}
          </button>
        </div>
      </aside>
    </>
  );
}
