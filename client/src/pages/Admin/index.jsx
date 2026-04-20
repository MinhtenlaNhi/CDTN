import { useNavigate } from "react-router-dom";
import { clearAuth, getAuth } from "../../auth/auth";
import "./styles.css";

export default function AdminPage() {
  const navigate = useNavigate();
  const auth = getAuth();

  function handleLogout() {
    clearAuth();
    navigate("/", { replace: true });
  }

  return (
    <div className="admin-page">
      <header className="admin-page__header">
        <h1 className="admin-page__title">Quản trị TZone</h1>
        <button type="button" className="admin-page__logout" onClick={handleLogout}>
          Đăng xuất
        </button>
      </header>
      <main className="admin-page__main">
        <p className="admin-page__lead">
          Bạn đang đăng nhập với quyền <strong>quản trị viên</strong>.
        </p>
        {auth?.email ? (
          <p className="admin-page__meta">
            Email: <span className="admin-page__email">{auth.email}</span>
          </p>
        ) : null}
        <p className="admin-page__hint">
          Các chức năng quản lý khóa học, học viên… có thể bổ sung tại đây sau.
        </p>
      </main>
    </div>
  );
}
