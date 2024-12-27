import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) دریافت نظرات کاربر
        const reviewsResponse = await axios.get(
          'http://localhost:8000/review_rating/reviews/reviews-by-user/',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { id },
          }
        );
        const reviewsData = reviewsResponse.data;
        setReviews(reviewsData);

        // 2) دریافت اطلاعات کاربر
        const userResponse = await axios.get(
          `http://localhost:8000/user_management/users/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const userData = userResponse.data;
        setUsername(userData.username || `${userData.first_name} ${userData.last_name}`);

        // 3) استخراج شناسه‌های بیزنس:
        //   فرض بر این است هر review فیلدی به نام business_id دارد
        const businessIds = [...new Set(reviewsData.map(r => r.business_id))].filter(Boolean);
        console.log('businessIds:', businessIds);

        // 4) همزمان اطلاعات هر بیزنس را می‌گیریم
        const businessPromises = businessIds.map((businessId) =>
          axios
            .get(`http://localhost:8000/business_management/businesses/${businessId}/`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then((res) => ({
              businessId,
              name: res.data.business_name, // یا هر فیلد دیگری که نام بیزنس باشد
            }))
            .catch((err) => {
              console.error(`Error fetching business ${businessId}:`, err);
              return { businessId, name: 'نام نامشخص' };
            })
        );

        const businessesData = await Promise.all(businessPromises);
        console.log(businessesData);
        // یک map ساده برای businessId -> name
        const businessesMap = {};
        businessesData.forEach((biz) => {
          businessesMap[biz.businessId] = biz.name;
        });
        setBusinesses(businessesMap);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('خطا در دریافت لیست نظرات');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  if (loading) {
    return <div className="text-center mt-5">در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center mt-5">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">{username} نظرات</h2>
      {reviews.length === 0 ? (
        <div className="alert alert-info text-center">هیچ نظری ثبت نشده است.</div>
      ) : (
        <div className="row" dir="rtl">
          {reviews.map((review) => (
            <div key={review.id} className="mb-4">
              <div className="card h-100">
                <div className="d-flex align-items-center p-2">
                  <img
                    src={review.userImage || "https://via.placeholder.com/80"}
                    alt={username}
                    className="rounded-circle"
                    style={{ height: "80px", width: "80px", objectFit: "cover" }}
                  />
                </div>

                <div className="card-body">
                  <h5 className="card-title">{username}</h5>
                  <p className="text-muted small mb-1">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>

                  {/* حالا نام بیزنس را براساس business_id دریافت می‌کنیم */}
                  <h6 className="mb-2">
                    {businesses[review.business_id] || "نام بیزنس"}
                  </h6>

                  <div className="mb-2">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={
                          index < review.rank ? "text-warning" : "text-muted"
                        }
                        style={{ marginRight: "2px" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  <p className="card-text">{review.review_text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviews;
