import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap'; // اضافه کردن Modal و Button
import './AllReviewsPage.css';
import axios from 'axios';
import img from './noon.png';

const AllReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [votes, setVotes] = useState({});
  const userId = localStorage.getItem('userId'); // گرفتن یوزر آیدی از لوکال استوریج
  const token = localStorage.getItem('token'); // گرفتن توکن از لوکال استوریج

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/review_rating/reviews/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            const [businessResponse, userResponse] = await Promise.all([
              axios.get(`http://localhost:8000/business_management/businesses/${review.business_id}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
              axios.get(`http://localhost:8000/user_management/users/${review.user}/`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }),
            ]);

            return {
              ...review,
              businessName: businessResponse.data.business_name,
              businessUrl: businessResponse.data.website_url,
              username: userResponse.data.username, // اضافه کردن نام کاربری
            };
          })
        );
        setReviews(enrichedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchVotes = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/review_rating/votes/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const votesMap = {};

        // ساختن نگاشت برای رأی‌ها
        data.forEach((vote) => {
          if (!votesMap[vote.review]) {
            votesMap[vote.review] = [];
          }
          votesMap[vote.review].push(vote.user);
        });

        setVotes(votesMap);
      } catch (error) {
        console.error('Error fetching votes:', error);
      }
    };

    fetchReviews();
    fetchVotes();
  }, [token]);

  const handleLike = async (reviewId) => {
    // بررسی اگر کاربر قبلاً رأی داده است
    if (votes[reviewId]?.includes(userId)) {
      alert('شما قبلاً به این نظر رأی داده‌اید.');
      return;
    }

    try {
      // ارسال درخواست رأی
      await axios.post(
        'http://localhost:8000/review_rating/votes/',
        {
          user: userId,
          review: reviewId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // به‌روزرسانی رأی‌ها
      setVotes((prevVotes) => ({
        ...prevVotes,
        [reviewId]: [...(prevVotes[reviewId] || []), userId],
      }));
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  return (
    <div className="review-section1">
      <h2>همه نظرات</h2>
      <div className="review-grid1">
        {reviews.map((review) => (
          <div key={review.id} className="review-card1">
            <img src={img} alt={review.businessName} className="user-image1" />
            <div className="review-info1">
              <h6 className="username">{review.username}</h6> {/* نمایش نام کاربری */}
              <p>{review.businessName}</p>
              <p className="date">{review.created_at}</p>
              <div className="stars">
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={index < review.rank ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <p className="comment">{review.review_text}</p>
              <LikeButton
                reviewId={review.id}
                handleLike={handleLike}
                votes={votes[review.id]?.length || 0}
              />
              {/* <ReportButton
                reviewId={review.id}
                reviewUserId={review.user}
                token={token}
              /> */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LikeButton = ({ reviewId, handleLike, votes }) => {
  return (
    <div className="like-dislike-buttons">
      <button onClick={() => handleLike(reviewId)} className="like-button">
        👍 {votes}
      </button>
    </div>
  );
};

const ReportButton = ({ reviewId, reviewUserId, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [reasonSelect, setReasonSelect] = useState('');
  const [resultReport, setResultReport] = useState('Unchecked'); // مقدار پیش‌فرض
  const [reason, setReason] = useState('');

  const handleReport = async () => {
    if (!reasonSelect || !reason) {
      alert('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    try {
      await axios.post(
        'http://localhost:8000/review_rating/reports/',
        {
          reason_select: reasonSelect,
          result_report: resultReport,
          reason,
          review_id: reviewId,
          review_user_id: reviewUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('گزارش شما با موفقیت ارسال شد.');
      setShowModal(false); // بستن مودال پس از ارسال
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="btn btn-warning mt-2">
        گزارش نظر
      </button>

      {/* مودال */}
      <Modal dir="rtl" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>گزارش نظر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <select
            value={reasonSelect}
            onChange={(e) => setReasonSelect(e.target.value)}
            className="form-select"
          >
            <option value="">انتخاب دلیل</option>
            <option value="terrorism">تروریسم</option>
            <option value="violence">خشونت</option>
            <option value="accusations">اتهامات</option>
            <option value="sexual">جنسی</option>
          </select>
          <textarea
            placeholder="توضیح دلیل"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="form-control mt-2"
          />
          <select
            value={resultReport}
            onChange={(e) => setResultReport(e.target.value)}
            className="form-select mt-2"
          >
            <option value="Unchecked">بررسی نشده</option>
            <option value="ignore">نادیده گرفته شود</option>
            <option value="Remove">حذف شود</option>
            <option value="UserBan">مسدود کردن کاربر</option>
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            انصراف
          </Button>
          <Button variant="danger" onClick={handleReport}>
            ارسال گزارش
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AllReviewsPage;
