import { calculationOptions } from "./Lushu-grid/constants";

export default function GenericNumerologyResult({ calculationType, result }) {
  const selectedOption = calculationOptions.find(
    (option) => option.value === calculationType,
  );
  const data = result?.data || result;

  if (!result) {
    return null;
  }

  return (
    <div className="mt-3 rounded-xl border border-white/10 bg-[#090d22]/80 p-3 text-white transition-all duration-200 hover:scale-[1.01]">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-purple-200">
            Numerology result
          </p>
          <h3 className="mt-1 text-lg font-semibold text-white">
            {selectedOption?.label || "Selected calculation"}
          </h3>
        </div>
        <span className="rounded-full border border-purple-300/30 bg-purple-500/15 px-3 py-1 text-xs font-semibold text-purple-100">
          {calculationType}
        </span>
      </div>

      <pre className="max-h-[520px] overflow-auto rounded-lg border border-white/10 bg-white/5 p-3 text-xs leading-5 text-purple-50">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
