"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import LoginPromptModal from "@/components/LoginPromptModal";
import { useLanguage } from "@/context/LanguageContext";

const items = [
  {
    labelKey: "categories.love",
    descKey: "life.loveDesc",
    image: "/guidance-love.svg",
    tone: "from-[#ff6aa7] to-[#8b00cc]",
    icon: (
      <path d="M12 20s-7-4.3-7-10.1A4.1 4.1 0 0 1 12 7a4.1 4.1 0 0 1 7 2.9C19 15.7 12 20 12 20Z" />
    ),
  },
  {
    labelKey: "categories.career",
    descKey: "life.careerDesc",
    image: "/guidance-career.svg",
    tone: "from-[#4b8cff] to-[#7c3aed]",
    icon: (
      <>
        <path d="M9 7V5.8A1.8 1.8 0 0 1 10.8 4h2.4A1.8 1.8 0 0 1 15 5.8V7" />
        <path d="M4.5 8.5h15v9.2a1.8 1.8 0 0 1-1.8 1.8H6.3a1.8 1.8 0 0 1-1.8-1.8V8.5Z" />
        <path d="M4.5 12.5h15M10 12.5v1h4v-1" />
      </>
    ),
  },
  {
    labelKey: "categories.health",
    descKey: "life.healthDesc",
    image: "/guidance-health.svg",
    tone: "from-[#2ccf7a] to-[#0ea5e9]",
    icon: (
      <>
        <path d="M12 19c4-2.5 6-5.5 6-9.2C18 6.6 15.4 4 12 4S6 6.6 6 9.8C6 13.5 8 16.5 12 19Z" />
        <path d="M9 11h6M12 8v6" />
      </>
    ),
  },
  {
    labelKey: "categories.growth",
    descKey: "life.growthDesc",
    image: "/guidance-growth.svg",
    tone: "from-[#f6b73c] to-[#18a058]",
    icon: (
      <>
        <path d="M12 20V9" />
        <path d="M12 13c-4.5-.2-6.5-2.7-7-7 4.4.3 6.7 2.4 7 7Z" />
        <path d="M12 15c4.1-.2 6.3-2.2 7-6-4 .1-6.3 2-7 6Z" />
      </>
    ),
  },
];

export default function Categories() {
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

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <button
            key={item.labelKey}
            onClick={handleAction}
            className="group relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#d9b857_0%,#fff7d2_42%,#b88a00_100%)] p-[1.5px] text-left shadow-[0_14px_28px_rgba(94,70,12,0.10)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_22px_42px_rgba(94,70,12,0.16)]"
          >
            <div className="relative min-h-[128px] overflow-hidden rounded-[18.5px] bg-[#fffdf6] p-4">
              <div
                className="absolute inset-0 bg-cover bg-center opacity-80 transition duration-300 group-hover:scale-105"
                style={{ backgroundImage: `url(${item.image})` }}
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,246,0.97)_0%,rgba(255,253,246,0.84)_52%,rgba(255,253,246,0.48)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#fffdf6] to-transparent" />

              <div className="relative flex h-full min-h-[96px] flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold leading-5 text-[#211704]">
                      {t(item.labelKey)}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[11px] font-semibold text-[#6f5930]">
                      {t(item.descKey)}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-extrabold text-[#8a6106] shadow-sm">
                    0{index + 1}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center rounded-full bg-[#dfff00] px-3.5 py-2 text-xs font-bold text-[#312d1e] shadow-[0_12px_24px_rgba(151,165,0,0.16)] transition group-hover:bg-[#cdf000]">
                    {t("categories.explore")} →
                  </span>

                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${item.tone} text-white shadow-[0_12px_24px_rgba(94,70,12,0.16)] transition group-hover:scale-105`}>
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}
