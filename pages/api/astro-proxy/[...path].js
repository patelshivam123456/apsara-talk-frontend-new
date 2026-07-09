const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_ASTRO ||
  "http://66.116.242.35:8085";

function buildTargetUrl(req) {
  const path = Array.isArray(req.query.path)
    ? req.query.path.join("/")
    : req.query.path || "";

  const query = new URLSearchParams();

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => query.append(key, item));
      return;
    }

    if (value !== undefined) {
      query.append(key, value);
    }
  });

  const target = `${API_BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
  const queryString = query.toString();

  return queryString ? `${target}?${queryString}` : target;
}

export default async function handler(req, res) {
  const targetUrl = buildTargetUrl(req);
  const headers = {
    accept: req.headers.accept || "*/*",
    ...(req.headers["content-type"]
      ? { "content-type": req.headers["content-type"] }
      : {}),
    ...(req.headers.authorization
      ? { Authorization: req.headers.authorization }
      : {}),
  };

  const hasBody = !["GET", "HEAD"].includes(req.method);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: hasBody && req.body !== undefined ? JSON.stringify(req.body) : undefined,
      redirect: "follow",
    });

    const contentType = response.headers.get("content-type");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const text = await response.text();

    return res.status(response.status).send(text);
  } catch (error) {
    console.log("[astro proxy] request failed", error);

    return res.status(500).json({
      success: false,
      message: "Astrology API proxy request failed",
    });
  }
}
