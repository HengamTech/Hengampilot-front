import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const HomeAndGardenPage = () => {
  const [minRating, setMinRating] = useState(1);
  const [country, setCountry] = useState("");
  const [province, setProvince] = useState("");
  const [verified, setVerified] = useState(false);
  const [sortOption, setSortOption] = useState("highestRating"); // معیار مرتب‌سازی

  const countries = {
     آمریکا: ["آلاباما", "آلاسکا", "آریزونا", "آرکانزاس", "کالیفرنیا", "کلرادو", "کانتیکت", "دلاویر", "فلوریدا", "جورجیا", "هاوایی", "آیداهو", "ایلینوی", "ایندیانا", "آیووا", "کانزاس", "کنتاکی", "لوئیزیانا", "مین", "مریلند", "ماساچوست", "میشیگان", "می‌سی‌سی‌پی", "میزوری", "مونتانا", "نبراسکا", "نوادا", "نیوهمپشایر", "نیوجرسی", "نیومکزیکو", "نیویورک", "کارولینای شمالی", "داکوتای شمالی", "اوهایو", "اوکلاهما", "اورگن", "پنسیلوانیا", "رود آیلند", "کارولینای جنوبی", "داکوتای جنوبی", "تنسی", "تگزاس", "یوتا", "ورمونت", "ویرجینیا", "واشینگتن", "ویرجینیای غربی", "ویسکانسین", "وایومینگ", "مینه‌سوتا"],
    Canada: ["Ontario", "Quebec", "British Columbia", "Alberta", "Manitoba"],
    UK: ["England", "Scotland", "Wales", "Northern Ireland"],
    Australia: ["New South Wales", "Victoria", "Queensland", "Western Australia"],
    Germany: ["Bavaria", "Baden-Württemberg", "North Rhine-Westphalia", "Hesse", "Saxony"],
    ایران: ["آذربایجان شرقی", "آذربایجان غربی", "اصفهان", "البرز", "ایلام", "بوشهر", "تهران", "چهارمحال و بختیاری", "خراسان جنوبی", "خراسان رضوی", "خراسان شمالی", "خوزستان", "زنجان", "سمنان", "سیستان و بلوچستان", "فارس", "قزوین", "قم", "کردستان", "کرمان", "کرمانشاه", "کهگیلویه و بویراحمد", "گلستان", "گیلان", "لرستان", "مازندران", "مرکزی", "مهرستان", "همدان", "هرمزگان", "یزد"]  };

  const companies = [
    {
      id: 1,
      name: "GreenTech Gardening",
      rating: 4.8,
      reviews: 120,
      location: "New York, USA",
      profileImage: "https://via.placeholder.com/50",
    },
    {
      id: 2,
      name: "Modern Home Solutions",
      rating: 4.6,
      reviews: 98,
      location: "California, USA",
      profileImage: "https://via.placeholder.com/50",
    },
    {
      id: 3,
      name: "Eco Garden Services",
      rating: 3.2,
      reviews: 50,
      location: "Texas, USA",
      profileImage: "https://via.placeholder.com/50",
    },
    {
      id: 4,
      name: "Urban Green Experts",
      rating: 5.0,
      reviews: 200,
      location: "Ontario, Canada",
      profileImage: "https://via.placeholder.com/50",
    },
  ];

  const filteredCompanies = companies
    .filter((company) => {
      return (
        company.rating >= minRating &&
        (country === "" ||
          company.location.toLowerCase().includes(country.toLowerCase())) &&
        (province === "" ||
          company.location.toLowerCase().includes(province.toLowerCase())) &&
        (!verified || (verified && company.isVerified))
      );
    })
    .sort((a, b) => {
      if (sortOption === "highestRating") return b.rating - a.rating;
      if (sortOption === "lowestRating") return a.rating - b.rating;
      if (sortOption === "mostReviews") return b.reviews - a.reviews;
      return 0;
    });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) stars.push(<FaStar key={`full-${i}`} style={{ color: "#FFD700" }} />);
    if (halfStar) stars.push(<FaStarHalfAlt key="half" style={{ color: "#DDD", transform: "rotateY(180deg)" }} />);
    for (let i = 0; i < emptyStars; i++) stars.push(<FaRegStar key={`empty-${i}`} style={{ color: "#DDD" }} />);

    return stars;
  };

  return (
    <div>
      {/* Header */}
      <header className="bg-dark text-white py-3">
        <div className="container d-flex justify-content-between align-items-center">
          <h1 className="text-uppercase m-0">Trustpilot</h1>
          <input
            type="text"
            className="form-control w-50"
            placeholder="Search for companies or categories..."
          />
        </div>
      </header>
      <section className="bg-light py-4">
        <div className="container text-center">
          <h2>سرویس  خانه</h2>
          <p className="text-muted">
            بهترین سایت های سرویس خانه را باهم مقایسه کنید
          </p>
        </div>
    </section>

      {/* Filters */}
      <div dir="rtl" className="container my-4">
        <div className="row">
          <aside className="col-md-3 shadow p-3 mb-3 bg-white rounded h-100" style={{ padding: "10px",boxShadow:" 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);",backgroundColor:"FFFDF5" }}>
            <h1 style={{ marginBottom: "20px" }}>فیلتر ها</h1>
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

          {/* Companies */}
          <main className="col-md-9">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span>{filteredCompanies.length} شرکت یافت شد</span>
              <select
                className="form-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="highestRating">بالاترین امتیاز</option>
                <option value="lowestRating">پایین ترین امتیاز</option>
                <option value="mostReviews">بیشترین نظرات</option>
              </select>
            </div>

            <div className="list-group">
              {filteredCompanies.map((company) => (
                <div
                  key={company.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center">
                    <img
                      src={company.profileImage}
                      alt={company.name}
                      className="rounded me-1"
                      style={{ width: "50px", height: "50px",position:"relative",top:"-20px",right:"-10px" }}
                    />
                    <div>
                      <h5 className="mb-1">{company.name}</h5>
                      <div className="mb-1">{renderStars(company.rating)}</div>
                      <small className="text-muted">
                        {company.rating.toFixed(1)} میانگین امتیاز | {company.reviews} نظر
                        <br />
                        {company.location}
                      </small>
                    </div>
                  </div>
                  <button className="btn btn-primary">جزئیات بیشتر</button>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p>© 2024 Trustpilot. All rights reserved.</p>
          <p>
            <a href="#" className="text-white text-decoration-none">
              Terms & Conditions
            </a>{" "}
            |{" "}
            <a href="#" className="text-white text-decoration-none">
              Privacy Policy
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomeAndGardenPage;
