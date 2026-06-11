"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/router";

import { useApp } from "@/context/AppContext";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";
import { clearServerSession } from "@/utils/authFetch";
import { getProfileRoute, getUserRoles } from "@/utils/roleAccess";
import { getStoredRoles } from "@/utils/tokenStore";
import { useLanguage } from "@/context/LanguageContext";

const Header = ({ profileData }) => {
  const router = useRouter();
  const { t } = useLanguage();

  const {
    setChatOpen,
    setNotifOpen,
    searchQuery,
    setSearchQuery,
    data,
  } = useApp();

  const [hideResults, setHideResults] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const dropdownRef = useRef();

  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector(
    (state) => state.auth
  );
  const roles = [
    ...new Set([
      ...getUserRoles(user),
      ...getStoredRoles(),
    ]),
  ];
  const profileRoute = getProfileRoute(roles);
  const displayFirstName =
    profileData?.firstName || user?.firstName || user?.username || user?.name;
  const displayLastName = profileData?.lastName || user?.lastName;
  const displayName =
    [displayFirstName, displayLastName].filter(Boolean).join(" ") || "User";

  const results = useMemo(() => {
    if (hideResults || !searchQuery.trim()) {
      return [];
    }

    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, hideResults, searchQuery]);

  // ❌ CLOSE DROPDOWN
  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  // ✅ LOGIN REDIRECT
  const handleLogin = () => {
    setShowDropdown(false);
    router.push("/login");
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await clearServerSession();
      dispatch(logout());
      setShowDropdown(false);
      router.replace("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <div className="flex flex-col gap-3 mb-4">

      {/* ROW 1: Logo + Actions (always on one line) */}
      <div className="flex items-center justify-between">

        {/* LOGO */}
        <div className="">
          {/* <div className="w-9 h-9 rounded-full border border-[#ffb86c] flex items-center justify-center text-[#ffb86c] text-lg">
            ✦
          </div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Apsara
            <span className="text-pink-400">Talk</span>
          </h2> */}
          <img src="/logo_apsara.jpeg" alt="Apsara Talk Logo" className="w-16 h-16" />
        </div>

        {/* RIGHT ACTIONS */}
        <div
          className="flex items-center gap-2 sm:gap-3 relative"
          ref={dropdownRef}
        >
          {/* CHAT */}
          <button
            onClick={() => setChatOpen(true)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
            aria-label="Open chat"
          >
            💬
          </button>

          {/* NOTIFICATION */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(true)}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
            >
              🔔
            </button>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </div>

          {/* PROFILE */}
          <div className="relative">
            {isLoggedIn ? (
              <div onClick={() => setShowDropdown(!showDropdown)} className="bg-white/5 cursor-pointer rounded-full text-black w-10 h-10 flex justify-center items-center">
                {getInitials(displayFirstName, displayLastName) || "U"}
                </div>
              // <img
              //   onClick={() => setShowDropdown(!showDropdown)}
              //   src={user?.image}
              //   className="w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer border border-white/10 object-cover"
              //   alt="user"
              // />
            ) : (
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                👤
              </button>
            )}

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-0 mt-3 w-52 bg-[#0f1535] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-4 border-b border-white/10">
                      <p className="text-sm font-medium">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {t("auth.welcomeBack")} ✨
                      </p>
                    </div>
                    <button onClick={()=>router.push(profileRoute)} className="cursor-pointer w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition">
                      {t("auth.profileDetails")}
                    </button>
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? t("auth.loggingOut") : t("auth.logout")}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition"
                    >
                      {t("auth.login")}
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/register");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-purple-400 hover:bg-white/10 transition"
                    >
                      {t("auth.registerNow")}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ROW 2: Search (full width on mobile, capped on desktop) */}
      <div className="relative w-full lg:max-w-sm">
        <input
          value={searchQuery}
          onChange={(e) => {
            setHideResults(false);
            setSearchQuery(e.target.value);
          }}
          placeholder={t("search.placeholder")}
          className="w-full bg-[#121735] border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-purple-500"
        />

        {/* RESULTS */}
        {results.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-[#0f1535] border border-white/10 rounded-xl shadow-lg z-50 overflow-hidden">
            {results.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 text-sm text-gray-300 hover:bg-white/10 cursor-pointer transition"
                onClick={() => {
                  setSearchQuery(item.name);
                  setHideResults(true);
                }}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Header;
