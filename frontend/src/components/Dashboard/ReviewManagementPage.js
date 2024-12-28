import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

const ReviewManagementPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // استیت‌های اصلی
  const [reviews, setReviews] = useState([]); // نظرات دریافتی از سرور
  const [businessesMap, setBusinessesMap] = useState({}); // نگاشت: businessId => businessName
  const [usersMap, setUsersMap] = useState({}); // نگاشت: userId => username

  // جستجو و فیلتر
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, pending, approved, rejected

  // گرفتن لیست نظرات
  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/review_rating/reviews/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data || [];
      setReviews(data);
      console.log('data',data);
      // گرفتن شناسه‌های یکتا برای بیزنس‌ها و کاربران
      const businessIds = [...new Set(data.map((item) => item.business_id))].filter(Boolean);
      const userIds = [...new Set(data.map((item) => item.user))].filter(Boolean);
      console.log('userIds1',userIds);
      // درخواست موازی برای بیزنس‌ها
      const businessPromises = businessIds.map((bizId) =>
        axios
          .get(`http://localhost:8000/business_management/businesses/${bizId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({ bizId, bizName: res.data.business_name }))
          .catch(() => ({ bizId, bizName: "نامشخص" }))
      );

      // درخواست موازی برای کاربران
      const userPromises = userIds.map((userId) =>
        axios
          .get(`http://localhost:8000/user_management/users/${userId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => ({ userId, username: res.data.username }))
          .catch((err) => {
            console.error(`Error fetching user ${userId}:`, err.message);
            return { userId, username: "نامشخص" }; // مقدار پیش‌فرض در صورت خطا
          })
      );
      
      // استفاده از Promise.allSettled برای ادامه عملیات حتی در صورت وجود خطا
      const userResults = await Promise.allSettled(userPromises);
      
      const userMap = {};
      userResults.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const { userId, username } = result.value;
          userMap[userId] = username;
        } else {
          console.error(`Failed to fetch user ${userIds[index]}:`, result.reason);
          userMap[userIds[index]] = "نامشخص";
        }
      });
      
      setUsersMap(userMap);
      console.log("User map:", userMap);
            // انتظار برای اتمام تمام درخواست‌ها
      const businessResults = await Promise.all(businessPromises);

      // ساخت نگاشت برای بیزنس‌ها و کاربران
      const bizMap = {};
      businessResults.forEach((b) => {
        bizMap[b.bizId] = b.bizName;
      });

      // const userMap = {};
      // userResults.forEach((u) => {
      //   userMap[u.userId] = u.username;
      // });

      setBusinessesMap(bizMap);
      setUsersMap(userMap);
    } catch (error) {
      console.error("خطا در دریافت نظرات:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // تایید و رد نظر
  const approveReview = (id) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "approved" } : r
    );
    setReviews(updated);
  };

  const rejectReview = (id) => {
    const updated = reviews.map((r) =>
      r.id === id ? { ...r, status: "rejected" } : r
    );
    setReviews(updated);
  };

  // حذف نظر
  const deleteReview = (id) => {
    if (window.confirm("آیا از حذف این نظر اطمینان دارید؟")) {
      setReviews(reviews.filter((r) => r.id !== id));
    }
  };

  // جستجو و فیلتر
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReviews = reviews.filter((review) => {
    const searchMatch =
      usersMap[review.user_id]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(searchTerm.toLowerCase());

    const statusMatch =
      filterStatus === "all" ? true : review.status === filterStatus;

    return searchMatch && statusMatch;
  });

  // تابع رندر ستاره
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    const stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} style={{ color: "#FFD700" }} />);
    }
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" style={{ color: "#FFD700" }} />);
    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} style={{ color: "#FFD700" }} />);
    }
    return stars;
  };

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row">
        <main className="col-12 col-md-12">
          <h2 className="mb-4">مدیریت نظرات</h2>

          {/* بخش فیلتر */}
          <div className="row mb-4">
            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="جستجو بر اساس نام کاربری یا متن نظر..."
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <div className="col-md-6">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">همه وضعیت‌ها</option>
                <option value="pending">در انتظار تایید</option>
                <option value="approved">تایید شده</option>
                <option value="rejected">رد شده</option>
              </select>
            </div>
          </div>

          {/* جدول نظرات */}
          <div className="table-responsive">
          <table
    className="table table-striped table-bordered table-hover align-middle text-center"
    style={{ tableLayout: "fixed", width: "100%" }}
  >
    <thead>
      <tr>
        <th style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>نام کاربری</th>
        <th style={{ maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>شرکت</th>
        <th style={{ maxWidth: "100px" }}>امتیاز</th>
        <th style={{ maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>نظر</th>
        <th style={{ maxWidth: "150px" }}>تاریخ</th>
        {/* <th style={{ maxWidth: "150px" }}>وضعیت</th> */}
        {/* <th style={{ maxWidth: "150px" }}>عملیات</th> */}
      </tr>
    </thead>
    <tbody>
      {filteredReviews.length === 0 ? (
        <tr>
          <td colSpan="7" className="text-center">
            هیچ نظری یافت نشد.
          </td>
        </tr>
      ) : (
        filteredReviews.map((review) => (
          <tr key={review.id}>
            <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {usersMap[review.user] || "نامشخص"}
            </td>
            <td style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {businessesMap[review.business_id] || "نامشخص"}
            </td>
            <td>{renderStars(review.rank || 0)}</td>
            <td > <div style={{
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxHeight: '4.5em',
    overflow: 'auto'
  }}>
              {review.review_text}
     </div>
            </td>
            <td>{review.created_at}</td>
            {/* <td>
              {review.status === "approved" && (
                <span className="badge bg-success">تایید شده</span>
              )}
              {review.status === "pending" && (
                <span className="badge bg-warning text-dark">در انتظار</span>
              )}
              {review.status === "rejected" && (
                <span className="badge bg-danger">رد شده</span>
              )}
            </td> */}
            {/* <td>
              {review.status === "pending" && (
                <>
                  <button
                    className="btn btn-success btn-sm me-2"
                    onClick={() => approveReview(review.id)}
                    title="تایید نظر"
                  >
                    <FaCheck />
                  </button>
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => rejectReview(review.id)}
                    title="رد نظر"
                  >
                    <FaTimes />
                  </button>
                </>
              )}
              <button
                className="btn btn-danger btn-sm"
                onClick={() => deleteReview(review.id)}
                title="حذف نظر"
              >
                <FaTrash />
              </button>
            </td> */}
          </tr>
        ))
      )}
    </tbody>
  </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewManagementPage;
