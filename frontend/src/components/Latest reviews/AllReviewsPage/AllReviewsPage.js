import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './AllReviewsPage.css';
import axios from 'axios';
import img from './noon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faFlag } from '@fortawesome/free-solid-svg-icons';

import { API_BASE_URL } from '../../config';

const AllReviewsPage = () => {
  // --- state اصلی شما ---
  const [reviews, setReviews] = useState([]);
  const [votes, setVotes] = useState({});
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    businessName: '',
    starFilter: 0,
    reviewText: '',
  });

  // --- state برای صفحه‌بندی ---
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 3; // تعداد نظرات در هر صفحه

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // برای بررسی نقش ادمین
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // اول نقش ادمین را از سرور بگیریم
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user_management/users/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error('Error fetching user admin status:', error);
      }
    };

    // گرفتن تمام نظرات
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/review_rating/reviews/`);
        const enrichedReviews = await Promise.all(
          data.map(async (review) => {
            const [businessResponse, userResponse] = await Promise.all([
              axios.get(
                `${API_BASE_URL}/business_management/businesses/${review.business_id}/`
              ),
              axios.get(
                `${API_BASE_URL}/user_management/users/${review.user}/`
              ),
            ]);

            return {
              ...review,
              businessName: businessResponse.data.business_name,
              businessUrl: businessResponse.data.website_url,
              business_image: businessResponse.data.business_image || 'https://t4.ftcdn.net/jpg/01/86/29/31/360_F_186293166_P4yk3uXQBDapbDFlR17ivpM6B1ux0fHG.jpg',
              username: userResponse.data.username,
              userimage: userResponse.data.user_image,
            };
          })
        );

        setReviews(enrichedReviews);

        // به‌صورت پیش‌فرض، فقط hidden را در فیلتر تنظیم کرده‌اید
        const hiddenReviews = enrichedReviews.filter((review) => review.hidden === true);
        setFilteredReviews(hiddenReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchVotes = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/review_rating/votes/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const votesMap = {};
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

    fetchAdminStatus();
    fetchReviews();
    fetchVotes();

    // هر 5 ثانیه یکبار مجددا fetch کند
    // const intervalId = setInterval(fetchReviews, 5000);
    // return () => clearInterval(intervalId);
  }, [token, userId]);

  // تابع لایک کردن یک نظر
  const handleLike = async (reviewId) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('ابتدا وارد شوید');
      return;
    }
    if (votes[reviewId]?.includes(userId)) {
      alert('شما قبلاً به این نظر رأی داده‌اید.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/review_rating/votes/`,
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

      setVotes((prevVotes) => ({
        ...prevVotes,
        [reviewId]: [...(prevVotes[reviewId] || []), userId],
      }));
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  // کنترل فیلترها
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleStarFilterChange = (starValue) => {
    setFilters((prev) => ({
      ...prev,
      starFilter: starValue,
    }));
  };

  // اعمال فیلترها
  const applyFilters = () => {
    // اعمال فیلترها روی نظرات
    const filtered = reviews.filter((review) => {
      // بررسی نام کاربری
      const usernameMatch = filters.username
        ? review.username && review.username.toLowerCase().includes(filters.username.toLowerCase())
        : true;
  
      // بررسی نام کسب‌وکار
      const businessMatch = filters.businessName
        ? review.businessName && review.businessName.toLowerCase().includes(filters.businessName.toLowerCase())
        : true;
  
      // بررسی تعداد ستاره (برابر یا بیشتر از مقدار وارد شده)
      const starMatch = review.rank >= filters.starFilter;
  
      // بررسی متن نظر
      const textMatch = filters.reviewText
        ? review.review_text && review.review_text.toLowerCase().includes(filters.reviewText.toLowerCase())
        : true;
  
      // بازگشت نتیجه نهایی
      return usernameMatch && businessMatch && starMatch && textMatch;
    });
  
    setFilteredReviews(filtered);
  
    // بازنشانی به صفحه اول بعد از اعمال فیلترها
    // setCurrentPage(1);
  };
  

  // تابع تبدیل تاریخ به جلالی
  const toJalali = (gregorianDate) => {
    const g2j = (gYear, gMonth, gDay) => {
      const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const jDaysInMonth = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29, 29];

      let gy = gYear - 1600;
      let gm = gMonth - 1;
      let gd = gDay - 1;

      let gDayNo =
        365 * gy +
        Math.floor((gy + 3) / 4) -
        Math.floor((gy + 99) / 100) +
        Math.floor((gy + 399) / 400);
      if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) {
        ++gDayNo;
      }
      for (let i = 0; i < gm; ++i) {
        gDayNo += gDaysInMonth[i];
      }
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

  // --- توابع صفحه‌بندی ---
  // محاسبه نظرات صفحه جاری:
  const getPaginatedReviews = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredReviews.slice(startIndex, endIndex);
  };

  // کامپوننت کنترل صفحه‌بندی:
  const PaginationControls = ({ totalReviews, currentPage, onPageChange }) => {
    const totalPages = Math.ceil(totalReviews / pageSize);
    // اگر فقط یک صفحه داریم، دکمه‌ها را نمایش ندهید
    if (totalPages <= 1) return null;

    return (
      <div className="pagination mt-3 d-flex justify-content-center">
        <button
          className="btn btn-secondary btn-sm me-2"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          قبلی
        </button>
        <span>
          صفحه {currentPage} از {totalPages}
        </span>
        <button
          className="btn btn-secondary btn-sm ms-2"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          بعدی
        </button>
      </div>
    );
  };

  return (
    <div className="container">
      <h2 className="text-center my-4">همه نظرات</h2>

      <div className="row" dir="rtl">
        <aside
          className="col-md-3 shadow p-3 mb-3 bg-white rounded h-100"
          dir="rtl"
          style={{
            padding: '10px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
            backgroundColor: '#FFFDF5',
          }}
        >
          <h5>فیلترها</h5>
          <div className="row">
            {/* فیلد نام کاربری */}
            <div className="col-md-8 mb-3 d-flex justify-content-center text-center">
              <input
                type="text"
                name="username"
                placeholder="نام کاربری"
                value={filters.username}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            {/* فیلد نام کسب‌وکار */}
            <div className="col-md-8 mb-3">
              <input
                type="text"
                name="businessName"
                placeholder="نام کسب‌وکار"
                value={filters.businessName}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            {/* فیلتر تعداد ستاره */}
            <div className="col-md-12 mb-3">
              <p>تعداد ستاره:</p>
              <StarFilter currentValue={filters.starFilter} onStarClick={handleStarFilterChange} />
            </div>
            {/* فیلد متن نظر */}
            <div className="col-md-12 mb-3">
              <input
                type="text"
                name="reviewText"
                placeholder="متن نظر"
                value={filters.reviewText}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <div className="col-md-12">
              <button onClick={applyFilters} className="btn btn-primary w-100">
                اعمال فیلتر
              </button>
            </div>
          </div>
        </aside>

        {/* لیست نظرات */}
        <div className="col col-md-6">
          {/* 
            به جای filteredReviews.map(...)، 
            از getPaginatedReviews() برای صفحه‌بندی استفاده می‌کنیم 
          */}
          {getPaginatedReviews().map((review) => (
            <div key={review.id} className="review-card1 col-md-4 mb-4">
              <div className="card p-2 shadow-sm">
                <div className="row">
                  <div className="d-flex justify-content-between">
                    <div className="d-flex justify-content-start mx-1" style={{ marginBottom: '42px' }}>
                      <img
                        src={review.userimage || 'https://t4.ftcdn.net/jpg/01/86/29/31/360_F_186293166_P4yk3uXQBDapbDFlR17ivpM6B1ux0fHG.jpg'}
                        // alt={review.businessName}
                        className="rounded-circle img-fluid"
                        style={{ height: '70px', width: '70px', marginBottom: '-10px' }}
                      />
                      <h6 className="username" style={{ marginTop: '25px' }}>
                        {review.username}
                      </h6>
                    </div>
                    <div className='mx-1' style={{ textAlign: 'center' }}>
                      <img
                        src={review.business_image}
                        width="70px"
                        height="70px"
                        className="img-fluid"
                        // alt="Business"
                      />
                      <p>{review.businessName}</p>
                    </div>
                  </div>
                  <div className="stars mx-1" style={{ marginTop: '-35px' }}>
                    {[...Array(5)].map((_, index) => (
                      <span key={index} className={index < review.rank ? 'star filled' : 'star'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="date mx-1">{toJalali(review.created_at)}</p>
                </div>
                <div className="review-info1">
                  <p
                    className="comment mb-3"
                    style={{
                      backgroundColor: "#f1f1f1",
                      padding: "15px",
                      borderRadius: "5px",
                      borderLeft: "5px solid #ccc"
                    }}
                  >
                    {review.review_text}
                  </p>
                  {/* <blockquote
  className="blockquote mt-2"
  style={{
    backgroundColor: "#f1f1f1",
    padding: "15px",
    borderRadius: "5px",
    borderLeft: "5px solid #ccc"
  }}
>
  <p className="mb-0" style={{ fontStyle: "italic" }}>
    {review.review_text}
  </p>
</blockquote>
                  <div style={{ borderTop: '2px solid #e5e5dd' }}></div> */}
                  <div className="d-flex justify-content-between"></div>
                  <div style={{ borderTop: '2px solid #e5e5dd' }}></div>

                  <div className="d-flex justify-content-between">
                    <LikeButton reviewId={review.id} handleLike={handleLike} votes={votes[review.id]?.length || 0} />
                    <ReportButton
                      style={{ width: '120px' }}
                      reviewId={review.id}
                      reviewUserId={review.user}
                      token={token}
                    />
                  </div>

                  {/* --- بخش ریپلای ادمین (جدید) --- */}
                  <AdminReplySection reviewId={review.id} token={token} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* نمایش کنترل‌های صفحه‌بندی زیر لیست نظرات */}
      <PaginationControls
        totalReviews={filteredReviews.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
      <div>
        <h1>sakam</h1>
      </div>
    </div>
  );
};

/** همان کد اصلی کامپوننت StarFilter شما */
const StarFilter = ({ currentValue, onStarClick }) => {
  const handleClick = (starValue) => {
    onStarClick(starValue);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((starVal) => (
        <span
          key={starVal}
          onClick={() => handleClick(starVal)}
          style={{
            cursor: 'pointer',
            color: starVal <= currentValue ? '#FFD700' : '#aaa',
            fontSize: '1.5rem',
            marginLeft: '5px',
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

/** همان کد اصلی کامپوننت LikeButton شما */
const LikeButton = ({ reviewId, handleLike, votes }) => {
  return (
    <div className="like-dislike-buttons">
      <button onClick={() => handleLike(reviewId)} className="dd btn transparent-bg btn-sm">
        👍 {votes}
      </button>
    </div>
  );
};

/** همان کد اصلی کامپوننت ReportButton شما */
const ReportButton = ({ reviewId, reviewUserId, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [reasonSelect, setReasonSelect] = useState('');
  const [resultReport, setResultReport] = useState('Unchecked');
  const [reason, setReason] = useState('');
  const userId = localStorage.getItem('userId');

  const handleReport = async () => {
     const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('ابتدا وارد شوید');
      return;
    }
    if (!reasonSelect || !reason) {
      alert('لطفاً تمام فیلدها را پر کنید.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/review_rating/reports/`,
        {
          reason_select: reasonSelect,
          result_report: resultReport,
          reason,
          review_id: reviewId,
          review_user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('گزارش شما با موفقیت ارسال شد.');
      setShowModal(false);
    } catch (error) {
      console.error('Error reporting review:', error);
    }
  };

  return (
    <>
      <a className="a" href="#!" onClick={() => setShowModal(true)}>
        <FontAwesomeIcon icon={faFlag} />
      </a>

      <Modal dir="rtl" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{marginLeft:"70%"}}>گزارش نظر</Modal.Title>
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
            <option value="Remove">حذف شود</option>
            <option value="UserBan">مسدود کردن کاربر</option>
          </select>
        </Modal.Body>
        <Modal.Footer className='d-flex justify-content-start' >
        
          
          <Button variant="danger" onClick={handleReport}>
            ارسال گزارش
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            انصراف
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

/** همان کد اصلی کامپوننت AdminReplySection شما */
const AdminReplySection = ({ reviewId, token }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user_management/users/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsAdmin(response.data.is_admin);
      } catch (err) {
        console.error('Error in checking admin status:', err);
      }
    };

    fetchAdminStatus();
  }, [token, userId]);

  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/review_rating/review_responses/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const filtered = data.filter((resp) => resp.review === reviewId);
        setReplies(filtered);
      } catch (err) {
        console.error('Error fetching replies:', err);
      }
    };
    fetchReplies();
  }, [reviewId, token]);

  const handleReplySubmit = async () => {
    if (!replyText.trim()) {
      alert('لطفاً متن پاسخ را وارد کنید.');
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/review_rating/review_responses/`,
        {
          description: replyText,
          review: reviewId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('پاسخ ثبت شد');
      setShowReplyForm(false);
      setReplyText('');

      // بروزرسانی لیست پاسخ‌ها
      const { data } = await axios.get(
        `${API_BASE_URL}/review_rating/review_responses/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const filtered = data.filter((resp) => resp.review === reviewId);
      setReplies(filtered);
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('خطا در ارسال پاسخ');
    }
  };

  const toggleAllReplies = () => {
    setShowAllReplies(!showAllReplies);
  };

  if (replies.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <div className="mt-3">
      {(replies.length > 0 || isAdmin) && (
        <Button
          className="btn btn-secondary btn-sm"
          style={{ marginLeft: '10px' }}
          onClick={toggleAllReplies}
        >
          {showAllReplies ? 'پنهان کردن پاسخ مدیر' : 'پاسخ های مدیر'}
        </Button>
      )}

      {showAllReplies && replies.length > 0 && (
        <div className="mt-3">
          <strong>پاسخ های مدیر:</strong>
          {replies.map((resp) => (
            <div
              key={resp.id}
              style={{
                background: '#f8f9fa',
                padding: '5px 10px',
                marginTop: '5px',
                borderRadius: '4px',
              }}
            >
              <p className="m-0">{resp.description}</p>
              <small className="text-muted">{new Date(resp.created_at).toLocaleString('fa-IR')}</small>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <Button className="btn btn-success btn-sm" onClick={() => setShowReplyForm(!showReplyForm)}>
            {showReplyForm ? 'بستن' : 'ریپلای'}
          </Button>

          {showReplyForm && (
            <div className="mt-2">
              <textarea
                className="form-control"
                placeholder="پاسخ ادمین را وارد کنید..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
              <Button variant="primary" className="mt-2" onClick={handleReplySubmit}>
                ارسال
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllReviewsPage;
