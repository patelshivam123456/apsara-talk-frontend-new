"use client";

const chartStyles = [
  "NORTH_INDIAN",
  "SOUTH_INDIAN",
  "EAST_INDIAN",
  "WEST_INDIAN",
];

const optionRows = [
  ["ashtakoot", "Ashtakoot", "Include Ashtakoot matching analysis"],
  ["dashakoot", "Dashakoot", "Include Dashakoot matching analysis"],
  ["papasamyam", "Papasamyam", "Include Papasamyam analysis"],
];

function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(checked ? "false" : "true")}
      className={`relative h-7 w-12 rounded-full transition ${
        checked ? "bg-[#c9a227]" : "bg-[#d8d0b4]"
      }`}
    >
      <span
        className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

export default function MatchingOptions({
  chartStyle,
  options,
  errors,
  inputClass,
  onChartStyleChange,
  onOptionsChange,
}) {
  return (
    <section className="rounded-2xl border border-[#eadcae] bg-white/92 p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#8a6106]">
          Matching Options
        </p>
        <h3 className="mt-1 text-lg font-extrabold text-[#211704]">
          Report Configuration
        </h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <label
            htmlFor="matching-chart-style"
            className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6106]"
          >
            Chart Style
          </label>
          <select
            id="matching-chart-style"
            value={chartStyle}
            onChange={(event) => onChartStyleChange(event.target.value)}
            className={`mt-2 h-12 w-full rounded-xl border px-3 text-sm font-medium outline-none transition focus:ring-4 ${inputClass}`}
          >
            {chartStyles.map((style) => (
              <option key={style} value={style}>
                {style}
              </option>
            ))}
          </select>
          {errors.chartStyle && (
            <p className="mt-1.5 text-xs font-semibold text-red-600">
              {errors.chartStyle}
            </p>
          )}
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {optionRows.map(([key, label, description]) => (
            <div
              key={key}
              className="flex min-h-28 flex-col justify-between rounded-xl border border-[#eadcae] bg-[#fffdf6] p-3"
            >
              <div>
                <p className="text-sm font-bold text-[#211704]">{label}</p>
                <p className="mt-1 text-xs leading-5 text-[#665d4d]">
                  {description}
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#8a6106]">
                  {options[key] === "true" ? "ON" : "OFF"}
                </span>
                <Toggle
                  checked={options[key] === "true"}
                  onChange={(value) =>
                    onOptionsChange({ ...options, [key]: value })
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
