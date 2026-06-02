"use client";

import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import { logout } from "@/redux/slices/authSlice";
import { clearServerSession } from "@/utils/authFetch";

export default function PageLayout({
  title,
  icon,
  children,
  protect = true,
  serverIsLoggedIn = false,
}) {
  const router = useRouter();
  const dropdownRef = useRef();
  const dispatch = useDispatch();
  const [showDropdown, setShowDropdown] = useState(false);
  const { isLoggedIn, isAuthLoaded, user } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ✅ LOGIN REDIRECT
  const handleLogin = () => {
    setShowDropdown(false);
    router.push("/login");
  };

  // ✅ LOGOUT
  const handleLogout = async () => {
    await clearServerSession();
    dispatch(logout());
    setShowDropdown(false);
    router.replace("/");
  };

  

  // ✅ Public astrologer routes
  const isPublicAstrologerRoute =
    router.pathname === "/astrologers" ||
    router.pathname === "/astrologers/[publicId]";

  // ✅ Disable protection for public routes
  const shouldProtect = protect && !isPublicAstrologerRoute;
  const hasActiveSession = isLoggedIn || serverIsLoggedIn;

  useEffect(() => {
    // wait for auth restore
    if (!isAuthLoaded) return;

    if (shouldProtect && !hasActiveSession) {
      router.replace("/login");
    }
  }, [hasActiveSession, isAuthLoaded, shouldProtect, router]);

  // loading state while restoring auth
  if (shouldProtect && !isAuthLoaded) {
    return null;
  }

  // block protected content
  if (shouldProtect && !hasActiveSession) {
    return null;
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };
  const displayFirstName = user?.firstName || user?.username || user?.name;
  const displayLastName = user?.lastName;
  const displayName =
    [displayFirstName, displayLastName].filter(Boolean).join(" ") || "User";

  return (
    <div className="min-h-screen dashboard-bg text-white flex">
      {/* Left sidebar */}
      <AppSidebar currentRoute={router.pathname} />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top nav bar */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3 px-4 sm:px-6 pt-4 sm:pt-6 pb-4 pl-16 lg:pl-6">
            <button
              onClick={() => router.back()}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-gray-300 hover:text-white text-lg shrink-0"
            >
              ←
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">{icon}</span>
              <h1 className="text-lg font-semibold">{title}</h1>
            </div>
          </div>
          <div ref={dropdownRef} className="relative pr-8">
            {hasActiveSession ? (
              <div
                onClick={() => setShowDropdown(!showDropdown)}
                className="bg-white/5 cursor-pointer rounded-full text-black w-10 h-10 flex justify-center items-center"
              >
                {getInitials(displayFirstName, displayLastName) || "U"}
              </div>
            ) : (
              // <img
              //   onClick={() => setShowDropdown(!showDropdown)}
              //   src={user?.image}
              //   className="w-9 h-9 sm:w-10 sm:h-10 rounded-full cursor-pointer border border-white/10 object-cover"
              //   alt="user"
              // />
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >
                👤
              </button>
            )}

            {/* DROPDOWN */}
            {showDropdown && (
              <div className="absolute right-6 mt-1 w-52 bg-[#0f1535] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                {hasActiveSession ? (
                  <>
                    <div className="px-4 py-4 border-b border-white/10">
                      <p className="text-sm font-medium">
                        {displayName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Welcome back ✨
                      </p>
                    </div>
                    <button
                      onClick={() => router.push("/profile")}
                      className="cursor-pointer w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition"
                    >
                      Profile Details
                    </button>
                    <button
                      onClick={handleLogout}
                      className="cursor-pointer w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        router.push("/register");
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-purple-400 hover:bg-white/10 transition"
                    >
                      Register Now
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 px-4 sm:px-6 pb-6 pl-16 lg:pl-6 z-30">
          {children}
        </div>
      </div>
    </div>
  );
}
