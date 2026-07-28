"use client";

import { useState } from "react";
import AstroInfoGrid from "@/components/AstroProfile/AstroInfoGrid";
import PayaCard from "@/components/AstroProfile/PayaCard";

function pick(source, keys) {
  for (const key of keys) {
    if (source?.[key] !== undefined && source?.[key] !== null) {
      return source[key];
    }
  }

  return "";
}

function formatDate(birth = {}) {
  return [birth.day, birth.month, birth.year].filter(Boolean).join("-");
}

function formatTime(birth = {}) {
  return [birth.hour, birth.min, birth.sec].filter(Boolean).join(":");
}

function getDivinePayload(result) {
  const divine = result?.data?.divine || result?.divine || {};
  return divine?.data || divine || {};
}

function getAstrologyPayload(result) {
  return result?.data?.astrology || result?.astrology;
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

function DivineTab({ result, birth }) {
  const divine = getDivinePayload(result);
  const paya = divine.paya || divine.paya_details || divine.payaDetails;

  const personalItems = [
    ["Full Name", pick(divine, ["fullName", "full_name", "name"]) || birth.fullName],
    ["Gender", pick(divine, ["gender"]) || birth.gender],
    ["Birth Date", pick(divine, ["birth_date", "birthDate", "dob"]) || formatDate(birth)],
    ["Birth Time", pick(divine, ["birth_time", "birthTime", "time"]) || formatTime(birth)],
    ["Birth Place", pick(divine, ["birth_place", "birthPlace", "place"]) || birth.place],
  ];

  const astronomicalItems = [
    ["Sunrise", pick(divine, ["sunrise", "sun_rise", "sunRise"])],
    ["Sunset", pick(divine, ["sunset", "sun_set", "sunSet"])],
    ["Timezone", pick(divine, ["timezone", "timezoneId", "time_zone"]) || birth.timezoneId],
    ["Latitude", pick(divine, ["latitude", "lat"]) || birth.lat],
    ["Longitude", pick(divine, ["longitude", "lon", "lng"]) || birth.lon],
    ["Ayanamsha", pick(divine, ["ayanamsha", "ayanamsa"])],
  ];

  const horoscopeItems = [
    ["Tithi", pick(divine, ["tithi"])],
    ["Paksha", pick(divine, ["paksha"])],
    ["Sunsign", pick(divine, ["sunsign", "sun_sign", "sunSign"])],
    ["Moonsign", pick(divine, ["moonsign", "moon_sign", "moonSign"])],
    ["Rashi Akshar", pick(divine, ["rashi_akshar", "rashiAkshar"])],
    ["Chandramasa", pick(divine, ["chandramasa", "chandra_masa"])],
    ["Nakshatra", pick(divine, ["nakshatra"])],
    ["Vaar", pick(divine, ["vaar", "vara"])],
    ["Yoga", pick(divine, ["yoga"])],
    ["Karana", pick(divine, ["karana"])],
  ];

  const characteristicsItems = [
    ["Varna", pick(divine, ["varna"])],
    ["Vashya", pick(divine, ["vashya"])],
    ["Yoni", pick(divine, ["yoni"])],
    ["Gana", pick(divine, ["gana"])],
    ["Nadi", pick(divine, ["nadi"])],
    ["Tatva", pick(divine, ["tatva", "tattva"])],
    ["Prahar", pick(divine, ["prahar"])],
    ["Yunja", pick(divine, ["yunja", "yuja"])],
  ];

  return (
    <div className="space-y-5">
      <AstroInfoGrid title="Personal Details" items={personalItems} />
      <AstroInfoGrid title="Astronomical Details" items={astronomicalItems} />
      <AstroInfoGrid title="Horoscope Details" items={horoscopeItems} />
      <AstroInfoGrid title="Birth Characteristics" items={characteristicsItems} />
      <PayaCard paya={paya} />
    </div>
  );
}

export default function AstroTabs({ result, birth }) {
  const [activeTab, setActiveTab] = useState("Astrology");
  const astrology = getAstrologyPayload(result);

  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/94 p-4 text-[#211704] shadow-lg sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
            Astro Profile Result
          </p>
          <h2 className="mt-1 text-xl font-extrabold">
            {birth?.fullName || "Basic Astro Details"}
          </h2>
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
          <DivineTab result={result} birth={birth || {}} />
        )}
      </div>
    </section>
  );
}
