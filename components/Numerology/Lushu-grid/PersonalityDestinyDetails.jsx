import { personalityDestinyTabs } from "./constants";

export default function PersonalityDestinyDetails({
  activePersonalityDestinyTab,
  setActivePersonalityDestinyTab,
  activePersonalityDestinyDetails,
  activePersonalityDestinyMeta,
  activePersonalityDestinyNumber,
}) {
  return (
    <div className="lg:col-span-2 mt-5">
      <div className="mb-3 astro-dark-surface rounded-xl border border-white/10 bg-[#090d22]/80 p-3 transition-all duration-200 hover:scale-[1.01] flex justify-between flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
            Numerology insight
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            Personality and Destiny Details
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4 overflow-hidden rounded-lg border border-[#d8a84a]/40 bg-white/5 p-1">
          {personalityDestinyTabs.map((tab) => {
            const isActive = activePersonalityDestinyTab === tab.key;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActivePersonalityDestinyTab(tab.key)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#d8a84a] text-[#211704]"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
        {(activePersonalityDestinyDetails || []).map((section) => {
          return (
            <article
              key={section.key}
              className="rounded-sm border-2 border-[#39d74a] bg-[#fffed5] p-3 text-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.2)]"
            >
              <div className="rounded-md border border-[#39d74a]/70 bg-[#cff5bd] px-3 py-2 text-center">
                <h4 className="text-sm font-bold leading-tight text-[#075a22]">
                  {section.label} of {activePersonalityDestinyMeta.label}{" "}
                  Number {activePersonalityDestinyNumber}
                </h4>
              </div>

              <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-[#075a22]">
                {section.items[0]?.lord && (
                  <span className="text-[10px] rounded-full border border-[#39d74a]/60 bg-white/70 px-2 py-1">
                    Lord: {section.items[0].lord}
                  </span>
                )}
                {section.items[0]?.colour && (
                  <span className="text-[10px] rounded-full border border-[#39d74a]/60 bg-white/70 px-2 py-1">
                    Colour: {section.items[0].colour}
                  </span>
                )}
              </div>

              {section.items.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[12px] leading-snug">
                  {section.items.map((item, index) => (
                    <li key={`${section.key}-${index}`}>
                      {item.value}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm font-semibold text-[#665d4d]">
                  No details available for this number.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
