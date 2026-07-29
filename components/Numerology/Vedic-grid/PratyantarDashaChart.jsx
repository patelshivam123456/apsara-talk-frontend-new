import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

const initialWindowStartYear = 2021;
const windowYearSpan = 9;
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

function getYearFromDate(value) {
  const date = parseChartDate(value);
  return date ? date.getFullYear() : Number.NaN;
}

function formatApiDate(date) {
  if (!date) {
    return "";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}-${month}-${year}`;
}

function formatApiFromDate(year, minDate) {
  if (minDate && year <= minDate.getFullYear()) {
    return formatApiDate(minDate);
  }

  return `01-01-${year}`;
}

function getWindowEndYear(startYear) {
  return Math.min(startYear + windowYearSpan, timelineEndYear);
}

function getRowKey(item) {
  return [
    item.calculationYear,
    item.effectiveStartDate,
    item.effectiveEndDate,
    item.pratyantarDashaNumber,
  ].join("|");
}

function sortRows(rows) {
  return [...rows].sort((left, right) => {
    const leftDate = parseChartDate(left.effectiveStartDate)?.getTime() ?? 0;
    const rightDate = parseChartDate(right.effectiveStartDate)?.getTime() ?? 0;
    return leftDate - rightDate;
  });
}

function mergeRows(existingRows, nextRows) {
  const rowMap = new Map();

  [...existingRows, ...nextRows].forEach((row) => {
    rowMap.set(getRowKey(row), row);
  });

  return sortRows([...rowMap.values()]);
}

export default function PratyantarDashaChart({
  pratyantarDasha = [],
  setPratyantarDasha,
  fetchPratyantarDasha,
  vedicDob,
}) {
  const scrollRef = useRef(null);
  const topSentinelRef = useRef(null);
  const bottomSentinelRef = useRef(null);
  const loadedWindowsRef = useRef(new Set());
  const pendingScrollRestoreRef = useRef(null);
  const minYear = useMemo(() => {
    const dobYear = getYearFromDate(vedicDob);
    return Number.isFinite(dobYear) ? dobYear : initialWindowStartYear;
  }, [vedicDob]);
  const minDate = useMemo(() => parseChartDate(vedicDob), [vedicDob]);
  const initialStart = Math.max(initialWindowStartYear, minYear);
  const [visibleYears, setVisibleYears] = useState({
    start: initialStart,
    end: getWindowEndYear(initialStart),
  });
  const [loadingDirection, setLoadingDirection] = useState("");
  const sortedRows = useMemo(() => sortRows(pratyantarDasha), [pratyantarDasha]);

  const loadWindow = useCallback(
    async (startYear, direction) => {
      const clampedStartYear = Math.max(minYear, Math.min(startYear, timelineEndYear));
      const fromDate = formatApiFromDate(clampedStartYear, minDate);

      if (
        !vedicDob ||
        !fetchPratyantarDasha ||
        loadedWindowsRef.current.has(fromDate)
      ) {
        return;
      }

      try {
        setLoadingDirection(direction);
        loadedWindowsRef.current.add(fromDate);
        const rows = await fetchPratyantarDasha(vedicDob, fromDate);
        setPratyantarDasha((currentRows) => mergeRows(currentRows, rows));
      } catch (error) {
        loadedWindowsRef.current.delete(fromDate);
        toast.error(
          error?.message ||
            "Unable to generate Pratyantar Dasha chart. Please try again.",
        );
      } finally {
        setLoadingDirection("");
      }
    },
    [fetchPratyantarDasha, minDate, minYear, setPratyantarDasha, vedicDob],
  );

  useEffect(() => {
    const initialFromDate = formatApiFromDate(initialStart, minDate);
    loadedWindowsRef.current = new Set([initialFromDate]);
  }, [initialStart, minDate, vedicDob]);

  useEffect(() => {
    if (!scrollRef.current || !pendingScrollRestoreRef.current) {
      return;
    }

    const scrollArea = scrollRef.current;
    const restore = pendingScrollRestoreRef.current;
    pendingScrollRestoreRef.current = null;

    scrollArea.scrollTop =
      scrollArea.scrollHeight - restore.previousScrollHeight + restore.previousScrollTop;
  }, [pratyantarDasha.length]);

  useEffect(() => {
    const scrollArea = scrollRef.current;

    if (!scrollArea) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          if (entry.target === topSentinelRef.current && visibleYears.start > minYear) {
            const nextStart = Math.max(visibleYears.start - 10, minYear);
            const nextBounds = {
              start: nextStart,
              end: visibleYears.end,
            };
            pendingScrollRestoreRef.current = {
              previousScrollHeight: scrollArea.scrollHeight,
              previousScrollTop: scrollArea.scrollTop,
            };
            setVisibleYears(nextBounds);
            loadWindow(nextStart, "previous");
          }

          if (
            entry.target === bottomSentinelRef.current &&
            visibleYears.end < timelineEndYear
          ) {
            const nextStart = Math.min(
              visibleYears.end + 1,
              timelineEndYear - windowYearSpan,
            );
            const nextBounds = {
              start: visibleYears.start,
              end: getWindowEndYear(nextStart),
            };
            setVisibleYears(nextBounds);
            loadWindow(nextStart, "next");
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
  }, [loadWindow, minYear, visibleYears]);

  return (
    <div className="overflow-hidden rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-2 text-[#111]">
      <div className="rounded-md border border-[#d8a84a]/30 bg-[#fff8ee] p-2.5 text-[#211704]">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
          Pratyantar Dasha
        </h3>
        <p className="mt-1 text-xs leading-5 text-[#665d4d]">
          Showing {visibleYears.start} to {visibleYears.end}. Year range is fixed
          to 10 years per scroll window.
        </p>
      </div>

      <div ref={scrollRef} className="mt-3 max-h-[360px] overflow-auto">
        <table className="w-full min-w-[250px] border-collapse text-center text-[13px] font-bold leading-tight">
          <thead className="sticky top-0 z-10">
            <tr>
              <th
                colSpan="3"
                className="rounded-t-md border border-[#333] bg-[#dfff3a] px-2 py-1 text-base leading-tight text-[#0d4d0c]"
              >
                Pratyantar Dasha
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
                Pratyantar
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
            {sortedRows.length ? (
              <>
                <tr ref={topSentinelRef}>
                  <td
                    colSpan="3"
                    className="border border-[#333] bg-[#fffed5] px-2 py-1 text-xs text-[#8a6106]"
                  >
                    {loadingDirection === "previous"
                      ? "Loading previous records..."
                      : visibleYears.start <= minYear
                        ? "Beginning of Pratyantar timeline"
                        : ""}
                  </td>
                </tr>
                {sortedRows.map((item) => (
                  <tr key={getRowKey(item)}>
                    <td className="break-words border border-[#333] bg-[#f7f7f7] px-2 py-2">
                      {formatChartDate(item.effectiveStartDate)}
                    </td>
                    <td className="break-words border border-[#333] bg-[#f7f7f7] px-2 py-2">
                      {formatChartDate(item.effectiveEndDate)}
                    </td>
                    <td className="border border-[#333] bg-[#f7f7f7] px-2 py-2 text-[#006d22]">
                      {item.pratyantarDashaNumber ?? "-"}
                    </td>
                  </tr>
                ))}
                <tr ref={bottomSentinelRef}>
                  <td
                    colSpan="3"
                    className="border border-[#333] bg-[#fffed5] px-2 py-1 text-xs text-[#8a6106]"
                  >
                    {loadingDirection === "next"
                      ? "Loading next records..."
                      : visibleYears.end >= timelineEndYear
                        ? "End of Pratyantar timeline"
                        : ""}
                  </td>
                </tr>
              </>
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-[#333] bg-[#f7f7f7] px-2 py-4"
                >
                  No Pratyantar Dasha data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
