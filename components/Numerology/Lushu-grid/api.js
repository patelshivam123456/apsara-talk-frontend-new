import {
  buildCountsPayload,
  normalizeLoShuRepetitionEffectsResult,
  normalizeNumberRelationshipsResult,
  normalizePersonalityDestinyResult,
  normalizeSectorEffectsResult,
} from "./helpers";

export async function fetchPersonalityDestinyDetails(type, number) {
  const query = new URLSearchParams({
    type,
    number: String(number),
  });

  const response = await fetch(
    `/api/astro-proxy/astrology-services/home-page/personality-destiny-details?${query.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || `Unable to generate ${type.toLowerCase()} details.`,
    );
  }

  return normalizePersonalityDestinyResult(result);
}

export async function fetchNumberRelationships(personalityNo, destinyNo) {
  const query = new URLSearchParams({
    personalityNo: String(personalityNo),
    destinyNo: String(destinyNo),
  });

  const response = await fetch(
    `/api/astro-proxy/astrology-services/home-page/number-relationships?${query.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Unable to generate number relationships.");
  }

  return normalizeNumberRelationshipsResult(result);
}

export async function fetchSectorWiseEffects(personalityNo, destinyNo) {
  const query = new URLSearchParams({
    personalityNo: String(personalityNo),
    destinyNo: String(destinyNo),
  });

  const response = await fetch(
    `/api/astro-proxy/astrology-services/home-page/get-sector-wise-effects?${query.toString()}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Unable to generate sector-wise effects.");
  }

  return normalizeSectorEffectsResult(result);
}

export async function fetchLoShuRepetitionEffects(counts) {
  const response = await fetch(
    "/api/astro-proxy/astrology-services/home-page/get-loshu-repetition-effects",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(buildCountsPayload(counts)),
    },
  );
  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result?.message || "Unable to generate Lo Shu repetition effects.",
    );
  }

  return normalizeLoShuRepetitionEffectsResult(result);
}
