import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { addEnrolledCourseId, getOngoingCourseIds, isCourseEnrolled } from "../auth/enrolledCoursesStorage";
import { COURSE_CATEGORIES, COURSE_IMG, COURSES, getCoursesByIds } from "../data/studentCourses";
import { findEnrollmentConflict } from "../utils/courseSchedule";
import "./DashboardHome.css";

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

function IconArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CourseCard({ course, imageIndex, joined, onJoin }) {
  const img = COURSE_IMG[imageIndex % COURSE_IMG.length];
  return (
    <article className="dh-card">
      <div className="dh-card__pattern" aria-hidden />
      <div className="dh-card__media">
        <img src={img} alt="" className="dh-card__img" loading="lazy" />
        <span className="dh-card__badge">{course.badge}</span>
      </div>
      <div className="dh-card__body">
        <div className="dh-card__row dh-card__row--top">
          <div className="dh-card__rating">
            <Stars value={course.rating} />
            <span className="dh-card__rating-count">{course.ratingLabel}</span>
          </div>
          <span className="dh-card__price">{course.price}</span>
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
        <div className="dh-card__footer">
          <div className="dh-card__instructor">
            <img src={AVATAR_PLACEHOLDER} alt="" className="dh-card__instructor-avatar" width={36} height={36} />
            <span className="dh-card__instructor-name">{course.instructor}</span>
          </div>
          <button
            type="button"
            className={`dh-card__cta ${joined ? "dh-card__cta--joined" : ""}`}
            disabled={joined}
            onClick={() => onJoin(course)}
          >
            {joined ? (
              "Đã tham gia"
            ) : (
              <>
                Tham gia
                <IconArrowRight />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function DashboardHome() {
  const [searchParams] = useSearchParams();
  const [, setEnrollBump] = useState(0);
  const categoryParam = searchParams.get("category");

  function handleJoin(course) {
    if (isCourseEnrolled(course.id)) return;
    const enrolled = getCoursesByIds(getOngoingCourseIds());
    const conflict = findEnrollmentConflict(course, enrolled);
    if (conflict) {
      window.alert(
        `Không thể đăng ký: lịch học trùng với khóa "${conflict.enrolledTitle}" (${conflict.weekdayLabel}: ${conflict.timeLabel}). Chỉ cần trùng một buổi cũng không thể đăng ký.`
      );
      return;
    }
    addEnrolledCourseId(course.id);
    setEnrollBump((t) => t + 1);
    window.alert(`Đã đăng ký tham gia khóa "${course.title}". Xem lịch tại mục Lịch học.`);
  }

  const activeCategory = useMemo(() => {
    if (!categoryParam) return null;
    return COURSE_CATEGORIES.some((c) => c.id === categoryParam) ? categoryParam : null;
  }, [categoryParam]);

  const filtered = useMemo(() => {
    if (!activeCategory) return COURSES;
    return COURSES.filter((c) => c.categoryId === activeCategory);
  }, [activeCategory]);

  const categoryLabel = useMemo(() => {
    if (!activeCategory) return null;
    return COURSE_CATEGORIES.find((c) => c.id === activeCategory)?.label;
  }, [activeCategory]);

  return (
    <div className="dh">
      <h1 className="dh__heading visually-hidden">Tổng quan khóa học</h1>
      {categoryLabel ? (
        <p className="dh__filter-hint" role="status">
          Đang hiển thị: <strong>{categoryLabel}</strong>
        </p>
      ) : null}
      {filtered.length === 0 ? (
        <p className="dh__empty">Không có khóa học trong danh mục này.</p>
      ) : (
        <div className="dh__grid">
          {filtered.map((c) => {
            const imageIndex = COURSES.findIndex((x) => x.id === c.id);
            return (
              <CourseCard
                key={c.id}
                course={c}
                imageIndex={imageIndex >= 0 ? imageIndex : 0}
                joined={isCourseEnrolled(c.id)}
                onJoin={handleJoin}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
