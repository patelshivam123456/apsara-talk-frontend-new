"use client";

import { useMemo, useState } from "react";
import LuckyCard from "@/components/Horoscope/LuckyCard";
import PredictionCard from "@/components/Horoscope/PredictionCard";
import ProgressSection from "@/components/Horoscope/ProgressSection";
import { predictionFields } from "@/components/Horoscope/horoscopeData";

function titleize(value) {
  return String(value || "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function pick(source, keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return "";
}

function parseLuckItems(items = []) {
  return items.reduce((acc, item) => {
    const [rawLabel, ...rest] = String(item).split(":");
    const label = rawLabel.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (!value) {
      return acc;
    }

    if (label.includes("color")) {
      acc.luckyColors = value;
    } else if (label.includes("number")) {
      acc.luckyNumbers = value;
    } else if (label.includes("alphabet")) {
      acc.luckyAlphabets = value;
    } else if (label.includes("cosmic")) {
      acc.cosmicTip = value;
    } else if (label.includes("single")) {
      acc.tipsForSingles = value;
    } else if (label.includes("couple")) {
      acc.tipsForCouples = value;
    }

    return acc;
  }, {});
}

function getDivinePayload(result) {
  const divine = result?.data?.divine || result?.divine || {};
  return divine?.data || divine || {};
}

function getAstrologyPayload(result) {
  return result?.data?.astrology || result?.astrology;
}

function getPredictionSource(divine) {
  return (
    divine.prediction ||
    divine.weekly_horoscope ||
    divine.monthly_horoscope ||
    divine.yearly_horoscope ||
    divine.predictions ||
    divine.horoscope ||
    {}
  );
}

function getPeriodLabel(divine) {
  return pick(divine, [
    "date",
    "week",
    "month",
    "year",
    "prediction_date",
    "horoscope_date",
  ]);
}

function AstrologyTab({ astrology }) {
  if (!astrology || astrology === "NA") {
    return (
      <div className="rounded-xl border border-dashed border-[#d8a84a]/60 bg-[#fffdf2] p-5 text-sm font-semibold text-[#6f5930]">
        No Astrology Data Available
      </div>
    );
  }

  return (
    <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#211704] p-4 text-xs leading-5 text-[#fff8ee]">
      {JSON.stringify(astrology, null, 2)}
    </pre>
  );
}

function DivineTab({ result, sign }) {
  const [activePredictionTab, setActivePredictionTab] = useState("personal");
  const divine = useMemo(() => getDivinePayload(result), [result]);
  const special = divine.special || {};
  const predictionSource = getPredictionSource(divine);
  const luckItems = parseLuckItems(predictionSource.luck || divine.luck || []);
  const percentages =
    special.horoscope_percentage ||
    special.horoscopePercentage ||
    divine.percentage ||
    divine.percentages ||
    divine.horoscope_percentage ||
    divine.horoscopePercentage ||
    {};
  const periodLabel = getPeriodLabel(divine) || "Horoscope";

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-[#eadcae] bg-[#fffdf2] p-4 shadow-sm">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
          {titleize(sign)}
        </p>
        <h2 className="mt-1 text-2xl font-extrabold text-[#211704]">
          {periodLabel}
        </h2>
      </section>

      <section className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
        <div className="flex gap-2 overflow-x-auto rounded-xl border border-[#eadcae] bg-[#fffdf6] p-1">
          {predictionFields.map((field) => (
            <button
              key={field}
              type="button"
              onClick={() => setActivePredictionTab(field)}
              className={`h-10 shrink-0 rounded-lg px-4 text-xs font-extrabold uppercase tracking-[0.08em] transition ${
                activePredictionTab === field
                  ? "bg-[#c9a227] text-[#211704] shadow-sm"
                  : "text-[#6f5930] hover:bg-[#fbf8cc]"
              }`}
            >
              {titleize(field)}
            </button>
          ))}
        </div>
        <div className="mt-4">
          <PredictionCard
            title={titleize(activePredictionTab)}
            value={pick(predictionSource, [
              activePredictionTab,
              `${activePredictionTab}_prediction`,
              `${activePredictionTab}Prediction`,
            ])}
          />
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <LuckyCard
          title="Lucky Colors"
          value={
            special.lucky_color_codes ||
            special.luckyColorCodes ||
            luckItems.luckyColors ||
            pick(divine, ["lucky_colors", "luckyColors", "lucky_color"])
          }
          colors
        />
        <LuckyCard
          title="Lucky Numbers"
          value={
            luckItems.luckyNumbers ||
            pick(divine, ["lucky_numbers", "luckyNumbers", "lucky_number"])
          }
        />
        <LuckyCard
          title="Lucky Alphabets"
          value={
            luckItems.luckyAlphabets ||
            pick(divine, ["lucky_alphabets", "luckyAlphabets"])
          }
        />
        <LuckyCard
          title="Cosmic Tip"
          value={luckItems.cosmicTip || pick(divine, ["cosmic_tip", "cosmicTip", "tip"])}
        />
        <LuckyCard
          title="Tips for Singles"
          value={
            luckItems.tipsForSingles ||
            pick(divine, ["tips_for_singles", "tipsForSingles", "single_tip"])
          }
        />
        <LuckyCard
          title="Tips for Couples"
          value={
            luckItems.tipsForCouples ||
            pick(divine, ["tips_for_couples", "tipsForCouples", "couple_tip"])
          }
        />
      </section>

      <ProgressSection percentages={percentages} />
    </div>
  );
}

export default function HoroscopeTabs({ result, sign }) {
  const [activeTab, setActiveTab] = useState("Astrology");
  const astrology = getAstrologyPayload(result);

  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/94 p-4 text-[#211704] shadow-lg sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
            Horoscope Result
          </p>
          <h2 className="mt-1 text-xl font-extrabold">{titleize(sign)}</h2>
        </div>
        <div className="grid grid-cols-2 rounded-xl border border-[#eadcae] bg-[#fffdf6] p-1">
          {["Astrology", "Divine"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`h-10 rounded-lg px-4 text-sm font-bold transition ${
                activeTab === tab
                  ? "bg-[#c9a227] text-[#211704] shadow-sm"
                  : "text-[#6f5930] hover:bg-[#fbf8cc]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5">
        {activeTab === "Astrology" ? (
          <AstrologyTab astrology={astrology} />
        ) : (
          <DivineTab result={result} sign={sign} />
        )}
      </div>
    </section>
  );
}
