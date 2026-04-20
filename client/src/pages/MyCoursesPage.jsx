import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  addCompletedCourseId,
  getCompletedEnrolledCourseIds,
  getOngoingCourseIds,
  removeCompletedCourseId
} from "../auth/enrolledCoursesStorage";
import { COURSE_IMG, COURSES, getCoursesByIds } from "../data/studentCourses";
import "../pages/DashboardHome.css";
import "./MyCoursesPage.css";

const AVATAR_PLACEHOLDER =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face";

function Stars({ value }) {
  const full = Math.min(5, Math.round(value));
  const stars = [];
  for (let i = 0; i < 5; i++) {
    const on = i < full;
    stars.push(
      <svg
        key={i}
        className={on ? "dh-stars__s dh-stars__s--full" : "dh-stars__s dh-stars__s--empty"}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        aria-hidden
      >
        <path
          fill={on ? "currentColor" : "#e5e7eb"}
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        />
      </svg>
    );
  }
  return <div className="dh-stars">{stars}</div>;
}

function IconCalendarSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconPeopleSmall() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 20v-1a4 4 0 014-4h4a4 4 0 014 4v1" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconArrowLearn() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MyCourseCard({ course, imageIndex, variant, onComplete, onReopen }) {
  const img = COURSE_IMG[imageIndex % COURSE_IMG.length];
  const isCompleted = variant === "completed";

  return (
    <article className={`dh-card myc-card ${isCompleted ? "myc-card--done" : ""}`}>
      <div className="dh-card__pattern" aria-hidden />
      <div className="dh-card__media">
        <img src={img} alt="" className="dh-card__img" loading="lazy" />
        <span className="dh-card__badge">{course.badge}</span>
      </div>
      <div className="dh-card__body">
        <div className="dh-card__row dh-card__row--top myc-card__rating-row">
          <div className="dh-card__rating">
            <Stars value={course.rating} />
            <span className="dh-card__rating-count">{course.ratingLabel}</span>
          </div>
        </div>
        <h2 className="dh-card__title">{course.title}</h2>
        <p className="dh-card__schedule">{course.schedule}</p>
        <div className="dh-card__meta">
          <span className="dh-card__meta-item">
            <IconCalendarSmall />
            Ngày khai giảng: {course.startDate}
          </span>
          <span className="dh-card__meta-item">
            <IconPeopleSmall />
            {course.enrolled}/{course.capacity}
          </span>
        </div>
        <div className="dh-card__footer myc-card__footer">
          <div className="dh-card__instructor">
            <img src={AVATAR_PLACEHOLDER} alt="" className="dh-card__instructor-avatar" width={36} height={36} />
            <span className="dh-card__instructor-name">{course.instructor}</span>
          </div>
          <div className="myc-card__cta-col">
            {isCompleted ? (
              <>
                <Link className="myc-card__learn" to={`/courses/${course.id}`}>
                  Xem lại
                  <IconArrowLearn />
                </Link>
                <button type="button" className="myc-card__secondary" onClick={() => onReopen(course.id)}>
                  Đăng ký học lại
                </button>
              </>
            ) : (
              <>
                <Link className="myc-card__learn" to={`/courses/${course.id}`}>
                  Học
                  <IconArrowLearn />
                </Link>
                <button type="button" className="myc-card__secondary" onClick={() => onComplete(course.id)}>
                  Hoàn thành khóa
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default function MyCoursesPage() {
  const [tab, setTab] = useState("ongoing");
  const [bump, setBump] = useState(0);

  useEffect(() => {
    function onCoursesChanged() {
      setBump((x) => x + 1);
    }
    window.addEventListener("tzone-courses-changed", onCoursesChanged);
    return () => window.removeEventListener("tzone-courses-changed", onCoursesChanged);
  }, []);

  const ongoingCourses = useMemo(() => getCoursesByIds(getOngoingCourseIds()), [bump, tab]);
  const completedCourses = useMemo(() => getCoursesByIds(getCompletedEnrolledCourseIds()), [bump, tab]);

  function handleComplete(courseId) {
    if (!window.confirm("Đánh dấu khóa này là đã hoàn thành?")) return;
    addCompletedCourseId(courseId);
    setTab("completed");
  }

  function handleReopen(courseId) {
    removeCompletedCourseId(courseId);
    setTab("ongoing");
  }

  const list = tab === "ongoing" ? ongoingCourses : completedCourses;

  const imageIndexFor = (id) => COURSES.findIndex((c) => c.id === id);

  return (
    <div className="myc">
      <h1 className="myc__title visually-hidden">Các khóa học của bạn</h1>
      <div className="myc__layout">
        <aside className="myc__sidebar" aria-label="Trạng thái khóa học">
          <button
            type="button"
            className={`myc__tab ${tab === "ongoing" ? "myc__tab--active" : ""}`}
            onClick={() => setTab("ongoing")}
          >
            Đang học
          </button>
          <button
            type="button"
            className={`myc__tab ${tab === "completed" ? "myc__tab--active" : ""}`}
            onClick={() => setTab("completed")}
          >
            Đã hoàn thành
          </button>
        </aside>
        <div className="myc__main">
          {list.length === 0 ? (
            <p className="myc__empty">
              {tab === "ongoing"
                ? "Bạn chưa có khóa đang học. Hãy đăng ký tại Tổng quan."
                : "Chưa có khóa nào được đánh dấu hoàn thành."}
            </p>
          ) : (
            <div className="myc__grid">
              {list.map((c) => (
                <MyCourseCard
                  key={c.id}
                  course={c}
                  imageIndex={imageIndexFor(c.id) >= 0 ? imageIndexFor(c.id) : 0}
                  variant={tab === "ongoing" ? "ongoing" : "completed"}
                  onComplete={handleComplete}
                  onReopen={handleReopen}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
