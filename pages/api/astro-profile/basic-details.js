const BASIC_ASTRO_DETAILS_API_URL =
  "https://apsraastro.com/astrology-services/third-party/basic-astro-details";
const REQUEST_TIMEOUT_MS = 45000;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(BASIC_ASTRO_DETAILS_API_URL, {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body || {}),
      signal: controller.signal,
    });

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";

    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      message: isTimeout
        ? "Astro profile generation timed out. Please try again."
        : "Astro profile generation failed. Please try again.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
