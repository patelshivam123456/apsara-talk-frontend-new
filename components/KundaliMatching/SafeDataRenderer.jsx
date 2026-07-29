"use client";

function formatLabel(label) {
  return String(label).replace(/_/g, " ");
}

const hiddenKeys = new Set(["status", "message", "code"]);

export default function SafeDataRenderer({ data, emptyText = "No data available." }) {
  if (data === null || data === undefined || data === "") {
    return (
      <div className="rounded-xl border border-dashed border-[#d8a84a]/60 bg-[#fffdf2] p-5 text-sm font-semibold text-[#6f5930]">
        {emptyText}
      </div>
    );
  }

  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return (
      <div className="rounded-xl border border-[#eadcae] bg-white p-4 text-sm font-semibold leading-6 text-[#211704]">
        {String(data)}
      </div>
    );
  }

  if (Array.isArray(data)) {
    if (!data.length) {
      return (
        <div className="rounded-xl border border-dashed border-[#d8a84a]/60 bg-[#fffdf2] p-5 text-sm font-semibold text-[#6f5930]">
          {emptyText}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="rounded-xl border border-[#eadcae] bg-white p-4">
            <SafeDataRenderer data={item} emptyText={emptyText} />
          </div>
        ))}
      </div>
    );
  }

  const entries = Object.entries(data).filter(
    ([key]) => !hiddenKeys.has(String(key).toLowerCase()),
  );

  if (!entries.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#d8a84a]/60 bg-[#fffdf2] p-5 text-sm font-semibold text-[#6f5930]">
        {emptyText}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {entries.map(([key, value]) => (
        <article
          key={key}
          className="rounded-xl border border-[#eadcae] bg-white/95 p-4 shadow-sm"
        >
          <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#8a6106]">
            {formatLabel(key)}
          </p>
          <div className="mt-2">
            {value && typeof value === "object" ? (
              <SafeDataRenderer data={value} emptyText={emptyText} />
            ) : (
              <p className="break-words text-sm font-semibold leading-6 text-[#211704]">
                {String(value ?? "No data available.")}
              </p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
