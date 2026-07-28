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

export default function PratyantarDashaChart({
  pratyantarDasha = [],
  pratyantarFromDate,
  setPratyantarFromDate,
  pratyantarYears,
  setPratyantarYears,
  pratyantarDashaApi,
  isSubmitting,
}) {
  return (
    <div className="overflow-hidden rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-2 text-[#111]">
      <div className="rounded-md border border-[#d8a84a]/30 bg-[#fff8ee] p-2.5 text-[#211704]">
        <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
          Pratyantar Dasha
        </h3>
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_110px_auto] sm:items-end lg:grid-cols-1 xl:grid-cols-[1fr_90px_auto]">
          <div>
            <label
              htmlFor="vedic-pratyantar-from-date"
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a6106]"
            >
              From Date
            </label>
            <input
              id="vedic-pratyantar-from-date"
              type="date"
              value={pratyantarFromDate}
              onChange={(event) => setPratyantarFromDate(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#d8a84a]/50 bg-white px-2.5 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
            />
          </div>
          <div>
            <label
              htmlFor="vedic-pratyantar-years"
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8a6106]"
            >
              Year
            </label>
            <input
              id="vedic-pratyantar-years"
              type="number"
              min="1"
              inputMode="numeric"
              value={pratyantarYears}
              onChange={(event) => setPratyantarYears(event.target.value)}
              className="mt-1.5 w-full rounded-md border border-[#d8a84a]/50 bg-white px-2.5 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
            />
          </div>
          <button
            type="button"
            onClick={() => pratyantarDashaApi()}
            disabled={isSubmitting}
            className="rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
          >
            {isSubmitting ? "Generating..." : "Submit"}
          </button>
        </div>
      </div>

      <div className="mt-3 max-h-[360px] overflow-auto">
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
            {pratyantarDasha.length ? (
              pratyantarDasha.map((item) => (
                <tr key={`${item.calculationYear}-${item.pratyantarDashaNumber}`}>
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
              ))
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
