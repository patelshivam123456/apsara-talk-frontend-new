export const ADMIN_ROLE = "ROLE_ADMIN";
export const ASTROLOGER_ROLE = "ROLE_ASTROLOGER";
export const CLIENT_ROLE = "ROLE_CLIENT";

export const ASTROLOGER_ALLOWED_ROUTES = new Set([
  "/astrologer-profile",
  "/losu",
  "/chat",
  "/activity",
]);

const PUBLIC_ROUTE_PREFIXES = [
  "/services/",
  "/astrologers/",
];

const PUBLIC_ROUTES = new Set([
  "/",
  "/astrologers",
  "/horoscope",
  "/kundli",
  "/compatibility",
  "/ask-universe",
  "/voice-guidance",
  "/saved-insights",
]);

export function normalizeRoles(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((role) => String(role).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((role) => role.trim())
    .filter(Boolean);
}

export function getUserRoles(user = {}) {
  return [
    ...normalizeRoles(user?.roles),
    ...normalizeRoles(user?.authorities),
  ];
}

export function hasRole(roles, role) {
  return roles.includes(role);
}

export function getPrimaryDashboardRoute(roles = []) {
  if (hasRole(roles, ASTROLOGER_ROLE) && !hasRole(roles, ADMIN_ROLE)) {
    return "/astrologer-profile";
  }

  return "/";
}

export function getProfileRoute(roles = []) {
  if (hasRole(roles, ASTROLOGER_ROLE) && !hasRole(roles, ADMIN_ROLE)) {
    return "/astrologer-profile";
  }

  return "/profile";
}

export function canAccessRoute(pathname, roles = []) {
  if (
    PUBLIC_ROUTES.has(pathname) ||
    PUBLIC_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix))
  ) {
    return true;
  }

  if (!roles.length || hasRole(roles, ADMIN_ROLE)) {
    return true;
  }

  if (hasRole(roles, ASTROLOGER_ROLE)) {
    return ASTROLOGER_ALLOWED_ROUTES.has(pathname);
  }

  return true;
}
