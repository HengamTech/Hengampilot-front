import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ReviewSection.css";
import img from "./noon.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";

const ITEMS_PER_PAGE = 4;
const COMMENT_MAX_LENGTH = 50;

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get("http://localhost:8000/review_rating/reviews/", 
        //  {
        //   headers: { Authorization: `Bearer ${token}` },
        // }
      );

        const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            const userResponse = await axios.get(
              `http://localhost:8000/user_management/users/${review.user}/`,
              // {
              //   headers: { Authorization: `Bearer ${token}` },
              // }
            );

            const businessResponse = await axios.get(
              `http://localhost:8000/business_management/businesses/${review.business_id}/`,
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

  // فقط hidden == true را در نظر می‌گیریم
  const hiddenReviewsOnly = reviews.filter((r) => r.hidden === true);
  const filledReviews = [...hiddenReviewsOnly.slice(0, ITEMS_PER_PAGE)];

  // اگر کارت خالی نیاز دارید (برای پر کردن 4 کارت):
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
    <div className="review-section">
      <div className="row">
        <div className="d-flex col col-md-8" style={{ marginTop: "-2px", fontSize: "12px", borderRadius: "50%" }}>
          {reviews.length > ITEMS_PER_PAGE && (
            <button className="view-more-button" onClick={handleViewMore}>
              <FontAwesomeIcon icon={faArrowCircleLeft} style={{ fontSize: "18px", color: " #28a745;" }} />
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
  );
};

const ReviewCard = ({ review, handleReadMore }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const toJalali = (gregorianDate) => {
    if (!gregorianDate) return "نامشخص";

    // ...
  };

  return (
    <div className="card p-1 h-100 cardselect" onClick={() => handleReadMore(review.id)}>
      <img
        src={review.userImage}
        alt={review.name}
        className="user-image mb-0 mx-auto d-block"
        style={{ width: "80px", height: "80px", borderRadius: "50%" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{review.name}</h5>
        <div className="stars mb-1" style={{ marginTop: "-11px" }}>
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < review.rank ? "star filled" : "star"}>
              ★
            </span>
          ))}
        </div>
        <p>{review.created_at ? toJalali(review.created_at) : "نامشخص"}</p>

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
