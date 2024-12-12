// HomeAndGardenPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios"; // اگر نیاز به API دارید
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import companiesData from "../CompaniesData/CompaniesData"; // ایمپورت داده‌های شرکت‌ه

const HomeAndGardenPage = () => {
  // وضعیت‌ها برای فیلترها و مرتب‌سازی
  const [minRating, setMinRating] = useState(1);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [verified, setVerified] = useState(false);
  const [sortOption, setSortOption] = useState("highestRating"); // معیار مرتب‌سازی

  // وضعیت برای داده‌ها، بارگذاری و خطا
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // برای هدایت

  const countries = {
    آمریکا: [
      "آلاباما",
      "آلاسکا",
      "آریزونا",
      "آرکانزاس",
      "کالیفرنیا",
      "کلرادو",
      "کانتیکت",
      "دلاویر",
      "فلوریدا",
      "جورجیا",
      "هاوایی",
      "آیداهو",
      "ایلینوی",
      "ایندیانا",
      "آیووا",
      "کانزاس",
      "کنتاکی",
      "لوئیزیانا",
      "مین",
      "مریلند",
      "ماساچوست",
      "میشیگان",
      "می‌سی‌سی‌پی",
      "میزوری",
      "مونتانا",
      "نبراسکا",
      "نوادا",
      "نیوهمپشایر",
      "نیوجرسی",
      "نیومکزیکو",
      "نیویورک",
      "کارولینای شمالی",
      "داکوتای شمالی",
      "اوهایو",
      "اوکلاهما",
      "اورگن",
      "پنسیلوانیا",
      "رود آیلند",
      "کارولینای جنوبی",
      "داکوتای جنوبی",
      "تنسی",
      "تگزاس",
      "یوتا",
      "ورمونت",
      "ویرجینیا",
      "واشینگتن",
      "ویرجینیای غربی",
      "ویسکانسین",
      "وایومینگ",
      "مینه‌سوتا",
    ],
    Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
    UK: ["England", "Scotland", "Wales", "Northern Ireland"],
    Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
    Germany: [
      "Bavaria",
      "Baden-Württemberg",
      "North Rhine-Westphalia",
      "Hesse",
      "Saxony",
    ],
    ایران: [
      "آذربایجان شرقی",
      "آذربایجان غربی",
      "اصفهان",
      "البرز",
      "ایلام",
      "بوشهر",
      "تهران",
      "چهارمحال و بختیاری",
      "خراسان جنوبی",
      "خراسان رضوی",
      "خراسان شمالی",
      "خوزستان",
      "زنجان",
      "سمنان",
      "سیستان و بلوچستان",
      "فارس",
      "قزوین",
      "قم",
      "کردستان",
      "کرمان",
      "کرمانشاه",
      "کهگیلویه و بویراحمد",
      "گلستان",
      "گیلان",
      "لرستان",
      "مازندران",
      "مرکزی",
      "مهرستان",
      "همدان",
      "هرمزگان",
      "یزد",
    ],
  };

  // داده‌های مرتب‌سازی
  const sortOptions = [
    { value: "highestRating", label: "بالاترین امتیاز" },
    { value: "lowestRating", label: "پایین ترین امتیاز" },
    { value: "mostReviews", label: "بیشترین نظرات" },
  ];

  // تابع برای دریافت داده‌ها از API یا استفاده از داده‌های محلی
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);

    try {
      // اگر از API استفاده می‌کنید، کد مربوطه را اینجا اضافه کنید.
      // برای حال حاضر از داده‌های محلی استفاده می‌کنیم:
      let filtered = companiesData.filter((company) => {
        return (
          company.rating >= minRating &&
          (country === "" ||
            company.location.toLowerCase().includes(country.toLowerCase())) &&
          (province === "" ||
            company.location.toLowerCase().includes(province.toLowerCase())) &&
          (!verified || (verified && company.isVerified))
        );
      });

      // مرتب‌سازی
      if (sortOption === "highestRating") {
        filtered.sort((a, b) => b.rating - a.rating);
      } else if (sortOption === "lowestRating") {
        filtered.sort((a, b) => a.rating - b.rating);
      } else if (sortOption === "mostReviews") {
        filtered.sort((a, b) => b.reviews - a.reviews);
      }

      setCompanies(filtered);
    } catch (err) {
      setError("خطا در دریافت داده‌ها. لطفاً دوباره تلاش کنید.");
      console.error("Error fetching companies:", err);
    } finally {
      setLoading(false);
    }
  };

  // استفاده از useEffect برای واکشی داده‌ها در ابتدا و هر بار که فیلترها تغییر می‌کنند
  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minRating, country, province, verified, sortOption]);

  // تابع رندر کردن ستاره‌ها
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

  // تابع برای هدایت به صفحه جزئیات شرکت
  const handleDetails = (id) => {
    navigate(`/companies/${id}`);
  };

  return (
    <div>
      
      {/* Section */}
      <section className="bg-light py-4">
        <div className="container text-center">
          <h2>سرویس خانه</h2>
          <p className="text-muted">
            بهترین سایت های سرویس خانه را باهم مقایسه کنید
          </p>
        </div>
      </section>

      {/* Filters and Companies */}
      <div dir="rtl" className="container my-4">
        <div className="row">
          {/* ستون کناری فیلترها */}
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

            {/* فیلتر ستاره */}
            <div className="mb-3">
              <label className="form-label">ستاره</label>
              <div className="d-flex">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <span
                    key={rating}
                    onClick={() => setMinRating(rating)}
                    style={{
                      cursor: "pointer",
                      color: rating <= minRating ? "#FFD700" : "#ddd",
                      fontSize: "1.5rem",
                    }}
                  >
                    {rating <= minRating ? <FaStar /> : <FaRegStar />}
                  </span>
                ))}
              </div>
            </div>

            {/* فیلتر کشور */}
            <div className="mb-3">
              <label className="form-label">نام کشور</label>
              <select
                className="form-select"
                value={country}
                onChange={(e) => {
                  setCountry(e.target.value);
                  setProvince(""); // Reset province when country changes
                }}
              >
                <option value="">انتخاب کنید</option>
                {Object.keys(countries).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* فیلتر استان/ایالت */}
            {country && (
              <div className="mb-3">
                <label className="form-label">نام استان/ایالت</label>
                <select
                  className="form-select"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                >
                  <option value="">انتخاب کنید</option>
                  {countries[country].map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* فیلتر وضعیت شرکت */}
            <div className="mb-3">
              <label className="form-label">وضعیت شرکت</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="verified"
                  checked={verified}
                  onChange={() => setVerified(!verified)}
                />
                <label className="form-check-label" htmlFor="verified">
                  تایید شده
                </label>
              </div>
            </div>
          </aside>

          {/* بخش شرکت‌ها */}
          <main className="col-md-9">
            {/* بخش شمارش و مرتب‌سازی */}
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

            {/* نمایش شرکت‌ها */}
            {loading ? (
              <p>در حال بارگذاری...</p>
            ) : error ? (
              <p className="text-danger">{error}</p>
            ) : companies.length === 0 ? (
              <p>هیچ شرکتی با این فیلترها یافت نشد.</p>
            ) : (
              <div className="list-group">
                {companies.map((company) => (
                  <div
                    key={company.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={company.profileImage}
                        alt={company.name}
                        className="rounded me-3"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h5 className="mb-1">{company.name}</h5>
                        <div className="mb-1">{renderStars(company.rating)}</div>
                        <small className="text-muted">
                          {company.rating.toFixed(1)} میانگین امتیاز |{" "}
                          {company.reviews} نظر
                          <br />
                          {company.location}
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
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

    </div>
  );
};

export default HomeAndGardenPage;
