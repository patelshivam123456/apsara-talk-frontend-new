import { sectorEffectTabs } from "./constants";
import { formatNumberGroup } from "./helpers";

export default function RelationshipsAndSectorEffects({
  losuResult,
  personalityRelationship,
  destinyRelationship,
  relationType,
  sectorWiseEffects,
  activeSectorEffectTab,
  setActiveSectorEffectTab,
  activeSectorEffect,
}) {
  return (
    <div className="mt-5 grid grid-cols-1 gap-3 lg:col-span-2 lg:grid-cols-[55fr_45fr]">
      <div className="overflow-hidden rounded-lg bg-[#fffdf2] p-3 text-[#111] shadow-lg shadow-black/15">
        <div>
          <table className="w-full table-fixed border-separate border-spacing-1 text-center text-[9px] font-medium sm:text-xs md:text-sm">
            <colgroup>
              <col className="w-[22%]" />
              <col className="w-[8%]" />
              <col className="w-[21%]" />
              <col className="w-[21%]" />
              <col className="w-[28%]" />
            </colgroup>
            <thead>
              <tr>
                <th
                  colSpan="2"
                  className="rounded-md bg-[#dff7d8] px-1 py-2 text-sm font-semibold leading-none sm:px-2 sm:text-base md:text-lg"
                >
                  Number
                </th>
                <th className="rounded-md bg-[#dff7d8] px-1 py-2 text-[10px] font-semibold sm:px-2 sm:text-sm md:text-base">
                  Friend
                </th>
                <th className="rounded-md bg-[#dff7d8] px-1 py-2 text-[10px] font-semibold sm:px-2 sm:text-sm md:text-base">
                  Enemy
                </th>
                <th className="rounded-md bg-[#dff7d8] px-1 py-2 text-[10px] font-semibold sm:px-2 sm:text-sm md:text-base">
                  Neutral
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: "Personality",
                  number: losuResult.driverNumber,
                  record: personalityRelationship,
                },
                {
                  label: "Destiny",
                  number: losuResult.destinyNumber,
                  record: destinyRelationship,
                },
              ].map((row) => (
                <tr key={row.label}>
                  <td className="whitespace-normal rounded-md bg-[#edf8d9] px-1 py-2 text-left text-[10px] sm:px-2 sm:text-sm md:text-base">
                    {row.label}
                  </td>
                  <td className="whitespace-normal rounded-md bg-white px-1 py-2 text-[10px] shadow-sm shadow-black/5 sm:text-sm">
                    {row.number}
                  </td>
                  <td className="whitespace-normal rounded-md bg-white px-1 py-2 text-[10px] text-green-600 shadow-sm shadow-black/5 sm:px-2 sm:text-sm">
                    {formatNumberGroup(row.record?.friendNumbers)}
                  </td>
                  <td className="whitespace-normal rounded-md bg-white px-1 py-2 text-[10px] text-red-600 shadow-sm shadow-black/5 sm:px-2 sm:text-sm">
                    {formatNumberGroup(row.record?.enemyNumbers)}
                  </td>
                  <td className="whitespace-normal rounded-md bg-white px-1 py-2 text-[10px] text-gray-500 shadow-sm shadow-black/5 sm:px-2 sm:text-sm">
                    {formatNumberGroup(row.record?.neutralNumbers)}
                  </td>
                </tr>
              ))}
              <tr>
                <td
                  colSpan="2"
                  className="whitespace-normal rounded-md bg-[#e7f2fb] px-1 py-2 text-[10px] leading-tight text-[#075a22] sm:px-2 sm:text-xs md:text-sm"
                >
                  <span className="block">Relation in</span>
                  <span className="block">Personality &</span>
                  <span className="block">Destiny Number</span>
                </td>
                <td
                  colSpan="3"
                  className="whitespace-normal rounded-md bg-white px-1 py-2 text-sm font-semibold shadow-sm shadow-black/5 sm:px-2 sm:text-base md:text-lg"
                >
                  {losuResult.driverNumber}:{losuResult.destinyNumber} ={" "}
                  {relationType}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-lg bg-[#fffdf2] p-3 text-[#111] shadow-lg shadow-black/15">
        <div>
          {sectorWiseEffects?.combinationKey && (
            <div className="mb-2 flex justify-end">
              <span className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#8a6106] shadow-sm shadow-black/10 sm:px-3 sm:text-xs">
                Combination Key: {sectorWiseEffects.combinationKey}
              </span>
            </div>
          )}

          <div className="grid grid-cols-4 gap-1 rounded-lg bg-[#f4ead0] p-1 sm:gap-1">
            {sectorEffectTabs.map((tab) => {
              const isActive = activeSectorEffectTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveSectorEffectTab(tab.key)}
                  className={`min-w-0  rounded-md px-0.5 py-2 text-center text-[10px] font-medium leading-tight transition sm:px-1 sm:text-sm md:text-sm ${
                    isActive
                      ? "bg-white text-[#d51d6b] shadow-md shadow-black/15"
                      : "text-[#496070] hover:bg-white/70 hover:text-[#1f75cc]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="mt-3 min-h-[138px] rounded-lg bg-[#fff8df] p-3 shadow-inner shadow-[#d8a84a]/15">
            <h3 className="text-lg font-bold leading-tight text-[#e11d74]">
              {
                sectorEffectTabs.find(
                  (tab) => tab.key === activeSectorEffectTab,
                )?.label
              }
            </h3>
            <div className="mt-1 text-sm  sm:text-sm">
              {activeSectorEffect || "No details available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
