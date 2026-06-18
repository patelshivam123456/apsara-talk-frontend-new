"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import ChatPanel from "@/components/ChatPanel";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import NotificationPanel from "@/components/NotificationPanel";
import {
  fetchPlanetaryHighlightsConfig,
  planetaryHighlightsConfig,
} from "@/constants/planetaryHighlightsData";
import { useLanguage } from "@/context/LanguageContext";

const toneClass = {
  positive: "border-emerald-400/50 bg-emerald-400/12 text-emerald-700",
  neutral: "border-amber-400/55 bg-amber-300/18 text-amber-800",
  challenging: "border-rose-400/50 bg-rose-400/12 text-rose-700",
};

const cosmicToneClass = {
  positive: "border-emerald-300/45 bg-emerald-300/12 text-emerald-100",
  neutral: "border-amber-300/45 bg-amber-300/12 text-amber-100",
  challenging: "border-rose-300/45 bg-rose-300/12 text-rose-100",
};

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Shell({ id, eyebrow, title, children, action }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.35 }}
      className="ph-panel rounded-[20px] border p-4 shadow-[0_16px_48px_rgba(89,65,16,0.10)] sm:p-5"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[var(--ph-accent)]">
            {eyebrow}
          </p>
          <h2 className="mt-1 text-xl font-black text-[var(--ph-text)]">
            {title}
          </h2>
        </div>
        {action}
      </div>
      {children}
    </motion.section>
  );
}

function InsightTile({ label, value, detail, icon }) {
  return (
    <article className="rounded-[18px] border border-[var(--ph-border)] bg-[var(--ph-card)] p-4 shadow-[0_12px_34px_rgba(89,65,16,0.08)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--ph-accent)]">
            {label}
          </p>
          <h3 className="mt-2 text-lg font-black text-[var(--ph-text)]">{value}</h3>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[var(--ph-soft)] text-xl text-[var(--ph-accent)]">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-[var(--ph-muted)]">{detail}</p>
    </article>
  );
}

function SectionNav() {
  const items = [
    ["Overview", "today-overview"],
    ["Energy", "energy-scoreboard"],
    ["Transits", "transits"],
    ["Calendar", "calendar"],
    ["FAQ", "faq"],
  ];

  return (
    <nav className="sticky top-24 z-30 hidden rounded-full border border-[var(--ph-border)] bg-[var(--ph-card)] p-1 shadow-[0_12px_30px_rgba(89,65,16,0.10)] backdrop-blur-xl lg:flex">
      {items.map(([label, id]) => (
        <button
          key={id}
          type="button"
          onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="rounded-full px-4 py-2 text-xs font-black text-[var(--ph-muted)] transition hover:bg-[var(--ph-soft)] hover:text-[var(--ph-text)]"
        >
          {label}
        </button>
      ))}
    </nav>
  );
}

function ViewToggle({ expanded, onClick, showLabel, hideLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-[#dfff00] px-4 py-2 text-xs font-black text-[#211704] shadow-[0_10px_24px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
    >
      {expanded ? hideLabel : showLabel}
    </button>
  );
}

function ProgressRing({ value, size = 58 }) {
  const radius = 24;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 58 58" className="h-full w-full -rotate-90">
        <circle cx="29" cy="29" r={radius} fill="none" stroke="var(--ph-ring)" strokeWidth="6" />
        <motion.circle
          cx="29"
          cy="29"
          r={radius}
          fill="none"
          stroke="#dfff00"
          strokeLinecap="round"
          strokeWidth="6"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        />
      </svg>
      <span className="absolute text-[11px] font-black text-[var(--ph-text)]">{value}%</span>
    </div>
  );
}

function ZodiacMini() {
  const signs = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

  return (
    <motion.div
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      className="relative aspect-square w-48 rounded-full border border-[var(--ph-border)] bg-[radial-gradient(circle,var(--ph-wheel)_0%,transparent_70%)] shadow-[0_20px_70px_rgba(151,165,0,0.18)] sm:w-60"
    >
      <div className="absolute inset-[20%] rounded-full border border-[var(--ph-border)]" />
      <div className="absolute inset-[36%] rounded-full bg-[var(--ph-card-strong)]" />
      {signs.map((sign, index) => {
        const angle = (index / signs.length) * Math.PI * 2;
        return (
          <span
            key={sign}
            className="absolute grid h-8 w-8 place-items-center rounded-full border border-[var(--ph-border)] bg-[var(--ph-card)] text-lg text-[var(--ph-text)]"
            style={{
              left: `calc(50% + ${Math.cos(angle) * 40}% - 16px)`,
              top: `calc(50% + ${Math.sin(angle) * 40}% - 16px)`,
            }}
          >
            {sign}
          </span>
        );
      })}
      <span className="absolute inset-0 grid place-items-center text-4xl text-[#dfff00]">✦</span>
    </motion.div>
  );
}

function Hero({ currentDate, cosmic, onToggleTheme, onTodayClick }) {
  return (
    <section className="ph-hero relative overflow-hidden rounded-[26px] border p-5 pt-24 shadow-[0_24px_80px_rgba(87,60,12,0.14)] sm:p-7 sm:pt-28 lg:p-10 lg:pt-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_13%_24%,var(--ph-glow-a),transparent_28%),radial-gradient(circle_at_84%_24%,var(--ph-glow-b),transparent_34%),linear-gradient(135deg,var(--ph-hero),var(--ph-hero-end))]" />
      <div className="pointer-events-none absolute -bottom-28 -left-24 h-72 w-72 rounded-full border border-[var(--ph-border)] opacity-60" />
      <div className="relative grid gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-[var(--ph-border)] bg-[var(--ph-card)] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-[var(--ph-muted)]">
              {currentDate}
            </span>
            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-full border border-[var(--ph-border)] bg-[var(--ph-card)] px-3 py-1.5 text-xs font-black text-[var(--ph-text)]"
            >
              {cosmic ? "Day Mode" : "Night Mode"}
            </button>
          </div>
          <h1 className="mt-5 max-w-3xl text-[2.4rem] font-black leading-[1.02] text-[var(--ph-text)] sm:text-[3.5rem]">
            Planetary Highlights
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ph-muted)] sm:text-base">
            Discover how current planetary movements influence your career, relationships, finances, health, and spiritual growth.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={onTodayClick}
              className="rounded-full bg-[#dfff00] px-5 py-3 text-sm font-black text-[#211704] shadow-[0_14px_32px_rgba(151,165,0,0.20)]"
            >
              View Today&apos;s Highlights
            </button>
            <button className="rounded-full border border-[var(--ph-border)] bg-[var(--ph-card)] px-5 py-3 text-sm font-black text-[var(--ph-text)]">
              Personalized Reading
            </button>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="rounded-[28px] border border-[var(--ph-border)] bg-[var(--ph-card)] p-5 shadow-[0_18px_60px_rgba(89,65,16,0.12)]">
            <ZodiacMini />
            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              {["Career", "Love", "Finance"].map((item) => (
                <span key={item} className="rounded-2xl bg-[var(--ph-soft)] px-3 py-2 text-[11px] font-black text-[var(--ph-muted)]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PlanetCard({ planet, onOpen }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="ph-card rounded-[18px] border p-4 transition"
    >
      <div className="flex gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[var(--ph-soft)] text-2xl text-[var(--ph-accent)]">
          {planet.symbol}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black text-[var(--ph-text)]">{planet.name}</h3>
            <span className="rounded-full bg-[var(--ph-soft)] px-2.5 py-1 text-[10px] font-black text-[var(--ph-muted)]">
              {planet.sanskritName}
            </span>
          </div>
          <p className="mt-1 text-xs font-bold text-[var(--ph-accent)]">{planet.currentSign} • {planet.currentHouse}</p>
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ph-muted)]">{planet.description}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-[auto_1fr] items-center gap-3">
        <ProgressRing value={planet.strength} />
        <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
          <span className="rounded-xl bg-[var(--ph-soft)] px-2 py-2 font-bold text-[var(--ph-muted)]">{planet.nature}</span>
          <span className="rounded-xl bg-[var(--ph-soft)] px-2 py-2 font-bold text-[var(--ph-muted)]">{planet.luckyColor}</span>
          <span className="rounded-xl bg-[var(--ph-soft)] px-2 py-2 font-bold text-[var(--ph-muted)]">#{planet.luckyNumber}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={() => onOpen(planet.id)}
        className="mt-4 w-full rounded-full border border-[var(--ph-border)] bg-[var(--ph-card-strong)] px-4 py-2 text-xs font-black text-[var(--ph-text)]"
      >
        View Details
      </button>
    </motion.article>
  );
}

function MiniList({ title, items }) {
  return (
    <div className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
      <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--ph-accent)]">{title}</p>
      <ul className="mt-2 space-y-1.5 text-xs leading-5 text-[var(--ph-muted)]">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#dfff00]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailModal({ planet, onClose }) {
  if (!planet) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[140] overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="mx-auto max-w-5xl rounded-[22px] border border-[var(--ph-border)] bg-[var(--ph-modal)] p-4 text-[var(--ph-text)] shadow-2xl sm:p-5"
        >
          <div className="flex items-start justify-between gap-4 border-b border-[var(--ph-border)] pb-4">
            <div className="flex gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[var(--ph-soft)] text-3xl text-[var(--ph-accent)]">{planet.symbol}</span>
              <div>
                <h2 className="text-xl font-black">{planet.name} Profile</h2>
                <p className="mt-1 text-xs text-[var(--ph-muted)]">{planet.sanskritName} • {planet.category}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ph-soft)] text-xl font-black"
              aria-label="Close planet details"
            >
              ×
            </button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ["Exaltation", planet.details.exaltationSign],
              ["Debilitation", planet.details.debilitationSign],
              ["Mool Trikona", planet.details.moolTrikona],
              ["Zodiac Signs", planet.details.zodiacSigns.join(", ")],
              ["Friends", planet.details.friendships.join(", ")],
              ["Enemies", planet.details.enemies.join(", ")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--ph-accent)]">{label}</p>
                <p className="mt-1 text-sm text-[var(--ph-muted)]">{value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <MiniList title="Positive Effects" items={planet.positiveEffects} />
            <MiniList title="Best Activities" items={planet.bestActivities} />
            <MiniList title="Avoid Activities" items={planet.avoidActivities} />
            <MiniList title="Remedies" items={[planet.impacts.remedies, planet.impacts.mantra]} />
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[
              ["Origin and Mythology", planet.details.origin],
              ["Vedic Significance", planet.details.vedicSignificance],
              ["Western Significance", planet.details.westernSignificance],
              ["Transit Effects", planet.details.transitEffects],
            ].map(([label, body]) => (
              <div key={label} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                <h3 className="text-sm font-black">{label}</h3>
                <p className="mt-2 text-xs leading-5 text-[var(--ph-muted)]">{body}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function PlanetaryHighlights({ fullPage = false }) {
  const router = useRouter();
  const { t } = useLanguage();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [config, setConfig] = useState(planetaryHighlightsConfig);
  const [loading, setLoading] = useState(fullPage);
  const [cosmic, setCosmic] = useState(false);
  const [selectedPlanetId, setSelectedPlanetId] = useState(null);
  const [showAllPlanets, setShowAllPlanets] = useState(false);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const [showAllCalendar, setShowAllCalendar] = useState(false);
  const [aspectId, setAspectId] = useState("conjunction");
  const [lifeId, setLifeId] = useState("career");
  const [query, setQuery] = useState("");
  const [calendarType, setCalendarType] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  useEffect(() => {
    if (!fullPage) return;

    let cancelled = false;
    fetchPlanetaryHighlightsConfig()
      .then((nextConfig) => {
        if (!cancelled) setConfig(nextConfig);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fullPage]);

  const currentDate = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const selectedPlanet = config.planets.find((planet) => planet.id === selectedPlanetId);
  const activeAspect = config.aspects.find((aspect) => aspect.id === aspectId) || config.aspects[0];
  const activeLife = config.lifeAreas.find((area) => area.id === lifeId) || config.lifeAreas[0];
  const visiblePlanets = showAllPlanets ? config.planets : config.planets.slice(0, 4);
  const visibleFaqs = showAllFaqs ? config.faqs : config.faqs.slice(0, 6);
  const strongestPlanet = config.planets.reduce(
    (strongest, planet) => (planet.strength > strongest.strength ? planet : strongest),
    config.planets[0]
  );
  const cautionPlanet = config.planets.reduce(
    (lowest, planet) => (planet.strength < lowest.strength ? planet : lowest),
    config.planets[0]
  );
  const averageEnergy = Math.round(
    config.energyScores.reduce((total, score) => total + score.score, 0) /
      Math.max(config.energyScores.length, 1)
  );
  const nextEvent = config.calendar[0];
  const calendar = useMemo(() => {
    return config.calendar
      .filter((item) => calendarType === "All" || item.type === calendarType)
      .filter((item) => `${item.title} ${item.planet} ${item.summary}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (sortBy === "planet" ? a.planet.localeCompare(b.planet) : a.date.localeCompare(b.date)));
  }, [calendarType, config.calendar, query, sortBy]);
  const visibleCalendar = showAllCalendar ? calendar : calendar.slice(0, 6);

  if (!fullPage) {
    const previewPlanets = isLoggedIn ? config.planets.slice(0, 3) : config.planets.slice(0, 3);

    return (
      <section className="overflow-hidden rounded-[24px] border border-[#eadcae] bg-[#fffbea]/50 p-4 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)]">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">Celestial briefing</p>
            <h2 className="mt-1 text-2xl font-extrabold">{t("planet.title")}</h2>
          </div>
          <button onClick={() => router.push("/services/planetary-highlights")} className="hidden rounded-full bg-[#dfff00] px-4 py-2 text-xs font-black text-[#211704] sm:block">
            {t("quick.viewAll")} →
          </button>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {previewPlanets.map((planet) => (
            <button
              key={planet.id}
              onClick={() => router.push("/services/planetary-highlights")}
              className="flex items-center gap-3 rounded-2xl border border-[#eadcae] bg-white/70 p-3 text-left transition hover:-translate-y-0.5"
            >
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#fbf8cc] text-xl">{planet.symbol}</span>
              <span>
                <span className="block font-black">{planet.name}</span>
                <span className="text-xs text-[#60481f]">{planet.currentSign} • {planet.strength}%</span>
              </span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div className={cn("ph-root min-h-screen px-3 py-3 sm:px-4 md:px-6", cosmic ? "ph-night" : "ph-day")}>
      <style jsx global>{`
        .ph-root {
          --ph-bg: #fdf4e3;
          --ph-hero: #fff8e8;
          --ph-card: rgba(255, 255, 255, 0.82);
          --ph-card-strong: rgba(255, 251, 234, 0.92);
          --ph-soft: #fbf8cc;
          --ph-border: rgba(216, 189, 104, 0.58);
          --ph-text: #211704;
          --ph-muted: #60481f;
          --ph-accent: #9a6f08;
          --ph-ring: rgba(154, 111, 8, 0.16);
          --ph-wheel: rgba(223, 255, 0, 0.28);
          --ph-glow-a: rgba(255, 255, 255, 0.86);
          --ph-glow-b: rgba(223, 255, 0, 0.28);
          --ph-modal: #fffdf7;
          background: var(--ph-bg);
          color: var(--ph-text);
        }

        .ph-night {
          --ph-bg: #000000;
          --ph-hero: #050505;
          --ph-card: #050505;
          --ph-card-strong: #0b0b0b;
          --ph-soft: #101010;
          --ph-border: rgba(255, 255, 255, 0.16);
          --ph-text: #ffffff;
          --ph-muted: #d8d1c2;
          --ph-accent: #dfff00;
          --ph-ring: rgba(255, 255, 255, 0.16);
          --ph-wheel: rgba(223, 255, 0, 0.16);
          --ph-glow-a: rgba(223, 255, 0, 0.08);
          --ph-glow-b: rgba(255, 255, 255, 0.06);
          --ph-modal: #050505;
        }

        .ph-hero,
        .ph-panel,
        .ph-card {
          background: var(--ph-card);
          border-color: var(--ph-border);
        }

        .ph-hero {
          background: var(--ph-hero);
        }

        .ph-night header > div > div,
        .ph-night footer {
          background: #050505 !important;
          border-color: rgba(255, 255, 255, 0.16) !important;
          color: #ffffff !important;
        }

        .ph-night header button,
        .ph-night header select,
        .ph-night footer button,
        .ph-night footer p,
        .ph-night footer h3 {
          color: #ffffff !important;
          border-color: rgba(255, 255, 255, 0.16) !important;
        }

        .ph-night header button,
        .ph-night header select,
        .ph-night footer button:not([class*="bg-[#dfff00]"]) {
          background: #0b0b0b !important;
        }
      `}</style>

      <ChatPanel />
      <NotificationPanel />
      <Header />

      <main className="mx-auto max-w-[1500px] space-y-4">
        <Hero
          cosmic={cosmic}
          currentDate={currentDate}
          onToggleTheme={() => setCosmic((value) => !value)}
          onTodayClick={() => document.getElementById("today-overview")?.scrollIntoView({ behavior: "smooth" })}
        />

        <div className="flex justify-center">
          <SectionNav />
        </div>

        <section className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <InsightTile
            label="Strongest now"
            value={`${strongestPlanet.name} ${strongestPlanet.strength}%`}
            detail={`${strongestPlanet.currentSign} supports ${strongestPlanet.bestActivities[0].toLowerCase()} and clearer timing.`}
            icon={strongestPlanet.symbol}
          />
          <InsightTile
            label="Needs care"
            value={`${cautionPlanet.name} ${cautionPlanet.strength}%`}
            detail={`Keep ${cautionPlanet.avoidActivities[0].toLowerCase()} in check and move with patience.`}
            icon={cautionPlanet.symbol}
          />
          <InsightTile
            label="Daily energy"
            value={`${averageEnergy}% aligned`}
            detail="Use the day for steady planning, reflective action, and simple remedies."
            icon="◌"
          />
          <InsightTile
            label="Next event"
            value={nextEvent?.title || "Cosmic update"}
            detail={nextEvent ? `${nextEvent.date} • ${nextEvent.impactLevel} influence` : "New calendar data will appear here."}
            icon="✦"
          />
        </section>

        <Shell
          id="today-overview"
          eyebrow="Today"
          title="Current Planetary Overview"
          action={
            config.planets.length > 4 && (
              <ViewToggle
                expanded={showAllPlanets}
                onClick={() => setShowAllPlanets((value) => !value)}
                showLabel="View All Planets"
                hideLabel="Show Fewer"
              />
            )
          }
        >
          {loading ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-44 animate-pulse rounded-[18px] bg-[var(--ph-soft)]" />
              ))}
            </div>
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {visiblePlanets.map((planet) => (
                <PlanetCard key={planet.id} planet={planet} onOpen={setSelectedPlanetId} />
              ))}
            </div>
          )}
        </Shell>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <Shell id="energy-scoreboard" eyebrow="Energy" title="Planetary Energy Scoreboard">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-4">
              {config.energyScores.map((score) => (
                <div key={score.planet} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                  <ProgressRing value={score.score} />
                  <p className="mt-2 text-xs font-black text-[var(--ph-text)]">{score.planet}</p>
                  <p className="text-[11px] text-[var(--ph-muted)]">
                    {score.trend === "up" ? "↑" : score.trend === "down" ? "↓" : "→"} {score.comparison}
                  </p>
                </div>
              ))}
            </div>
          </Shell>

          <Shell id="transits" eyebrow="Transits" title="Upcoming Transit Timeline">
            <div className="grid gap-3 md:grid-cols-2">
              {config.transits.slice(0, 4).map((transit) => (
                <article key={transit.id} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black text-[var(--ph-text)]">{transit.planet}</h3>
                    <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-black uppercase", cosmic ? cosmicToneClass[transit.impactLevel] : toneClass[transit.impactLevel])}>
                      {transit.impactLevel}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-[var(--ph-muted)]">{transit.fromSign} → {transit.toSign}</p>
                  <p className="mt-1 text-xs font-bold text-[var(--ph-accent)]">{transit.date} • {transit.time}</p>
                </article>
              ))}
            </div>
          </Shell>
        </section>

        <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
          <Shell eyebrow="Aspects" title="Aspect Studio">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-2">
              {config.aspects.map((aspect) => (
                <button
                  key={aspect.id}
                  onClick={() => setAspectId(aspect.id)}
                  className={cn(
                    "rounded-2xl border px-3 py-3 text-xs font-black transition",
                    aspectId === aspect.id
                      ? "border-[#dfff00] bg-[#dfff00] text-[#211704]"
                      : "border-[var(--ph-border)] bg-[var(--ph-card-strong)] text-[var(--ph-text)]"
                  )}
                >
                  {aspect.name}
                </button>
              ))}
            </div>
          </Shell>

          <Shell eyebrow={activeAspect.angle} title={activeAspect.name}>
            <p className="text-sm leading-6 text-[var(--ph-muted)]">{activeAspect.definition}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <MiniList title="Positive" items={activeAspect.positiveEffects.slice(0, 3)} />
              <MiniList title="Challenges" items={activeAspect.challenges.slice(0, 3)} />
              <MiniList title="Best Practices" items={activeAspect.bestPractices.slice(0, 3)} />
            </div>
          </Shell>
        </section>

        <Shell eyebrow="Life Areas" title="How Planets Affect Your Life">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {config.lifeAreas.map((area) => (
              <button
                key={area.id}
                onClick={() => setLifeId(area.id)}
                className={cn(
                  "shrink-0 rounded-full px-4 py-2 text-xs font-black",
                  lifeId === area.id
                    ? "bg-[#dfff00] text-[#211704]"
                    : "border border-[var(--ph-border)] bg-[var(--ph-card-strong)] text-[var(--ph-text)]"
                )}
              >
                {area.label}
              </button>
            ))}
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            <MiniList title="Positive Influence" items={[activeLife.positiveInfluence]} />
            <MiniList title="Current Trends" items={[activeLife.currentTrends]} />
            <MiniList title="Remedies" items={activeLife.remedies} />
          </div>
        </Shell>

        <section className="grid gap-4 xl:grid-cols-2">
          <Shell eyebrow="Events" title="Major Astrological Events">
            <div className="grid gap-3 sm:grid-cols-2">
              {config.events.slice(0, 4).map((event) => (
                <article key={event.id} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                  <h3 className="text-sm font-black text-[var(--ph-text)]">{event.name}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[var(--ph-muted)]">{event.description}</p>
                  <p className="mt-2 text-[11px] font-black text-[var(--ph-accent)]">{event.duration}</p>
                </article>
              ))}
            </div>
          </Shell>

          <Shell eyebrow="Remedies" title="Planetary Remedy Picks">
            <div className="grid gap-3 sm:grid-cols-3">
              {config.remedies.slice(0, 3).map((remedy) => (
                <article key={remedy.planet} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                  <h3 className="text-sm font-black text-[var(--ph-text)]">{remedy.planet}</h3>
                  <p className="mt-2 text-xs leading-5 text-[var(--ph-muted)]">{remedy.mantras[0]}</p>
                  <p className="mt-2 text-[11px] font-bold text-[var(--ph-accent)]">{remedy.gemstones.join(", ")}</p>
                </article>
              ))}
            </div>
          </Shell>
        </section>

        <Shell id="calendar" eyebrow="Calendar" title="Next 30 Days">
          <div className="mb-4 grid gap-2 md:grid-cols-4">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search events"
              className="min-h-11 rounded-full border border-[var(--ph-border)] bg-[var(--ph-card-strong)] px-4 text-sm text-[var(--ph-text)] outline-none"
            />
            <select
              value={calendarType}
              onChange={(event) => setCalendarType(event.target.value)}
              className="min-h-11 rounded-full border border-[var(--ph-border)] bg-[var(--ph-card-strong)] px-4 text-sm text-[var(--ph-text)]"
            >
              {["All", "Movement", "Retrograde", "Eclipse", "Special Yoga"].map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
            <button onClick={() => setSortBy("planet")} className="rounded-full border border-[var(--ph-border)] bg-[var(--ph-card-strong)] px-4 py-2 text-xs font-black text-[var(--ph-text)]">
              Sort by Planet
            </button>
            <button onClick={() => setSortBy("date")} className="rounded-full border border-[var(--ph-border)] bg-[var(--ph-card-strong)] px-4 py-2 text-xs font-black text-[var(--ph-text)]">
              Sort by Date
            </button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {visibleCalendar.map((item) => (
              <article key={item.id} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[11px] font-black text-[var(--ph-accent)]">{item.date}</p>
                  <span className={cn("rounded-full border px-2.5 py-1 text-[10px] font-black uppercase", cosmic ? cosmicToneClass[item.impactLevel] : toneClass[item.impactLevel])}>
                    {item.impactLevel}
                  </span>
                </div>
                <h3 className="mt-2 text-sm font-black text-[var(--ph-text)]">{item.title}</h3>
                <p className="mt-1 text-xs text-[var(--ph-muted)]">{item.planet} • {item.type}</p>
              </article>
            ))}
          </div>
          {calendar.length > 6 && (
            <div className="mt-4 flex justify-center">
              <ViewToggle
                expanded={showAllCalendar}
                onClick={() => setShowAllCalendar((value) => !value)}
                showLabel="View All Calendar Events"
                hideLabel="Show Fewer"
              />
            </div>
          )}
        </Shell>

        <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <Shell eyebrow="Combinations" title="Planetary Combinations">
            <div className="grid gap-3">
              {config.combinations.slice(0, 3).map((combo) => (
                <article key={combo.pair} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3">
                  <h3 className="text-sm font-black text-[var(--ph-text)]">{combo.pair}</h3>
                  <p className="mt-1 text-xs leading-5 text-[var(--ph-muted)]">{combo.meaning}</p>
                </article>
              ))}
            </div>
          </Shell>

          <Shell
            id="faq"
            eyebrow="FAQ"
            title="Planetary Questions"
            action={
              config.faqs.length > 6 && (
                <ViewToggle
                  expanded={showAllFaqs}
                  onClick={() => setShowAllFaqs((value) => !value)}
                  showLabel="View All Questions"
                  hideLabel="Show Fewer"
                />
              )
            }
          >
            <div className="grid gap-2 md:grid-cols-2">
              {visibleFaqs.map((faq, index) => (
                <details key={faq.question} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3" open={index === 0}>
                  <summary className="cursor-pointer list-none text-xs font-black text-[var(--ph-text)]">{faq.question}</summary>
                  <p className="mt-2 text-xs leading-5 text-[var(--ph-muted)]">{faq.answer}</p>
                </details>
              ))}
            </div>
          </Shell>
        </section>

        <section className="rounded-[24px] border border-[var(--ph-border)] bg-[var(--ph-card)] p-5 shadow-[0_20px_60px_rgba(87,60,12,0.10)] sm:p-6">
          <h2 className="text-2xl font-black text-[var(--ph-text)]">Get Personalized Planetary Analysis</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {["Birth Chart Analysis", "Daily Predictions", "Transit Reports", "Career Guidance", "Relationship Guidance"].map((feature) => (
              <p key={feature} className="rounded-2xl border border-[var(--ph-border)] bg-[var(--ph-card-strong)] p-3 text-xs font-black text-[var(--ph-text)]">
                {feature}
              </p>
            ))}
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            {["Consult Astrologer", "Generate Kundli", "View Horoscope"].map((label) => (
              <button key={label} className="rounded-full bg-[#dfff00] px-5 py-3 text-sm font-black text-[#211704]">
                {label}
              </button>
            ))}
          </div>
        </section>

        <Footer />
      </main>

      <DetailModal planet={selectedPlanet} onClose={() => setSelectedPlanetId(null)} />
    </div>
  );
}
