const AUTH_FIELD_NAMES = new Set([
  "accessToken",
  "refreshToken",
  "token",
  "jwt",
]);

export function stripAuthFields(value) {
  if (!value || typeof value !== "object") {
    return value || null;
  }

  return Object.fromEntries(
    Object.entries(value).filter(([key]) => !AUTH_FIELD_NAMES.has(key))
  );
}
