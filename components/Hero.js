import CircularProgress from "./CircularProgress";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

function getGreeting(t) {
  const hour = new Date().getHours();
  if (hour < 12) return t("hero.goodMorning");
  if (hour < 17) return t("hero.goodAfternoon");
  return t("hero.goodEvening");
}

export default function Hero({ profileData }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { t } = useLanguage();

  const greeting = getGreeting(t);
  const firstName =
    profileData?.firstName || user?.firstName || user?.username || user?.name;
  const lastName = profileData?.lastName || user?.lastName;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const displayName =
    isLoggedIn && fullName ? fullName.toUpperCase() : t("hero.explorer");

  return (
    <div className="relative w-full rounded-2xl overflow-hidden min-h-65 sm:min-h-75">

      {/* Background Image */}
      <img
        src="/Astro_Banner.jpg"
        alt="astro banner"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-[#0b0f2a]/98 via-[#0b0f2a]/80 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#0b0f2a]/60" />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between px-5 sm:px-8 py-6 min-h-65 sm:min-h-75">

        {/* TOP: Greeting */}
        <div>
          <p className="text-[10px] sm:text-xs text-purple-300 uppercase tracking-widest mb-1.5 font-medium">
            {isLoggedIn ? t("hero.dailyReading") : t("hero.cosmicGuidance")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold leading-snug">
            {greeting},{" "}
            <span className="text-yellow-400">{displayName} ✨</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1.5">
            {isLoggedIn
              ? t("hero.loggedInText")
              : t("hero.guestText")}
          </p>
        </div>

        {/* WALLET BALANCE — mobile only, logged-in only */}
        {isLoggedIn && (
          <div className="lg:hidden mt-4 flex items-center justify-between gap-3 backdrop-blur-md bg-linear-to-r from-purple-700/30 to-[#0b0f2a]/60 border border-purple-500/30 rounded-2xl px-5 py-3.5 shadow-[0_0_20px_rgba(139,92,246,0.2)]">
            <div>
              <p className="text-[10px] text-purple-300 uppercase tracking-widest">
                {t("hero.walletBalance")}
              </p>
              <p className="text-2xl font-bold mt-0.5 tracking-tight">
                ₹ 520.00
              </p>
            </div>
            <button className="bg-purple-600 hover:bg-purple-700 transition px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-md">
              {t("hero.addMoney")}
            </button>
          </div>
        )}

        {/* BOTTOM: Info Cards */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">

          {/* Energy Card */}
          <div className="backdrop-blur-md bg-white/5 border border-white/10 p-4 rounded-xl sm:w-[44%] flex flex-col gap-2">
            <p className="text-[10px] uppercase tracking-widest font-bold">
              {t("hero.todayEnergy")}
            </p>
            <div className="flex items-center gap-4">
              <CircularProgress value={72} />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">{t("hero.positiveZone")}</p>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {t("hero.energyText")}
                </p>
                <p className="text-[11px] font-bold  mt-0.5">
                  {t("hero.energyCta")}
                </p>
              </div>
            </div>
          </div>

          {/* Today at a Glance */}
          <div className="flex-1 backdrop-blur-md bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-3">
            <p className="text-[10px]  uppercase tracking-widest font-bold">
              {t("hero.todayGlance")}
            </p>
            <div className="flex items-center justify-around text-center flex-1">

              <div className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">🌅</span>
                <p className="text-xs font-medium text-white">{t("hero.morning")}</p>
                <span className="text-[10px] font-semibold text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full">
                  {t("hero.focus")}
                </span>
              </div>

              <div className="w-px h-10 bg-white/10" />

              <div className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">☀️</span>
                <p className="text-xs font-medium text-white">{t("hero.afternoon")}</p>
                <span className="text-[10px] font-semibold text-yellow-400 bg-yellow-500/20 px-2 py-0.5 rounded-full">
                  {t("hero.execute")}
                </span>
              </div>

              <div className="w-px h-10 bg-white/10" />

              <div className="flex flex-col items-center gap-1.5">
                <span className="text-2xl">🌙</span>
                <p className="text-xs font-medium text-white">{t("hero.evening")}</p>
                <span className="text-[10px] font-semibold text-white bg-blue-500/20 px-2 py-0.5 rounded-full">
                  {t("hero.reflect")}
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
