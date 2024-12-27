import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";

const Companylistbycategory1 = () => {
  // گرفتن categoryId از پارامترهای آدرس
  // مثال: اگر مسیر شما "/category/5" باشد، categoryId = "5"
  const { id: categoryId } = useParams();

  const [minRating, setMinRating] = useState(0);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [verified, setVerified] = useState(false);
  const [sortOption, setSortOption] = useState("highestRating");

  const token = localStorage.getItem("token");
  const [categories, setCategories] = useState([]);

  // فیلدهای موقت فیلتر
  const [tempMinRating, setTempMinRating] = useState(1);
  const [tempCountry, setTempCountry] = useState("");
  const [tempProvince, setTempProvince] = useState("");
  const [tempVerified, setTempVerified] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const sortOptions = [
    { value: "highestRating", label: "بالاترین امتیاز" },
    { value: "lowestRating", label: "پایین ترین امتیاز" },
    { value: "mostReviews", label: "بیشترین نظرات" },
  ];

  // تابعی برای گرفتن همه بیزنس‌ها و سپس فیلتر بر اساس دسته‌بندی
  const fetchAllBusinesses = async () => {
    setLoading(true);
    setError(null);

    try {
      // اگر به توکن نیاز دارید، در هدر اضافه کنید:
      // headers: { Authorization: `Bearer ${token}` }
      const response = await axios.get("http://127.0.0.1:8000/business_management/businesses/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // پاسخ باید آرایه‌ای از بیزنس‌ها برگرداند
      // [{
      //   id: 10,
      //   business_name: "شرکت A",
      //   business_category: 5,
      //   average_rank: 4.2,
      //   ...
      // }, ...]

      let fetchedCompanies = response.data || [];
      // console.log(response.data);
      // اول فقط آن بیزنس‌هایی را برمی‌داریم که business_category === categoryId
      // دقت کنید categoryId از useParams رشته است؛ پس باید تبدیل به عدد شود
      // const catId = parseInt(categoryId, 10);
      // console.log(catId);
      let filteredByCategory = fetchedCompanies.filter((company) => {
        console.log(company.business_category);
        return company.business_category === categoryId;
      });

      // حالا فیلتر کردن بر اساس ستاره، لوکیشن و تایید شده بودن
      let finalFiltered = filteredByCategory.filter((company) => {
        // شرط ستاره
        let matchRating = company.average_rank >= minRating;
        // شرط کشور
        let matchCountry =
            country === "" ||
            (company.location &&
                company.location.toLowerCase().includes(country.toLowerCase()));
        // شرط استان
        let matchProvince =
            province === "" ||
            (company.location &&
                company.location.toLowerCase().includes(province.toLowerCase()));
        // شرط تایید
        let matchVerified = !verified || (verified && company.is_verified);

        return matchRating && matchCountry && matchProvince && matchVerified;
      });

      // مرتب‌سازی
      if (sortOption === "highestRating") {
        finalFiltered.sort((a, b) => b.average_rank - a.average_rank);
      } else if (sortOption === "lowestRating") {
        finalFiltered.sort((a, b) => a.average_rank - b.average_rank);
      } else if (sortOption === "mostReviews") {
        finalFiltered.sort((a, b) => b.total_reviews - a.total_reviews);
      }

      setCompanies(finalFiltered);
    } catch (err) {
      setError("خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.");
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await axios.get(
          `http://localhost:8000/business_management/category/${categoryId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setCategories(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // هروقت یکی از فیلترها (یا categoryId) تغییر کرد، دوباره اطلاعات را بگیر
  useEffect(() => {
    if (categoryId) {
      fetchAllBusinesses();
      fetchCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, minRating, country, province, verified, sortOption]);

  // اعمال فیلتر
  const applyFilters = () => {
    setMinRating(tempMinRating);
    setCountry(tempCountry);
    setProvince(tempProvince);
    setVerified(tempVerified);
  };

  // رندر ستاره‌ها
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

  // دکمه جزئیات بیشتر
  const handleDetails = (id) => {
    navigate(`/companies/${id}`);
  };
  return (
      <div>
        <section className="bg-light py-4">
          <div className="container text-center">
            <h2>دسته بندی {categories.category_name}</h2>
            <p className="text-muted">
              شرکت‌های مرتبط با {categories.category_name} را مشاهده کنید
            </p>
          </div>
        </section>

        <div dir="rtl" className="container my-4">
          <div className="row">
            {/* Sidebar فیلتر */}
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

              <button className="btn btn-success w-100" onClick={applyFilters}>
                اعمال فیلتر
              </button>
            </aside>

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
                          company.profileImage || "https://via.placeholder.com/80";
                      return (
                          <div
                              key={company.id}
                              className="list-group-item d-flex justify-content-between align-items-center"
                          >
                            <div className="d-flex align-items-center">
                              <img
                                  src={imageSrc}
                                  alt={company.business_name}
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
                                  {renderStars(company.average_rank)}
                                </div>
                                <small className="text-muted">
                                  {company.average_rank.toFixed(1)} میانگین امتیاز |{" "}
                                  {company.total_reviews} نظر
                                  <br />
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
