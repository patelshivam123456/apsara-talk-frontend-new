"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import { useApp } from "@/context/AppContext";
import LoginPromptModal from "@/components/LoginPromptModal";
// import { astrologerData } from "@/constants/Astrologer-Home-Data";
import { config } from "@/constants/URLConfig";
import { useLanguage } from "@/context/LanguageContext";

const EXPERIENCE_RANGES = [
  { labelKey: "astro.allExperience", min: 0, max: Infinity },
  { labelKey: "astro.years0to5", min: 0, max: 5 },
  { labelKey: "astro.years6to10", min: 6, max: 10 },
  { labelKey: "astro.years11plus", min: 11, max: Infinity },
];

export default function Astrologers({ limit,astrologerData = [] }) {
  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.auth);
  const { t } = useLanguage();

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
  // console.log(astrologerData,"//////////");
  

  const categoryFilters = useMemo(() => {
    const categories = [
      ...new Set(
        astrologerData.map((astro) => astro.specialization).filter(Boolean)
      ),
    ];

    return ["All", ...categories];
  }, [astrologerData]);

  const languageFilters = useMemo(() => {
    const langs = astrologerData.flatMap((astro) =>
      String(astro.language || "")
        .split(",")
        .map((lang) => lang.trim())
        .filter(Boolean)
    );

    return ["All", ...new Set(langs)];
  }, [astrologerData]);

  const locationFilters = useMemo(() => {
    const locations = [
      ...new Set(astrologerData.map((astro) => astro.city).filter(Boolean)),
    ];

    return ["All", ...locations];
  }, [astrologerData]);

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
    const displayName = String(astro.displayName || "");
    const specialization = String(astro.specialization || "");
    const astroLanguage = String(astro.language || "");
    const city = String(astro.city || "");
    const matchesSearch =
      !searchQuery ||
      displayName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      specialization
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      astroLanguage
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      city
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesCategory =
      active === "All" ||
      specialization === active;

    const matchesLanguage =
      language === "All" ||
      astroLanguage.includes(language);

    const matchesLocation =
      location === "All" ||
      city === location;

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

  const getLanguages = (value) =>
    String(value || "")
      .split(",")
      .map((lang) => lang.trim())
      .filter(Boolean);

  return (
    <>
      {showModal && (
        <LoginPromptModal
          onClose={() => setShowModal(false)}
        />
      )}

      <div className="z-30 rounded-[22px] bg-white p-4 text-[#211704] shadow-2xl sm:p-5">

        {/* =========================
            HEADER
        ========================= */}

        <div className="flex flex-col gap-4 mb-5">

          {/* TOP BAR */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-2">

              {/* FILTER BUTTON */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={`relative flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-200
                ${
                  filterOpen || activeFilterCount > 0
                    ? "border-[#b88a00] bg-[#b88a00] text-white shadow-[0_10px_22px_rgba(184,138,0,0.24)]"
                    : "border-[#dbc45f] bg-[#fff3bd] text-[#2b2108] hover:bg-[#f7e38e]"
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

                {t("astro.filters")}

                {/* FILTER COUNT */}
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-[#8b6500]">
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

              <h2 className="text-sm font-extrabold uppercase tracking-[0.22em] text-[#261b08]">
                {t("astro.top")}
              </h2>
            </div>

            {/* RESET */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="self-start rounded-full border border-[#e5c94c] px-3 py-1.5 text-xs font-bold text-[#9a3b22] transition hover:bg-[#fff2c7] sm:self-auto"
              >
                {t("astro.resetFilters")}
              </button>
            )}
          </div>

          {/* =========================
              FILTER PANEL
          ========================= */}

          {filterOpen && (
            <div className="flex flex-col gap-4 rounded-[18px] border border-[#e0c85a] bg-[#fff5cf] p-4 shadow-inner">

              {/* CATEGORY */}
              <div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8d6a0a]">
                  {t("astro.category")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {categoryFilters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActive(item)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200
                      ${
                        active === item
                          ? "border-[#b88a00] bg-[#b88a00] text-white shadow-[0_8px_16px_rgba(184,138,0,0.18)]"
                          : "border-[#e5cc63] bg-white/60 text-[#4b3b13] hover:bg-white"
                      }`}
                    >
                      {item === "All" ? t("common.all") : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* LANGUAGE */}
              <div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8d6a0a]">
                  {t("astro.language")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {languageFilters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setLanguage(item)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200
                      ${
                        language === item
                          ? "border-[#b88a00] bg-[#b88a00] text-white"
                          : "border-[#e5cc63] bg-white/60 text-[#4b3b13] hover:bg-white"
                      }`}
                    >
                      {item === "All" ? t("common.all") : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* LOCATION */}
              <div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8d6a0a]">
                  {t("astro.location")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {locationFilters.map((item) => (
                    <button
                      key={item}
                      onClick={() => setLocation(item)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200
                      ${
                        location === item
                          ? "border-[#b88a00] bg-[#b88a00] text-white"
                          : "border-[#e5cc63] bg-white/60 text-[#4b3b13] hover:bg-white"
                      }`}
                    >
                      {item === "All" ? t("common.all") : item}
                    </button>
                  ))}
                </div>
              </div>

              {/* EXPERIENCE */}
              <div>
                <p className="mb-2 text-[10px] font-extrabold uppercase tracking-widest text-[#8d6a0a]">
                  {t("astro.experience")}
                </p>

                <div className="flex flex-wrap gap-2">
                  {EXPERIENCE_RANGES.map((item, index) => (
                    <button
                      key={item.labelKey}
                      onClick={() => setExperienceRange(index)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-200
                      ${
                        experienceRange === index
                          ? "border-[#b88a00] bg-[#b88a00] text-white"
                          : "border-[#e5cc63] bg-white/60 text-[#4b3b13] hover:bg-white"
                      }`}
                    >
                      {t(item.labelKey)}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">

          {(limit ? filteredAstrologers.slice(0, limit) : filteredAstrologers).map((astro) => {
            const languages = getLanguages(astro.language);

            return (
              <div
                key={astro.publicId}
                className="group relative rounded-[20px] bg-[linear-gradient(135deg,#d9b857_0%,#fff6d4_34%,#e000a9_72%,#5b21b6_100%)] p-[1.5px] shadow-[0_16px_34px_rgba(94,70,12,0.12),0_0_0_1px_rgba(217,184,87,0.22)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(94,70,12,0.18),0_0_28px_rgba(224,0,169,0.16)]"
              >
                <div className="relative flex min-h-[292px] flex-col overflow-hidden rounded-[18.5px] bg-[#fffdf8]">
                  <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#b88a00] via-[#e000a9] to-[#5b21b6]" />
                  <div className="absolute -right-12 -top-16 h-36 w-36 rounded-full bg-[#fff0b8]/80 blur-2xl" />

                  <div className="relative flex flex-1 flex-col p-4 pl-5">
                  <div className="flex items-start gap-3">
                    <div className="relative shrink-0">
                      <div className="flex h-16 w-16 items-center justify-center rounded-[18px] bg-[#211704] text-lg font-black text-[#ffd447] shadow-[0_12px_22px_rgba(33,23,4,0.18)]">
                        {getInitials(
                          astro.firstName,
                          astro.lastName
                        )}
                      </div>
                      <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#18a058] text-[10px] font-black text-white">
                        ✓
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="truncate text-[15px] font-extrabold leading-5 text-[#201404]">
                            {astro.displayName}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#7b6322]">
                            {astro.specialization}
                          </p>
                        </div>

                        <span className="shrink-0 rounded-full border border-[#dec45f] bg-[#fff7d8] px-2.5 py-1 text-[10px] font-bold text-[#5e4810]">
                          {astro.city || astro.state}
                        </span>
                      </div>

                      <button
                        onClick={() => router.push(`/astrologers/${astro.publicId}`)}
                        className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#8b00cc] transition hover:text-[#650095]"
                      >
                        {t("astro.viewProfile")} →
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-[14px] border border-[#ead783] bg-[#fff8dc]">
                    <div className="px-3 py-2 text-center">
                      <p className="text-sm font-black leading-none text-[#211704]">
                        {astro.yearsOfExperience}+
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#8d6a0a]">
                        Exp
                      </p>
                    </div>
                    <div className="border-x border-[#ead783] px-3 py-2 text-center">
                      <p className="text-sm font-black leading-none text-[#211704]">
                        {languages.length || 1}
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#8d6a0a]">
                        Lang
                      </p>
                    </div>
                    <div className="px-3 py-2 text-center">
                      <p className="text-sm font-black leading-none text-[#211704]">
                        4.9
                      </p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-wide text-[#8d6a0a]">
                        Rating
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {languages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="rounded-md bg-[#f4ecd0] px-2.5 py-1 text-[10px] font-bold text-[#5d4a1b]"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 line-clamp-2 min-h-[38px] text-[11px] leading-relaxed text-[#665d4d]">
                    {astro.bio}
                  </p>

                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <button
                      onClick={handleAction}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#dfff00] px-4 py-2.5 text-xs font-bold text-[#3b382d] shadow-[0_16px_30px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                      </svg>
                      {t("astro.chat")}
                    </button>

                    <button
                      onClick={handleAction}
                      className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full border border-[#e6ddc5] bg-[#fffdf6] px-4 py-2.5 text-xs font-bold text-[#4c493f] shadow-sm transition hover:border-[#d3bd7d] hover:bg-white"
                    >
                      <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.32 1.77.59 2.61a2 2 0 0 1-.45 2.11L8 9.69a16 16 0 0 0 6.31 6.31l1.25-1.25a2 2 0 0 1 2.11-.45c.84.27 1.71.47 2.61.59A2 2 0 0 1 22 16.92z" />
                      </svg>
                      {t("astro.call")}
                    </button>
                  </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* VIEW MORE */}
          {limit && filteredAstrologers.length > limit && (
            <div className="w-full sm:w-[20%] mx-auto col-span-1 sm:col-span-2 xl:col-span-3 flex justify-center pt-2">
              <button
                onClick={() => router.push("/astrologers")}
                className="inline-flex min-h-11  flex-1 items-center justify-center gap-2 rounded-full bg-[#dfff00] px-4 py-2.5 text-xs font-bold text-[#3b382d] shadow-[0_16px_30px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
              >
                {t("astro.viewMore")} →
              </button>
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredAstrologers.length === 0 && (
            <div className="col-span-1 flex flex-col items-center gap-3 py-12 text-[#665d4d] sm:col-span-2 xl:col-span-3">

              <span className="text-4xl">
                🔭
              </span>

              <p className="text-sm">
                {t("astro.empty")}
              </p>

              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#8b00cc] transition hover:text-[#650095]"
              >
                {t("astro.resetFilters")}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
