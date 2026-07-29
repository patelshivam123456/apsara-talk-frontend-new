import { useEffect, useMemo, useRef, useState } from "react";

const windowYearSpan = 10;
const timelineEndYear = 2060;

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

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function getYearFromDate(value) {
  const date = value instanceof Date ? value : parseChartDate(value);
  return date ? date.getFullYear() : Number.NaN;
}

function getRowTimestamp(row, key, fallbackDateKey) {
  return row[key] ?? parseChartDate(row[fallbackDateKey])?.getTime();
}

export default function MahadashaAntardashaChart({
  dashaRows = [],
  vedicDob,
}) {
  const dashaScrollRef = useRef(null);
  const dashaHeaderRef = useRef(null);
  const dashaScrollTargetRef = useRef(null);
  const topSentinelRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const pendingScrollRestoreRef = useRef(null);
  const hasInitialScrolledRef = useRef(false);
  const today = useMemo(() => new Date(), []);
  const fiveYearsBeforeToday = useMemo(() => addYears(today, -5), [today]);
  const fiveYearsAfterToday = useMemo(() => addYears(today, 5), [today]);
  const dobYear = getYearFromDate(vedicDob);
  const minYear = Number.isFinite(dobYear) ? dobYear : 1900;
  const maxYear = timelineEndYear;
  const initialCenterYear = clamp(today.getFullYear(), minYear, maxYear);
  const initialStartYear = clamp(initialCenterYear - 5, minYear, maxYear);
  const initialEndYear = clamp(initialStartYear + windowYearSpan, minYear, maxYear);
  const [visibleYears, setVisibleYears] = useState({
    start: initialStartYear,
    end: initialEndYear,
  });
  const [timelineLoading, setTimelineLoading] = useState("");

  const visibleRows = useMemo(() => {
    const windowStart = new Date(visibleYears.start, 0, 1).getTime();
    const windowEnd = new Date(visibleYears.end, 11, 31, 23, 59, 59).getTime();

    return dashaRows.filter((row) => {
      const startTimestamp = getRowTimestamp(row, "startTimestamp", "fromDate");
      const endTimestamp = getRowTimestamp(row, "endTimestamp", "toDate");

      return (
        Number.isFinite(startTimestamp) &&
        Number.isFinite(endTimestamp) &&
        startTimestamp <= windowEnd &&
        endTimestamp >= windowStart
      );
    });
  }, [dashaRows, visibleYears]);

  const currentDashaRowId = useMemo(() => {
    const todayTimestamp = today.getTime();

    return visibleRows.find((row) => {
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
  }, [today, visibleRows]);

  const currentDashaRowIndex = useMemo(
    () => visibleRows.findIndex((row) => row.id === currentDashaRowId),
    [currentDashaRowId, visibleRows],
  );

  const dashaScrollTargetIndex = useMemo(() => {
    if (currentDashaRowIndex >= 0) {
      return currentDashaRowIndex;
    }

    const windowStartTimestamp = fiveYearsBeforeToday.getTime();
    const firstWindowRowIndex = visibleRows.findIndex((row) => {
      const endTimestamp = getRowTimestamp(row, "endTimestamp", "toDate");

      return (
        Number.isFinite(endTimestamp) &&
        endTimestamp >= windowStartTimestamp
      );
    });

    return firstWindowRowIndex >= 0 ? firstWindowRowIndex : 0;
  }, [currentDashaRowIndex, fiveYearsBeforeToday, visibleRows]);

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
    if (
      hasInitialScrolledRef.current ||
      !dashaScrollRef.current ||
      !dashaScrollTargetRef.current
    ) {
      return;
    }

    const scrollArea = dashaScrollRef.current;
    const targetRow = dashaScrollTargetRef.current;
    const headerHeight = dashaHeaderRef.current?.offsetHeight || 0;

    scrollArea.scrollTo({
      top: Math.max(targetRow.offsetTop - headerHeight, 0),
      behavior: "auto",
    });
    hasInitialScrolledRef.current = true;
  }, [dashaScrollTargetIndex, visibleRows.length]);

  useEffect(() => {
    if (!dashaScrollRef.current || !pendingScrollRestoreRef.current) {
      return;
    }

    const scrollArea = dashaScrollRef.current;
    const restore = pendingScrollRestoreRef.current;
    pendingScrollRestoreRef.current = null;

    scrollArea.scrollTop =
      scrollArea.scrollHeight - restore.previousScrollHeight + restore.previousScrollTop;
  }, [visibleRows.length]);

  useEffect(() => {
    const scrollArea = dashaScrollRef.current;

    if (!scrollArea || !dashaRows.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target === topSentinelRef.current && visibleYears.start > minYear) {
            pendingScrollRestoreRef.current = {
              previousScrollHeight: scrollArea.scrollHeight,
              previousScrollTop: scrollArea.scrollTop,
            };
            setTimelineLoading("previous");
            setVisibleYears((current) => ({
              ...current,
              start: clamp(current.start - 11, minYear, maxYear),
            }));
            window.setTimeout(() => setTimelineLoading(""), 160);
          }

          if (entry.target === bottomSentinelRef.current && visibleYears.end < maxYear) {
            setTimelineLoading("next");
            setVisibleYears((current) => ({
              ...current,
              end: clamp(current.end + 11, minYear, maxYear),
            }));
            window.setTimeout(() => setTimelineLoading(""), 160);
          }
        });
      },
      {
        root: scrollArea,
        rootMargin: "80px 0px",
        threshold: 0.01,
      },
    );

    if (topSentinelRef.current) {
      observer.observe(topSentinelRef.current);
    }

    if (bottomSentinelRef.current) {
      observer.observe(bottomSentinelRef.current);
    }

    return () => observer.disconnect();
  }, [dashaRows.length, maxYear, minYear, visibleYears]);

  return (
    <div className="overflow-hidden rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-2 text-[#111]">
      <div className="rounded-md border border-[#d8a84a]/30 bg-[#fff8ee] p-2.5 text-[#211704]">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
          Mahadasha & Antardasha
        </h3>
        <p className="mt-1 text-xs leading-5 text-[#665d4d]">
          Showing {visibleYears.start} to {visibleYears.end}. Scroll to browse
          the complete DOB to 31/12/2060 timeline.
        </p>
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
            {visibleRows.length ? (
              <>
                <tr ref={topSentinelRef}>
                  <td
                    colSpan="4"
                    className="border border-[#333] bg-[#fffed5] px-2 py-1 text-xs text-[#8a6106]"
                  >
                    {timelineLoading === "previous"
                      ? "Loading previous records..."
                      : visibleYears.start <= minYear
                        ? "Beginning of Dasha timeline"
                        : ""}
                  </td>
                </tr>
                {visibleRows.map((item, index) => {
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
              })}
                <tr ref={bottomSentinelRef}>
                  <td
                    colSpan="4"
                    className="border border-[#333] bg-[#fffed5] px-2 py-1 text-xs text-[#8a6106]"
                  >
                    {timelineLoading === "next"
                      ? "Loading next records..."
                      : visibleYears.end >= maxYear
                        ? "End of Dasha timeline"
                        : ""}
                  </td>
                </tr>
              </>
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
