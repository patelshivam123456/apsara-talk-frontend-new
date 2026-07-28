"use client";

function ValueCard({ label, value }) {
  const isNested = value && typeof value === "object";

  return (
    <article className="rounded-xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
        {label}
      </p>
      {isNested ? (
        <pre className="mt-3 max-h-56 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-[#211704] p-3 text-xs leading-5 text-[#fff8ee]">
          {JSON.stringify(value, null, 2)}
        </pre>
      ) : (
        <p className="mt-2 break-words text-sm font-semibold text-[#211704]">
          {String(value ?? "N/A")}
        </p>
      )}
    </article>
  );
}

export default function AstrologyTab({ astrology }) {
  if (!astrology || (typeof astrology === "object" && !Object.keys(astrology).length)) {
    return (
      <div className="rounded-xl border border-dashed border-[#d8a84a]/60 bg-[#fffdf2] p-5 text-sm font-semibold text-[#6f5930]">
        No Astrology Data Available
      </div>
    );
  }

  if (typeof astrology !== "object" || Array.isArray(astrology)) {
    return (
      <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-[#211704] p-4 text-xs leading-5 text-[#fff8ee]">
        {JSON.stringify(astrology, null, 2)}
      </pre>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Object.entries(astrology).map(([key, value]) => (
        <ValueCard key={key} label={key.replace(/_/g, " ")} value={value} />
      ))}
    </div>
  );
}
