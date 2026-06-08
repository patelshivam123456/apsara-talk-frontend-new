let accessToken = null;

const ACCESS_TOKEN_PAYLOAD_KEY = "accessTokenPayload";
const USER_ROLE_KEY = "roles";
const USER_AUTHORITIES_KEY = "authorities";
const USER_ID_KEY = "uid";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  return decodeURIComponent(
    Array.from(window.atob(padded))
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join("")
  );
}

export function decodeAccessToken(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const [, payload] = token.split(".");

  if (!payload) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(payload));
  } catch {
    return null;
  }
}

function clearStoredAccessTokenClaims() {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(ACCESS_TOKEN_PAYLOAD_KEY);
  localStorage.removeItem(USER_ROLE_KEY);
  localStorage.removeItem(USER_AUTHORITIES_KEY);
  localStorage.removeItem(USER_ID_KEY);
}

function storeAccessTokenClaims(token) {
  if (!isBrowser()) {
    return;
  }

  const decodedToken = decodeAccessToken(token);

  if (!decodedToken) {
    clearStoredAccessTokenClaims();
    return;
  }

  localStorage.setItem(ACCESS_TOKEN_PAYLOAD_KEY, JSON.stringify(decodedToken));

  if (decodedToken.roles) {
    localStorage.setItem(USER_ROLE_KEY, decodedToken.roles);
  } else {
    localStorage.removeItem(USER_ROLE_KEY);
  }

  if (decodedToken.authorities) {
    localStorage.setItem(USER_AUTHORITIES_KEY, decodedToken.authorities);
  } else {
    localStorage.removeItem(USER_AUTHORITIES_KEY);
  }

  if (decodedToken.uid) {
    localStorage.setItem(USER_ID_KEY, decodedToken.uid);
  } else {
    localStorage.removeItem(USER_ID_KEY);
  }
}

function normalizeRoleList(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((role) => String(role).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  return [];
}

export function getAccessToken() {
  return accessToken;
}

export function getStoredAccessTokenClaims() {
  if (!isBrowser()) {
    return null;
  }

  const rawPayload = localStorage.getItem(ACCESS_TOKEN_PAYLOAD_KEY);

  if (!rawPayload) {
    return null;
  }

  try {
    return JSON.parse(rawPayload);
  } catch {
    return null;
  }
}

export function getStoredRoles() {
  if (!isBrowser()) {
    return [];
  }

  const claims = getStoredAccessTokenClaims();
  const roleClaims = normalizeRoleList(claims?.roles);
  const authorityClaims = normalizeRoleList(claims?.authorities);
  const storedRoles = normalizeRoleList(localStorage.getItem(USER_ROLE_KEY));
  const storedAuthorities = normalizeRoleList(
    localStorage.getItem(USER_AUTHORITIES_KEY)
  );

  return [
    ...new Set([
      ...roleClaims,
      ...authorityClaims,
      ...storedRoles,
      ...storedAuthorities,
    ]),
  ];
}

export function hasStoredRole(role) {
  return getStoredRoles().includes(role);
}

export function setAccessToken(token) {
  accessToken = token || null;

  if (accessToken) {
    storeAccessTokenClaims(accessToken);
  } else {
    clearStoredAccessTokenClaims();
  }
}

export function clearAccessToken() {
  accessToken = null;
  clearStoredAccessTokenClaims();
}

export function extractAccessToken(payload) {
  return (
    payload?.accessToken ||
    payload?.token ||
    payload?.data?.accessToken ||
    payload?.data?.token ||
    null
  );
}
