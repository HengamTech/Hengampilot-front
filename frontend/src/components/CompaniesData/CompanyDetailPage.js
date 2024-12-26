import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const CompanyDetailPage = () => {
  const { id } = useParams(); // دریافت شناسه شرکت از URL
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]); // نظرات کاربران
//   const fetchcomment = async () =>{
//     setLoading(true);
//     setError(null);
//     try{
//       const response = await axios.get(
//         `http://localhost:8000/business_management/category/{id}/${id}/`,
//         {
//           headers:{
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       setComments(response.data);
//       console.log("sakam");
//     }
   
//     catch (err) {
//       setError("خطا در دریافت اطلاعات شرکت.");
    
//     } finally {
//       setLoading(false);
//     }
//   };
//   useEffect(() =>{
// fetchcomment()
//   },[id]);
  const fetchCompany = async () => {
    setLoading(true);
    setError(null);
    try {
      //const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://127.0.0.1:8000/business_management/businesses/${id}/`,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );
      setCompany(response.data);
    } catch (err) {
      setError("خطا در دریافت اطلاعات شرکت.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  // بررسی احراز هویت و هدایت کاربر
  const handleReviewSubmit = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // کاربر وارد نشده است -> هدایت به صفحه ورود
      alert("برای ثبت نظر باید وارد شوید.");
      navigate("/login");
    } else {
      // کاربر وارد شده است -> هدایت به صفحه ثبت‌نظر
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

  return (
    <div className="container my-5" dir="rtl">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        بازگشت
      </button>
      <div className="card">
        <div
          className="card-header d-flex align-items-center"
          style={{ backgroundColor: "white" }}
        >
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
            <div>{/* تابع برای نمایش ستاره‌ها */}</div>
            <small className="text-muted">
              {company.average_rank?.toFixed(1)} میانگین امتیاز |{" "}
              {company.total_reviews} نظر
            </small>
            <button
              className="btn btn-primary mt-3"
              onClick={handleReviewSubmit} // فراخوانی تابع بررسی احراز هویت
            >
              ثبت نظر
            </button>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <h4>توضیحات</h4>
            <p>{company.description}</p>
            <h4>نظرات کاربران</h4>
            {comments.length === 0 ? (
              <p>هنوز هیچ نظری ثبت نشده است.</p>
            ) : (
              <ul className="list-group">
                {comments.map((comment) => (
                  <li key={comment.id} className="list-group-item">
                    <strong>{comment.username}</strong> - {comment.rating} ستاره
                    <br />
                    <small className="text-muted">{comment.date}</small>
                    <p>{comment.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailPage;
