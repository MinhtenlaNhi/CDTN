import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CourseCategoryTapSuPage from "../CourseCategoryTapSu";
import CourseCategoryToeicAPage from "../CourseCategoryToeicA";
import CourseCategoryToeicBPage from "../CourseCategoryToeicB";
import CourseCategoryToeicSWPage from "../CourseCategoryToeicSW";
import UserNavMenu from "../../components/UserNavMenu";
import "./styles.css";

function HamburgerIcon() {
  return (
    <svg
      className="nav-category__icon-svg"
      width="20"
      height="14"
      viewBox="0 0 20 14"
      aria-hidden
    >
      <path
        d="M0 1h20M0 7h20M0 13h20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      className="search-box__icon-svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconBenefitTeacher() {
  return (
    <svg className="benefit-card__icon" viewBox="0 0 48 48" aria-hidden>
      <rect
        x="5"
        y="7"
        width="26"
        height="20"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M5 14h26" stroke="currentColor" strokeWidth="2" />
      <path
        d="M11 30v7M16 30v9M21 30v7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="37" cy="31" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M37 25v12M33 34h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconBenefitBook() {
  return (
    <svg className="benefit-card__icon" viewBox="0 0 48 48" aria-hidden>
      <rect x="6" y="10" width="16" height="26" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="24" y="10" width="16" height="26" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M22 10v28" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconBenefitWifi() {
  return (
    <svg className="benefit-card__icon" viewBox="0 0 48 48" aria-hidden>
      <path
        d="M8 28c6-6 14-6 20 0M14 34c4-3 8-3 12 0M20 40h2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="40" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconBenefitTarget() {
  return (
    <svg className="benefit-card__icon" viewBox="0 0 48 48" aria-hidden>
      <circle cx="24" cy="26" r="14" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="26" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="26" r="3" fill="currentColor" />
      <path d="M34 12l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function HeroDecoStarBlue() {
  return (
    <svg
      className="hero-deco hero-deco--svg hero-deco--blue-star"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path fill="#3b82f6" d="M12 2l2.2 6.8H21l-5.5 4 2.1 6.5L12 15.8 6.4 19.3l2.1-6.5L3 8.8h6.8L12 2z" />
    </svg>
  );
}

function HeroDecoStarYellow() {
  return (
    <svg
      className="hero-deco hero-deco--svg hero-deco--yellow-star"
      viewBox="0 0 24 24"
      aria-hidden
    >
      <path
        fill="none"
        stroke="#eab308"
        strokeWidth="2"
        d="M12 4l1.8 5.5H19l-4.5 3.3 1.7 5.2L12 16.8 7.8 18l1.7-5.2L5 9.5h5.2L12 4z"
      />
    </svg>
  );
}

const benefitItems = [
  {
    title: "GIẢNG VIÊN TOEIC 900+",
    subtitle: "Kinh nghiệm luyện thi thực chiến",
    Icon: IconBenefitTeacher
  },
  {
    title: "LỘ TRÌNH RÕ RÀNG",
    subtitle: "Từ mất gốc đến 800+",
    Icon: IconBenefitBook
  },
  {
    title: "HỌC ONLINE LINH HOẠT",
    subtitle: "Mọi lúc mọi nơi",
    Icon: IconBenefitWifi
  },
  {
    title: "CAM KẾT ĐẦU RA",
    subtitle: "Không đạt học lại miễn phí",
    Icon: IconBenefitTarget
  }
];

const categories = [
  { label: "TẬP SỰ", id: "tap-su" },
  { label: "TOEIC A", id: "toeic-a" },
  { label: "TOEIC B", id: "toeic-b" },
  { label: "TOEIC S+W", id: "toeic-sw" }
];

const courses = [
  {
    id: 1,
    levelLabel: "KHÓA TẬP SỰ",
    title: "Tập Sự A01",
    schedule: "Tối 3-5-7 | 20h-21h30",
    price: "2.500.000đ",
    ratingCount: "4.5k",
    startDate: "5/7",
    enrolled: "10/23",
    instructor: {
      name: "Ms. Phương Anh",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80"
    },
    image: "/images/course-team-collab.png"
  },
  {
    id: 2,
    levelLabel: "KHÓA TOEIC A",
    title: "TOEIC A ST15",
    schedule: "Tối 2-4-6 | 18h-19h30",
    price: "3.200.000đ",
    ratingCount: "4.5k",
    startDate: "8/7",
    enrolled: "10/23",
    instructor: {
      name: "Ms. Thu Linh",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80"
    },
    image: "/images/course-library-student.png"
  },
  {
    id: 3,
    levelLabel: "KHÓA TOEIC B",
    title: "TOEIC B S17",
    schedule: "Tối 3-5-7 | 17h30-19h30",
    price: "3.000.000đ",
    ratingCount: "4.5k",
    startDate: "12/7",
    enrolled: "10/23",
    instructor: {
      name: "Ms. Minh Hạnh",
      avatar:
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=120&q=80"
    },
    image: "/images/course-group-study.png"
  }
];

function IconCalendarSmall() {
  return (
    <svg className="info-pill__icon" viewBox="0 0 20 20" aria-hidden>
      <rect
        x="3"
        y="4"
        width="14"
        height="13"
        rx="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M3 8h14M7 2v3M13 2v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconUserSmall() {
  return (
    <svg className="info-pill__icon" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="7" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M4 17c1.5-3 3.5-4 6-4s4.5 1 6 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const teachers = [
  {
    name: "Ms. Thu Linh",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=420&q=80"
  },
  {
    name: "Ms. Huyền My",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=420&q=80"
  },
  {
    name: "Ms. Minh Hạnh",
    image:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=420&q=80"
  }
];

const reviewIntro = {
  text:
    "Học viên chia sẻ trải nghiệm thực tế sau các khóa học tại TZone — từ lộ trình rõ ràng đến sự đồng hành của giảng viên.",
  tagline: "Chăm chỉ là có chứng chỉ"
};

const reviewTestimonials = [
  {
    id: 1,
    quote:
      '"Giáo viên vui vẻ, bài học sát đề thi và dễ hiểu. Mình đã tự tin hơn rất nhiều khi làm bài."',
    name: "Linh Chi",
    classInfo: "Lớp TOEIC A — Khai giảng 3/2025"
  },
  {
    id: 2,
    quote:
      '"Mình đã cải thiện điểm sau 6 tuần học tại TZone. Lịch học linh hoạt rất hợp với sinh viên."',
    name: "Giang Thủy",
    classInfo: "Lớp TOEIC B — Khai giảng 1/2025"
  }
];

function ReviewSunDeco() {
  return (
    <div className="reviews-strip__sun" aria-hidden>
      <img
        src="/images/review-sun.png"
        alt=""
        className="reviews-strip__sun-img"
        decoding="async"
      />
    </div>
  );
}

function IconCloudAccent() {
  return (
    <img
      src="/images/review-cloud.png"
      alt=""
      className="review-intro__cloud-img"
      width={40}
      height={40}
      decoding="async"
    />
  );
}

/** Logo / nhãn hiển thị — số TK & QR lấy từ API `/api/payment-methods`. Logo PNG trong `public/images/payments/`. */
const PAYMENT_DISPLAY = [
  {
    id: "mb",
    label: "MB Bank",
    short: "MB",
    logoSrc: "/images/payments/mb.png",
    accent: "#1434a4"
  },
  {
    id: "vcb",
    label: "Vietcombank",
    short: "VCB",
    logoSrc: "/images/payments/vietcombank.png",
    accent: "#006b68"
  },
  {
    id: "tcb",
    label: "Techcombank",
    short: "TCB",
    logoSrc: "/images/payments/techcombank.png",
    accent: "#ed1c24"
  },
  {
    id: "agri",
    label: "Agribank",
    short: "AGR",
    logoSrc: "/images/payments/agribank.png",
    accent: "#9e1b32"
  },
  {
    id: "vib",
    label: "VIB",
    short: "VIB",
    logoSrc: "/images/payments/vib.png",
    accent: "#1b3b6f"
  },
  {
    id: "momo",
    label: "Ví MoMo",
    short: "MoMo",
    logoSrc: "/images/payments/momo.png",
    accent: "#a50064"
  }
];

const PAYMENT_BANK_EMPTY = {
  accountNumber: "",
  accountName: "",
  branch: "",
  note: "",
  qrImage: null
};

function qrCodeUrl(text) {
  const clean = String(text).replace(/\s/g, "");
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=8&data=${encodeURIComponent(clean)}`;
}

export default function HomePage() {
  const location = useLocation();
  const categoryDetailRef = useRef(null);
  const [openCategoryId, setOpenCategoryId] = useState(null);
  const [paymentDetailId, setPaymentDetailId] = useState(null);
  const [paymentBankById, setPaymentBankById] = useState({});
  const [paymentBankLoading, setPaymentBankLoading] = useState(true);
  const [paymentBankError, setPaymentBankError] = useState(false);

  useEffect(() => {
    const base = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
    const url = `${base}/api/payment-methods`;
    let cancelled = false;
    setPaymentBankLoading(true);
    setPaymentBankError(false);
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error("bad status");
        return r.json();
      })
      .then((body) => {
        if (cancelled) return;
        if (!body?.success || !Array.isArray(body.data)) {
          setPaymentBankError(true);
          setPaymentBankById({});
          return;
        }
        setPaymentBankById(Object.fromEntries(body.data.map((p) => [p.id, p])));
      })
      .catch(() => {
        if (!cancelled) {
          setPaymentBankError(true);
          setPaymentBankById({});
        }
      })
      .finally(() => {
        if (!cancelled) setPaymentBankLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const paymentMethods = useMemo(
    () =>
      PAYMENT_DISPLAY.map((row) => ({
        ...row,
        ...PAYMENT_BANK_EMPTY,
        ...(paymentBankById[row.id] || {})
      })),
    [paymentBankById]
  );

  useEffect(() => {
    const raw = location.hash || (typeof window !== "undefined" ? window.location.hash : "");
    const hash = raw.replace(/^#/, "");
    if (!hash) return;
    const t = window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => clearTimeout(t);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (!openCategoryId) return;
    const t = window.setTimeout(() => {
      categoryDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(t);
  }, [openCategoryId]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setPaymentDetailId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!paymentDetailId) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [paymentDetailId]);

  const paymentOpen = paymentDetailId
    ? (() => {
        const row = PAYMENT_DISPLAY.find((p) => p.id === paymentDetailId);
        if (!row) return null;
        return {
          ...row,
          ...PAYMENT_BANK_EMPTY,
          ...(paymentBankById[paymentDetailId] || {})
        };
      })()
    : null;

  return (
    <main id="top" className="home">
      <header className="hero">
        <nav className="top-nav" aria-label="Điều hướng chính">
          <div className="top-nav__left">
            <h1 className="logo">TZone</h1>
            <button type="button" className="nav-category">
              <HamburgerIcon />
              <span>Danh mục</span>
            </button>
          </div>
          <div className="search-box">
            <input
              type="search"
              name="q"
              placeholder="Tìm kiếm khóa học"
              autoComplete="off"
            />
            <span className="search-box__icon">
              <SearchIcon />
            </span>
          </div>
          <UserNavMenu />
        </nav>

        <section className="hero-content">
          <div className="hero-content__text">
            <h2>Chinh Phục TOEIC 800+</h2>
            <p className="hero-content__sub">
              20+ Bộ Đề TOEIC Chuẩn Luyện Thi Thực Tế Mỗi Ngày
            </p>
          </div>
          <div className="hero-content__visual">
            <HeroDecoStarBlue />
            <span className="hero-deco hero-deco--dot hero-deco--dot-green" aria-hidden />
            <HeroDecoStarYellow />
            <span className="hero-deco hero-deco--dot hero-deco--dot-red" aria-hidden />
            <img
              className="hero-content__img"
              src="/images/hero-banner.png"
              alt="Học viên ăn mừng thành công khi ôn luyện TOEIC với laptop"
              loading="eager"
              decoding="async"
            />
          </div>
        </section>
      </header>

      <section className="benefits" aria-label="Điểm nổi bật">
        <div className="benefits__inner">
          {benefitItems.map(({ title, subtitle, Icon }) => (
            <article key={title} className="benefit-card">
              <Icon />
              <div className="benefit-card__text">
                <h3 className="benefit-card__title">{title}</h3>
                <p className="benefit-card__subtitle">{subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section
        id="danh-muc-khoa-hoc"
        className="section section--categories"
        aria-labelledby="heading-danh-muc"
      >
        <div className="section-heading">
          <span className="section-heading__accent" aria-hidden />
          <h3 id="heading-danh-muc" className="section-heading__title">
            DANH MỤC KHÓA HỌC
          </h3>
        </div>
        <div className="category-grid">
          {categories.map(({ label, id }) => (
            <button
              key={id}
              type="button"
              className={`category-card${openCategoryId === id ? " category-card--active" : ""}`}
              onClick={() => setOpenCategoryId((prev) => (prev === id ? null : id))}
              aria-expanded={openCategoryId === id}
              aria-controls={openCategoryId ? "home-category-detail" : undefined}
            >
              <span className="category-card__label">{label}</span>
            </button>
          ))}
        </div>
        {openCategoryId ? (
          <div
            id="home-category-detail"
            ref={categoryDetailRef}
            className="home-category-detail"
            role="region"
            aria-label="Chi tiết danh mục khóa học"
          >
            {openCategoryId === "tap-su" && <CourseCategoryTapSuPage embedded />}
            {openCategoryId === "toeic-a" && <CourseCategoryToeicAPage embedded />}
            {openCategoryId === "toeic-b" && <CourseCategoryToeicBPage embedded />}
            {openCategoryId === "toeic-sw" && <CourseCategoryToeicSWPage embedded />}
          </div>
        ) : null}
      </section>

      <section
        id="khoa-hoc-sap-khai-giang"
        className="courses-strip"
        aria-labelledby="courses-strip-title"
      >
        <div className="courses-strip__container">
          <div className="section-heading" id="courses-strip-title">
            <span className="section-heading__accent" aria-hidden />
            <h3 className="section-heading__title">KHÓA HỌC SẮP KHAI GIẢNG</h3>
          </div>
          <div className="course-grid">
            {courses.map((course) => (
              <article key={course.id} className="course-card">
                <div className="course-card__media">
                  <img src={course.image} alt={course.title} />
                  <span className="course-card__badge">{course.levelLabel}</span>
                </div>
                <div className="course-card__body">
                  <div className="course-card__row course-card__row--meta">
                    <div className="course-card__rating">
                      <span className="course-card__stars" aria-hidden>
                        ★★★★★
                      </span>
                      <span className="course-card__rating-count">{course.ratingCount}</span>
                    </div>
                    <span className="course-card__price">{course.price}</span>
                  </div>
                  <h4 className="course-card__course-title">{course.title}</h4>
                  <p className="course-card__schedule">{course.schedule}</p>
                  <div className="course-card__pills">
                    <span className="info-pill">
                      <IconCalendarSmall />
                      Ngày khai giảng: {course.startDate}
                    </span>
                    <span className="info-pill">
                      <IconUserSmall />
                      {course.enrolled}
                    </span>
                  </div>
                  <div className="course-card__row course-card__row--footer">
                    <div className="course-card__instructor">
                      <img
                        src={course.instructor.avatar}
                        alt=""
                        className="course-card__avatar"
                        width={36}
                        height={36}
                      />
                      <span className="course-card__instructor-name">
                        {course.instructor.name}
                      </span>
                    </div>
                    <button type="button" className="btn-course-join">
                      Tham gia <span aria-hidden>→</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <button type="button" className="view-all">
            Xem tất cả
          </button>
        </div>
      </section>

      <section className="section section--teachers">
        <div className="section-heading">
          <span className="section-heading__accent" aria-hidden />
          <h3 className="section-heading__title">GIẢNG VIÊN TIÊU BIỂU</h3>
        </div>
        <div className="teacher-grid">
          {teachers.map((teacher) => (
            <figure key={teacher.name} className="teacher-card">
              <div className="teacher-card__photo">
                <img src={teacher.image} alt={teacher.name} />
              </div>
              <figcaption className="teacher-card__name">{teacher.name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section
        id="danh-gia"
        className="reviews-strip"
        aria-labelledby="reviews-heading"
      >
        <div className="reviews-strip__container">
          <ReviewSunDeco />
          <div className="section-heading" id="reviews-heading">
            <span className="section-heading__accent" aria-hidden />
            <h3 className="section-heading__title">ĐÁNH GIÁ</h3>
          </div>
          <div className="review-layout">
            <div className="review-intro">
              <p className="review-intro__text">{reviewIntro.text}</p>
              <p className="review-intro__tagline">
                <IconCloudAccent />
                <span className="review-intro__tagtext">{reviewIntro.tagline}</span>
              </p>
              <button type="button" className="btn-review-all">
                Xem tất cả
              </button>
            </div>
            {reviewTestimonials.map((item) => (
              <article key={item.id} className="review-card">
                <div className="review-card__stars" aria-hidden>
                  ★★★★★
                </div>
                <p className="review-card__quote">{item.quote}</p>
                <footer className="review-card__footer">
                  <strong className="review-card__author">{item.name}</strong>
                  <span className="review-card__class">{item.classInfo}</span>
                </footer>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer__col">
          <h4 className="footer__title">Về TZONE</h4>
          <nav className="footer__nav" aria-label="Liên kết nhanh">
            <Link className="footer__link" to="/#top">
              Trang chủ
            </Link>
            <Link className="footer__link" to="/#danh-muc-khoa-hoc">
              Danh mục
            </Link>
            <Link className="footer__link" to="/#khoa-hoc-sap-khai-giang">
              Khóa học sắp khai giảng
            </Link>
            <Link className="footer__link" to="/#danh-gia">
              Đánh giá
            </Link>
          </nav>
        </div>
        <div className="footer__col">
          <h4 className="footer__title">Liên hệ</h4>
          <nav className="footer__nav">
            <span className="footer__text">Trợ giúp</span>
            <a className="footer__link" href="tel:0564896201">
              Hotline: 0564896201
            </a>
          </nav>
        </div>
        <div className="footer__col">
          <h4 className="footer__title">Tài nguyên</h4>
          <nav className="footer__nav">
            <span className="footer__text">Chương trình liên kết</span>
          </nav>
        </div>
        <div className="footer__col footer__col--payments">
          <h4 className="footer__title">Phương thức thanh toán</h4>
          <div className="footer-payments">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                type="button"
                className="footer-payment-tile"
                style={{ "--pay-accent": pm.accent }}
                aria-label={`${pm.label} — xem số tài khoản và mã QR`}
                onClick={() => setPaymentDetailId(pm.id)}
              >
                <span className="footer-payment-tile__brand">
                  <img
                    src={pm.logoSrc}
                    alt=""
                    className="footer-payment-tile__logo-img"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              </button>
            ))}
          </div>
        </div>
      </footer>

      {paymentOpen ? (
        <div
          className="payment-modal-overlay"
          role="presentation"
          onClick={() => setPaymentDetailId(null)}
        >
          <div
            className="payment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="payment-modal__close"
              aria-label="Đóng"
              onClick={() => setPaymentDetailId(null)}
            >
              ×
            </button>
            <div className="payment-modal__head">
              <div className="payment-modal__brand-frame">
                <img
                  className="payment-modal__brand-logo"
                  src={paymentOpen.logoSrc}
                  alt=""
                  width={200}
                  height={80}
                />
              </div>
              <h3 id="payment-modal-title" className="payment-modal__title">
                {paymentOpen.label}
              </h3>
            </div>
            {paymentBankLoading ? (
              <p className="payment-modal__status">Đang tải thông tin tài khoản...</p>
            ) : paymentBankError ? (
              <p className="payment-modal__status">
                Không tải được thông tin thanh toán. Vui lòng thử lại sau.
              </p>
            ) : (
              <>
                <dl className="payment-modal__dl">
                  <div>
                    <dt>Số tài khoản</dt>
                    <dd>
                      <code className="payment-modal__acct">
                        {paymentOpen.accountNumber || "—"}
                      </code>
                      <button
                        type="button"
                        className="payment-modal__copy"
                        disabled={!paymentOpen.accountNumber?.trim()}
                        onClick={() =>
                          navigator.clipboard?.writeText(
                            String(paymentOpen.accountNumber).replace(/\s/g, "")
                          )
                        }
                      >
                        Sao chép
                      </button>
                    </dd>
                  </div>
                  <div>
                    <dt>Chủ tài khoản</dt>
                    <dd>{paymentOpen.accountName || "—"}</dd>
                  </div>
                  <div>
                    <dt>Chi nhánh / kênh</dt>
                    <dd>{paymentOpen.branch || "—"}</dd>
                  </div>
                </dl>
                <div className="payment-modal__qr-wrap">
                  <p className="payment-modal__qr-label">Quét mã QR</p>
                  <img
                    className="payment-modal__qr"
                    src={
                      paymentOpen.qrImage ||
                      qrCodeUrl(
                        `${paymentOpen.label}|${paymentOpen.accountNumber}|${paymentOpen.accountName}`
                      )
                    }
                    alt={`QR thanh toán ${paymentOpen.label}`}
                  />
                </div>
                <p className="payment-modal__note">{paymentOpen.note || "—"}</p>
              </>
            )}
          </div>
        </div>
      ) : null}
    </main>
  );
}
