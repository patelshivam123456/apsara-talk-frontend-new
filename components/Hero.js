import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";
import {
  ADMIN_ROLE,
  ASTROLOGER_ROLE,
  CLIENT_ROLE,
  getUserRoles,
} from "@/utils/roleAccess";

const carouselSlides = [
  {
    src: "/Astro_Banner.jpg",
    alt: "ApsaraAstro astrology guidance banner",
    eyebrow: "Live astrology",
    title: "Instant clarity from trusted astrologers",
    body: "Chat, call, and find direction for love, career, money, and family questions.",
    position: "object-center",
  },
  {
    src: "/Astrosignup.jpg",
    alt: "ApsaraAstro spiritual consultation banner",
    eyebrow: "Personal readings",
    title: "Your questions deserve a clear answer",
    body: "Choose an expert, start privately, and continue only when the guidance feels right.",
    position: "object-[52%_center]",
  },
  {
    src: "/Astro_Banner.jpg",
    alt: "ApsaraAstro horoscope and birth chart banner",
    eyebrow: "Daily insight",
    title: "Horoscope, kundli, and compatibility in one place",
    body: "Follow your day with warmer perspective and practical next steps.",
    position: "object-[36%_center]",
  },
  {
    src: "/Astrosignup.jpg",
    alt: "ApsaraAstro relationship and career guidance banner",
    eyebrow: "Private support",
    title: "Start with a free chat, continue with confidence",
    body: "A calm, simple way to connect when you need help deciding what comes next.",
    position: "object-[64%_center]",
  },
];

export default function Hero({ profileData }) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { balance } = useSelector((state) => state.wallet);
  const { t } = useLanguage();
  const router = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);

  const firstName =
    profileData?.firstName || user?.firstName || user?.username || user?.name;
  const lastName = profileData?.lastName || user?.lastName;
  const fullName = [firstName, lastName].filter(Boolean).join(" ");
  const hasServerSession = !!profileData;
  const hasActiveSession = isLoggedIn || hasServerSession;
  const displayName =
    hasActiveSession && fullName ? fullName.toUpperCase() : t("hero.explorer");
  const roles = [
    ...new Set([
      ...getUserRoles(profileData),
      ...getUserRoles(user),
    ]),
  ];
  const isClient =
    roles.includes(CLIENT_ROLE) ||
    (hasActiveSession &&
      !roles.includes(ASTROLOGER_ROLE) &&
      !roles.includes(ADMIN_ROLE));

  const trustItems = [
    { value: "24/7", label: "Guidance" },
    { value: "5 min", label: "First reply" },
    { value: "100+", label: "Experts" },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((slide) => (slide + 1) % carouselSlides.length);
    }, 4500);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full overflow-hidden rounded-[28px] border border-[#eadcae] bg-[#fff9e9] font-sans shadow-[0_22px_70px_rgba(87,60,12,0.12)]">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#fffdf4_0%,#fff6da_52%,#f5e4b3_100%)]" />
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full border border-[#d9b857]/30" />
      <div className="absolute -right-10 top-10 h-44 w-44 rounded-full border border-[#d9b857]/25" />

      <div className="relative z-10 grid gap-6 p-4 sm:p-5 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch lg:p-6">
        <div className="flex min-h-[260px] flex-col justify-between rounded-[22px] border border-white/80 bg-white/64 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-sm sm:min-h-[300px] sm:p-7 lg:min-h-[350px]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="inline-flex rounded-full border border-[#d3ae4f]/45 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#916805] shadow-sm">
              {hasActiveSession ? t("hero.dailyReading") : t("hero.cosmicGuidance")}
              </p>

              {isClient && (
                <div className="ml-0 flex items-center gap-3 rounded-full border border-[#d3ae4f]/35 bg-[#211704] px-3 py-2 text-[#fffdf7] shadow-[0_12px_30px_rgba(33,23,4,0.16)] sm:ml-auto">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#f4da91]">
                      {t("hero.walletBalance")}
                    </p>
                    <p className="text-sm font-bold text-[#fffdf7]">
                      ₹ {Number(balance || 0).toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => router.push("/wallet")}
                    className="rounded-full bg-[#e5c45b] px-3 py-1.5 text-[11px] font-bold text-[#211704] transition hover:bg-[#f0d875]"
                  >
                    {t("hero.addMoney")}
                  </button>
                </div>
              )}
            </div>

            <h1 className="mt-7 max-w-xl text-[2rem] font-bold leading-[1.04] text-[#1d1607] sm:text-[2.45rem] lg:text-[3.15rem]">
              {hasActiveSession ? "Welcome back," : "Clarity for your next step."}
              {hasActiveSession && (
                <span className="mt-1 block break-words text-[#967006]">
                  {displayName}
                </span>
              )}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#60481f] sm:text-[15px]">
              {hasActiveSession ? t("hero.loggedInText") : t("hero.guestText")}
            </p>

            <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                onClick={() => router.push(hasActiveSession ? "/astrologers" : "/login")}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[#dfff00] px-6 py-3 text-sm font-bold text-[#3b382d] shadow-[0_16px_30px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000] sm:w-auto sm:min-w-[208px] sm:text-base"
              >
                <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M5 6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5v6A2.5 2.5 0 0 1 16.5 15H10l-4.5 4v-4A2.5 2.5 0 0 1 3 12.5v-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
                </svg>
                Get Free Chat
              </button>
              <button
                onClick={() => router.push("/register")}
                className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full border border-[#e6ddc5] bg-[#fffdf6] px-6 py-3 text-sm font-bold text-[#4c493f] shadow-sm transition hover:border-[#d3bd7d] hover:bg-white sm:w-auto sm:min-w-[228px] sm:text-base"
              >
                <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M12 4v11m0 0 4-4m-4 4-4-4M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Download The App
              </button>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-3 gap-2 sm:gap-3">
            {trustItems.map((item) => (
              <div
                key={item.label}
                className="rounded-full text-center border border-[#d8bd68]/38 bg-[#fff6dc] px-3 py-3 shadow-sm"
              >
                <p className="text-[13px] font-bold text-[#8a6106]">{item.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6f5930]">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[350px] overflow-hidden rounded-[24px] border border-[#d6b66b]/45 bg-[#211704] shadow-[0_22px_52px_rgba(72,48,8,0.2)] lg:block">
          {carouselSlides.map((slide, index) => (
            <div
              key={`${slide.src}-${slide.eyebrow}`}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === activeSlide ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={index !== activeSlide}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 760px, (min-width: 1024px) 55vw, 100vw"
                className={`object-cover ${slide.position}`}
              />
            </div>
          ))}

          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,13,2,0.74)_0%,rgba(20,13,2,0.36)_48%,rgba(20,13,2,0.12)_100%),linear-gradient(0deg,rgba(20,13,2,0.68),transparent_58%)]" />

          <div className="absolute left-4 top-4 rounded-full border border-white/30 bg-white/90 px-4 py-2 text-xs font-bold text-[#745004] shadow-lg backdrop-blur-md sm:left-5 sm:top-5">
            {carouselSlides[activeSlide].eyebrow}
          </div>

          <div className="absolute bottom-4 left-4 right-4 rounded-[22px] border border-white/35 bg-white/92 p-4 text-[#211704] shadow-[0_18px_40px_rgba(0,0,0,0.18)] backdrop-blur-md sm:bottom-5 sm:left-5 sm:right-5 lg:right-auto lg:w-[460px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#8a6106]">
                  {t("hero.todayEnergy")}
                </p>
                <p className="mt-1 text-base font-bold sm:text-lg">
                  {carouselSlides[activeSlide].title}
                </p>
                <p className="mt-1 text-xs leading-5 text-[#60481f]">
                  {carouselSlides[activeSlide].body}
                </p>
              </div>
              <button
                onClick={() => router.push("/astrologers")}
                className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#dfff00] px-5 py-2.5 text-xs font-bold text-[#312d1e] transition hover:bg-[#cdf000]"
              >
                {t("astro.viewMore")}
              </button>
            </div>
          </div>

          <div className="absolute right-4 top-4 flex items-center gap-2 sm:right-5 sm:top-5">
            {carouselSlides.map((slide, index) => (
              <button
                key={slide.eyebrow}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full border border-white/70 transition-all ${
                  index === activeSlide
                    ? "w-8 bg-[#dfff00]"
                    : "w-2.5 bg-white/70 hover:bg-white"
                }`}
                aria-label={`Show banner slide ${index + 1}`}
                aria-current={index === activeSlide}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
