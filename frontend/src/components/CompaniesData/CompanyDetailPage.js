import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

/* --- افزوده‌های جدید برای Like, Report, AdminReply, Filter --- */
import { Button, Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag,faReply, faUserShield  } from '@fortawesome/free-solid-svg-icons';

import { API_BASE_URL } from '../config';

const CompanyDetailPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState('');
  const [search, setSearch] = useState('');
  const { id } = useParams();

  // لیست کامنت‌ها + اطلاعات کاربر هر کامنت
  const [comments, setComments] = useState([]);
  const [userDetails, setUserDetails] = useState({});

  // برای لایک کردن هر کامنت
  const [votes, setVotes] = useState({});
  // بررسی نقش ادمین
  const [isAdmin, setIsAdmin] = useState(false);

  // --- state های مربوط به فیلتر در فرانت‌اند ---
  const [filterUsername, setFilterUsername] = useState("");
  const [filterRating, setFilterRating] = useState(0); // 0 یعنی انتخاب‌نشده
  const [filteredComments, setFilteredComments] = useState([]);

  // تبدیل تاریخ میلادی به شمسی
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
    return `${year}/${month.toString().padStart(2, '0')}/${day
      .toString()
      .padStart(2, '0')}`;
  };

  // گرفتن اطلاعات votes (برای لایک‌ها)
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

  // برای چک کردن نقش ادمین
  const fetchAdminStatus = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/user_management/users/${userId}/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsAdmin(data.is_admin);
    } catch (err) {
      console.error('Error checking admin status:', err);
    }
  };

  // فراخوانی نظرات
  const fetchComments = async (id, ordering, search) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/business_management/businesses/reviews/`,
        {
          params: { id, ordering, search },
        }
      );
      setComments(response.data);

      // گرفتن اطلاعات کاربران هر کامنت
      const uniqueUserIds = [...new Set(response.data.map(comment => comment.user))];
      const userFetchPromises = uniqueUserIds
        .filter(uid => !userDetails[uid])
        .map(uid => loadUserDetails(uid));
      await Promise.all(userFetchPromises);
    } catch (err) {
      setError("خطا در دریافت اطلاعات نظرات.");
    } finally {
      setLoading(false);
    }
  };

  // گرفتن اطلاعات شرکت
  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/business_management/businesses/${id}/`
      );
      setCompany(response.data);
    } catch (err) {
      setError("خطا در دریافت اطلاعات شرکت.");
    } finally {
      setLoading(false);
    }
  };

  // گرفتن اطلاعات کاربر برای یک comment
  const loadUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/user_management/users/${userId}/`
      );
      setUserDetails(prevDetails => ({
        ...prevDetails,
        [userId]: {
          userId: response.data.username,
          userimage: response.data.user_image
        }
      }));
    } catch (err) {
      console.error(`خطا در دریافت اطلاعات کاربر با آیدی ${userId}`);
    }
  };

  // در اولین بار و هر بار id / ordering / search تغییر کرد
  useEffect(() => {
    fetchCompany();
    fetchComments(id, ordering, search);
    fetchAdminStatus();
    fetchVotes();
  }, [id, ordering, search]);

  // هربار که comments به‌روز شود، filteredComments را هم ست می‌کنیم
  useEffect(() => {
    setFilteredComments(comments);
  }, [comments]);

  // تابع اعمال فیلتر
  const applyFilter = () => {
    let newFiltered = [...comments];

    // فیلتر نام کاربری
    if (filterUsername.trim()) {
      newFiltered = newFiltered.filter((c) => {
        const ud = userDetails[c.user];
        const username = ud?.userId || "";
        return username
          .toLowerCase()
          .includes(filterUsername.trim().toLowerCase());
      });
    }

    // فیلتر امتیاز
    if (filterRating > 0) {
      newFiltered = newFiltered.filter((c) => Math.floor(c.rank) === filterRating);
    }

    setFilteredComments(newFiltered);
  };

  // کلیک روی دکمه ثبت نظر
  const handleReviewSubmit = () => {
    if (!token) {
      alert("برای ثبت نظر باید وارد شوید.");
      navigate("/login");
    } else {
      navigate(`/reviewsubmit/${id}`);
    }
  };

  // لایک کردن یک کامنت
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

  // رندر ستاره‌ها برای نمایش امتیاز
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: "#FFD700" }} />);
    }
    if (halfStar) {
      stars.push(
        <FaStarHalfAlt
          key="half"
          style={{ color: "#FFD700", transform: "rotate(138deg)" }}
        />
      );
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: "#FFD700" }} />);
    }

    return stars;
  };

  // رندر ستاره‌ها برای انتخاب امتیاز در فیلتر
  const renderFilterStars = () => {
    const stars = [1, 2, 3, 4, 5];
    return (
      <div>
        {stars.map((starValue) => (
          <span
            key={starValue}
            style={{
              cursor: "pointer",
              color: filterRating >= starValue ? "#FFD700" : "#ccc",
              fontSize: "1.5rem",
              marginLeft: "5px",
            }}
            onClick={() => setFilterRating(starValue)}
          >
            <FaStar />
          </span>
        ))}
        {/* گزینه‌ای برای پاک‌کردن فیلتر امتیاز */}
        {filterRating > 0 && (
          <Button
            variant="light"
            size="sm"
            style={{ marginRight: "10px" }}
            onClick={() => setFilterRating(0)}
          >
            حذف امتیاز
          </Button>
        )}
      </div>
    );
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
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

  const imageSrc = company.business_image || "https://via.placeholder.com/80";

  return (
    <div className="container my-5" dir="rtl">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        بازگشت
      </button>

      <div className="card shadow-sm border-0 rounded mb-4">
        <div className="card-header text-center bg-white">
          <img
            src={imageSrc}
            alt={company.business_name}
            className="rounded-circle shadow mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <h2>{company.business_name}</h2>
          <div style={{ fontSize: "24px" }}>{renderStars(company.average_rating)}</div>
          <small className="text-muted">
            میانگین {company.average_rating?.toFixed(1)} امتیاز | {company.total_reviews} نظر
          </small>
          <div>
            <button className="btn btn-primary mt-2"style={{width:"150px"}} onClick={handleReviewSubmit}>
              ثبت نظر
            </button>
          </div>
        </div>
        <div className="card-body">
          <h4>توضیحات</h4>
          <p>{company.description}</p>
        </div>
      </div>

      {/* بخش نظرات و فیلتر در دو ستون مجزا */}
      <div className="row">
        {/* ستون فیلتر (سمت راست در حالت RTL) */}
        <div className="col-md-3 mb-4">
          <div
            style={{
              padding: '10px',
              position: "sticky",
              top: "80px",
              boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
              borderRadius: "8px",
              backgroundColor: 'white',
             
            }}
          >
            <h5 className="mb-3">فیلتر نظرات</h5>

            <div className="mb-3">
              <label>نام کاربری:</label>
              <input
                type="text"
                className="form-control"
                value={filterUsername}
                onChange={(e) => setFilterUsername(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>امتیاز:</label>
              {renderFilterStars()}
            </div>

            <Button className="w-100" variant="primary" onClick={applyFilter}>
              اعمال فیلتر
            </Button>
          </div>
        </div>

        {/* ستون نمایش نظرات (هر کامنت در یک سطر) */}
        <div className="col-md-7">
          <h4 className="d-flex justify-content-center mb-4">نظرات کاربران</h4>
          {filteredComments.length === 0 ? (
            <p>هیچ نظری برای نمایش وجود ندارد.</p>
          ) : (
            <div>
              {filteredComments.map((comment) => {
                // اگر کامنت hidden=false باشد، آن را نشان ندهیم
                if (comment.hidden === false) return null;

                return (
                  <div
                    key={comment.id}
                    className="mb-3 p-3 shadow-lg"
                    style={{ 
                      borderRadius: "8px", 
                      backgroundColor: "white" 
                    }}
                  >
                    {/* تصویر و نام کاربر */}
                    <div className="d-flex align-items-start mb-2">
                      <img
                        src={
                          userDetails[comment.user]?.userimage ||
                          'https://t4.ftcdn.net/jpg/01/86/29/31/360_F_186293166_P4yk3uXQBDapbDFlR17ivpM6B1ux0fHG.jpg'
                        }
                        width="40px"
                        className="rounded-circle me-2"
                        style={{ objectFit: "cover" }}
                        alt=""
                      />
                      <strong>
                        {userDetails[comment.user]?.userId || "در حال بارگذاری..."}
                      </strong>
                    </div>

                    {/* نمایش امتیاز با ستاره */}
                    <div className="mb-1">{renderStars(comment.rank)}</div>

                    <small className="text-muted">{toJalali(comment.created_at)}</small>
                    <blockquote
  className="blockquote mt-2"
  style={{
    backgroundColor: "#f1f1f1",
    padding: "15px",
    borderRadius: "5px",
    borderLeft: "5px solid #ccc"
  }}
>
  <p className="mb-0" style={{ fontStyle: "italic" }}>
    {comment.review_text}
  </p>
</blockquote>

                    {/* دکمه لایک و گزارش */}
                    <div className="d-flex justify-content-between">
                      <LikeButton
                        reviewId={comment.id}
                        handleLike={handleLike}
                        votes={votes[comment.id]?.length || 0}
                      />

                      <ReportButton
                        reviewId={comment.id}
                        reviewUserId={comment.user}
                        token={token}
                      />
                    </div>

                    {/* ریپلای ادمین */}
                    <AdminReplySection
                      reviewId={comment.id}
                      token={token}
                      isAdmin={isAdmin}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* --- اجزای کمکی (LikeButton, ReportButton, AdminReplySection) --- */

// کامپوننت لایک
const LikeButton = ({ reviewId, handleLike, votes }) => {
  return (
    <div className="like-dislike-buttons mb-2">
      <button
        onClick={() => handleLike(reviewId)}
        className="btn transparent-bg btn-sm"
      >
        👍 {votes}
      </button>
    </div>
  );
};

// کامپوننت گزارش نظر
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
      <button
        className="btn btn-light btn-sm"
        onClick={() => setShowModal(true)}
        style={{ marginRight: '8px' }}
      >
        <FontAwesomeIcon icon={faFlag} style={{ marginLeft: '5px' }} />
      </button>

      <Modal dir="rtl" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{ marginLeft: "70%" }}>گزارش نظر</Modal.Title>
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
            <option value="Remove">حذف شود</option>
            <option value="UserBan">مسدود کردن کاربر</option>
          </select>
        </Modal.Body>
        <Modal.Footer className="justify-content-start">
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

// بخش ریپلای ادمین
const AdminReplySection = ({ reviewId, token, isAdmin }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replies, setReplies] = useState([]);
  const [showAllReplies, setShowAllReplies] = useState(false);

  // گرفتن پاسخ‌های این کامنت
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const { data } = await axios.get(
          `${API_BASE_URL}/review_rating/review_responses/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
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

  // اگر هیچ پاسخی وجود ندارد و ادمین نیست => هیچی نشان نده
  if (replies.length === 0 && !isAdmin) {
    return null;
  }

  return (
    <div className="mt-2">
      {(replies.length > 0 || isAdmin) && (
        <Button
          className="btn btn-secondary btn-sm"
          onClick={toggleAllReplies}
          style={{ marginRight: '10px' }}
        >
          {showAllReplies ? 'پنهان کردن پاسخ مدیر' :<FontAwesomeIcon icon={faUserShield} className="text-green-500 w-6 h-6" />}
        </Button>
      )}

      {showAllReplies && replies.length > 0 && (
        <div className="mt-2">
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
              <small className="text-muted">
                {new Date(resp.created_at).toLocaleString('fa-IR')}
              </small>
            </div>
          ))}
        </div>
      )}

      {isAdmin && (
        <>
          <Button variant="link" onClick={() => setShowReplyForm(!showReplyForm)}>
            {showReplyForm ? 'بستن' :         <FontAwesomeIcon icon={faReply} className="text-blue-500 w-6 h-6" />}
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

export default CompanyDetailPage;
