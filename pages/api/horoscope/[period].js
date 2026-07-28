const REQUEST_TIMEOUT_MS = 45000;

const horoscopeApiUrlByPeriod = {
  daily: "https://apsraastro.com/astrology-services/third-party/daily-horoscope",
  weekly: "https://apsraastro.com/astrology-services/third-party/weekly-horoscope",
  monthly: "https://apsraastro.com/astrology-services/third-party/monthly-horoscope",
  yearly: "https://apsraastro.com/astrology-services/third-party/yearly-horoscope",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const period = String(req.query.period || "").toLowerCase();
  const apiUrl = horoscopeApiUrlByPeriod[period];

  if (!apiUrl) {
    return res.status(404).json({
      success: false,
      message: "Horoscope period was not found.",
    });
  }

  const sign = String(req.body?.sign || "").trim().toLowerCase();

  if (!sign) {
    return res.status(400).json({
      success: false,
      message: "Zodiac sign is required.",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sign }),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";

    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      message: isTimeout
        ? "Horoscope request timed out. Please try again."
        : "Horoscope request failed. Please try again.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
