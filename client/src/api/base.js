/** Base URL cho API — dev: để trống để dùng proxy Vite `/api` → localhost:5000 */
export function apiPath(path) {
  const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return base ? `${base}${p}` : p;
}
