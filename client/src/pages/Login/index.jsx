import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { AUTH_STORAGE_KEY, resolveRole } from "../../auth/auth";
import { loginWithEmail, syncGoogleAccount } from "../../api/auth";
import { clearPendingRegisterRole, hasCompletedOnboarding } from "../../auth/onboardingStorage";
import "./styles.css";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

function IconGradCap({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"
      />
    </svg>
  );
}

function IconVideo({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M17 10.5V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.5l4 4v-11l-4 4z"
      />
    </svg>
  );
}

function IconPeople({ className }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="currentColor"
        d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.96 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
      />
    </svg>
  );
}

function IconGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden>
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

const stats = [
  { value: "300", label: "Giảng viên", tone: "green", Icon: IconGradCap },
  { value: "10.000+", label: "Video", tone: "orange", Icon: IconVideo },
  { value: "20.000+", label: "Học viên", tone: "pink", Icon: IconGradCap },
  { value: "100.000+", label: "Người dùng", tone: "blue", Icon: IconPeople }
];

function GoogleSignInButton() {
  const navigate = useNavigate();
  const [googleErr, setGoogleErr] = useState(null);

  const login = useGoogleLogin({
    scope: "openid email profile",
    onSuccess: async (tokenResponse) => {
      setGoogleErr(null);
      try {
        const r = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });
        if (!r.ok) throw new Error("userinfo");
        const profile = await r.json();
        const email = profile.email;
        const role = resolveRole(email);
        sessionStorage.setItem(
          AUTH_STORAGE_KEY,
          JSON.stringify({
            provider: "google",
            email,
            name: profile.name,
            picture: profile.picture,
            role,
            at: Date.now()
          })
        );
        try {
          await syncGoogleAccount({
            email,
            name: profile.name,
            picture: profile.picture
          });
        } catch (err) {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
          if (err.code === "LOCAL_EMAIL_EXISTS") {
            setGoogleErr(
              err.message ||
                "Email này đã đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu."
            );
          } else {
            setGoogleErr(err.message || "Không thể đồng bộ tài khoản Google. Kiểm tra MongoDB.");
          }
          return;
        }
        if (role === "admin") {
          clearPendingRegisterRole();
          navigate("/admin");
        } else if (!hasCompletedOnboarding(email)) {
          navigate("/onboarding");
        } else {
          clearPendingRegisterRole();
          navigate("/dashboard");
        }
      } catch {
        setGoogleErr("Không lấy được thông tin tài khoản Google.");
      }
    },
    onError: () => setGoogleErr("Đăng nhập Google bị hủy hoặc lỗi.")
  });

  return (
    <>
      {googleErr ? (
        <p className="login-google-err" role="alert">
          {googleErr}
        </p>
      ) : null}
      <button type="button" className="login-btn-google" onClick={() => login()}>
        <IconGoogle />
        Đăng nhập với Google
      </button>
    </>
  );
}

function GoogleSignInPlaceholder() {
  const isProd = import.meta.env.PROD;
  return (
    <>
      <p className="login-google-hint">
        {isProd ? (
          <>
            Đăng nhập Google chưa bật trên bản đã deploy: biến{" "}
            <code className="login-code">VITE_GOOGLE_CLIENT_ID</code> phải có{" "}
            <strong>khi chạy build</strong> (Vite nhúng giá trị vào file JS). Trên Render: Environment → thêm{" "}
            <code className="login-code">VITE_GOOGLE_CLIENT_ID</code> → deploy lại. Trong Google Cloud Console →
            OAuth client → <strong>Authorized JavaScript origins</strong> phải có URL trang của bạn (ví dụ{" "}
            <code className="login-code">https://ten-app.onrender.com</code>), không chỉ localhost.
          </>
        ) : (
          <>
            Để đăng nhập bằng Gmail/Google, tạo OAuth Client (Web) trong Google Cloud Console và thêm vào file{" "}
            <code className="login-code">client/.env</code>:{" "}
            <code className="login-code">VITE_GOOGLE_CLIENT_ID=...apps.googleusercontent.com</code>
            — thêm <strong>Authorized JavaScript origin</strong>:{" "}
            <code className="login-code">http://localhost:5173</code>
          </>
        )}
      </p>
      <button type="button" className="login-btn-google login-btn-google--disabled" disabled>
        <IconGoogle />
        Đăng nhập với Google
      </button>
    </>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErr, setFormErr] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setFormErr(null);
    const em = email.trim();
    if (!em || !password) {
      setFormErr("Vui lòng nhập email và mật khẩu.");
      return;
    }
    setSubmitting(true);
    try {
      const { user } = await loginWithEmail({ email: em, password });
      const role = resolveRole(user.email);
      sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          provider: "email",
          email: user.email,
          name: user.name,
          picture: "",
          role,
          accountType: user.accountRole,
          at: Date.now()
        })
      );
      if (role === "admin") {
        clearPendingRegisterRole();
        navigate("/admin");
      } else if (!hasCompletedOnboarding(user.email)) {
        navigate("/onboarding");
      } else {
        clearPendingRegisterRole();
        navigate("/dashboard");
      }
    } catch (err) {
      setFormErr(err.message || "Đăng nhập thất bại.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrap">
        <div className="login-card">
          <h1 className="login-card__title">WELCOME BACK</h1>
          <p className="login-card__subtitle">
            Chào mừng trở lại! Vui lòng nhập thông tin đăng nhập.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            {formErr ? (
              <p className="login-google-err" role="alert">
                {formErr}
              </p>
            ) : null}
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                className="login-field__input"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFormErr(null);
                }}
                disabled={submitting}
              />
            </div>
            <div className="login-field">
              <label className="login-field__label" htmlFor="login-password">
                Mật khẩu
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                className="login-field__input"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormErr(null);
                }}
                disabled={submitting}
              />
            </div>

            <div className="login-row">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Ghi nhớ đăng nhập
              </label>
              <a className="login-forgot" href="#forgot">
                Quên mật khẩu?
              </a>
            </div>

            <button type="submit" className="login-btn-primary" disabled={submitting}>
              {submitting ? "Đang đăng nhập…" : "Đăng nhập"}
            </button>
          </form>

          {googleClientId ? <GoogleSignInButton /> : <GoogleSignInPlaceholder />}

          <div className="login-card__extra">
            <Link className="login-card__home-link" to="/">
              Quay lại trang chủ
            </Link>
            <p className="login-card__signup">
              Chưa có tài khoản?{" "}
              <Link className="login-card__signup-link" to="/register">
                Đăng ký ngay!
              </Link>
            </p>
          </div>
        </div>

        <div className="login-stats" aria-label="Thống kê nền tảng">
          {stats.map(({ value, label, tone, Icon }) => (
            <div key={label} className="login-stat">
              <div className={`login-stat__icon login-stat__icon--${tone}`}>
                <Icon />
              </div>
              <div>
                <p className="login-stat__value">{value}</p>
                <p className="login-stat__label">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
