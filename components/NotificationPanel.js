"use client";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

const notifications = [
  {
    key: "notifications.horoscopeReady",
    time: "Today",
    icon: (
      <path d="M12 2v3m0 14v3M4.22 4.22l2.12 2.12m11.32 11.32 2.12 2.12M2 12h3m14 0h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0Z" />
    ),
  },
  {
    key: "notifications.newMessage",
    time: "2 min ago",
    icon: (
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
    ),
  },
];

export default function NotificationPanel() {
  const { notifOpen, setNotifOpen } = useApp();
  const { t } = useLanguage();
  const { effectiveTheme } = useTheme();
  const isNight = effectiveTheme === "dark-gold";

  if (!notifOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex justify-end">
      
      {/* Overlay */}
      <div
        className="absolute inset-0 cursor-pointer bg-[#120c03]/55 backdrop-blur-[2px]"
        onClick={() => setNotifOpen(false)}
      />

      {/* Panel */}
      <aside
        className={`relative flex h-full w-full flex-col border-l p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] sm:w-[380px] ${
          isNight
            ? "border-[#d9b857]/25 bg-[#100a02] text-[#fff8d8]"
            : "border-[#d8bd68]/60 bg-[#fffdf6] text-[#211704]"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${
            isNight
              ? "bg-[radial-gradient(circle_at_18%_8%,rgba(223,255,0,0.16),transparent_30%),radial-gradient(circle_at_100%_30%,rgba(196,122,10,0.20),transparent_36%)]"
              : "bg-[radial-gradient(circle_at_20%_8%,rgba(223,255,0,0.28),transparent_30%),radial-gradient(circle_at_100%_30%,rgba(255,240,184,0.75),transparent_38%)]"
          }`}
        />

        <div className="relative mb-5 flex items-start justify-between gap-4 border-b border-current/10 pb-4">
          <div>
            <p className={`text-[10px] font-extrabold uppercase tracking-[0.22em] ${isNight ? "text-[#f0c040]" : "text-[#916805]"}`}>
              Inbox
            </p>
            <h2 className="mt-1 text-xl font-extrabold">{t("notifications.title")}</h2>
            <p className={`mt-1 text-xs ${isNight ? "text-[#c8a882]" : "text-[#6f5930]"}`}>
              2 new updates for your account
            </p>
          </div>
          <button
            onClick={() => setNotifOpen(false)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition ${
              isNight
                ? "border-white/15 bg-white/10 text-[#efe4c2] hover:bg-white/15"
                : "border-[#e6ddc5] bg-white text-[#4c493f] hover:bg-[#fff4c8]"
            }`}
            aria-label="Close notifications"
          >
            ✕
          </button>
        </div>

        <div className="relative space-y-3">
          {notifications.map((item) => (
            <div
              key={item.key}
              className={`flex gap-3 rounded-[18px] border p-3 shadow-sm ${
                isNight
                  ? "border-[#d9b857]/18 bg-white/8"
                  : "border-[#ead783] bg-white/82"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#dfff00] text-[#211704] shadow-[0_10px_20px_rgba(151,165,0,0.16)]">
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
                  {item.icon}
                </svg>
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-extrabold leading-5">{t(item.key)}</p>
                  <span className={`shrink-0 text-[10px] font-bold ${isNight ? "text-[#bdae86]" : "text-[#8a6106]"}`}>
                    {item.time}
                  </span>
                </div>
                <p className={`mt-1 text-xs leading-5 ${isNight ? "text-[#c8a882]" : "text-[#6f5930]"}`}>
                  Tap to view details and continue where you left off.
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative mt-auto pt-4">
          <button
            type="button"
            onClick={() => setNotifOpen(false)}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-[#dfff00] px-5 py-2.5 text-xs font-bold text-[#312d1e] shadow-[0_16px_30px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
          >
            Mark all as read
          </button>
        </div>
      </aside>
    </div>
  );
}
