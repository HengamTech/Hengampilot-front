import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import './AllReviewsPage.css';
import axios from 'axios';
import img from './noon.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';

const AllReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [votes, setVotes] = useState({});
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    businessName: '',
    minRank: 0,
    maxRank: 5,
    reviewText: '',
  });

  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // برای بررسی اینکه آیا کاربر ادمین است یا نه
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // اول نقش ادمین را از سرور بگیریم (اگر بخشی از User باشد)
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user_management/users/${userId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // فرض می‌کنیم در پاسخ، فیلد is_admin وجود دارد
        setIsAdmin(response.data.is_admin);
      } catch (error) {
        console.error('Error fetching user admin status:', error);
      }
    };

    // گرفتن تمام نظرات
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
              business_image:businessResponse.data.business_image,
              username: userResponse.data.username,
              userimage: userResponse.data.user_image,
            };
          })
        );
        setReviews(enrichedReviews);
        setFilteredReviews(enrichedReviews);
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
  }, [token, userId]);

  const handleLike = async (reviewId) => {
    if (votes[reviewId]?.includes(userId)) {
      alert('شما قبلاً به این نظر رأی داده‌اید.');
      return;
    }

    try {
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

      setVotes((prevVotes) => ({
        ...prevVotes,
        [reviewId]: [...(prevVotes[reviewId] || []), userId],
      }));
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const filtered = reviews.filter((review) => {
      const usernameMatch = filters.username
        ? review.username.toLowerCase().includes(filters.username.toLowerCase())
        : true;
      const businessMatch = filters.businessName
        ? review.businessName.toLowerCase().includes(filters.businessName.toLowerCase())
        : true;
      const rankMatch = review.rank >= filters.minRank && review.rank <= filters.maxRank;
      const textMatch = filters.reviewText
        ? review.review_text.toLowerCase().includes(filters.reviewText.toLowerCase())
        : true;

      return usernameMatch && businessMatch && rankMatch && textMatch;
    });

    setFilteredReviews(filtered);
  };

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
      for (let i = 0; i < gm; ++i) gDayNo += gDaysInMonth[i];
      // Leap year
      if (
        gm > 1 &&
        ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)
      )
        ++gDayNo;
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
            <div className="col-md-8 mb-3">
              <input
                type="number"
                name="minRank"
                placeholder="حداقل امتیاز"
                value={filters.minRank}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <div className="col-md-8 mb-3">
              <input
                type="number"
                name="maxRank"
                placeholder="حداکثر امتیاز"
                value={filters.maxRank}
                onChange={handleFilterChange}
                className="form-control"
              />
            </div>
            <div className="col-md-8 mb-3">
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
        <div className="col col-md-7">
          {filteredReviews.map((review) => (
            <div key={review.id} className="review-card1 col-md-4 mb-4">
              <div className="card p-2 shadow-sm">
                <div className="row">
                  <div className="d-flex justify-content-start">
                    <img
                      src={review.userimage}
                      alt={review.businessName}
                      className="rounded-circle img-fluid"
                      style={{ height: '70px', width: '70px',marginBottom:"-10px"}}
                    />
                    <h6 className="username"style={{marginTop:"25px"}}>{review.username}</h6>

                    
                  </div>
                </div>
                <div className='d-flex justify-content-between'>
                     <div className='stars '>
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          className={index < review.rank ? 'star filled' : 'star'}
                        >
                          ★
                        </span>
                      ))}
                      </div>
                    <p className="date">تاریخ:{toJalali(review.created_at)}</p>

                    </div>
                <div className="review-info1 ">
                                  <div
                    style={{
                      borderTop: '2px solid #e5e5dd',
                    }}
                  > 
                  
                    <p className="comment mb-3">{review.review_text}</p>
                  </div>
                  <div
                    style={{
                      borderTop: '2px solid #e5e5dd',
                    }}
                  > 
                        </div>
                    
                     <div className='d-flex justify-content-between'>
                     <p>{review.businessName}</p>
                      <img src={review.business_image} width="55px"height="30px"
                      className='img-fluid'/> 
                      </div>
                      <div
                    style={{
                      borderTop: '2px solid #e5e5dd',
                    }}
                  > 
                        </div>
                  
                  <div className="d-flex justify-content-start">
                    <LikeButton
                      reviewId={review.id}
                      handleLike={handleLike}
                      votes={votes[review.id]?.length || 0}
                    />
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
    </div>
  );
};

const LikeButton = ({ reviewId, handleLike, votes }) => {
  return (
    <div className="like-dislike-buttons">
      <button onClick={() => handleLike(reviewId)} className="btn btn-success">
        👍 {votes}
      </button>
    </div>
  );
};

const ReportButton = ({ reviewId, reviewUserId, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [reasonSelect, setReasonSelect] = useState('');
  const [resultReport, setResultReport] = useState('Unchecked');
  const [reason, setReason] = useState('');
  const userId = localStorage.getItem('userId');

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
        <FontAwesomeIcon icon={faEllipsisV} />
      </a>

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

/* 
   این کامپوننت جدید است: 
   - اگر کاربر ادمین باشد، دکمه "ریپلای" نمایش داده می‌شود
   - پس از کلیک، فرمی برای ثبت ریپلای نشان داده می‌شود
   - پاسخ‌های ادمین از /review_rating/review_responses/{reviewId}/ گرفته می‌شود
   - پس از ارسال پاسخ جدید (POST به /review_rating/review_responses/)،
     دوباره پاسخ‌ها را می‌گیریم و نمایش می‌دهیم
*/
const AdminReplySection = ({ reviewId, token }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);

  const userId = localStorage.getItem('userId');

  // بررسی نقش ادمین (می‌توانید اگر لازم باشد یک بار در والد انجام دهید)
  useEffect(() => {
    const fetchAdminStatus = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/user_management/users/${userId}/`,
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

  // گرفتن پاسخ‌های ادمین
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/review_rating/review_responses/${reviewId}/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setReplies(data);
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
        'http://localhost:8000/review_rating/review_responses/',
        {
          description: replyText,
          review: reviewId, // id این ریویو
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('پاسخ ثبت شد');
      setShowReplyForm(false);
      setReplyText('');

      // پاسخ‌ها را مجدداً بگیریم
      const { data } = await axios.get(
        `http://localhost:8000/review_rating/review_responses/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // حالا فقط آن پاسخ‌هایی را می‌خواهیم که مربوط به همین reviewId باشند:
      const filtered = data.filter((resp) => resp.review === reviewId);
      setReplies(filtered);
    } catch (err) {
      console.error('Error submitting reply:', err);
      alert('خطا در ارسال پاسخ');
    }
  };

  if (!isAdmin) return null; // اگر ادمین نیست، هیچ نمایش نده

  return (
    <div className="mt-3">
      {/* دکمه نمایش فرم ریپلای */}
      <Button variant="link" onClick={() => setShowReplyForm(!showReplyForm)}>
        ریپلای
      </Button>

      {/* نمایش فرم ریپلای در صورت کلیک */}
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

      {/* نمایش لیست پاسخ‌های ثبت شده */}
      {replies && replies.length > 0 && (
        <div className="mt-3">
          <strong>پاسخ های ادمین:</strong>
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
              <small className="text-muted">
                {new Date(resp.created_at).toLocaleString('fa-IR')}
              </small>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllReviewsPage;
