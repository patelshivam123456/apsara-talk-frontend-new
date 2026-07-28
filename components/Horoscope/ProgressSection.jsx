"use client";

import { percentageFields } from "@/components/Horoscope/horoscopeData";

function toPercent(value) {
  const match = String(value ?? "").match(/\d+/);
  const number = match ? Number(match[0]) : 0;
  return Math.max(0, Math.min(100, number));
}

export default function ProgressSection({ percentages = {} }) {
  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
        Horoscope Percentage
      </p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {percentageFields.map((field) => {
          const value = toPercent(percentages[field]);

          return (
            <div key={field}>
              <div className="mb-2 flex items-center justify-between text-xs font-bold">
                <span className="capitalize text-[#211704]">{field}</span>
                <span className="text-[#8a6106]">{value}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-[#efe6a5]">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#c49a00] via-[#dfff00] to-[#73c000] transition-all duration-700"
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
