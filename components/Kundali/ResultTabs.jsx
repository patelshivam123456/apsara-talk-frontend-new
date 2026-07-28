"use client";

import { useState } from "react";
import AstrologyTab from "@/components/Kundali/AstrologyTab";
import DivineTab from "@/components/Kundali/DivineTab";

const tabs = ["Astrology", "Divine"];

export default function ResultTabs({ result, theme = "public" }) {
  const [activeTab, setActiveTab] = useState("Astrology");
  const isAstrologer = theme === "astrologer";
  const data = result?.data || {};

  return (
    <section
      className={`rounded-2xl border p-4 shadow-lg sm:p-5 ${
        isAstrologer
          ? "border-[#d8a84a]/45 bg-[#fff8ee] text-[#211704]"
          : "border-[#eadcae] bg-white/94 text-[#211704]"
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
            Generated Result
          </p>
          <h2 className="mt-1 text-xl font-extrabold">Kundali PDF Details</h2>
        </div>
        <div className="grid grid-cols-2 rounded-xl border border-[#eadcae] bg-[#fffdf6] p-1">
          {tabs.map((tab) => (
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
          <AstrologyTab astrology={data.astrology} />
        ) : (
          <DivineTab divine={data.divine} />
        )}
      </div>
    </section>
  );
}
