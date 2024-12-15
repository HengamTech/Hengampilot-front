import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useParams } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const ReviewSubmit = () => {
  const navigate = useNavigate();
  const { id: businessId } = useParams(); // دریافت ID شرکت از URL

  const [formData, setFormData] = useState({
    review_text: "",
    rank: 0,
    user: "",
    business_id: businessId,
  });

  const [businessName, setBusinessName] = useState("");
  const [errors, setErrors] = useState({});

  // گرفتن اطلاعات کاربر از localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const user = localStorage.getItem("userId");

    if (!token) {
      alert("لطفاً وارد شوید.");
      navigate("/login");
      return;
    }

    // تنظیم اطلاعات کاربر
    setFormData((prev) => ({ ...prev, user: user }));

    // گرفتن نام شرکت از API
    const fetchBusinessName = async () => {
      try {
        const businessResponse = await axios.get(
          `http://127.0.0.1:8000/business_management/businesses/${businessId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBusinessName(businessResponse.data.business_name);
      } catch (error) {
        console.error("Error fetching business name:", error);
        alert("خطا در دریافت اطلاعات شرکت.");
      }
    };

    fetchBusinessName();
  }, [businessId, navigate]);

  // مدیریت تغییر در متن نظر
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // مدیریت انتخاب تعداد ستاره‌ها
  const handleStarClick = (rank) => {
    setFormData((prev) => ({ ...prev, rank }));
  };

  // اعتبارسنجی فرم
  const validateForm = () => {
    const newErrors = {};
    if (!formData.review_text.trim()) newErrors.review_text = "لطفاً متن نظر را وارد کنید.";
    if (!formData.rank) newErrors.rank = "لطفاً امتیاز خود را انتخاب کنید.";
    return newErrors;
  };

  // ارسال فرم
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("لطفاً وارد شوید.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/review_rating/reviews/",
          {
            review_text: formData.review_text,
            rank: formData.rank,
            business_id: formData.business_id,
            user: formData.user,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          alert("نظر شما با موفقیت ثبت شد!");
          navigate(`/companies/${businessId}`);
        } else {
          alert("خطا در ثبت نظر!");
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("خطا در ارسال نظر. لطفا دوباره تلاش کنید.");
      }
    }
  };

  return (
    <div className="container mt-5"dir="rtl">
      <h3 className="text-center mb-4">ثبت نظر</h3>
      <div className="card p-3">
        <h5>شرکت: {businessName}</h5>
        <h6>کاربر: {localStorage.getItem("username")}</h6>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="review_text" className="form-label">متن نظر</label>
            <textarea
              className={`form-control ${errors.review_text ? "is-invalid" : ""}`}
              id="review_text"
              name="review_text"
              rows="4"
              value={formData.review_text}
              onChange={handleChange}
            ></textarea>
            {errors.description && <div className="invalid-feedback">{errors.review_text}</div>}
          </div>

          <div className="mb-3">
            <label className="form-label">امتیاز</label>
            <div>
              {[1, 2, 3, 4, 5].map((rank) => (
                <FaStar
                  key={rank}
                  size={30}
                  className="me-2"
                  color={formData.rank >= rank ? "gold" : "gray"}
                  onClick={() => handleStarClick(rank)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            {errors.rank && <div className="text-danger mt-2">{errors.rank}</div>}
          </div>

          {/* فیلدهای مخفی */}
          <input type="hidden" name="business_id" value={formData.business_id} />
          <input type="hidden" name="user" value={formData.user} />

          <button type="submit" className="btn btn-primary w-100">ارسال نظر</button>
        </form>
      </div>
    </div>
  );
};

export default ReviewSubmit;
