import { useEffect, useMemo, useRef } from "react";

function formatChartDate(value) {
  if (!value) {
    return "-";
  }

  const separator = String(value).includes("/") ? "/" : "-";
  const parts = String(value).split(separator);

  if (parts.length !== 3) {
    return value;
  }

  const [first, second, third] = parts;
  const [day, month, year] =
    first.length === 4 ? [third, second, first] : [first, second, third];

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

function formatDateInputValue(value) {
  if (!value) {
    return "";
  }

  const separator = String(value).includes("/") ? "/" : "-";
  const parts = String(value).split(separator);

  if (parts.length !== 3) {
    return "";
  }

  const [first, second, third] = parts;
  const [day, month, year] =
    first.length === 4 ? [third, second, first] : [first, second, third];

  if (!year || !month || !day) {
    return "";
  }

  return `${year}-${month}-${day}`;
}

function parseChartDate(value) {
  if (!value) {
    return null;
  }

  const separator = String(value).includes("/") ? "/" : "-";
  const parts = String(value).split(separator);

  if (parts.length !== 3) {
    return null;
  }

  const [first, second, third] = parts;
  const [day, month, year] =
    first.length === 4 ? [third, second, first] : [first, second, third];
  const date = new Date(Number(year), Number(month) - 1, Number(day));

  if (
    date.getFullYear() !== Number(year) ||
    date.getMonth() !== Number(month) - 1 ||
    date.getDate() !== Number(day)
  ) {
    return null;
  }

  return date;
}

function addYears(date, years) {
  const nextDate = new Date(date);
  nextDate.setFullYear(nextDate.getFullYear() + years);
  return nextDate;
}

function getRowTimestamp(row, key, fallbackDateKey) {
  return row[key] ?? parseChartDate(row[fallbackDateKey])?.getTime();
}

export default function MahadashaAntardashaChart({
  dashaRows = [],
  dashaFromDate,
  setDashaFromDate,
  dashaToDate,
  setDashaToDate,
  dashaCalculationApi,
  isSubmitting,
  maxDashaInputDate,
  vedicDob,
}) {
  const dashaScrollRef = useRef(null);
  const dashaHeaderRef = useRef(null);
  const dashaScrollTargetRef = useRef(null);
  const today = useMemo(() => new Date(), []);
  const fiveYearsBeforeToday = useMemo(() => addYears(today, -5), [today]);
  const fiveYearsAfterToday = useMemo(() => addYears(today, 5), [today]);
  const vedicDobInputDate = formatDateInputValue(vedicDob);

  const currentDashaRowId = useMemo(() => {
    const todayTimestamp = today.getTime();

    return dashaRows.find((row) => {
      const startTimestamp = getRowTimestamp(
        row,
        "startTimestamp",
        "fromDate",
      );
      const endTimestamp = getRowTimestamp(row, "endTimestamp", "toDate");

      return (
        Number.isFinite(startTimestamp) &&
        Number.isFinite(endTimestamp) &&
        startTimestamp <= todayTimestamp &&
        endTimestamp >= todayTimestamp
      );
    })?.id;
  }, [dashaRows, today]);

  const currentDashaRowIndex = useMemo(
    () => dashaRows.findIndex((row) => row.id === currentDashaRowId),
    [currentDashaRowId, dashaRows],
  );

  const dashaScrollTargetIndex = useMemo(() => {
    if (currentDashaRowIndex >= 0) {
      return currentDashaRowIndex;
    }

    const windowStartTimestamp = fiveYearsBeforeToday.getTime();
    const firstWindowRowIndex = dashaRows.findIndex((row) => {
      const endTimestamp = getRowTimestamp(row, "endTimestamp", "toDate");

      return (
        Number.isFinite(endTimestamp) &&
        endTimestamp >= windowStartTimestamp
      );
    });

    return firstWindowRowIndex >= 0 ? firstWindowRowIndex : 0;
  }, [currentDashaRowIndex, dashaRows, fiveYearsBeforeToday]);

  const isNearCurrentDateWindow = (row) => {
    const startTimestamp = getRowTimestamp(row, "startTimestamp", "fromDate");
    const endTimestamp = getRowTimestamp(row, "endTimestamp", "toDate");

    return (
      Number.isFinite(startTimestamp) &&
      Number.isFinite(endTimestamp) &&
      startTimestamp <= fiveYearsAfterToday.getTime() &&
      endTimestamp >= fiveYearsBeforeToday.getTime()
    );
  };

  useEffect(() => {
    if (!dashaScrollRef.current || !dashaScrollTargetRef.current) {
      return;
    }

    const scrollArea = dashaScrollRef.current;
    const targetRow = dashaScrollTargetRef.current;
    const headerHeight = dashaHeaderRef.current?.offsetHeight || 0;

    scrollArea.scrollTo({
      top: Math.max(targetRow.offsetTop - headerHeight, 0),
      behavior: "auto",
    });
  }, [dashaRows.length, dashaScrollTargetIndex]);

  return (
    <div className="overflow-hidden rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-2 text-[#111]">
      <div className="rounded-md border border-[#d8a84a]/30 bg-[#fff8ee] p-2.5 text-[#211704]">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
          Mahadasha & Antardasha
        </h3>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end lg:grid-cols-1 xl:grid-cols-[1fr_1fr_auto]">
          <div>
            <label
              htmlFor="vedic-dasha-from-date"
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a6106]"
            >
              From Date
            </label>
            <input
              id="vedic-dasha-from-date"
              type="date"
              min={vedicDobInputDate || undefined}
              max={dashaToDate || maxDashaInputDate}
              value={dashaFromDate}
              onChange={(event) => setDashaFromDate(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#d8a84a]/50 bg-white px-2.5 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
            />
          </div>
          <div>
            <label
              htmlFor="vedic-dasha-to-date"
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a6106]"
            >
              To Date
            </label>
            <input
              id="vedic-dasha-to-date"
              type="date"
              min={dashaFromDate}
              max={maxDashaInputDate}
              value={dashaToDate}
              onChange={(event) => setDashaToDate(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#d8a84a]/50 bg-white px-2.5 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
            />
          </div>
          <button
            type="button"
            onClick={() => dashaCalculationApi()}
            disabled={isSubmitting || !dashaFromDate || !dashaToDate}
            className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {isSubmitting ? "Generating..." : "Submit"}
          </button>
        </div>
      </div>

      <div ref={dashaScrollRef} className="mt-3 max-h-[360px] overflow-auto">
        <table className="w-full min-w-[250px] border-collapse text-center text-[13px] font-bold leading-tight">
          <thead ref={dashaHeaderRef} className="sticky top-0 z-10">
            <tr>
              <th
                colSpan="4"
                className="rounded-t-md border border-[#333] bg-[#dfff3a] px-2 py-1 text-base leading-tight text-[#0d4d0c]"
              >
                Mahadasha & Antardasha
                <br />
                Chart
              </th>
            </tr>
            <tr>
              <th
                colSpan="2"
                className="border border-[#333] bg-[#ffd957] px-2 py-2"
              >
                Date
              </th>
              <th
                rowSpan="2"
                className="border border-[#333] bg-[#ffd957] px-1 py-2"
              >
                Maha
                <br />
                Dasha
              </th>
              <th
                rowSpan="2"
                className="border border-[#333] bg-[#ffd957] px-1 py-2"
              >
                Antar
                <br />
                Dasha
              </th>
            </tr>
            <tr>
              <th className="border border-[#333] bg-[#ffffce] px-2 py-2">
                From
              </th>
              <th className="border border-[#333] bg-[#ffffce] px-2 py-2">
                To
              </th>
            </tr>
          </thead>
          <tbody>
            {dashaRows.length ? (
              dashaRows.map((item, index) => {
                const isCurrentRow = item.id === currentDashaRowId;
                const isNearDateWindow = isNearCurrentDateWindow(item);
                const rowBackground = isCurrentRow
                  ? "bg-[#dcffb8]"
                  : isNearDateWindow
                    ? "bg-[#fff9d9]"
                    : "bg-[#f7f7f7]";
                const dateCellClassName = [
                  "break-words border border-[#333] px-2 py-2",
                  rowBackground,
                ].join(" ");
                const numberCellClassName = [
                  "border border-[#333] px-2 py-2",
                  rowBackground,
                ].join(" ");

                return (
                  <tr
                    key={item.id}
                    ref={
                      index === dashaScrollTargetIndex
                        ? dashaScrollTargetRef
                        : null
                    }
                    className={
                      isCurrentRow ? "outline outline-2 outline-[#2f8f11]" : ""
                    }
                  >
                    <td className={dateCellClassName}>
                      {formatChartDate(item.fromDate)}
                    </td>
                    <td className={dateCellClassName}>
                      {formatChartDate(item.toDate)}
                    </td>
                    <td className={numberCellClassName}>
                      {item.mahadashaNumber ?? "-"}
                    </td>
                    <td className={`${numberCellClassName} text-[#006d22]`}>
                      {item.antardashaNumber ?? "-"}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-[#333] bg-[#f7f7f7] px-2 py-4"
                >
                  No Dasha data is available for the selected date range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
