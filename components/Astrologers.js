"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { useApp } from "@/context/AppContext";
import LoginPromptModal from "@/components/LoginPromptModal";
import { astrologerData } from "@/constants/Astrologer-Home-Data";

const EXPERIENCE_RANGES = [
  { label: "All Experience", min: 0, max: Infinity },
  { label: "0 - 5 Years", min: 0, max: 5 },
  { label: "6 - 10 Years", min: 6, max: 10 },
  { label: "11+ Years", min: 11, max: Infinity },
];

export default function Astrologers({ limit }) {
  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const { searchQuery } = useApp();

  const [active, setActive] = useState("All");
  const [language, setLanguage] = useState("All");
  const [location, setLocation] = useState("All");
  const [experienceRange, setExperienceRange] = useState(0);

  const [showModal, setShowModal] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  /* =========================
     DYNAMIC FILTER VALUES
  ========================= */

  const categoryFilters = useMemo(() => {
    const categories = [
      ...new Set(
        astrologerData.map((astro) => astro.specialization)
      ),
    ];

    return ["All", ...categories];
  }, []);

  const languageFilters = useMemo(() => {
    const langs = astrologerData.flatMap((astro) =>
      astro.language.split(",").map((lang) => lang.trim())
    );

    return ["All", ...new Set(langs)];
  }, []);

  const locationFilters = useMemo(() => {
    const locations = [
      ...new Set(astrologerData.map((astro) => astro.city)),
    ];

    return ["All", ...locations];
  }, []);

  /* =========================
     ACTIONS
  ========================= */

  const handleAction = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      router.push("/thankyou");
    }
  };

  const resetFilters = () => {
    setActive("All");
    setLanguage("All");
    setLocation("All");
    setExperienceRange(0);
  };

  /* =========================
     FILTER COUNT
  ========================= */

  const activeFilterCount = [
    active !== "All",
    language !== "All",
    location !== "All",
    experienceRange !== 0,
  ].filter(Boolean).length;

  /* =========================
     EXPERIENCE RANGE
  ========================= */

  const { min, max } = EXPERIENCE_RANGES[experienceRange];

  /* =========================
     FILTERED DATA
  ========================= */

  const filteredAstrologers = astrologerData.filter((astro) => {
    const matchesSearch =
      !searchQuery ||
      astro.displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      astro.specialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      astro.language
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      astro.city
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      active === "All" ||
      astro.specialization === active;

    const matchesLanguage =
      language === "All" ||
      astro.language.includes(language);

    const matchesLocation =
      location === "All" ||
      astro.city === location;

    const experience = Number(astro.yearsOfExperience);

    const matchesExperience =
      experience >= min && experience <= max;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesLanguage &&
      matchesLocation &&
      matchesExperience
    );
  });

  /* =========================
     INITIALS
  ========================= */

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ""}${
      lastName?.charAt(0) || ""
    }`.toUpperCase();
  };

  return (
    <>
      {showModal && (
        <LoginPromptModal
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="bg-[#0f1535]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-md">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-4 mb-5">

          {/* TOP BAR */}
          <div className="flex items-center justify-between">

            <div className="flex items-center gap-2">

              {/* FILTER BUTTON */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all duration-200
                ${
                  filterOpen || activeFilterCount > 0
                    ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]"
                    : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
                }`}
              >

                {/* FILTER ICON */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M3 4a1 1 0 0 1 1-1h16a1 1 0 0 1 .78 1.625L14 12.376V20a1 1 0 0 1-1.447.894l-4-2A1 1 0 0 1 8 18v-5.624L3.22 5.625A1 1 0 0 1 3 4z"/>
                </svg>

                Filters

                {/* FILTER COUNT */}
                {activeFilterCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-white text-purple-700 text-[9px] font-bold flex items-center justify-center">
                    {activeFilterCount}
                  </span>
                )}

                {/* CHEVRON */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-3 h-3 transition-transform duration-200 ${
                    filterOpen ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-widest">
                Top Astrologers
              </h2>
            </div>

            {/* RESET */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-xs text-red-400 hover:text-red-300 transition"
              >
                Reset Filters
              </button>
            )}
          </div>

          {/* =========================
              FILTER PANEL
          ========================= */}

          {filterOpen && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-4">

              {/* CATEGORY */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Category
                </p>

                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActive(item)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all duration-200
                      ${
                        active === item
                          ? "bg-purple-600 text-white border-purple-600 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* LANGUAGE */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Language
                </p>

                <div className="flex flex-wrap gap-2">
                  {languageFilters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setLanguage(item)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all duration-200
                      ${
                        language === item
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Location
                </p>

                <div className="flex flex-wrap gap-2">
                  {locationFilters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setLocation(item)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all duration-200
                      ${
                        location === item
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {/* EXPERIENCE */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-2">
                  Experience
                </p>

                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_RANGES.map((item, index) => (
                    <button
                      key={item.label}
                      onClick={() => setExperienceRange(index)}
                      className={`px-3 py-1 text-xs rounded-full border transition-all duration-200
                      ${
                        experienceRange === index
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* =========================
            CARDS
        ========================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

          {(limit ? filteredAstrologers.slice(0, limit) : filteredAstrologers).map((astro) => (
            <div
              key={astro.publicId}
              className="relative bg-linear-to-b from-[#1a1f4a] to-[#0f1535] border border-white/10 rounded-2xl p-4 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-[0_4px_24px_rgba(139,92,246,0.15)] transition-all duration-200 flex flex-col gap-3"
            >

              {/* CITY BADGE */}
              <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 border border-white/10">
                {astro.city}
              </span>

              {/* CONTENT */}
              <div className="flex flex-col items-center text-center gap-2 mt-3">

                {/* INITIALS */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold border-2 border-purple-400/30">
                  {getInitials(
                    astro.firstName,
                    astro.lastName
                  )}
                </div>

                {/* NAME */}
                <h3 className="text-sm font-semibold mt-1">
                  {astro.displayName}
                </h3>

                {/* SPECIALIZATION */}
                <p className="text-[11px] text-gray-400">
                  {astro.specialization}
                </p>

                {/* EXPERIENCE */}
                <p className="text-[11px] text-purple-400 font-medium">
                  {astro.yearsOfExperience}+ Years Experience
                </p>
              </div>

              {/* LANGUAGES */}
              <div className="flex flex-wrap gap-1 justify-center">
                {astro.language
                  .split(",")
                  .map((lang) => (
                    <span
                      key={lang}
                      className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full text-gray-300"
                    >
                      {lang.trim()}
                    </span>
                  ))}
              </div>

              {/* BIO */}
              <p className="text-[11px] text-gray-400 text-center leading-relaxed">
                {astro.bio}
              </p>

              {/* BUTTONS */}
              <div className="flex gap-2 mt-auto">

                <button
                  onClick={handleAction}
                  className="flex-1 text-xs font-medium bg-white/5 py-2 rounded-lg hover:bg-white/10 transition"
                >
                  Chat
                </button>

                <button
                  onClick={handleAction}
                  className="flex-1 text-xs font-medium bg-purple-600 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  Call
                </button>
              </div>

              {/* VIEW PROFILE */}
              <button
                onClick={() => router.push(`/astrologers/${astro.publicId}`)}
                className="w-full text-xs text-purple-400 hover:text-purple-300 py-1 transition text-center"
              >
                View Profile →
              </button>
            </div>
          ))}

          {/* VIEW MORE */}
          {limit && filteredAstrologers.length > limit && (
            <div className="col-span-1 sm:col-span-2 xl:col-span-3 flex justify-center pt-2">
              <button
                onClick={() => router.push("/astrologers")}
                className="px-6 py-2 text-sm font-medium bg-purple-600 hover:bg-purple-700 rounded-xl transition shadow-[0_0_16px_rgba(139,92,246,0.25)]"
              >
                View More →
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredAstrologers.length === 0 && (
            <div className="col-span-1 sm:col-span-2 xl:col-span-3 py-12 flex flex-col items-center gap-3 text-gray-400">

              <span className="text-4xl">
                🔭
              </span>

              <p className="text-sm">
                No astrologers match your filters.
              </p>

              <button
                onClick={resetFilters}
                className="text-xs text-purple-400 hover:text-purple-300 transition"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}