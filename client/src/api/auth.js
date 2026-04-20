import { apiPath } from "./base";

export async function checkEmailForRegister(email) {
  const res = await fetch(apiPath("/api/auth/check-email"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Không kiểm tra được email.");
  }
  return data;
}

export async function loginWithEmail({ email, password }) {
  const res = await fetch(apiPath("/api/auth/login"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Đăng nhập thất bại.");
  }
  return data;
}

export async function registerAccount({ email, name, password, role }) {
  const res = await fetch(apiPath("/api/auth/register"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, password, role })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Đăng ký thất bại.");
    err.code = data.code;
    throw err;
  }
  return data;
}

export async function syncGoogleAccount({ email, name, picture }) {
  const res = await fetch(apiPath("/api/auth/google-sync"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, name, picture })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Không lưu được tài khoản Google.");
    err.code = data.code;
    throw err;
  }
  return data;
}
