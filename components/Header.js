"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";

import { useApp } from "@/context/AppContext";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/slices/authSlice";


const Header = ({ sidebarOpen = false,profileData }) => {
  const router = useRouter();

  const {
    setChatOpen,
    setNotifOpen,
    searchQuery,
    setSearchQuery,
    data,
  } = useApp();

  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef();

  const dispatch = useDispatch();

  const { isLoggedIn, user } = useSelector(
    (state) => state.auth
  );

  // 🔍 SEARCH LOGIC
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = data.filter((item) =>
      item.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );

    setResults(filtered);
  }, [searchQuery, data]);

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
  const handleLogout = () => {
    dispatch(logout());
    setShowDropdown(false);
    router.push("/");
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
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full border border-[#ffb86c] flex items-center justify-center text-[#ffb86c] text-lg">
            ✦
          </div>
          <h2 className="text-xl md:text-2xl font-semibold">
            Apsara
            <span className="text-pink-400">Talk</span>
          </h2>
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
                {getInitials(profileData?.firstName, profileData?.lastName)}
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
                        {profileData?.firstName} {profileData?.lastName}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Welcome back ✨
                      </p>
                    </div>
                    <button onClick={()=>router.push("/profile")} className="cursor-pointer w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition">
                      Profile Details
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/10 transition"
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
      </div>

      {/* ROW 2: Search (full width on mobile, capped on desktop) */}
      <div className="relative w-full lg:max-w-sm">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search astrologers, topics..."
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
                  setResults([]);
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
