import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReviewSection.css";
import img from "./noon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

import { API_BASE_URL } from '../../config';

const ITEMS_PER_PAGE = 5;
const COMMENT_MAX_LENGTH = 50;

const ReviewSection = ({id}) => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        // دریافت همه نظرات
        const { data } = await axios.get(
          `${API_BASE_URL}/review_rating/reviews/`
          // { headers: { Authorization: `Bearer ${token}` } }
        );

        // تکمیل اطلاعات هر نظر
        const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            const userResponse = await axios.get(
              `${API_BASE_URL}/user_management/users/${review.user}/`
              // { headers: { Authorization: `Bearer ${token}` } }
            );

            const businessResponse = await axios.get(
              `${API_BASE_URL}/business_management/businesses/${review.business_id}/`
              // { headers: { Authorization: `Bearer ${token}` } }
            );

            return {
              ...review,
              name: userResponse.data.username,
              userImage: userResponse.data.user_image || "https://via.placeholder.com/150",
              businessName: businessResponse.data.business_name,
              businessUrl: businessResponse.data.website_url,
              business_img: businessResponse.data.business_image,
            };
          })
        );
        setReviews(enrichedReviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, []);

  const handleViewMore = () => {
    navigate("/all-reviews");
  };

  const handleReadMore = (id) => {
    navigate(`/review/${id}`);
  };

  // فقط نظرات مخفی (hidden === true) را برمی‌داریم
  const hiddenReviewsOnly = reviews.filter((r) => r.hidden === true);

  // تابع کمکی برای شافل (درهم) کردن آرایه
  function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // جایگزینی
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  // نظرات را شافل می‌کنیم تا هر بار 4 نظر رندوم نمایش داده شوند
  const shuffledHidden = shuffle([...hiddenReviewsOnly]);

  // 4 نظر از نظرات مخفی تصادفی
  const filledReviews = shuffledHidden.slice(0, ITEMS_PER_PAGE);

  // اگر کارت خالی نیاز دارید (برای پر کردن تا 4 کارت):
  while (filledReviews.length < ITEMS_PER_PAGE) {
    filledReviews.push({
      id: `empty-${filledReviews.length}`,
      name: "نام کاربر",
      created_at: null,
      rank: 0,
      review_text: null,
      businessName: "",
      businessUrl: "",
    });
  }

  return (
    <section id={id}>
    <div className="review-section">
      <div className="row">
        <div
          className="d-flex col col-md-8"
          style={{ marginTop: "-2px", fontSize: "12px", borderRadius: "50%" }}
        >
          {reviews.length > ITEMS_PER_PAGE && (
            <button className="view-more-button" onClick={handleViewMore}>
              <FontAwesomeIcon
                icon={faArrowCircleLeft}
                style={{ fontSize: "18px", color: " #28a745;" }}
              />
              مشاهده بیشتر
            </button>
          )}
        </div>
        <h2 className="col">مشاهده نظرسنجی‌های اخیر</h2>
      </div>
      <div className="row">
        {filledReviews.map((review, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
            <ReviewCard review={review} handleReadMore={handleReadMore} />
          </div>
        ))}
      </div>
    </div>
    </section>

  );
};

const ReviewCard = ({ review, handleReadMore }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const toJalali = (gregorianDate) => {
    if (!gregorianDate) return "نامشخص";
    // تبدیل تاریخ میلادی به شمسی (در صورت نیاز)
    // ...
    return gregorianDate; // یا هر فرمت شمسی موردنظرتان
  };

  return (
    <div
      className="card p-1 h-100 cardselect"
      onClick={() => handleReadMore(review.id)}
    >
      <img
        src={review.userImage || 'https://via.placeholder.com/50'}
        // alt={review.name}
        className="user-image mb-0 mx-auto d-block"
        style={{ width: "80px", height: "80px", borderRadius: "50%" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{review.name}</h5>
        <div className="stars mb-1" style={{ marginTop: "-11px",fontSize:"28px" }}>
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < review.rank ? "star filled" : "star"}>
              ★
            </span>
          ))}
        </div>
        {/* <p>{review.created_at ? toJalali(review.created_at) : "نامشخص"}</p> */}

        <p className="card-text aa">
          {review.review_text
            ? review.review_text.length > COMMENT_MAX_LENGTH
              ? `${review.review_text.substring(0, COMMENT_MAX_LENGTH)}...`
              : review.review_text
            : "نظر ناموجود است"}
        </p>
        <div className="brand">
          {review.business_img && (
            <img
              src={review.business_img}
              alt={review.name}
              style={{ width: "55px", height: "55px", marginRight: "8px" }}
            />
          )}
          <div className="brand2">
            <h5 className="card-text">{review.businessName}</h5>
            <p className="card-text">{review.businessUrl}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
