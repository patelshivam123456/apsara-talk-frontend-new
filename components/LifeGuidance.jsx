"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useLanguage } from "@/context/LanguageContext";

const items = [
  {
    titleKey: "categories.love",
    descKey: "life.loveDesc",
    accent: "from-[#ff6aa7] to-[#8b00cc]",
    surface: "from-[#fff0f6] to-[#f7ecff]",
    image: "/guidance-love.svg",
    path: (
      <path d="M12 20s-7-4.3-7-10.1A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 7 2.9C19 15.7 12 20 12 20Z" />
    ),
  },
  {
    titleKey: "categories.career",
    descKey: "life.careerDesc",
    accent: "from-[#4b8cff] to-[#7c3aed]",
    surface: "from-[#eef5ff] to-[#f4edff]",
    image: "/guidance-career.svg",
    path: (
      <>
        <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
        <path d="M4.5 8.5h15v9.2a1.8 1.8 0 0 1-1.8 1.8H6.3a1.8 1.8 0 0 1-1.8-1.8V8.5Z" />
        <path d="M4.5 12.5h15M10 12.5v1h4v-1" />
      </>
    ),
  },
  {
    titleKey: "categories.health",
    descKey: "life.healthDesc",
    accent: "from-[#2ccf7a] to-[#0ea5e9]",
    surface: "from-[#effdf4] to-[#edf9ff]",
    image: "/guidance-health.svg",
    path: (
      <>
        <path d="M12 19c4-2.5 6-5.5 6-9.2C18 6.6 15.4 4 12 4S6 6.6 6 9.8C6 13.5 8 16.5 12 19Z" />
        <path d="M9 11h6M12 8v6" />
      </>
    ),
  },
  {
    titleKey: "categories.growth",
    descKey: "life.growthDesc",
    accent: "from-[#f6b73c] to-[#18a058]",
    surface: "from-[#fff8dc] to-[#effdf4]",
    image: "/guidance-growth.svg",
    path: (
      <>
        <path d="M12 20V9" />
        <path d="M12 13c-4.5-.2-6.5-2.7-7-7 4.4.3 6.7 2.4 7 7Z" />
        <path d="M12 15c4.1-.2 6.3-2.2 7-6-4 .1-6.3 2-7 6Z" />
      </>
    ),
  },
];

export default function LifeGuidance() {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { t } = useLanguage();

  const handleAction = () => {
    if (!isLoggedIn) {
      setShowModal(true);
    } else {
      router.push("/thankyou");
    }
  };

  return (
    <>
      {showModal && <LoginPromptModal onClose={() => setShowModal(false)} />}

      <section className="relative overflow-hidden rounded-[22px] bg-[#fffaf0] p-4 text-[#211704] shadow-[0_16px_38px_rgba(87,60,12,0.10)] sm:p-5">
        <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full border border-[#d9b857]/25" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[#fff0b8]/55 blur-3xl" />

        {/* Header */}
        <div className="relative mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-[#9a6f08]">
              Life guidance
            </p>
            <h2 className="mt-1 text-lg font-extrabold leading-tight text-[#1d1607] sm:text-xl">
              {t("life.title")}
            </h2>
            <p className="mt-1 text-xs font-medium text-[#60481f] sm:text-sm">
              {t("life.subtitle")}
            </p>
          </div>

          <button
            onClick={handleAction}
            className="inline-flex min-h-10 w-fit items-center justify-center rounded-full bg-[#dfff00] px-4 py-2 text-xs font-bold text-[#312d1e] shadow-[0_12px_24px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
          >
            {t("categories.explore")} →
          </button>
        </div>

        {/* Cards */}
        <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item, index) => (
            <button
              key={item.titleKey}
              onClick={handleAction}
              className="group relative overflow-hidden rounded-[18px] bg-[linear-gradient(135deg,#d9b857_0%,#fff6d4_42%,#c8a027_100%)] p-[1.5px] text-left shadow-[0_10px_24px_rgba(94,70,12,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_rgba(94,70,12,0.14)]"
            >
              <div
                className={`relative flex min-h-[132px] flex-col overflow-hidden rounded-[16.5px] bg-gradient-to-br ${item.surface} p-4`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center opacity-85 transition duration-300 group-hover:scale-105"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,248,0.96)_0%,rgba(255,253,248,0.82)_55%,rgba(255,253,248,0.48)_100%)]" />
                <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#fffdf6] to-transparent" />

                <div className="relative flex items-start justify-between gap-4">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.accent} text-white shadow-[0_10px_20px_rgba(94,70,12,0.14)]`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {item.path}
                    </svg>
                  </span>

                  <span className="rounded-full border border-white/70 bg-white/70 px-2.5 py-1 text-[10px] font-extrabold text-[#8a6106] shadow-sm">
                    0{index + 1}
                  </span>
                </div>

                <div className="relative mt-auto pt-4">
                  <h3 className="text-sm font-extrabold leading-5 text-[#1d1607]">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-xs font-medium leading-5 text-[#60481f]">
                    {t(item.descKey)}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-extrabold text-[#8b00cc] transition group-hover:text-[#650095]">
                    {t("categories.explore")} →
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
