import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaCheck,
  FaTimes,
  FaTrash,
} from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const ReviewManagementPage = () => {
  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState([]);
  const [businessesMap, setBusinessesMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHidden, setFilterHidden] = useState("all");

  // برای مودال نمایش جزئیات نظر:
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReviewDetail, setSelectedReviewDetail] = useState(null);

  // تابع تبدیل تاریخ میلادی به شمسی
  const toJalali = (gregorianDate) => {
    if (!gregorianDate) return "نامشخص"; // اگر خالی بود
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
      for (let i = 0; i < gm; ++i) {
        gDayNo += gDaysInMonth[i];
      }
      // سال کبیسه میلادی
      if (
        gm > 1 &&
        ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)
      ) {
        ++gDayNo;
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

    const parts = gregorianDate.split("-");
    if (parts.length < 3) return "نامشخص";
    const gYear = parseInt(parts[0], 10);
    const gMonth = parseInt(parts[1], 10);
    const gDay = parseInt(parts[2], 10);

    const { year, month, day } = g2j(gYear, gMonth, gDay);
    return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/review_rating/reviews/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data || [];
      setReviews(data);

      const businessIds = [
        ...new Set(data.map((item) => item.business_id)),
      ].filter(Boolean);
      const userIds = [
        ...new Set(data.map((item) => item.user)),
      ].filter(Boolean);

      const businessPromises = businessIds.map((bizId) =>
        axios
          .get(`http://localhost:8000/business_management/businesses/${bizId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({ bizId, bizName: res.data.business_name }))
          .catch(() => ({ bizId, bizName: "نامشخص" }))
      );

      const userPromises = userIds.map((userId) =>
        axios
          .get(`http://localhost:8000/user_management/users/${userId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({ userId, username: res.data.username }))
          .catch(() => ({ userId, username: "نامشخص" }))
      );

      const businessResults = await Promise.all(businessPromises);
      const userResults = await Promise.all(userPromises);

      const bizMap = {};
      businessResults.forEach(({ bizId, bizName }) => {
        bizMap[bizId] = bizName;
      });

      const userMap = {};
      userResults.forEach(({ userId, username }) => {
        userMap[userId] = username;
      });

      setBusinessesMap(bizMap);
      setUsersMap(userMap);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const updateReviewHidden = async (id, newHiddenStatus) => {
    try {
      const review = reviews.find((r) => r.id === id);
      if (!review) {
        console.error("Review not found.");
        return;
      }

      // نمایش پیام تأیید به کاربر
      const confirmationMessage = newHiddenStatus
        ? "آیا مطمئن هستید که می‌خواهید این نظر را تأیید کنید؟"
        : "آیا مطمئن هستید که می‌خواهید این نظر را رد کنید؟";

      const isConfirmed = window.confirm(confirmationMessage);
      if (!isConfirmed) {
        return; // کاربر انصراف داده است
      }

      const updatedReview = {
        ...review,
        hidden: newHiddenStatus,
      };

      await axios.put(
        `http://localhost:8000/review_rating/reviews/${id}/`,
        updatedReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, hidden: newHiddenStatus } : r))
      );

      // پیام موفقیت
      alert(
        newHiddenStatus
          ? "نظر با موفقیت تأیید شد."
          : "نظر با موفقیت رد شد."
      );
    } catch (error) {
      console.error(
        "Error updating review:",
        error.response?.data || error.message
      );
      alert("خطا در به‌روزرسانی نظر. لطفاً دوباره تلاش کنید.");
    }
  };

  const deleteReview = async (id) => {
    if (window.confirm("آیا از حذف این نظر مطمئن هستید؟")) {
      try {
        await axios.delete(`http://localhost:8000/review_rating/reviews/${id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews((prev) => prev.filter((review) => review.id !== id));
      } catch (error) {
        console.error("Error deleting review:", error);
      }
    }
  };

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredReviews = reviews.filter((review) => {
    const username = usersMap[review.user]?.toLowerCase() || "";
    const reviewText = review.review_text?.toLowerCase() || "";
    const searchLower = searchTerm.toLowerCase();

    const searchMatch = username.includes(searchLower) || reviewText.includes(searchLower);
    const hiddenMatch =
      filterHidden === "all"
        ? true
        : filterHidden === "hidden"
        ? review.hidden
        : !review.hidden;

    return searchMatch && hiddenMatch;
  });

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
      <>
        {Array(fullStars).fill(<FaStar style={{ color: "#FFD700" }} />)}
        {halfStar && <FaStarHalfAlt style={{ color: "#FFD700" }} />}
        {Array(emptyStars).fill(<FaRegStar style={{ color: "#FFD700" }} />)}
      </>
    );
  };

  // برای باز و بسته کردن مودال نمایش جزئیات نظر
  const [showModal, setShowModal] = useState(false);

  const handleShowModal = (review) => {
    setSelectedReviewDetail(review);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setSelectedReviewDetail(null);
    setShowModal(false);
  };

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <h2 className="mb-4">مدیریت نظرات</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="جستجو..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterHidden}
            onChange={(e) => setFilterHidden(e.target.value)}
          >
            <option value="all">همه نظرات</option>
            <option value="hidden">مخفی شده</option>
            <option value="visible">قابل مشاهده</option>
          </select>
        </div>
      </div>

      <table
        className="table table-striped text-center"
        style={{ tableLayout: "fixed", width: "100%" }}
      >
        <colgroup>
          <col style={{ width: "120px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
          <col style={{ width: "120px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
          <col style={{ width: "80px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
          <col style={{ width: "120px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
          <col style={{ width: "100px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
          <col style={{ width: "100px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
          <col style={{ width: "140px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
        </colgroup>
        <thead>
          <tr>
            <th>نام کاربری</th>
            <th>شرکت</th>
            <th>امتیاز</th>
            <th>نظر</th>
            <th>تاریخ</th>
            <th>وضعیت</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {filteredReviews.map((review) => (
            <tr key={review.id}>
              <td>{usersMap[review.user] || "نامشخص"}</td>
              <td>{businessesMap[review.business_id] || "نامشخص"}</td>
              <td>{renderStars(review.rank || 0)}</td>

              {/* ستون "نظر": به‌جای نمایش مستقیم متن، دکمه‌ی "جزئیات نظر" */}
              <td>
                <button
                  className="btn btn-link p-0"
                  onClick={() => handleShowModal(review)}
                >
                  جزئیات نظر
                </button>
              </td>

              {/* تبدیل تاریخ به شمسی */}
              <td>{toJalali(review.created_at)}</td>

              <td>{review.hidden ? "تایید شده" : "رد شده"}</td>
              <td>
                <FaCheck
                  style={{ cursor: "pointer", margin: "0 3px" }}
                  onClick={() => updateReviewHidden(review.id, true)}
                />
                <FaTimes
                  style={{ cursor: "pointer", margin: "0 3px" }}
                  onClick={() => updateReviewHidden(review.id, false)}
                />
                <FaTrash
                  style={{ cursor: "pointer", margin: "0 3px" }}
                  onClick={() => deleteReview(review.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* مودال نمایش جزئیات نظر */}
      <Modal show={showModal} onHide={handleCloseModal} dir="rtl">
        <Modal.Header closeButton>
          <Modal.Title>جزئیات نظر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReviewDetail ? (
            <>
              <p>
                <strong>تاریخ ثبت نظر: </strong>
                {toJalali(selectedReviewDetail.created_at)}
              </p>
              
                <strong >متن نظر کاربر:</strong>
              <div style={{
                maxHeight: "200px",
                overflow:"auto",
                fontSize:"24px",
                textAlign: "justify",
                lineHeight:"1.8",
                padding: "10px",
                border: "2px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
                direction:"rtl",
                wordBreak: "break-word",
                whiteSpace: "pre-wrap",
              }}>
              <p>{selectedReviewDetail.review_text}</p>
              </div>
            </>
          ) : (
            <p>در حال بارگذاری...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewManagementPage;
