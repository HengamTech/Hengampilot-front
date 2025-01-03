import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ReviewSection.css';
import img from './noon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft } from '@fortawesome/free-solid-svg-icons';

// تعداد کارت‌ها در صفحه اصلی
const ITEMS_PER_PAGE = 4;
const COMMENT_MAX_LENGTH = 50;

const ReviewSection = () => {
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:8000/review_rating/reviews/', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            const userResponse = await axios.get(`http://localhost:8000/user_management/users/${review.user}/`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            const businessResponse = await axios.get(
              `http://localhost:8000/business_management/businesses/${review.business_id}/`,
              { headers: { Authorization: `Bearer ${token}` } }
            );

            return {
              ...review,
              name: userResponse.data.username,
              userImage: userResponse.data.user_image || img,
              businessName: businessResponse.data.business_name,
              businessUrl: businessResponse.data.website_url,
              business_img:businessResponse.data.business_image,
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

  // پر کردن کارت‌های خالی
  const filledReviews = [...reviews.slice(0, ITEMS_PER_PAGE)];
  while (filledReviews.length < ITEMS_PER_PAGE) {
    filledReviews.push({
      id: `empty-${filledReviews.length}`,
      name: 'نام کاربر',
      created_at: null,
      rank: 0,
      review_text: null,
      businessName: '',
      businessUrl: '',
    });
  }

  return (
    <div className="review-section">
      <div className="row">
        <div className="d-flex col col-md-8" style={{ marginTop: '-2px', fontSize: '12px', borderRadius: '50%' }}>
          {reviews.length > ITEMS_PER_PAGE && (
            <button className="view-more-button" onClick={handleViewMore}>
              <FontAwesomeIcon icon={faArrowCircleLeft} style={{ fontSize: '18px', color: 'white' }} />
              بیشتر
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
    if (!gregorianDate) return 'نامشخص'; // بررسی مقدار ورودی

    const g2j = (gYear, gMonth, gDay) => {
      const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const jDaysInMonth = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29, 29];

      let gy = gYear - 1600;
      let gm = gMonth - 1;
      let gd = gDay - 1;

      let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
      for (let i = 0; i < gm; ++i) gDayNo += gDaysInMonth[i];
      if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) ++gDayNo;
      gDayNo += gd;

      let jDayNo = gDayNo - 79;
      let jNp = Math.floor(jDayNo / 12053);
      jDayNo %= 12053;

      let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
      jDayNo %= 1461;

      if (jDayNo >= 366) {
        jy += Math.floor((jDayNo - 1) / 365);
        jDayNo = (jDayNo - 1) % 365;
      }

      let jm = 0;
      for (let i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; ++i) {
        jDayNo -= jDaysInMonth[i];
        jm++;
      }
      let jd = jDayNo + 1;

      return { year: jy, month: jm + 1, day: jd };
    };

    const parts = gregorianDate.split('-');
    const gYear = parseInt(parts[0], 10);
    const gMonth = parseInt(parts[1], 10);
    const gDay = parseInt(parts[2], 10);

    const { year, month, day } = g2j(gYear, gMonth, gDay);
    return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`;
  };

  return (
    <div className="card p-1 h-100 cardselect" onClick={() => handleReadMore(review.id)}>
      <img
        src={review.userImage || img}
        alt={review.name}
        className="user-image mb-0 mx-auto d-block"
        style={{ width: '80px', height: '80px', borderRadius: '50%' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{review.name}</h5>
        <p>تاریخ: {review.created_at ? toJalali(review.created_at) : 'نامشخص'}</p>
        <div className="stars mb-1">
          {[...Array(5)].map((_, index) => (
            <span key={index} className={index < review.rank ? 'star filled' : 'star'}>
              ★
            </span>
          ))}
        </div>
        <p className="card-text aa">
          {review.review_text
            ? review.review_text.length > COMMENT_MAX_LENGTH
              ? `${review.review_text.substring(0, COMMENT_MAX_LENGTH)}...`
              : review.review_text
            : 'نظر ناموجود است'}
        </p>
        <div className="brand">
          <img src={review.business_img} alt={review.name} style={{ width: '55px', height: '55px', marginRight: '8px' }} />
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
