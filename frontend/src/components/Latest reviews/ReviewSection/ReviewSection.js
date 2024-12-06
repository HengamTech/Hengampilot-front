import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewSection.css';
import img from './noon.png';

// نمونه نظرات
const reviews = [
  { id: 2, name: "محمد احمدی", date: "1403/08/08", rating: 3, comment: " Inception is undoubtedly one of my all-time favorite films. Directed by Christopher Nolan, it offers a remarkable fusion of mind-bending storytelling, outstanding performances, and visually stunning scenes that have left a lasting impression on me.", productImage: img, userImage: img },
  { id: 3, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 4, name: "احمد موسوی", date: "1403/08/08", rating: 4, comment: "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me. From the moment I first watched it, I was captivated by its intricate plot and the way it challenges the audience to think deeply about the nature of reality and dreams.", productImage: img, userImage: img },
  { id: 5, name: "کاوه رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 6, name: "رضا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 7, name: "آرام جعفری", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },

];

// تعداد کارت‌ها در صفحه اصلی
const ITEMS_PER_PAGE = 4;
const COMMENT_MAX_LENGTH = 100;

const ReviewSection = () => {
  const navigate = useNavigate();

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
      <h2>مشاهده نظرسنجی های اخیر</h2>
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
        <p className="date">{review.date}</p>
        <div className="stars mb-1">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < review.rating ? "star filled" : "star"}>★</span>
          ))}
        </div>
        <p className="card-text">
          {review.comment
            ? (review.comment.length > COMMENT_MAX_LENGTH
              ? `${review.comment.substring(0, COMMENT_MAX_LENGTH)}...`
              : review.comment)
            : "نظر ناموجود است"}
        </p>
        {review.comment && review.comment.length > COMMENT_MAX_LENGTH && (
          <button className="btn btn-link p-0 read-more-button" onClick={() => handleReadMore(review.id)}>مشاهده بیشتر</button>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
