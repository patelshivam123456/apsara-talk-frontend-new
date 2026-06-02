import {
  clearAccessToken,
  extractAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/utils/tokenStore";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const CLIENT_API_BASE_URL = "/api/proxy";

const apiUrl = (path) =>
  `${
    typeof window === "undefined"
      ? API_BASE_URL.replace(/\/$/, "")
      : CLIENT_API_BASE_URL
  }/${path.replace(/^\//, "")}`;

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

function forwardSetCookie(response, res) {
  if (!res || !response?.headers) {
    return;
  }

  const setCookie = getSetCookieHeaders(response.headers).map(normalizeSetCookie);

  if (setCookie.length) {
    res.setHeader("Set-Cookie", setCookie);
  }
}

async function storeAccessTokenFromResponse(response) {
  const payload = await response?.clone().json().catch(() => null);
  const accessToken = extractAccessToken(payload);

  if (accessToken) {
    setAccessToken(accessToken);
  }

  return accessToken;
}

function withAccessTokenHeaders(options = {}, token = getAccessToken()) {
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function refreshCookieSession() {
  return fetch(apiUrl("authorization/auth/refresh-token"), {
    method: "GET",
    credentials: "include",
    headers: {
      accept: "*/*",
    },
  });
}

export async function fetchWithAuth(input, options = {}, { onRefreshFailed } = {}) {
  const headers = withAccessTokenHeaders(options);
  const response = await fetch(input, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status !== 401) {
    return response;
  }

  try {
    const refreshResponse = await refreshCookieSession();

    if (!refreshResponse.ok) {
      throw new Error("Session refresh failed");
    }

    const accessToken = await storeAccessTokenFromResponse(refreshResponse);

    return fetch(input, {
      ...options,
      headers: withAccessTokenHeaders(options, accessToken),
      credentials: "include",
    });
  } catch (error) {
    clearAccessToken();
    onRefreshFailed?.(error);
    return response;
  }
}

export async function clearServerSession() {
  if (typeof window === "undefined") {
    return;
  }

  await fetch(apiUrl("authorization/auth/logout"), {
    method: "GET",
    credentials: "include",
    headers: {
      accept: "*/*",
    },
  }).catch(() => null);

  clearAccessToken();
}

export async function serverFetchWithAuth(input, options = {}, { req, res } = {}) {
  const headers = new Headers(options.headers || {});
  const cookie = req?.headers?.cookie;

  if (cookie) {
    headers.set("cookie", cookie);
  }

  const response = await fetch(input, {
    ...options,
    headers,
  });

  forwardSetCookie(response, res);

  if (response.status !== 401) {
    return { response };
  }

  const refreshResponse = await fetch(apiUrl("authorization/auth/refresh-token"), {
    method: "GET",
    headers,
  }).catch(() => null);

  forwardSetCookie(refreshResponse, res);

  if (!refreshResponse?.ok) {
    return { response };
  }

  const payload = await refreshResponse.clone().json().catch(() => null);
  const accessToken = extractAccessToken(payload);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const retryResponse = await fetch(input, {
    ...options,
    headers,
  });

  forwardSetCookie(retryResponse, res);

  return { response: retryResponse };
}
