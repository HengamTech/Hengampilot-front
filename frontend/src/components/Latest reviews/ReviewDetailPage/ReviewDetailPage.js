import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import img from './noon.png';

import { API_BASE_URL } from '../../config';

// const reviews = [
//   { id: 2, name: "محمد احمدی", date: "1403/08/08", rating: 3, comment: " Inception is undoubtedly one of my all-time favorite films. Directed by Christopher Nolan, it offers a remarkable fusion of mind-bending storytelling, outstanding performances, and visually stunning scenes that have left a lasting impression on me.", productImage: img, userImage: img },
//   { id: 3, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   { id: 4, name: "احمد موسوی", date: "1403/08/08", rating: 4, comment: "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me.", productImage: img, userImage: img },
//   { id: 5, name: "کاوه رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   { id: 6, name: "رضا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   { id: 7, name: "آرام جعفری", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
//   // سایر نظرات
// ];

const ReviewDetailPage = () => {
  const { id } = useParams();
  // const review = reviews.find((r) => r.id === parseInt(id));
  const [review, setReview] = useState([]);
  const navigate = useNavigate();
  const toJalali = (gregorianDate) => {
    if (!gregorianDate) return 'نامشخص'; // بررسی مقدار ورودی

    const g2j = (gYear, gMonth, gDay) => {
      const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const jDaysInMonth = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29, 29];

      let gy = gYear - 1600;
      let gm = gMonth - 1;
      let gd = gDay - 1;

      let gDayNo = 365 * gy + Math.floor((gy + 3) / 4) - Math.floor((gy + 99) / 100) + Math.floor((gy + 399) / 400);
      for (let i = 0; i < gm; ++i) gDayNo += gDaysInMonth[i];
      if (gm > 1 && ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)) ++gDayNo;
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

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`${API_BASE_URL}/review_rating/reviews/${id}/`, {
          // headers: {
          //   Authorization: `Bearer ${token}`,
          // },
        }
      );
        console.log(data);
            console.log(review.user);

            const userResponse = await axios.get(`${API_BASE_URL}/user_management/users/${data.user}/`, {
              // headers: {
              //   Authorization: `Bearer ${token}`,
              // },
            });
            const businessResponse = await axios.get(`${API_BASE_URL}/business_management/businesses/${data.business_id}/`, {
              // headers: {
              //   Authorization: `Bearer ${token}`,
              // },
            });
            setReview({
              ...data,
              name: userResponse.data.username,
              userImage: userResponse.data.user_image || img,
              businessName:businessResponse.data.business_name,
              businessUrl:businessResponse.data.website_url
            });
          } catch (error) {
            console.error('Error fetching review:', error);
          }
        };
    
        fetchReview();
      }, [id]);

  if (!review) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 text-center">
        <p>نظر مورد نظر یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-130">
      <h2 className="mb-4">جزئیات نظر</h2>
      <div className="card text-center" style={{ maxWidth: '730px', width: '100%' }}>
        <div className="card-body">
          <img
            src={review.userImage}
            alt={review.name}
            className="rounded-circle mb-3"
            style={{ width: '100px', height: '100px' }}
          />
          <h4 className="card-title">{review.name}</h4>
          <p className="text-muted">تاریخ:{toJalali(review.created_at)}</p>
          <p className="text-muted">{review.businessName}</p>
          <div className="mb-3">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < review.rank ? 'text-warning' : 'text-muted'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="card-text">{review.review_text}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
