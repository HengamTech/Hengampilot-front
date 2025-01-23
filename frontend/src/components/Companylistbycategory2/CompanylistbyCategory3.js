import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

import { API_BASE_URL } from '../config';

const Companylistbycategory1 = () => {
  const navigate = useNavigate();
  // از آدرس URL پارامتر category_name را می‌گیریم
  const { id:category_name}  = useParams();
  console.log("Salam",category_name)
  // مقادیر مربوط به فیلترها
  const [minRating, setMinRating] = useState(0);
  const [verified, setVerified] = useState(false);
  const [sortOption, setSortOption] = useState("highestRating");

  // برای کنترل فیلترها در لحظه (پیش از اعمال نهایی)
  const [tempMinRating, setTempMinRating] = useState(1);
  const [tempVerified, setTempVerified] = useState(false);

  // آرایه‌ی نهایی کسب‌وکارها
  const [companies, setCompanies] = useState([]);
  // حالت‌های لودینگ و خطا
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // اگر نیاز به توکن برای احراز هویت دارید
  const token = localStorage.getItem("token");

  // آبجکت‌های مرتب‌سازی
  const sortOptions = [
    { value: "highestRating", label: "بالاترین امتیاز" },
    { value: "lowestRating", label: "پایین ترین امتیاز" },
    { value: "mostReviews", label: "بیشترین نظرات" },
  ];

  // تابع گرفتن لیست شرکت‌ها از سرور (فقط از یک اندپوینت)
  const fetchAllBusinesses = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/business_management/businesses/category-businesses/`,
        {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
          params:{
            // سرور طبق کد شما انتظار category_name را به‌صورت کوئری دریافت می‌کند
            category_name: category_name,
          },
        }
      );

      // حالا businesses را دریافت کردید
      const fetchedCompanies = response.data || [];

      // اینجا می‌توانید لاگ کنید که چه چیزی از سرور آمده
      console.log("fetchedCompanies:", fetchedCompanies);

      // بعداً در همین تابع، فیلترهای سمت کلاینت را اعمال می‌کنیم
      let finalFiltered = fetchedCompanies.filter((company) => {
        // بررسی میانگین امتیاز
        const matchRating = company.average_rating >= minRating;
        // بررسی وضعیت تاییدشده
        const matchVerified = !verified || (verified && company.is_verified);

        return matchRating && matchVerified;
      });

      // مرتب‌سازی بر اساس selectBox
      if (sortOption === "highestRating") {
        finalFiltered.sort((a, b) => b.average_rating - a.average_rating);
      } else if (sortOption === "lowestRating") {
        finalFiltered.sort((a, b) => a.average_rating - b.average_rating);
      } else if (sortOption === "mostReviews") {
        finalFiltered.sort((a, b) => b.total_reviews - a.total_reviews);
      }

      // حالا نهایی را در state می‌گذاریم
      setCompanies(finalFiltered);
    } catch (err) {
      setError("خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.");
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  // هر بار که category_name یا فیلترها عوض شدند، دوباره داده را بگیر
  useEffect(() => {
    // اگر category_name به‌درستی در آدرس هست، fetchAllBusinesses را صدا بزن
    if (category_name) {
      fetchAllBusinesses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category_name, minRating, verified, sortOption]);

  // تابع اعمال فیلترها از مقادیر temp به state اصلی
  const applyFilters = () => {
    setMinRating(tempMinRating);
    setVerified(tempVerified);
  };

  // تابع رندر ستاره‌ها
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: "#FFD700" }} data-testid={`star-${i}`} />);
    }
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" style={{ color: "#FFD700" }} data-testid="star-half" />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: "#FFD700" }} data-testid={`star-empty-${i}`} />);
    }

    return stars;
  };

  // دکمه جزئیات
  const handleDetails = (id) => {
    navigate(`/companies/${id}`);
  };

  return (
    <div>
      {/* هدر بالای صفحه */}
      <section className="bg-light py-4">
        <div className="container text-center">
          <h2>دسته بندی {category_name}</h2>
          <p className="text-muted">
            شرکت‌های مرتبط با {category_name} را مشاهده کنید
          </p>
        </div>
      </section>

      <div dir="rtl" className="container my-4">
        <div className="row">
          {/* ستون سایدبار فیلترها */}
          <aside
            className="col-md-3 shadow p-3 mb-3 bg-white rounded h-100"
            style={{
              padding: "10px",
              boxShadow:
                "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)",
              backgroundColor: "#FFFDF5",
            }}
          >
            <h1 style={{ marginBottom: "20px" }}>فیلتر ها</h1>
            <div className="mb-3">
              <label className="form-label">ستاره</label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    onClick={() => setTempMinRating(rating)}
                    style={{
                      cursor: "pointer",
                      color: rating <= tempMinRating ? "#FFD700" : "#ddd",
                      fontSize: "1.5rem",
                    }}
                  >
                    {rating <= tempMinRating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">وضعیت شرکت</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="verified"
                  checked={tempVerified}
                  onChange={() => setTempVerified(!tempVerified)}
                />
                <label className="form-check-label" htmlFor="verified">
                  تایید شده
                </label>
              </div>
            </div>

            <button data-testid="applyF" className="btn btn-success w-100" onClick={applyFilters}>
              اعمال فیلتر
            </button>
          </aside>

          {/* ستون محتوای اصلی (لیست شرکت‌ها) */}
          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>{companies.length} شرکت یافت شد</span>
              <select
                className="form-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* وضعیت‌ها */}
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : companies.length === 0 ? (
              <p>هیچ شرکتی با این فیلترها یافت نشد.</p>
            ) : (
              <div className="list-group">
                {companies.map((company) => {
                  const imageSrc =
                    `${API_BASE_URL}${company.business_image}` || "https://via.placeholder.com/80";
                    console.log("salam",company.business_image);
                  return (
                    <div
                      key={company.id}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={imageSrc}
                          // alt={company.business_name}
                          className="rounded me-3"
                          style={{
                            width: "80px",
                            height: "80px",
                            marginLeft: "20px",
                            marginBottom: "10px",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <h5 className="mb-1">{company.business_name}</h5>
                          <div className="mb-1">
                            {renderStars(company.average_rating)}
                          </div>
                          <small className="text-muted">
                            {company.average_rating.toFixed(1)} میانگین امتیاز |{" "}
                            {company.total_reviews} نظر
                            <br/>
                            {company.website_url}
                          </small>
                        </div>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleDetails(company.id)}
                      >
                        جزئیات بیشتر
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Companylistbycategory1;
