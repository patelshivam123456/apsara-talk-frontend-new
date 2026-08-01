import { rowOrder } from "../Lushu-grid/constants";
import { formatList } from "../Lushu-grid/helpers";

function getGridRows(grid = {}) {
  return rowOrder.map(([rowKey, rowLabel]) => [
    rowKey,
    rowLabel,
    Array.isArray(grid[rowKey]) ? grid[rowKey] : ["", "", ""],
  ]);
}

export default function PythorasGridPage({ pythorasResult }) {
  const countEntries = pythorasResult?.counts
    ? Object.entries(pythorasResult.counts)
    : [];
  const gridRows = getGridRows(pythorasResult?.grid);
  const summaryCards = [
    {
      label: "Date of Birth",
      value: pythorasResult?.dob,
      detail: "Source date used for numerology calculation",
    },
    {
      label: "Personality Number",
      value: pythorasResult?.driverNumber,
      detail: pythorasResult?.driverAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
    {
      label: "Destiny Number",
      value: pythorasResult?.destinyNumber,
      detail: pythorasResult?.destinyAddedToGrid
        ? "Added to grid"
        : "Not added to grid",
    },
  ];
  const detailCards = [
    ["Name Number", pythorasResult?.nameNumber],
    ["Running Age", pythorasResult?.runningAge],
    ["Missing Numbers", formatList(pythorasResult?.missingNumbers)],
    ["Repeated Numbers", formatList(pythorasResult?.repeatedNumbers)],
  ];
  const challengeNumber = pythorasResult?.challengeNumber || {};
  const pinnacleNumber = pythorasResult?.pinnacleNumber || {};
  const challengeEntries = [
    {
      label: "Challenge One",
      value: challengeNumber.firstChallengeNumber,
      detail: challengeNumber.firstChallengeTimePeriod,
    },
    {
      label: "Challenge Two",
      value: challengeNumber.secondChallengeNumber,
      detail: challengeNumber.secondChallengeTimePeriod,
    },
    {
      label: "Challenge Three",
      value: challengeNumber.thirdChallengeNumber,
      detail: challengeNumber.thirdChallengeTimePeriod,
    },
    {
      label: "Challenge Four",
      value: challengeNumber.fourthChallengeNumber,
      detail: challengeNumber.fourthChallengeTimePeriod,
    },
  ];
  const pinnacleEntries = [
    {
      label: "Pinnacle One",
      value: pinnacleNumber.firstPinnacleNumber,
      detail: pinnacleNumber.firstChallengeTimePeriod,
    },
    {
      label: "Pinnacle Two",
      value: pinnacleNumber.secondPinnacleNumber,
      detail: pinnacleNumber.secondChallengeTimePeriod,
    },
    {
      label: "Pinnacle Three",
      value: pinnacleNumber.thirdPinnacleNumber,
      detail: pinnacleNumber.thirdChallengeTimePeriod,
    },
    {
      label: "Pinnacle Four",
      value: pinnacleNumber.fourthPinnacleNumber,
      detail: pinnacleNumber.fourthChallengeTimePeriod,
    },
  ];

  return (
    <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-[0.85fr_1fr]">
      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          {summaryCards.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-2.5 transition-all duration-200 hover:scale-[1.01]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#8a6106]">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-[#211704]">
                {item.value ?? "-"}
              </p>
              <p className="mt-0.5 text-xs text-[#665d4d]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {detailCards.map(([label, value]) => (
            <div
              key={label}
              className="astro-dark-surface rounded-xl border border-white/10 bg-[#17112f] p-2.5 transition-all duration-200 hover:scale-[1.01]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                {label}
              </p>
              <p className="mt-2 text-base font-semibold text-white">
                {value ?? "-"}
              </p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-[#d8a84a]/40 bg-[#fff8ee] p-3 transition-all duration-200 hover:scale-[1.01]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#211704]">
              Number Counts
            </h3>
            <span className="rounded-full border border-[#d8a84a]/40 bg-[#fdefd4] px-3 py-1 text-xs text-[#8a6106]">
              1 to 9
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-9 lg:grid-cols-3">
            {countEntries.map(([number, count]) => (
              <div
                key={number}
                className="astro-dark-surface rounded-md border border-white/10 bg-[#10162f] px-1.5 py-1 text-center transition-all duration-200 hover:scale-[1.01]"
              >
                <p className="text-xs text-gray-400">No. {number}</p>
                <p className="text-sm font-semibold text-white md:text-base">
                  {count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="astro-dark-surface rounded-xl border border-white/10 bg-[#090d22]/80 p-3 transition-all duration-200 hover:scale-[1.01]">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
              Grid placement
            </p>
            <h3 className="mt-1 text-lg font-semibold text-white">
              Pythagoras Grid
            </h3>
          </div>
          <span className="rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
            Astrologer view
          </span>
        </div>

        <div className="mx-auto grid aspect-square w-full max-w-[320px] grid-rows-3 overflow-hidden rounded-2xl border border-[#d8a84a]/60 shadow-[inset_0_0_48px_rgba(216,168,74,0.12)]">
          {gridRows.map(([rowKey, , values]) => (
            <div key={rowKey} className="grid grid-cols-3">
              {values.map((value, index) => (
                <div
                  key={`${rowKey}-${index}`}
                  className="flex items-center justify-center border border-[#d8a84a]/45"
                >
                  <span
                    className={`text-2xl font-bold ${
                      value ? "text-[#f0c040]" : "text-white/20"
                    }`}
                  >
                    {value || "-"}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
          {gridRows.map(([rowKey, rowLabel, values]) => (
            <div
              key={rowKey}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-2 transition-all duration-200 hover:scale-[1.01]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                {rowLabel}
              </p>
              <p className="mt-1 text-xs font-semibold leading-5 text-white">
                {values.map((value) => value || "Empty").join(" / ")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {challengeEntries.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {challengeEntries.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-2.5 transition-all duration-200 hover:scale-[1.01]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#8a6106]">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-[#211704]">
                {item.value ?? "-"}
              </p>
              <p className="mt-0.5 text-xs text-[#665d4d]">
                Challenge Time Period: {item.detail ?? "-"}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      {pinnacleEntries.length ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
          {pinnacleEntries.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#d8a84a]/40 bg-[#fff8ee] p-2.5 transition-all duration-200 hover:scale-[1.01]"
            >
              <p className="text-xs uppercase tracking-[0.14em] text-[#8a6106]">
                {item.label}
              </p>
              <p className="mt-1 text-lg font-bold text-[#211704]">
                {item.value ?? "-"}
              </p>
              <p className="mt-0.5 text-xs text-[#665d4d]">
                Challenge Time Period: {item.detail ?? "-"}
              </p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
