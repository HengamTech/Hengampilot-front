import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReviewSection.css';
import img from './noon.png';

// تعداد کارت‌ها در صفحه اصلی
const ITEMS_PER_PAGE = 4;
const COMMENT_MAX_LENGTH = 100;

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/review_rating/reviews/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
        console.log(data);
      const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            console.log(review.user);

            const userResponse = await axios.get(`http://localhost:8000/user_management/users/${review.user}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            return {
              ...review,
              name: userResponse.data.username,
              userImage: userResponse.data.profile_picture || img,
              
            };
          })
        );
        setReviews(enrichedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleViewMore = () => {
    navigate('/all-reviews');
  };

  const handleReadMore = (id) => {
    navigate(`/review/${id}`);
  };

  // ترکیب نظرات واقعی و کارت‌های خالی تا رسیدن به تعداد ۴
  const filledReviews = [...reviews.slice(0, ITEMS_PER_PAGE)];
  while (filledReviews.length < ITEMS_PER_PAGE) {
    filledReviews.push({ id: `empty-${filledReviews.length}`, name: "نام کاربر", date: "تاریخ", rating: 0, comment: null });
  }

  return (
    <div className="review-section">
      <h2>مشاهده نظرسنجی‌های اخیر</h2>
      <div className="row">
        {filledReviews.map((review, index) => (
          <div className="col-lg-3 col-md-4 col-sm-6 mb-4" key={index}>
            <ReviewCard review={review} handleReadMore={handleReadMore} />
          </div>
        ))}
      </div>
      {reviews.length > ITEMS_PER_PAGE && (
        <button className="view-more-button" onClick={handleViewMore}>مشاهده نظرات بیشتر</button>
      )}
    </div>
  );
};

const ReviewCard = ({ review, handleReadMore }) => {
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleDislike = () => {
    setDislikes(dislikes + 1);
  };

  return (
    <div className="card p-1 h-100">
      <img src={review.userImage || img} alt={review.name} className="user-image mb-0 mx-auto d-block" style={{ width: '80px', height: '80px', borderRadius: '50%' }} />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{review.name}</h5>
        <p className="date">{review.created_at}</p>
        <div className="stars mb-1">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < review.rank ? "star filled" : "star"}>★</span>
          ))}
        </div>
        <p className="card-text">
          {review.review_text
            ? (review.review_text.length > COMMENT_MAX_LENGTH
              ? `${review.review_text.substring(0, COMMENT_MAX_LENGTH)}...`
              : review.review_text)
            : "نظر ناموجود است"}
        </p>
        {review.review_text && review.review_text.length > COMMENT_MAX_LENGTH && (
          <button className="btn btn-link p-0 read-more-button" onClick={() => handleReadMore(review.id)}>مشاهده بیشتر</button>
        )}
        <div className="d-flex justify-content-between mt-3">
          <button className="btn btn-light" onClick={handleLike}>👍 {likes}</button>
          <button className="btn btn-light" onClick={handleDislike}>👎 {dislikes}</button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;
