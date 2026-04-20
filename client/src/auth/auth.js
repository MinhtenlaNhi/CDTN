export const AUTH_STORAGE_KEY = "tzone_auth";

/** Email Google được cấp quyền quản trị (so khớp không phân biệt hoa thường). */
export const ADMIN_EMAILS = new Set(["pdquang050203@gmail.com"]);

export function resolveRole(email) {
  const e = String(email || "")
    .toLowerCase()
    .trim();
  return ADMIN_EMAILS.has(e) ? "admin" : "user";
}

export function getAuth() {
  try {
    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data?.email) return null;
    if (!data.role) {
      data.role = resolveRole(data.email);
    }
    return data;
  } catch {
    return null;
  }
}

export function clearAuth() {
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}

export function isAdminSession() {
  return getAuth()?.role === "admin";
}
