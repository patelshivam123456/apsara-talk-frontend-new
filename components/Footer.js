"use client";

import Image from "next/image";
import { useRouter } from "next/router";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const footerLinks = [
  { labelKey: "nav.astrologers", route: "/astrologers" },
  { labelKey: "nav.horoscope", route: "/horoscope" },
  { labelKey: "nav.kundli", route: "/kundli" },
  { labelKey: "nav.compatibility", route: "/compatibility" },
];

const footerColumns = [
  {
    title: "Consultations",
    links: [
      { label: "Tomorrow's Horoscope", route: "/services/tomorrows-horoscope" },
      { label: "Weekly Horoscope", route: "/services/weekly-horoscope" },
      { label: "Monthly Horoscope", route: "/services/monthly-horoscope" },
      { label: "Yearly Horoscope", route: "/services/yearly-horoscope" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "How to read kundali", route: "/kundli" },
      { label: "Chat with Astrologer", route: "/services/chat-with-astrologer" },
      { label: "Talk to Astrologer", route: "/services/call-with-astrologer" },
      { label: "Astrology Yoga", route: "/services/personal-growth-guidance" },
    ],
  },
  {
    title: "Astrologer",
    links: [
      { label: "Astrologer Login", route: "/astrologer-login" },
      { label: "Astrologer Registration", route: "/astrologer-register" },
      { label: "Contact us", route: "/services/chat-with-astrologer" },
      { label: "Support", route: "/services/chat-with-astrologer" },
    ],
  },
  {
    title: "Secure",
    links: [
      { label: "Private & Confidential", route: "/services/chat-with-astrologer" },
      { label: "Verified Astrologers", route: "/astrologers" },
      { label: "Secure Payments", route: "/wallet" },
      { label: "Trusted Guidance", route: "/services/love-guidance" },
    ],
  },
];

const themeOptions = [
  { id: "auto", label: "Auto", icon: "🔄" },
  { id: "day", label: "Day", icon: "☀️" },
  { id: "night", label: "Night", icon: "🌙" },
];

export default function Footer() {
  const router = useRouter();
  const { t } = useLanguage();
  const { themeMode, effectiveTheme, setTheme } = useTheme();
  const isNight = effectiveTheme === "dark-gold";

  return (
    <footer
      className={`relative mt-4 overflow-hidden rounded-[26px] border p-5 shadow-[0_22px_54px_rgba(87,60,12,0.12)] backdrop-blur-md sm:p-6 ${
        isNight
          ? "border-[#d9b857]/25 bg-[#0c0b05] text-[#fff8d8]"
          : "border-[#d8bd68]/55 bg-[#fbff8e] text-[#211704]"
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-0 ${
          isNight
            ? "bg-[radial-gradient(circle_at_20%_35%,rgba(223,255,0,0.30),transparent_34%),radial-gradient(circle_at_58%_46%,rgba(180,66,38,0.32),transparent_28%),radial-gradient(circle_at_75%_80%,rgba(53,164,88,0.32),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.36),rgba(0,0,0,0.76))]"
            : "bg-[radial-gradient(circle_at_22%_30%,rgba(255,255,255,0.84),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(223,255,0,0.50),transparent_32%)]"
        }`}
      />
      {isNight && (
        <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:radial-gradient(circle,rgba(255,255,255,0.72)_1px,transparent_1px)] [background-size:64px_64px]" />
      )}

      <div className="relative">
        <div className="flex flex-col gap-5 border-b border-current/12 pb-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/logo_apsara.jpeg"
              alt="ApsaraAstro Logo"
              width={44}
              height={44}
              className="h-11 w-11 rounded-2xl object-cover ring-1 ring-white/35"
            />
            <div>
              <p className="font-extrabold">
                <span className="text-white [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Apsara
                </span>
                <span className="text-[#dfff00] [text-shadow:0_1px_3px_rgba(33,23,4,0.65)]">
                  Astro
                </span>
              </p>
              <p className={`text-xs ${isNight ? "text-[#d6caa7]" : "text-[#6f5930]"}`}>
                {t("brand.tagline")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
            {footerLinks.map((item) => (
              <button
                key={item.route}
                onClick={() => router.push(item.route)}
                className={`rounded-full border px-4 py-2 text-left text-xs font-bold transition sm:text-center ${
                  isNight
                    ? "border-white/15 bg-white/8 text-[#efe4c2] hover:bg-white/14 hover:text-white"
                    : "border-[#d8bd68]/50 bg-white/45 text-[#4c493f] hover:bg-white"
                }`}
              >
                {t(item.labelKey)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-xs font-extrabold">{column.title}</h3>
              <div className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => router.push(link.route)}
                    className={`block text-left text-xs transition ${
                      isNight
                        ? "text-[#cfc3a2] hover:text-white"
                        : "text-[#6f5930] hover:text-[#211704]"
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 border-t border-current/12 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className={`text-[11px] ${isNight ? "text-[#bdae86]" : "text-[#7a6a43]"}`}>
            © 2026 ApsaraAstro. All Rights Reserved
          </p>

          <div
            className={`inline-flex w-fit items-center rounded-xl border p-1 shadow-sm ${
              isNight
                ? "border-white/18 bg-white/10 text-[#efe4c2]"
                : "border-[#d8bd68]/55 bg-white/65 text-[#6f5930]"
            }`}
          >
            {themeOptions.map((option) => {
              const isActive = themeMode === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[11px] font-bold transition ${
                    isActive
                      ? "bg-[#dfff00] text-[#211704] shadow-[0_8px_18px_rgba(151,165,0,0.22)]"
                      : isNight
                        ? "hover:bg-white/12"
                        : "hover:bg-white"
                  }`}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
