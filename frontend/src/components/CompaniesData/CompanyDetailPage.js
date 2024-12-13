// CompanyDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CompanyDetailPage = () => {
  const { id } = useParams(); // دریافت شناسه شرکت از URL
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([
    {
      id: 1,
      username: "علی",
      rating: 4.5,
      comment: "خدمات عالی و تیم حرفه‌ای.",
      date: "2024-04-20",
    },
    {
      id: 2,
      username: "مریم",
      rating: 5.0,
      comment: "کاملاً راضی از کیفیت کارها.",
      date: "2024-04-18",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newComment, setNewComment] = useState({
    username: "",
    rating: 5,
    comment: "",
  });

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

  // واکشی اطلاعات شرکت از API با استفاده از id
  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://127.0.0.1:8000/business_management/businesses/${id}/`, 
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setCompany(response.data);
    } catch (err) {
      console.error("Error fetching company details:", err);
      setError("خطا در دریافت اطلاعات شرکت. لطفاً دوباره تلاش کنید.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  // تابع برای ثبت نظر جدید
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.username.trim() === "" || newComment.comment.trim() === "") {
      alert("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    const commentToAdd = {
      id: comments.length + 1,
      username: newComment.username,
      rating: parseFloat(newComment.rating),
      comment: newComment.comment,
      date: new Date().toISOString().split("T")[0],
    };

    setComments([...comments, commentToAdd]);
    setNewComment({ username: "", rating: 5, comment: "" });
    setShowForm(false);
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // اگر شرکت یافت نشد
  if (!company) {
    return (
      <div className="container text-center mt-5">
        <h2>شرکت مورد نظر یافت نشد.</h2>
        <button className="btn btn-primary mt-3" onClick={() => navigate(-1)}>
          بازگشت
        </button>
      </div>
    );
  }

  // اگر عکس شرکت موجود نبود، عکس پیش فرض
  const imageSrc = company.profileImage || "https://via.placeholder.com/80";

  return (
    <div>
      <div className="container my-5" dir="rtl">
        <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
          بازگشت
        </button>
        <div className="card">
          <div className="card-header d-flex align-items-center" style={{ backgroundColor: "white" }}>
            <img
              src={imageSrc}
              alt={company.business_name}
              className="rounded me-0"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                objectFit: "cover",
                marginLeft: "10px",
              }}
            />
            <div className="d-flex flex-column">
              <h2>{company.business_name}</h2>
              <div>{renderStars(company.average_rank)}</div>
              <small className="text-muted">
                {company.average_rank?.toFixed(1)} میانگین امتیاز |{" "}
                {company.total_reviews} نظر
              </small>
              {company.is_verified && (
                <span className="badge bg-success ms-2">تایید شده</span>
              )}
              {/* دکمه ثبت نظر */}
              <button
                className="btn btn-primary mt-3"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "لغو" : "ثبت نظر"}
              </button>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <h4>توضیحات</h4>
              <p>{company.description}</p>

              <h4>خدمات</h4>
              <ul>
                {company.services?.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>

              <h4>نظرات کاربران</h4>
              {comments.length === 0 ? (
                <p>هنوز هیچ نظری ثبت نشده است.</p>
              ) : (
                <ul className="list-group">
                  {comments.map((comment) => (
                    <li key={comment.id} className="list-group-item">
                      <strong>{comment.username}</strong> -{" "}
                      {renderStars(comment.rating)}
                      <br />
                      <small className="text-muted">{comment.date}</small>
                      <p>{comment.comment}</p>
                    </li>
                  ))}
                </ul>
              )}

              {/* فرم ثبت نظر */}
              {showForm && (
                <div className="col-12 mt-4">
                  <form onSubmit={handleSubmitComment}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        نام کاربری
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={newComment.username}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            username: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="rating" className="form-label">
                        امتیاز
                      </label>
                      <select
                        className="form-select"
                        id="rating"
                        value={newComment.rating}
                        onChange={(e) =>
                          setNewComment({ ...newComment, rating: e.target.value })
                        }
                      >
                        <option value={5}>۵</option>
                        <option value={4.5}>۴.۵</option>
                        <option value={4}>۴</option>
                        <option value={3.5}>۳.۵</option>
                        <option value={3}>۳</option>
                        <option value={2.5}>۲.۵</option>
                        <option value={2}>۲</option>
                        <option value={1.5}>۱.۵</option>
                        <option value={1}>۱</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="comment" className="form-label">
                        نظر
                      </label>
                      <textarea
                        className="form-control"
                        id="comment"
                        rows="3"
                        value={newComment.comment}
                        onChange={(e) =>
                          setNewComment({ ...newComment, comment: e.target.value })
                        }
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-success">
                      ارسال نظر
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
