import { personalYearReadingDetails } from "./constants";

export default function PersonalYearMatrix({
  fromYear,
  setFromYear,
  toYear,
  setToYear,
  personalYearMatrixApi,
  isSubmitting,
  personalYearMatrix,
  personalYearResult,
}) {
  return (
    <div className="grid grid-cols-1 gap-3 lg:col-span-2 xl:grid-cols-[4fr_2fr]">
      <div className="overflow-hidden rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-2 text-[#111]">
        <div className="mt-4 rounded-lg border border-[#d8a84a]/30 bg-[#fff8ee] p-3 text-[#211704]">
   
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[#8a6106]">
        Matrix for Personal Year & Month
      </h3>
<div className="sm:flex justify-between gap-3 lg:flex-row lg:items-end lg:justify-between mt-2">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-[360px]">
        <div>
          <label
            htmlFor="losu-from-year"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]"
          >
            From Year
          </label>

          <input
            id="losu-from-year"
            type="number"
            inputMode="numeric"
            value={fromYear}
            onChange={(event) => setFromYear(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#d8a84a]/50 bg-white px-3 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
          />
        </div>

        <div>
          <label
            htmlFor="losu-to-year"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a6106]"
          >
            To Year
          </label>

          <input
            id="losu-to-year"
            type="number"
            inputMode="numeric"
            value={toYear}
            onChange={(event) => setToYear(event.target.value)}
            className="mt-2 w-full rounded-lg border border-[#d8a84a]/50 bg-white px-3 py-2 text-sm text-[#211704] outline-none transition focus:border-[#8a6106]"
          />
        </div>
      </div>
      <div className="mt-3 sm:mt-0">
    <button
      onClick={()=>personalYearMatrixApi()}
      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
    >
      {isSubmitting ? "Generating..." : "Submit"}
    </button>
  </div>
    </div>
  </div>

        <div className="overflow-x-auto">
          <table className="min-w-[760px] border-collapse text-center text-sm font-semibold">
            <thead>
              <tr>
                <th
                  rowSpan="2"
                  className="border border-[#333] bg-[#ffd957] px-3 py-3"
                >
                  Year
                </th>
                <th
                  rowSpan="2"
                  className="border border-[#333] bg-[#ffd957] px-3 py-3"
                >
                  Personal
                  <br />
                  Year
                </th>
                <th
                  colSpan="12"
                  className="border border-[#333] bg-[#ffd957] px-3 py-3"
                >
                  Personal Month
                </th>
              </tr>
              <tr>
                {[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ].map((month) => (
                  <th
                    key={month}
                    className="border border-[#333] bg-[#f7f7f7] px-3 py-2"
                  >
                    {month}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {personalYearMatrix.map((item) => (
                <tr key={item.year}>
                  <td className="border border-[#333] bg-[#f7f7f7] px-3 py-2">
                    {item.year}
                  </td>
                  <td className="border border-[#333] bg-[#f7f7f7] px-3 py-2 text-lg">
                    <span className="text-red-600">
                      {String(item.personalYear || "").split("/")[0]?.trim()}
                    </span>
                    <span className="px-1 text-black">/</span>
                    <span className="text-green-700">
                      {String(item.personalYear || "").split("/")[1]?.trim()}
                    </span>
                  </td>
                  {item.months?.map((month) => (
                    <td
                      key={`${item.year}-${month.month}`}
                      className="border border-[#333] bg-[#f7f7f7] px-3 py-2 text-base"
                    >
                      {month.personalMonth}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <aside className="rounded-sm border-2 border-[#1f3c2d] bg-[#fffed5] p-3 text-[#111]">
        <h3 className="text-lg font-semibold leading-tight">
          Personal Year reading
        </h3>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-base leading-tight">
          <li className="text-[13px]">
            Your running personal year is{" "}
            {personalYearResult.personalYear}.
          </li>
          {personalYearReadingDetails.map((item) => (
            <li className="text-[13px]" key={item}>{item}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
