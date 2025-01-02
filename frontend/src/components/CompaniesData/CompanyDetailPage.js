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
  const { id } = useParams();
  const [comments, setComments] = useState([]);
  const [userDetails, setUserDetails] = useState({});

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
      const uniqueUserIds = [...new Set(response.data.map(comment => comment.user))];
      const userFetchPromises = uniqueUserIds
        .filter(userId => !userDetails[userId])
        .map(userId => loadUserDetails(userId));
      await Promise.all(userFetchPromises);
    } catch (err) {
      setError("خطا در دریافت اطلاعات نظرات.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/business_management/businesses/${id}/`
      );
      setCompany(response.data);
      console.log('response.data:',response.data);
    } catch (err) {
      setError("خطا در دریافت اطلاعات شرکت.");
    } finally {
      setLoading(false);
    }
  };

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
      setUserDetails(prevDetails => ({
        ...prevDetails,
        [userId]: response.data.username,
      }));
    } catch (err) {
      console.error(`خطا در دریافت اطلاعات کاربر با آیدی ${userId}`);
    }
  };

  useEffect(() => {
    fetchCompany();
    fetchComments(id, ordering, search);
  }, [id, ordering, search]);

  const handleReviewSubmit = () => {
    if (!token) {
      alert("برای ثبت نظر باید وارد شوید.");
      navigate("/login");
    } else {
      navigate(`/reviewsubmit/${id}`);
    }
  };

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

  return (
    <div className="container my-5" dir="rtl">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        بازگشت
      </button>
      <div className="card shadow-sm border-0 rounded">
        <div className="card-header text-center bg-white">
          <img
            src={imageSrc}
            alt={company.business_name}
            className="rounded-circle shadow mb-3"
            style={{ width: "150px", height: "150px", objectFit: "cover" }}
          />
          <h2>{company.business_name}</h2>
          <small className="text-muted">
            {company.average_rating?.toFixed(1)} میانگین امتیاز | {company.total_reviews} نظر
          </small>
          <div>
          <button className="btn btn-primary mt-2" onClick={handleReviewSubmit}>
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
            <div>
              {comments.map((comment) => (
                <div key={comment.id} className="border-bottom py-3">
                  <div className="d-flex align-items-center">
                    <img
                      src="https://via.placeholder.com/50"
                      alt="User"
                      className="rounded-circle me-2"
                    />
                   
                  </div>
                  <div className="col">
                    <strong>{userDetails[comment.user] || "در حال بارگذاری..."}</strong>
                    </div>
                  <div>{renderStars(comment.rank)}</div>
                  <small className="text-muted">{comment.created_at}</small>
                  <p>{comment.review_text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
