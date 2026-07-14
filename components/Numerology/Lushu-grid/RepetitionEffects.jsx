import {
  buildLoShuRepetitionGrid,
  getRepetitionAccent,
  getRepetitionGridCellDisplay,
  getRepetitionGridCellClass,
  isHighRepetitionCell,
  isMissingRepetitionCell,
} from "./helpers";

export default function RepetitionEffects({
  loShuRepetitionEffects,
  loShuRepetitionGrid,
}) {
  if (loShuRepetitionEffects.length === 0) {
    return null;
  }

  return (
    <section className="lg:col-span-2 overflow-hidden rounded-xl border border-blue-100 bg-[#eef7ff] p-3 text-[#061735] shadow-lg shadow-blue-950/10 sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(260px,0.42fr)] lg:items-center">
        <div className="min-w-0">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-600">
              Meaning of repetition
            </p>
            <h3 className="mt-1 text-2xl font-extrabold leading-tight text-[#071d46] sm:text-3xl md:text-4xl">
              Lo Shu Grid Number Effects
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Repetition readings are generated from your current
              grid counts.
            </p>
          </div>
        </div>

        <div className="mx-auto grid aspect-square w-full max-w-[220px] grid-cols-3 gap-1 rounded-lg bg-white p-1 text-center shadow-xl shadow-blue-950/15">
          {loShuRepetitionGrid.map((cell, index) => (
            <div
              key={`repetition-grid-${cell.key}-${index}`}
              className={`flex flex-col items-center justify-center rounded-md px-1 text-center text-2xl font-extrabold sm:text-3xl ${getRepetitionGridCellClass(cell)}`}
            >
              <span className="leading-none">
                {getRepetitionGridCellDisplay(cell)}
              </span>
              {isMissingRepetitionCell(cell) && (
                <span className="mt-1 text-[9px] font-bold uppercase leading-none tracking-[0.04em] text-gray-500 sm:text-[10px]">
                  missing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {loShuRepetitionEffects.map((effect) => {
          const accent = getRepetitionAccent(effect.repetitionStatus);
          const cardGrid = buildLoShuRepetitionGrid(
            loShuRepetitionEffects,
            effect.loShuNumber,
          );

          return (
            <article
              key={effect.id || effect.loShuNumber}
              className={`rounded-lg border bg-white p-3 shadow-md shadow-blue-950/10 transition-all duration-200 hover:-translate-y-0.5 ${accent.card}`}
            >
              <div className="flex gap-3">
                <div className="shrink-0">
                  <div className="grid h-16 w-16 grid-cols-3 gap-0.5 rounded-md bg-white p-0.5 shadow-lg shadow-blue-950/10 sm:h-20 sm:w-20">
                    {cardGrid.map((cell, index) => (
                      <div
                        key={`${effect.loShuNumber}-${cell.key}-${index}`}
                        className={`flex flex-col items-center justify-center rounded-sm px-0.5 text-center text-[10px] font-bold leading-none sm:text-xs ${
                          isHighRepetitionCell(cell) ? "tracking-[-0.02em]" : ""
                        } ${getRepetitionGridCellClass(cell, effect.loShuNumber)}`}
                      >
                        <span>{getRepetitionGridCellDisplay(cell)}</span>
                        {isMissingRepetitionCell(cell) && (
                          <span className="mt-0.5 text-[6px] font-bold uppercase leading-none tracking-[0.02em] text-gray-500 sm:text-[7px]">
                            missing
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4
                      className={`rounded-md px-2 py-1 text-lg font-extrabold leading-tight text-[#071d46] ${
                        effect.repetitionStatus
                          ?.toLowerCase()
                          .includes("missing")
                          ? "text-gray-600"
                          : Number(effect.loShuNumber) === 9
                          ? "bg-yellow-100 text-yellow-900"
                          : "bg-transparent"
                      }`}
                    >
                      {effect.title}
                    </h4>
                    <span
                      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ring-1 ${accent.badge}`}
                    >
                      {effect.repetitionStatus}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {effect.meaning}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-4 flex flex-col gap-3 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-blue-600 text-xs font-bold text-blue-700">
            i
          </span>
          <span>
            {loShuRepetitionEffects[0]?.generalNote ||
              "General tendency only. Full meaning depends on the complete grid."}
          </span>
        </p>
        <span className="rounded-full bg-yellow-600 px-4 py-2 text-center text-sm font-bold text-white">
          {loShuRepetitionEffects.length} number effects
        </span>
      </div>
    </section>
  );
}
