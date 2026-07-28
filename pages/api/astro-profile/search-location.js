const LOCATION_API_URL =
  "https://apsraastro.com/astrology-services/home-page/get-geolocation";
const REQUEST_TIMEOUT_MS = 12000;

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const birthPlace = String(req.query.birthPlace || "").trim();

  if (birthPlace.length < 2) {
    return res.status(400).json({
      success: false,
      message: "Enter at least 2 characters to search birth place.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const targetUrl = new URL(LOCATION_API_URL);
    targetUrl.searchParams.set("birthPlace", birthPlace);

    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false, data: [] });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";

    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      message: isTimeout
        ? "Location search timed out. Please try again."
        : "Location search failed. Please try again.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
