import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CompanyDetailPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordering, setOrdering] = useState('');
  const [search, setSearch] = useState('');
  const { id } = useParams(); // شناسه شرکت
  const [comments, setComments] = useState([]); // نظرات کاربران
  const [userDetails, setUserDetails] = useState({}); // ذخیره اطلاعات کاربران
  
  // ✅ دریافت نظرات
  const fetchComments = async (id, ordering, search) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://localhost:8000/business_management/businesses/reviews/`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { id, ordering, search },
        }
      );
      setComments(response.data);
      
      // استخراج userId ها و دریافت اطلاعات کاربران
      const uniqueUserIds = [...new Set(response.data.map(comment => comment.user))];
      const userFetchPromises = uniqueUserIds
        .filter(userId => !userDetails[userId]) // جلوگیری از درخواست‌های تکراری
        .map(userId => loadUserDetails(userId));

      await Promise.all(userFetchPromises);
    } catch (err) {
      setError("خطا در دریافت اطلاعات نظرات.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ دریافت اطلاعات شرکت
  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/business_management/businesses/${id}/`
      );
      setCompany(response.data);
    } catch (err) {
      setError("خطا در دریافت اطلاعات شرکت.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ دریافت اطلاعات کاربر
  const loadUserDetails = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/user_management/users/${userId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response.data',response.data);
      setUserDetails(prevDetails => ({
        ...prevDetails,
        [userId]: response.data.username,
      }));
    } catch (err) {
      console.error(`خطا در دریافت اطلاعات کاربر با آیدی ${userId}`);
    }
  };
// console.log('userDetails',userDetails);
  useEffect(() => {
    fetchCompany();
    fetchComments(id, ordering, search);
  }, [id, ordering, search]);

  // ✅ هدایت به صفحه ثبت نظر
  const handleReviewSubmit = () => {
    if (!token) {
      alert("برای ثبت نظر باید وارد شوید.");
      navigate("/login");
    } else {
      navigate(`/reviewsubmit/${id}`);
    }
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

  const imageSrc = company.profileImage || "https://via.placeholder.com/80";

  // ✅ رندر ستاره‌ها
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
    <div className="container my-5" dir="rtl">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        بازگشت
      </button>
      <div className="card">
        <div className="card-header d-flex align-items-center" style={{ backgroundColor: "white" }}>
          <img
            src={imageSrc}
            alt={company.business_name}
            className="rounded me-0"
            style={{
              width: "200px",
              height: "200px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
          <div className="d-flex flex-column">
            <h2>{company.business_name}</h2>
            <small className="text-muted">
              {company.average_rank?.toFixed(1)} میانگین امتیاز |{" "}
              {company.total_reviews} نظر
            </small>
            <button className="btn btn-primary mt-3" onClick={handleReviewSubmit}>
              ثبت نظر
            </button>
          </div>
        </div>
        <div className="card-body">
          <h4>توضیحات</h4>
          <p>{company.description}</p>
          <h4>نظرات کاربران</h4>
          {comments.length === 0 ? (
            <p>هنوز هیچ نظری ثبت نشده است.</p>
          ) : (
            <ul className="list-group">
              {comments.map((comment) => (
                <li key={comment.id} className="list-group-item">
              <img   src="https://via.placeholder.com/80"
                            alt="User"
                            className="rounded-circle mb-2"
 />
                    <strong>
                    {userDetails[comment.user] || "در حال بارگذاری..."}
                  </strong>
                  <div>{renderStars(comment.rank)}</div>
                  <small className="text-muted">{comment.created_at}</small>
                  <p>{comment.review_text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
