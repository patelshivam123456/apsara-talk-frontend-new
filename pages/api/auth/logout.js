const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const LOGOUT_URL = `${API_BASE_URL.replace(
  /\/$/,
  ""
)}/authorization/auth/logout`;

function serializeClearCookie(name) {
  return `${name}=; Max-Age=0; Path=/; SameSite=Lax`;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const refreshToken =
    req.cookies?.refreshToken || req.headers["x-refresh-token"];

  try {
    const response = await fetch(LOGOUT_URL, {
      method: "GET",
      headers: {
        accept: "*/*",
        ...(refreshToken ? { Cookie: `refreshToken=${refreshToken}` } : {}),
      },
      redirect: "follow",
    });

    const payload = await response.json().catch(() => null);

    res.setHeader("Set-Cookie", [
      serializeClearCookie("isLoggedIn"),
      serializeClearCookie("token"),
      serializeClearCookie("refreshToken"),
    ]);

    return res.status(response.status).json(payload || { success: response.ok });
  } catch (error) {
    console.log("[logout] proxy error", error);

    res.setHeader("Set-Cookie", [
      serializeClearCookie("isLoggedIn"),
      serializeClearCookie("token"),
      serializeClearCookie("refreshToken"),
    ]);

    return res.status(500).json({ message: "Logout failed" });
  }
}
