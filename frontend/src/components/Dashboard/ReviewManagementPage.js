// src/components/ReviewManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import companies from "../CompaniesData/CompaniesData"; // مسیر درست به CompaniesData.js
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar,
  faUsers,
  faCommentDots,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

const ReviewManagementPage = () => {
  const navigate = useNavigate();

  // داده‌های ادمین
  const adminData = {
    name: "ادمین",
    role: "مدیر سایت",
  };

  // وضعیت صفحه فعال
  const [activePage, setActivePage] = useState("manageComments");

  // مدیریت تغییر صفحه
  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/${page}`); // مسیرها را در App.js تعریف کنید
  };

  // مدیریت کاربران (تعریف عملکرد خاص)
  const handleUserManagement = () => {
    setActivePage("manageUsers");
    navigate("/manageUsers");
  };

  // وضعیت نظرات با استفاده از localStorage
  const [reviews, setReviews] = useState(() => {
    const savedReviews = localStorage.getItem("reviews");
    return savedReviews
      ? JSON.parse(savedReviews)
      : [
          {
            id: 1,
            username: "علی",
            rating: 4.5,
            comment: "خدمات عالی و تیم حرفه‌ای.",
            date: "2024-04-20",
            status: "pending", // وضعیت نظرات: pending, approved, rejected
            category: "باغبانی",
            companyId: 1,
          },
          {
            id: 2,
            username: "مریم",
            rating: 5.0,
            comment: "کاملاً راضی از کیفیت کارها.",
            date: "2024-04-18",
            status: "approved",
            category: "بهبود خانه",
            companyId: 2,
          },
          {
            id: 3,
            username: "سارا",
            rating: 3.0,
            comment: "تعداد زیادی مشکل در خدمات وجود داشت.",
            date: "2024-04-15",
            status: "rejected",
            category: "باغبانی",
            companyId: 1,
          },
          // نظرات بیشتری اضافه کنید
        ];
  });

  // به‌روزرسانی localStorage هنگام تغییر نظرات
  useEffect(() => {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  }, [reviews]);

  // وضعیت جستجو و فیلتر
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected
  const [filterCategory, setFilterCategory] = useState("all"); // all, دسته‌بندی‌ها

  // دسته‌بندی‌ها برای فیلتر
  const categories = ["باغبانی", "بهبود خانه", "خدمات مشتریان", "دیگر"];

  // تابع برای رندر کردن ستاره‌ها
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: "#FFD700" }} />);
    }
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" style={{ color: "#FFD700" }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: "#FFD700" }} />);
    }

    return stars;
  };

  // تابع برای تایید نظر
  const approveReview = (id) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { ...review, status: "approved" } : review
    );
    setReviews(updatedReviews);
  };

  // تابع برای رد نظر
  const rejectReview = (id) => {
    const updatedReviews = reviews.map((review) =>
      review.id === id ? { ...review, status: "rejected" } : review
    );
    setReviews(updatedReviews);
  };

  // تابع برای حذف نظر
  const deleteReview = (id) => {
    if (window.confirm("آیا از حذف این نظر اطمینان دارید؟")) {
      const updatedReviews = reviews.filter((review) => review.id !== id);
      setReviews(updatedReviews);
    }
  };

  // فیلتر و جستجوی نظرات
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" ? true : review.status === filterStatus;

    const matchesCategory =
      filterCategory === "all" ? true : review.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // تابع برای دریافت نام شرکت بر اساس companyId
  const getCompanyName = (companyId) => {
    const company = companies.find((c) => c.id === companyId);
    return company ? company.name : "نامشخص";
  };

  return (
    <div className="container-fluid"dir="rtl">
      <div className="row">
        {/* Sidebar */}
        {/* <aside className="col-12 col-md-3 bg-dark text-white p-3">
          <div className="text-center mb-4">
          <h4>مدیر سیستم</h4>
            <p>نقش: مدیر</p>

          </div>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "dashboard" ? "bg-primary" : ""}`}
                  onClick={() => handlePageChange("AdminDashboard")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  داشبورد
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "manageUsers" ? "bg-primary" : ""}`}
                  onClick={() => handlePageChange("UserManagement")}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت کاربران
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "manageComments" ? "bg-primary" : ""}`}
                  onClick={() => handlePageChange("manageComments")}
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                  مدیریت نظرات
                </a>
              </li> */}
             {/* <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "manageSite" ? "bg-primary" : ""}`}
                  onClick={() => handlePageChange("manageSite")}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت سایت
                </a>
              </li>
              */}
              {/* <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "settings" ? "bg-primary" : ""}`}
                  onClick={() => handlePageChange("settings")}
                >
                  <FontAwesomeIcon icon={faCog} />
                  تنظیمات
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                  onClick={() => handlePageChange("logout")}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  خروج
                </a>
              </li>
            </ul>
          </nav>
        </aside> */}

        {/* Main Content */}
        <main className="col-12 col-md-9" >
          <h2 className="mb-4">مدیریت نظرات</h2>

          {/* بخش فیلتر کردن نظرات */}
          <div className="row mb-4">
            <div className="col-md-4 mb-2">
              <input
                type="text"
                className="form-control"
                placeholder="جستجو بر اساس نام کاربری یا نظر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-4 mb-2">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار تایید</option>
                <option value="approved">تایید شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>
            <div className="col-md-4 mb-2">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">همه دسته‌بندی‌ها</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* جدول نظرات */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover align-middle text-center">
              <thead>
                <tr>
                  <th scope="col">نام کاربری</th>
                  <th scope="col">دسته‌بندی</th>
                  <th scope="col">شرکت</th>
                  <th scope="col">امتیاز</th>
                  <th scope="col">نظر</th>
                  <th scope="col">تاریخ</th>
                  <th scope="col">وضعیت</th>
                  <th scope="col">عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredReviews.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center">
                      هیچ نظری یافت نشد.
                    </td>
                  </tr>
                ) : (
                  filteredReviews.map((review) => (
                    <tr key={review.id}>
                      <td>{review.username}</td>
                      <td>{review.category}</td>
                      <td>{getCompanyName(review.companyId)}</td>
                      <td>{renderStars(review.rating)}</td>
                      <td>{review.comment}</td>
                      <td>{review.date}</td>
                      <td>
                        {review.status === "approved" && (
                          <span className="badge bg-success">تایید شده</span>
                        )}
                        {review.status === "pending" && (
                          <span className="badge bg-warning text-dark">در انتظار</span>
                        )}
                        {review.status === "rejected" && (
                          <span className="badge bg-danger">رد شده</span>
                        )}
                      </td>
                      <td>
                        {review.status === "pending" && (
                          <>
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => approveReview(review.id)}
                              title="تایید نظر"
                            >
                              <FaCheck />
                            </button>
                            <button
                              className="btn btn-danger btn-sm me-2"
                              onClick={() => rejectReview(review.id)}
                              title="رد نظر"
                            >
                              <FaTimes />
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-secondary btn-sm me-2"
                          onClick={() => navigate(`/companies/${review.companyId}`)} // هدایت به جزئیات شرکت مرتبط
                          title="مشاهده جزئیات"
                        >
                          <FaStarHalfAlt />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteReview(review.id)}
                          title="حذف نظر"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      
    </div>
  );
};

export default ReviewManagementPage;
