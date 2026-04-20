import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import CourseCategoryTapSuPage from "../pages/CourseCategoryTapSu";
import CourseCategoryToeicAPage from "../pages/CourseCategoryToeicA";
import CourseCategoryToeicBPage from "../pages/CourseCategoryToeicB";
import CourseCategoryToeicSWPage from "../pages/CourseCategoryToeicSW";
import LoginPage from "../pages/Login";
import AdminPage from "../pages/Admin";
import OnboardingPage from "../pages/Onboarding";
import RegisterPage from "../pages/Register";
import RegisterDetailsPage from "../pages/RegisterDetails";
import DashboardHome from "../pages/DashboardHome";
import MyCoursesPage from "../pages/MyCoursesPage";
import SchedulePage from "../pages/SchedulePage";
import StudentShell from "../layouts/StudentShell";
import AdminRoute from "./AdminRoute";
import OnboardingRoute from "./OnboardingRoute";
import PrivateRoute from "./PrivateRoute";

const PlaceholderPage = ({ title }) => (
  <div style={{ padding: 24, maxWidth: 720, margin: "0 auto" }}>
    <h1 style={{ fontSize: "1.5rem", marginBottom: 12 }}>{title}</h1>
    <p style={{ color: "#6b7280" }}>Trang đang được phát triển.</p>
  </div>
);

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/courses/tap-su" element={<CourseCategoryTapSuPage />} />
      <Route path="/courses/toeic-a" element={<CourseCategoryToeicAPage />} />
      <Route path="/courses/toeic-b" element={<CourseCategoryToeicBPage />} />
      <Route path="/courses/toeic-sw" element={<CourseCategoryToeicSWPage />} />
      <Route path="/courses" element={<PlaceholderPage title="Courses" />} />
      <Route path="/courses/:id" element={<PlaceholderPage title="Course Detail" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/onboarding"
        element={
          <OnboardingRoute>
            <OnboardingPage />
          </OnboardingRoute>
        }
      />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/register/details" element={<RegisterDetailsPage />} />
      <Route element={<PrivateRoute><StudentShell /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardHome />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/my-courses" element={<MyCoursesPage />} />
        <Route path="/account" element={<PlaceholderPage title="Thông tin cá nhân" />} />
        <Route path="/reviews" element={<PlaceholderPage title="Đánh giá" />} />
        <Route path="/tests" element={<PlaceholderPage title="Các bài kiểm tra" />} />
      </Route>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
