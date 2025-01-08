import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
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
const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [businesses, setBusinesses] = useState({});
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const[user,setUser] =useState(null);
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
        setUser(userData);
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
              pic: res.data.business_image,
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
          businessesMap[biz.businessId] = {
          name: biz.name,
          pic : biz.pic,
              }        });
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
            <div key={review.id} className="mb-2">
              <div className="card h-100">
               <div style={{marginRight:"10px"}}>
                <div className="d-flex justify-content-between align-items-center p-2">
                <img
                    src={user.user_image || "https://via.placeholder.com/80"}
                    alt={username}
                    className="rounded-circle"
                    style={{ height: "80px", width: "60px", objectFit: "cover" }}
                  />
                <div style={{textAlign:"center"}}>
               
               <img src={businesses[review.business_id]?.pic || "https://via.placeholder.com/80"} width="100px" height="100px"/>

                <h6 className="mb-0">
                    {businesses[review.business_id]?.name || "نام بیزنس"}
                  </h6>
                  </div>
                  
                  

                </div>
                <div className="mb-2"style={{marginTop:"-10px"}}>
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className={
                          index < review.rank ? "text-warning" : "text-muted"
                        }
                        style={{ marginRight: "2px",fontSize:"30px" }}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                </div>
               
                <div className="card-body">
                  {/* <h5 className="card-title">{username}</h5> */}
                  <p className="text-muted small mb-1">
                    { toJalali(review.created_at)}
                  </p>
                  <div style={{marginLeft:"10px"}}>
                                    {review.hidden ? (
  <span className="badge bg-success">تایید شده</span>
) : (
  <span className="badge bg-danger">تایید نشده</span>
)}
</div>
                  {/* حالا نام بیزنس را براساس business_id دریافت می‌کنیم */}
                 
               
                 
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
