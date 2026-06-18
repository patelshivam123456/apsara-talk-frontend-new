"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";

import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { slugifyServiceLabel } from "@/constants/servicePages";
import { logout } from "@/redux/slices/authSlice";
import { clearServerSession } from "@/utils/authFetch";
import {
  ADMIN_ROLE,
  ASTROLOGER_ROLE,
  CLIENT_ROLE,
  canAccessRoute,
  getPrimaryDashboardRoute,
  getProfileRoute,
  getUserRoles,
} from "@/utils/roleAccess";

const withServiceRoutes = (labels) =>
  labels.map((label) => ({
    label,
    route: `/services/${slugifyServiceLabel(label)}`,
  }));

const consultationItems = withServiceRoutes([
  "Chat with Astrologer",
  "Call with Astrologer",
]);

const horoscopeItems = withServiceRoutes([
  "Daily Horoscope",
  "Tomorrow's Horoscope",
  "Yesterday's Horoscope",
  "Weekly Horoscope",
  "Monthly Horoscope",
  "Yearly Horoscope",
]);

const freeServiceItems = withServiceRoutes([
  "Free Kundli",
  "Kundli Matching",
  "Compatibility",
  "Tarot",
]);

const calculatorItems = withServiceRoutes([
  "Love Calculator",
  "Numerology Calculator",
  "Rising Sign Calculator",
  "Dasha Calculator",
  "Mangal Dosha Calculator",
  "Moon Phase Calculator",
  "Flames Calculator",
  "Friendship Calculator",
  "Transit Chart Calculator",
  "Name Compatibility Calculator",
]);

const panchangItems = withServiceRoutes([
  "Today Panchang",
  "Rahu Kaal",
  "Choghadiya",
  "Tithi",
  "Vaar",
  "Hora",
  "Karana",
  "Tomorrow Panchang",
  "Numerology",
]);

function getMenuGroups() {
  return [
    { label: "Consultations", items: consultationItems },
    { label: "Horoscope", items: horoscopeItems },
    { label: "Free Services", items: freeServiceItems },
    { label: "Calculators", items: calculatorItems, wide: true },
    { label: "Panchang", items: panchangItems },
  ];
}

export default function Header({ profileData }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, language, languages, setLanguage } = useLanguage();
  const { setChatOpen, setNotifOpen } = useApp();
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);

  const headerRef = useRef(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const hasServerSession = !!profileData;
  const hasActiveSession = isLoggedIn || hasServerSession;
  const roles = [
    ...new Set([
      ...getUserRoles(profileData),
      ...getUserRoles(user),
    ]),
  ];
  const isAdmin = roles.includes(ADMIN_ROLE);
  const isAstrologer = roles.includes(ASTROLOGER_ROLE) && !isAdmin;
  const isClient =
    roles.includes(CLIENT_ROLE) ||
    (hasActiveSession &&
      !roles.includes(ASTROLOGER_ROLE) &&
      !roles.includes(ADMIN_ROLE));
  const menuGroups = getMenuGroups();
  const profileRoute = getProfileRoute(roles);
  const displayFirstName =
    profileData?.firstName || user?.firstName || user?.username || user?.name;
  const displayLastName = profileData?.lastName || user?.lastName;
  const displayName =
    [displayFirstName, displayLastName].filter(Boolean).join(" ") || "User";

  useEffect(() => {
    const handleClick = (event) => {
      if (!headerRef.current?.contains(event.target)) {
        setActiveMenu(null);
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const getInitials = (firstName, lastName) =>
    `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();

  const goTo = (route) => {
    if (hasActiveSession && !canAccessRoute(route, roles)) {
      router.push(getPrimaryDashboardRoute(roles));
      return;
    }

    setActiveMenu(null);
    setDrawerOpen(false);
    router.push(route);
  };

  const handleLogin = () => {
    setShowDropdown(false);
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await clearServerSession();
      dispatch(logout());
      setShowDropdown(false);
      setDrawerOpen(false);
      router.replace("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="fixed left-0 right-0 top-0 z-[90] px-3 py-3 sm:px-5"
      >
        <div className="mx-auto max-w-[1500px]">
          <div className="flex h-16 items-center gap-3 rounded-full border border-[#e8dfbd] bg-white/92 px-3 text-[#4d4a45] shadow-[0_16px_42px_rgba(42,33,8,0.14)] backdrop-blur-xl sm:px-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ece3bd] bg-[#fbf8df] text-xl text-[#4d4a45] transition hover:bg-[#f5efbf] xl:hidden"
              aria-label="Open navigation"
            >
              ☰
            </button>

            <Link href="/" className="flex shrink-0 items-center gap-2">
              <Image
                src="/logo_apsara.jpeg"
                alt="ApsaraAstro Logo"
                width={42}
                height={42}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-[#eef000]/70"
              />
              <span className="text-lg font-bold">
                <span className="text-white [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Apsara
                </span>
                <span className="text-[#dfff00] [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Astro
                </span>
              </span>
            </Link>

            <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
              {menuGroups.map((group) => (
                <div key={group.label} className="relative">
                  <button
                    onClick={() =>
                      setActiveMenu(activeMenu === group.label ? null : group.label)
                    }
                    className={`rounded-full px-3 py-2 text-sm font-medium transition flex items-center ${
                      activeMenu === group.label
                        ? "bg-[#fbf8cc] text-[#4a4844] shadow-sm ring-1 ring-[#d8ce76]"
                        : "text-[#5c5952] hover:bg-[#fbf8cc]"
                    }`}
                  >
                    {group.label}&nbsp;<div className="text-[11px] text-[#dfff00]">▼</div>
                  </button>

                  {activeMenu === group.label && (
                    <div
                      className={`absolute left-0 top-full mt-3 max-h-[390px] overflow-y-auto rounded-2xl border border-[#eee8d5] bg-white p-3 shadow-[0_18px_44px_rgba(42,33,8,0.16)] ${
                        group.wide
                          ? "w-[560px] grid grid-cols-2 gap-x-5"
                          : "w-56"
                      }`}
                    >
                      {group.items.map((item) => (
                        <button
                          key={`${group.label}-${item.label}`}
                          onClick={() => goTo(item.route)}
                          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-[#4d4a45] transition hover:bg-[#fbf8df] hover:text-[#111]"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => goTo("/astrologers")}
                className="rounded-full px-3 py-2 text-sm  text-[#5c5952] transition hover:bg-[#fbf8cc]"
              >
                Shop
              </button>
              <button
                onClick={() => goTo("/saved-insights")}
                className="rounded-full px-3 py-2 text-sm  text-[#5c5952] transition hover:bg-[#fbf8cc]"
              >
                Blog
              </button>
            </nav>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {isClient && (
                <button
                  onClick={() => goTo("/wallet")}
                  className="hidden h-9 items-center gap-1 rounded-full border border-[#d8ce76] bg-[#fbf8cc] px-3 text-xs font-bold text-[#3f3a15] sm:flex"
                >
                  ▣ ₹{Number(balance || 0).toFixed(0)}
                </button>
              )}

              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="hidden h-9 rounded-full border border-[#eee8d5] bg-white px-1.5 text-xs font-semibold text-[#4d4a45] outline-none lg:block"
                aria-label="Select language"
              >
                {languages.map((item) => (
                  <option key={item.code} value={item.code}>
                    {item.nativeLabel}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setNotifOpen(true)}
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#4d4a45] transition hover:bg-[#fbf8df]"
                aria-label="Open notifications"
              >
                <svg
                  className="h-4.5 w-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#dfff00] ring-2 ring-white" />
              </button>

              <div className="relative">
                {hasActiveSession ? (
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef000] text-sm font-bold text-[#3f3a15] ring-2 ring-[#d9db00]"
                    aria-label="Open profile menu"
                  >
                    {getInitials(displayFirstName, displayLastName) || "U"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef000] text-[#3f3a15] ring-2 ring-[#d9db00]"
                    aria-label="Open login menu"
                  >
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                      <path d="m10 17 5-5-5-5" />
                      <path d="M15 12H3" />
                    </svg>
                  </button>
                )}

                {showDropdown && (
                  <div className="absolute right-0 top-full mt-3 w-72 overflow-hidden rounded-3xl border border-[#eee8d5] bg-white p-4 text-[#4d4a45] shadow-[0_18px_44px_rgba(42,33,8,0.16)]">
                    {hasActiveSession ? (
                      <>
                        <div className="mb-3 flex items-center gap-3 border-b border-[#eee8d5] pb-4">
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#eef000] font-bold text-[#3f3a15]">
                            {getInitials(displayFirstName, displayLastName) || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-bold">{displayName}</p>
                            <p className="text-xs text-[#77736a]">
                              {t("auth.welcomeBack")}
                            </p>
                          </div>
                        </div>

                        {isClient && (
                          <button
                            onClick={() => goTo("/wallet")}
                            className="mb-2 flex w-full items-center justify-between rounded-2xl bg-[#fbf8cc] px-3 py-2 text-sm font-semibold text-[#4d4a45]"
                          >
                            <span>Wallet Transactions</span>
                            <span>₹{Number(balance || 0).toFixed(0)}</span>
                          </button>
                        )}

                        <button
                          onClick={() => goTo(profileRoute)}
                          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-[#fbf8df]"
                        >
                          {t("auth.profileDetails")}
                        </button>
                        <button
                          onClick={() => setChatOpen(true)}
                          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-[#fbf8df]"
                        >
                          Customer Support Chat
                        </button>
                        <button
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60"
                        >
                          {isLoggingOut ? t("auth.loggingOut") : t("auth.logout")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={handleLogin}
                          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium hover:bg-[#fbf8df]"
                        >
                          {t("auth.login")}
                        </button>
                        <button
                          onClick={() => goTo("/register")}
                          className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#8a6106] hover:bg-[#fbf8df]"
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
        </div>
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden">
          <button
            className="absolute inset-0 bg-black/45 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
            aria-label="Close navigation overlay"
          />

          <aside className="absolute left-0 top-0 h-full w-[82vw] max-w-[360px] overflow-y-auto bg-white text-[#4d4a45] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#eee8d5] px-5 py-5">
              <Link
                href="/"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center gap-3"
              >
                <Image
                  src="/logo_apsara.jpeg"
                  alt="ApsaraAstro Logo"
                  width={42}
                  height={42}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-[#eef000]/70"
                />
                <span className="text-lg font-bold">
                  <span className="text-white [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                    Apsara
                  </span>
                  <span className="text-[#dfff00] [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                    Astro
                  </span>
                </span>
              </Link>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-2xl hover:bg-[#fbf8df]"
                aria-label="Close navigation"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 px-4 py-4">
              <div className="rounded-2xl border border-[#eee8d5] bg-[#fbf8cc] p-3">
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="h-10 w-full rounded-full border border-[#d8ce76] bg-white px-3 text-xs font-semibold text-[#4d4a45] outline-none"
                  aria-label="Select language"
                >
                  {languages.map((item) => (
                    <option key={item.code} value={item.code}>
                      {item.nativeLabel}
                    </option>
                  ))}
                </select>
              </div>

              {menuGroups.map((group) => (
                <div key={group.label}>
                  <button
                    onClick={() =>
                      setExpandedMobileMenu(
                        expandedMobileMenu === group.label ? null : group.label
                      )
                    }
                    className="flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm font-bold hover:bg-[#fbf8df]"
                  >
                    <span>{group.label}</span>
                    <span>{expandedMobileMenu === group.label ? "⌃" : "⌄"}</span>
                  </button>

                  {expandedMobileMenu === group.label && (
                    <div className="ml-3 mt-1 space-y-1 border-l border-[#eee8d5] pl-3">
                      {group.items.map((item) => (
                        <button
                          key={`${group.label}-${item.label}`}
                          onClick={() => goTo(item.route)}
                          className="block w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-[#666158] hover:bg-[#fbf8df]"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <button
                onClick={() => goTo("/astrologers")}
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold hover:bg-[#fbf8df]"
              >
                Shop
              </button>
              <button
                onClick={() => goTo("/saved-insights")}
                className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-bold hover:bg-[#fbf8df]"
              >
                Blog
              </button>
            </div>

            <div className="sticky bottom-0 border-t border-[#eee8d5] bg-[#fffef8] p-4">
              <div className="rounded-[1.5rem] border border-[#d8ce76] bg-[#fbf8cc] p-3">
                <p className="text-sm font-bold">First Chat Free</p>
                <p className="text-xs text-[#77736a]">★★★★★ | 1Cr+ Downloads</p>
              </div>
            </div>
          </aside>
        </div>
      )}

      <div className="h-[50px]" />
    </>
  );
}
