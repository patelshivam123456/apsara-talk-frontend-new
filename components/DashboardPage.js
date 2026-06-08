"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import QuickActions from "@/components/QuickActions";
import PlanetaryHighlights from "@/components/PlanetaryHighlights";
import Astrologers from "@/components/Astrologers";
import Categories from "@/components/Categories";
import LifeGuidance from "@/components/LifeGuidance";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import NotificationPanel from "@/components/NotificationPanel";
import LoginPromptModal from "@/components/LoginPromptModal";
import {
  canAccessRoute,
  getPrimaryDashboardRoute,
  getUserRoles,
} from "@/utils/roleAccess";
import { getStoredRoles } from "@/utils/tokenStore";

export default function DashboardPage({ sidebarOpen, handleOpenSidebar,profileData, astrologerData }) {
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

  const handleAction = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      router.push("/thankyou");
    }
  };

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
    { label: "Our Profile", icon: "🔭", route: "/astrologer-profile" },
    { label: "Our Clients", icon: "💬", route: "/chat" },
    { label: "My Activity", icon: "📊", route: "/activity" },
  ];
  const visibleMenus = isAstrologer ? astrologerMenus : sidebarMenus;

  return (
    <>
      {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}

      {/* OVERLAY PANELS — rendered once at root */}
      <ChatPanel />
      <NotificationPanel />

      <div className="min-h-screen text-white p-2 sm:p-3 dashboard-bg">
        <div className="border border-white/10 rounded-2xl overflow-hidden bg-[#070b1d]">
          <div className="flex flex-col lg:flex-row">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer"
                onClick={() => handleOpenSidebar()}
              />
            )}

            {/* LEFT SIDEBAR */}
            <aside
              className={`${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 fixed lg:relative left-0 top-0 h-full lg:h-auto w-64 lg:w-60 z-50 lg:z-auto transition-all duration-300 lg:border-r border-white/10 bg-[#050816] lg:min-h-screen p-4 overflow-y-auto`}
            >
              {/* LOGO */}
              <div className="flex items-center justify-between gap-3 mb-6">
                <div className={`flex items-center gap-2 ${!sidebarOpen ? "hidden lg:flex" : ""}`}>
                  <div className="w-9 h-9 rounded-full border border-[#ffb86c] flex items-center justify-center text-[#ffb86c] text-lg">
                    ✦
                  </div>
                </div>

                <button
                  onClick={() => handleOpenSidebar()}
                  className="text-xl flex items-center justify-center text-gray-300 cursor-pointer hover:text-white lg:hidden"
                >
                  ☰
                </button>
              </div>

              {/* MENUS */}
              <div className="space-y-2">
                {visibleMenus.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (!isLoggedIn && item.route !== "/" && item.route !== "/astrologers") {
                        setShowModal(true);
                      } else if (isLoggedIn && !canAccessRoute(item.route, roles)) {
                        router.push(getPrimaryDashboardRoute(roles));
                      } else {
                        router.push(item.route);
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200
                      ${
                        item.route === "/"
                          ? "bg-purple-600/30 border border-purple-500/40 text-white"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                  >
                    <span className="text-base w-5 text-center shrink-0">{item.icon}</span>
                    <span className={`truncate ${!sidebarOpen ? "hidden lg:inline" : ""}`}>{item.label}</span>
                  </button>
                ))}
              </div>

              {/* FREE CHAT CARD */}
              <div className={`mt-6 rounded-2xl overflow-hidden border border-white/10 bg-linear-to-br from-[#1b1b52] to-[#0b1027] p-4 ${!sidebarOpen ? "hidden lg:block" : ""}`}>
                <h3 className="text-lg font-semibold mb-2">
                  {isAstrologer ? "Client Queue" : "First Chat Free"}
                </h3>
                <p className="text-xs text-gray-300 leading-5">
                  {isAstrologer
                    ? "Review your assigned clients and active sessions."
                    : "Get 5 minutes FREE with your first astrologer."}
                </p>
                <button
                  onClick={() =>
                    isAstrologer ? router.push("/chat") : handleAction()
                  }
                  className="mt-4 w-full py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm"
                >
                  {isAstrologer ? "Open Clients" : "Claim Now"}
                </button>
              </div>
            </aside>

            {/* CENTER + RIGHT */}
            <div className="flex-1 min-w-0 flex flex-col lg:flex-row">

              {/* MAIN CONTENT */}
              <div className="flex-1 min-w-0 p-3 sm:p-5 space-y-4 sm:space-y-6">

                {/* MOBILE HAMBURGER */}
                <button
                  onClick={() => handleOpenSidebar()}
                  className="lg:hidden text-2xl text-gray-300 hover:text-white"
                >
                  ☰
                </button>

                <Header profileData={profileData} />
                <Hero profileData={profileData}/>

                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {/* <QuickActions /> */}
                  <PlanetaryHighlights />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
<QuickActions /> 
</div>
                <Astrologers limit={3} astrologerData={astrologerData}/>
                <Categories />
                <LifeGuidance />
              </div>

              {/* RIGHT SIDEBAR */}
              <Sidebar />
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
