import {
  loShuGridOrder,
  preferredPersonalityDestinySections,
} from "./constants";

export function formatList(values) {
  return values?.length ? values.join(", ") : "None";
}

export function parseNumberList(value) {
  if (!value) {
    return [];
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatNumberGroup(value) {
  const numbers = parseNumberList(value);
  return numbers.length ? numbers.join(", ") : "-";
}

export function formatDobForApi(value) {
  const [year, month, day] = value.split("-");
  return `${day}-${month}-${year}`;
}

export function normalizeMatrixResult(result) {
  const data = result?.data || result;
  return Array.isArray(data) ? data : data?.matrix || data?.years || [];
}

export function formatPersonalityDestinySectionLabel(key) {
  const preferredSection = preferredPersonalityDestinySections.find(
    (section) => section.key === key,
  );

  if (preferredSection) {
    return preferredSection.label;
  }

  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase())
    .trim();
}

export function normalizePersonalityDestinyResult(result) {
  const data = result?.data || result || {};
  const preferredKeys = preferredPersonalityDestinySections.map(
    (section) => section.key,
  );

  return Object.entries(data)
    .filter(([, value]) => Array.isArray(value))
    .sort(([keyA], [keyB]) => {
      const indexA = preferredKeys.indexOf(keyA);
      const indexB = preferredKeys.indexOf(keyB);

      if (indexA === -1 && indexB === -1) {
        return keyA.localeCompare(keyB);
      }

      if (indexA === -1) {
        return 1;
      }

      if (indexB === -1) {
        return -1;
      }

      return indexA - indexB;
    })
    .map(([key, value]) => ({
      key,
      label: formatPersonalityDestinySectionLabel(key),
      items: value.filter((item) => item?.value),
    }));
}

export function normalizeNumberRelationshipsResult(result) {
  const data = result?.data || result;
  return Array.isArray(data) ? data : [];
}

export function normalizeSectorEffectsResult(result) {
  return result?.data || result || null;
}

export function normalizeLoShuRepetitionEffectsResult(result) {
  const data = result?.data || result;
  return Array.isArray(data) ? data : [];
}

export function buildCountsPayload(counts = {}) {
  return Object.fromEntries(
    Array.from({ length: 9 }, (_, index) => {
      const number = String(index + 1);
      return [number, Number(counts[number] || 0)];
    }),
  );
}

export function buildLoShuRepetitionGrid(effects = [], highlightedNumber = null) {
  const fallbackNumbers = loShuGridOrder.flat();
  const cells = Array.from({ length: 9 }, (_, index) => ({
    key: `fallback-${index}`,
    number: fallbackNumbers[index],
    effect: null,
    isHighlighted: false,
  }));

  effects.forEach((effect) => {
    const row = Number(effect.gridRow);
    const column = Number(effect.gridColumn);

    if (row < 1 || row > 3 || column < 1 || column > 3) {
      return;
    }

    const index = (row - 1) * 3 + (column - 1);
    const number = Number(effect.loShuNumber);

    cells[index] = {
      key: effect.id || `${row}-${column}-${number}`,
      number,
      effect,
      isHighlighted: Number(highlightedNumber) === number,
    };
  });

  return cells;
}

export function getRepetitionAccent(status = "") {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("missing")) {
    return {
      card: "border-gray-200",
      badge: "bg-gray-100 text-gray-600 ring-gray-200",
      cell: "bg-gray-100 text-gray-500",
    };
  }

  if (normalizedStatus.includes("twice")) {
    return {
      card: "border-blue-100",
      badge: "bg-blue-50 text-blue-700 ring-blue-200",
      cell: "bg-blue-100 text-blue-800",
    };
  }

  if (normalizedStatus.includes("3") || normalizedStatus.includes("more")) {
    return {
      card: "border-indigo-100",
      badge: "bg-indigo-50 text-indigo-700 ring-indigo-200",
      cell: "bg-indigo-100 text-indigo-800",
    };
  }

  return {
    card: "border-cyan-100",
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    cell: "bg-cyan-50 text-cyan-800",
  };
}

export function getRepetitionGridCellClass(cell, highlightedNumber = null) {
  const isMissing = cell.effect?.repetitionStatus
    ?.toLowerCase()
    .includes("missing");
  const repetitionCount = Number(cell.effect?.repetitionCount || 0);
  const isHighlighted =
    highlightedNumber !== null &&
    Number(highlightedNumber) === Number(cell.number);

  if (isMissing) {
    return isHighlighted
      ? "bg-gray-200 text-gray-600 shadow-md shadow-gray-200"
      : "bg-gray-100 text-gray-500 shadow-sm shadow-gray-200";
  }

  if (repetitionCount >= 3) {
    return "bg-blue-50 text-red-600 shadow-md shadow-blue-100";
  }

  if (repetitionCount > 0 || isHighlighted) {
    return "bg-blue-50 text-[#071d46] shadow-md shadow-blue-100";
  }

  return "bg-white text-slate-300 shadow-sm shadow-blue-50";
}

export function getRepetitionGridCellDisplay(cell) {
  const number = cell.number || "-";
  const repetitionCount = Number(cell.effect?.repetitionCount || 0);

  if (!cell.effect || repetitionCount <= 1) {
    return String(number);
  }

  return String(number).repeat(repetitionCount);
}

export function isMissingRepetitionCell(cell) {
  return cell.effect?.repetitionStatus?.toLowerCase().includes("missing");
}

export function isHighRepetitionCell(cell) {
  return Number(cell.effect?.repetitionCount || 0) >= 3;
}

export function getNumberRelationshipType(sourceRecord, targetNumber) {
  if (!sourceRecord || targetNumber === undefined || targetNumber === null) {
    return "Unknown";
  }

  const target = String(targetNumber);

  if (parseNumberList(sourceRecord.friendNumbers).includes(target)) {
    return "Friend";
  }

  if (parseNumberList(sourceRecord.enemyNumbers).includes(target)) {
    return "Enemy";
  }

  if (parseNumberList(sourceRecord.neutralNumbers).includes(target)) {
    return "Neutral";
  }

  return "Unknown";
}
