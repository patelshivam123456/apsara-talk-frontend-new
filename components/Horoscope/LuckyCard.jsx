"use client";

import ColorSwatch from "@/components/Horoscope/ColorSwatch";

function normalizeList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean).map(String);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function LuckyCard({ title, value, colors = false }) {
  const items = normalizeList(value);

  return (
    <article className="rounded-2xl border border-[#eadcae] bg-[#fffdf2] p-4 shadow-sm">
      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
        {title}
      </p>
      {colors && items.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <ColorSwatch key={item} color={item} />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm font-semibold leading-6 text-[#211704]">
          {items.length ? items.join(", ") : value || "Not available"}
        </p>
      )}
    </article>
  );
}
