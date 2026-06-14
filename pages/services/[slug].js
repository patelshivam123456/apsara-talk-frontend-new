"use client";

import { useRouter } from "next/router";
import PublicPageLayout from "@/components/PublicPageLayout";
import { servicePages, serviceSlugs } from "@/constants/servicePages";

const categoryConfig = {
  consultation: {
    label: "Consultation flow",
    accent: "bg-[#211704] text-[#dfff00]",
    panels: ["Expert selection", "Private question", "Session summary"],
    details: [
      ["Best for", "Personal questions where you want a direct, human response."],
      ["How it works", "Choose an astrologer, start the session, and continue only when it feels useful."],
      ["Privacy", "Your question stays focused inside the consultation experience."],
      ["Next step", "Shortlist experts by language, specialty, and comfort."],
    ],
  },
  horoscope: {
    label: "Zodiac forecast",
    accent: "bg-[#fff0a6] text-[#7a5400]",
    panels: ["Love", "Career", "Health", "Finance"],
    details: [
      ["Reading style", "A practical sign-wise forecast for the selected time period."],
      ["Use it for", "Planning conversations, meetings, self-care, and daily priorities."],
      ["What to notice", "Repeating themes, timing cues, and emotional tone."],
      ["Recommended action", "Pick one focus area and keep the day simple."],
    ],
  },
  kundli: {
    label: "Chart based service",
    accent: "bg-[#e8f8d7] text-[#236b24]",
    panels: ["Birth details", "Planetary houses", "Dasha timing"],
    details: [
      ["Input needed", "Date, time, and place of birth improve chart context."],
      ["Chart focus", "Ascendant, moon sign, house placement, and planetary strength."],
      ["Helpful for", "Marriage, career timing, self-understanding, and long-term planning."],
      ["Expert tip", "Use generated results as a starting point for deeper interpretation."],
    ],
  },
  calculator: {
    label: "Interactive calculator",
    accent: "bg-[#f7ecff] text-[#650095]",
    panels: ["Enter details", "Calculate result", "Read meaning"],
    details: [
      ["Purpose", "A quick, easy tool for checking a focused astrology or compatibility result."],
      ["Best use", "Compare options, understand broad patterns, and decide what to explore next."],
      ["Result type", "Simple scores, labels, timing cues, or chart-based indicators."],
      ["Follow-up", "Open the deeper tool or speak with an expert for personal detail."],
    ],
  },
  panchang: {
    label: "Daily timing",
    accent: "bg-[#fff8dc] text-[#8a6106]",
    panels: ["Tithi", "Vaar", "Hora", "Muhurta"],
    details: [
      ["Focus", "Traditional time-quality factors for planning the day."],
      ["Use it for", "Scheduling important starts, travel, rituals, and focused work."],
      ["Balance", "Treat timing as supportive guidance, not a source of fear."],
      ["Best habit", "Check the day once, then choose practical action."],
    ],
  },
  intuitive: {
    label: "Reflective guidance",
    accent: "bg-[#edf9ff] text-[#075985]",
    panels: ["Ask clearly", "Reflect deeply", "Act gently"],
    details: [
      ["Question style", "Works best with one clear question about love, career, or direction."],
      ["Reading tone", "Reflective, calm, and designed to help you think more clearly."],
      ["Good for", "When you feel stuck and need a simple next step."],
      ["Remember", "Use insight as guidance while keeping your own judgment in the room."],
    ],
  },
  guidance: {
    label: "Life guidance",
    accent: "bg-[#fff0f6] text-[#9f1239]",
    panels: ["Understand", "Discuss", "Decide"],
    details: [
      ["Area covered", "Personal themes like love, career, health rhythm, and inner growth."],
      ["Session focus", "Bring the question that is closest to your real decision."],
      ["Outcome", "A calmer reading of the pattern and one useful next step."],
      ["Recommended", "Save key details in your profile for more accurate guidance."],
    ],
  },
};

const categoryBySlug = {
  "chat-with-astrologer": "consultation",
  "call-with-astrologer": "consultation",
  "daily-horoscope": "horoscope",
  "tomorrows-horoscope": "horoscope",
  "yesterdays-horoscope": "horoscope",
  "weekly-horoscope": "horoscope",
  "monthly-horoscope": "horoscope",
  "yearly-horoscope": "horoscope",
  "free-kundli": "kundli",
  "kundli-matching": "kundli",
  "rising-sign-calculator": "kundli",
  "dasha-calculator": "kundli",
  "mangal-dosha-calculator": "kundli",
  "transit-chart-calculator": "kundli",
  tarot: "intuitive",
  numerology: "intuitive",
  "numerology-calculator": "intuitive",
  "today-panchang": "panchang",
  "rahu-kaal": "panchang",
  choghadiya: "panchang",
  tithi: "panchang",
  vaar: "panchang",
  hora: "panchang",
  karana: "panchang",
  "tomorrow-panchang": "panchang",
  "love-guidance": "guidance",
  "career-guidance": "guidance",
  "health-guidance": "guidance",
  "personal-growth-guidance": "guidance",
  "planetary-highlights": "guidance",
};

function getCategory(slug) {
  if (categoryBySlug[slug]) {
    return categoryBySlug[slug];
  }

  if (slug.includes("calculator") || slug === "compatibility") {
    return "calculator";
  }

  return "guidance";
}

function DetailGrid({ config }) {
  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {config.details.map(([title, body]) => (
        <article
          key={title}
          className="rounded-[20px] border border-[#eadcae] bg-white/92 p-4 text-[#211704] shadow-[0_12px_28px_rgba(94,70,12,0.08)]"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#9a6f08]">
            {title}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#60481f]">{body}</p>
        </article>
      ))}
    </section>
  );
}

function ConsultationLayout({ page, config }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[26px] bg-[#211704] p-5 text-white shadow-[0_20px_48px_rgba(33,23,4,0.18)] sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#dfff00]">
          {config.label}
        </p>
        <div className="mt-6 space-y-4">
          {config.panels.map((item, index) => (
            <div key={item} className="flex gap-4 rounded-[18px] border border-white/12 bg-white/8 p-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#dfff00] text-sm font-black text-[#211704]">
                {index + 1}
              </span>
              <div>
                <h2 className="text-sm font-extrabold">{item}</h2>
                <p className="mt-1 text-xs leading-5 text-[#f4e7bd]">
                  {page.cards[index]?.[1] || "Move through this step with clear, private guidance."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[26px] border border-[#eadcae] bg-white/92 p-5 shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
          Consultation benefits
        </p>
        <div className="mt-5 grid gap-3">
          {page.highlights.map((item) => (
            <div key={item} className="rounded-[16px] bg-[#ffffbf]/55 p-4 text-sm font-extrabold text-[#211704]">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HoroscopeLayout({ page, config }) {
  return (
    <section className="rounded-[28px] border border-[#eadcae] bg-white/92 p-4 shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">
      <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-[24px] bg-[#fff8dc] p-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
            {config.label}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"].map((sign) => (
              <div key={sign} className="grid h-14 place-items-center rounded-2xl bg-white text-2xl shadow-sm">
                {sign}
              </div>
            ))}
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {config.panels.map((item, index) => (
            <article key={item} className="rounded-[20px] border border-[#eee8d5] bg-[#fffdf8] p-5">
              <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black ${config.accent}`}>
                {item}
              </span>
              <h2 className="mt-4 text-base font-extrabold text-[#1d1607]">
                {page.cards[index % page.cards.length]?.[0] || item}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#60481f]">
                {page.cards[index % page.cards.length]?.[1] || page.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ToolLayout({ page, config }) {
  return (
    <section className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-[26px] border border-[#eadcae] bg-white/92 p-5 shadow-[0_18px_42px_rgba(107,82,12,0.13)] lg:col-span-2 sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
          {config.label}
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {config.panels.map((item, index) => (
            <div key={item} className="rounded-[20px] bg-[#fff8dc] p-4">
              <span className={`grid h-11 w-11 place-items-center rounded-full text-sm font-black ${config.accent}`}>
                0{index + 1}
              </span>
              <h2 className="mt-4 text-sm font-extrabold text-[#211704]">{item}</h2>
              <p className="mt-2 text-xs leading-5 text-[#60481f]">
                {page.cards[index]?.[1] || "Follow this step to get a clearer result."}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[26px] bg-[#211704] p-5 text-white shadow-[0_20px_48px_rgba(33,23,4,0.18)] sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#dfff00]">
          Includes
        </p>
        <div className="mt-5 space-y-3">
          {page.highlights.map((item) => (
            <div key={item} className="rounded-2xl border border-white/12 bg-white/8 p-3 text-sm font-bold">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PanchangLayout({ page, config }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[28px] border border-[#eadcae] bg-[#fffdf8] p-5 shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-[#9a6f08]">
          Panchang details
        </p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {config.panels.map((item) => (
            <div key={item} className="rounded-[18px] border border-[#eadcae] bg-[#fff8dc] p-4">
              <h2 className="text-sm font-extrabold text-[#211704]">{item}</h2>
              <p className="mt-2 text-xs leading-5 text-[#60481f]">
                Use this timing factor to understand the quality of the day.
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[28px] bg-[#fbf8cc] p-5 text-[#211704] shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">
        <h2 className="text-xl font-extrabold">How to use {page.title}</h2>
        <div className="mt-5 space-y-3">
          {page.cards.map(([title, body]) => (
            <div key={title} className="rounded-2xl bg-white/70 p-4">
              <p className="text-sm font-extrabold">{title}</p>
              <p className="mt-1 text-xs leading-5 text-[#60481f]">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuidanceLayout({ page, config }) {
  return (
    <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="rounded-[28px] border border-[#eadcae] bg-white/92 p-5 shadow-[0_18px_42px_rgba(107,82,12,0.13)] sm:p-6">
        <span className={`inline-flex rounded-full px-3 py-2 text-xs font-black ${config.accent}`}>
          {config.label}
        </span>
        <h2 className="mt-5 text-2xl font-extrabold text-[#211704]">
          A focused page for {page.title.toLowerCase()}
        </h2>
        <p className="mt-3 text-sm leading-7 text-[#60481f]">{page.description}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {page.cards.map(([title, body], index) => (
          <article key={title} className="rounded-[22px] border border-[#eadcae] bg-[#fffdf8] p-5 shadow-[0_14px_32px_rgba(94,70,12,0.10)]">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fbf8cc] text-xs font-black text-[#8a6106] ring-1 ring-[#d8ce76]">
              0{index + 1}
            </span>
            <h2 className="mt-4 text-base font-extrabold text-[#1d1607]">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-[#60481f]">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function ServiceInnerPage({ page, slug, category }) {
  const router = useRouter();
  const config = categoryConfig[category];
  const Layout =
    category === "consultation"
      ? ConsultationLayout
      : category === "horoscope"
        ? HoroscopeLayout
        : category === "panchang"
          ? PanchangLayout
          : category === "guidance" || category === "intuitive"
            ? GuidanceLayout
            : ToolLayout;

  if (!page) {
    return null;
  }

  return (
    <PublicPageLayout
      eyebrow={page.eyebrow}
      title={page.title}
      description={page.description}
      actions={
        <button
          onClick={() => router.push(page.ctaRoute)}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#dfff00] px-6 py-3 text-sm font-bold text-[#312d1e] shadow-[0_16px_30px_rgba(151,165,0,0.18)] transition hover:bg-[#cdf000]"
        >
          {page.cta} →
        </button>
      }
    >
      <Layout page={page} config={config} slug={slug} />
      <DetailGrid config={config} />
    </PublicPageLayout>
  );
}

export async function getStaticPaths() {
  return {
    paths: serviceSlugs.map((slug) => ({ params: { slug } })),
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const page = servicePages[slug] || null;

  return {
    props: {
      page,
      slug,
      category: getCategory(slug),
    },
  };
}
