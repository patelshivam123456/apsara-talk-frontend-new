"use client";

import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";

const actions = [
  // {
  //   titleKey: "quick.talk",
  //   description: "Connect with an expert now",
  //   icon: "💬",
  //   route: "/astrologers",
  // },
  {
    titleKey: "quick.horoscope",
    description: "Read your daily insight",
    icon: "★",
    route: "/horoscope",
  },
  {
    titleKey: "quick.kundli",
    description: "Create your birth report",
    icon: "▰",
    route: "/kundli",
  },
  {
    titleKey: "quick.compatibility",
    description: "Check relationship match",
    icon: "♥",
    route: "/compatibility",
  },
];

export default function QuickActions() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleAction = (route = "/thankyou") => {
    router.push(route);
  };

  return (
    <>
      <section className="quick-actions rounded-[22px] bg-white/92 p-4 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:rounded-[26px] sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
              Shortcuts
            </p>
            <h2 className="mt-1 text-xl font-extrabold text-black sm:text-3xl">
              {t("quick.title")}
            </h2>
          </div>
          <button
            onClick={() => handleAction("/astrologers")}
            className="hidden shrink-0 items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000] sm:inline-flex"
          >
            {t("quick.viewAll")} →
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {actions.map((item) => (
            <button
              key={item.titleKey}
              onClick={() => handleAction(item.route)}
              className="group flex min-h-[92px] items-center gap-3 rounded-[16px] border border-[#ffffbf]/85 bg-[#ffffbf] p-3 text-left shadow-[0_10px_24px_rgba(126,98,10,0.12)] transition hover:-translate-y-0.5 hover:border-[#ffffbf] hover:bg-[#fffaa4] hover:shadow-[0_16px_34px_rgba(126,98,10,0.18)] sm:min-h-[104px] sm:gap-4 sm:p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white text-lg font-bold text-[#a06c00] shadow-[0_12px_22px_rgba(126,98,10,0.14)] ring-1 ring-[#d7c747]/80 sm:h-14 sm:w-14 sm:rounded-[16px] sm:text-xl">
                {item.icon}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-extrabold text-[#211704] sm:text-base">
                  {t(item.titleKey)}
                </p>
                <p className="mt-1 text-xs font-semibold leading-5 text-[#6f5930] sm:text-sm">
                  {item.description}
                </p>
              </div>
            </button>
          ))}
        </div>
        <button
          onClick={() => handleAction("/astrologers")}
          className="mt-4 inline-flex w-full shrink-0 items-center justify-center rounded-full bg-[#dfff00] px-4 py-3 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000] sm:hidden"
        >
          {t("quick.viewAll")} →
        </button>
      </section>
    </>
  );
}
