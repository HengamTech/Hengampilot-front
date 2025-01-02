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

const ReviewManagementPage = () => {
  const token = localStorage.getItem("token");

  const [reviews, setReviews] = useState([]);
  const [businessesMap, setBusinessesMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filterHidden, setFilterHidden] = useState("all"); // فیلتر بر اساس `hidden`

  const fetchReviews = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/review_rating/reviews/",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = response.data || [];
      setReviews(data);

      const businessIds = [...new Set(data.map((item) => item.business_id))].filter(Boolean);
      const userIds = [...new Set(data.map((item) => item.user))].filter(Boolean);

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

      const updatedReview = {
        ...review,
        hidden: newHiddenStatus,
      };

      const response = await axios.put(
        `http://localhost:8000/review_rating/reviews/${id}/`,
        updatedReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews((prev) =>
        prev.map((r) => (r.id === id ? { ...r, hidden: newHiddenStatus } : r))
      );
    } catch (error) {
      console.error("Error updating review:", error.response?.data || error.message);
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
    const searchMatch =
      usersMap[review.user]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review_text?.toLowerCase().includes(searchTerm.toLowerCase());
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

      <table className="table table-striped text-center">
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
              <td>{review.review_text}</td>
              <td>{review.created_at}</td>
              <td>{review.hidden ? "مخفی شده" : "قابل مشاهده"}</td>
              <td>
                <FaCheck onClick={() => updateReviewHidden(review.id, false)} />
                <FaTimes onClick={() => updateReviewHidden(review.id, true)} />
                <FaTrash onClick={() => deleteReview(review.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReviewManagementPage;
