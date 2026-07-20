const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const REQUEST_TIMEOUT_MS = 30000;

function getSetCookieHeaders(headers) {
  if (typeof headers.getSetCookie === "function") {
    return headers.getSetCookie();
  }

  const header = headers.get("set-cookie");

  if (!header) {
    return [];
  }

  return header.split(/,\s*(?=[^,]+=)/);
}

function normalizeSetCookie(cookie) {
  return cookie
    .replace(/;\s*Domain=[^;]*/gi, "")
    .replace(/;\s*Path=[^;]*/gi, "; Path=/")
    .replace(/;\s*SameSite=None/gi, "; SameSite=Lax");
}

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
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = {
    accept: req.headers.accept || "*/*",
    ...(req.headers["content-type"]
      ? { "content-type": req.headers["content-type"] }
      : {}),
    ...(req.headers.cookie ? { Cookie: req.headers.cookie } : {}),
    ...(req.headers.authorization
      ? { Authorization: req.headers.authorization }
      : {}),
  };

  const hasBody = !["GET", "HEAD"].includes(req.method);

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      ...(hasBody
        ? {
            body: req,
            duplex: "half",
          }
        : {}),
      redirect: "follow",
      signal: controller.signal,
    });

    const setCookie = getSetCookieHeaders(response.headers).map(normalizeSetCookie);

    if (setCookie.length) {
      res.setHeader("Set-Cookie", setCookie);
    }

    const contentType = response.headers.get("content-type");

    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    const text = await response.text();

    return res.status(response.status).send(text);
  } catch (error) {
    console.error("[api proxy] request failed", {
      targetUrl,
      message: error?.message,
      code: error?.cause?.code,
      cause: error?.cause?.message,
    });

    const isTimeout = error?.name === "AbortError";
    const isDevelopment = process.env.NODE_ENV !== "production";

    return res.status(isTimeout ? 504 : 502).json({
      success: false,
      message: "API proxy request failed",
      ...(isDevelopment
        ? {
            error: error?.message,
            code: error?.cause?.code,
            cause: error?.cause?.message,
            targetUrl,
          }
        : {}),
    });
  } finally {
    clearTimeout(timeout);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
