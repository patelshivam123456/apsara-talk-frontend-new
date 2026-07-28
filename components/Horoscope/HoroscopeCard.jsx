"use client";

export default function HoroscopeCard({
  sign,
  active,
  disabled,
  onSelect,
  theme = "public",
}) {
  const isAstrologer = theme === "astrologer";

  return (
    <button
      type="button"
      onClick={() => onSelect(sign)}
      disabled={disabled}
      aria-label={`Select ${sign.englishName} horoscope`}
      aria-pressed={active}
      className={`group flex min-w-[78px] flex-col items-center justify-start gap-2 rounded-xl border border-transparent px-2 py-1.5 text-center transition focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 ${
        active
          ? "scale-[1.04] border-[#dfff00]/55 bg-white/8"
          : isAstrologer
            ? "hover:border-[#c49a00]/45 hover:bg-white/10"
            : "hover:border-[#dfff00]/35 hover:bg-white/8"
      } ${
        isAstrologer
          ? "focus:ring-[#d8a84a]/25"
          : "focus:ring-[#dfff00]/35"
      }`}
    >
      <span
        className={`grid h-12 w-12 place-items-center rounded-[15px] bg-linear-to-br ${sign.gradient} text-[1.65rem] leading-none text-white shadow-[0_12px_24px_rgba(0,0,0,0.32)] ring-1 ring-white/10 transition group-hover:-translate-y-0.5 sm:h-[52px] sm:w-[52px]`}
      >
        {sign.symbol}
      </span>
      <span className="min-w-0">
        <span className="block max-w-[82px] truncate text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#fff9de] [text-shadow:0_1px_4px_rgba(0,0,0,0.5)]">
          {sign.name}
        </span>
        <span className="sr-only">
          {sign.englishName}
        </span>
      </span>
    </button>
  );
}
