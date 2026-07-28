const ASTROLOGY_BASE_URL = "https://apsraastro.com/astrology-services";
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
    const response = await fetch(
      `${ASTROLOGY_BASE_URL}/third-party/kundali-pdf`,
      {
        method: "POST",
        headers: {
          accept: "*/*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body || {}),
        signal: controller.signal,
      },
    );

    const data = await response.json().catch(() => null);
    return res.status(response.status).json(data || { success: false });
  } catch (error) {
    const isTimeout = error?.name === "AbortError";

    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      message: isTimeout
        ? "Kundali generation timed out. Please try again."
        : "Kundali generation failed. Please try again.",
    });
  } finally {
    clearTimeout(timeout);
  }
}
