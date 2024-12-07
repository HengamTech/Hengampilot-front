import React from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import img from './noon.png';

const reviews = [
  { id: 2, name: "محمد احمدی", date: "1403/08/08", rating: 3, comment: " Inception is undoubtedly one of my all-time favorite films. Directed by Christopher Nolan, it offers a remarkable fusion of mind-bending storytelling, outstanding performances, and visually stunning scenes that have left a lasting impression on me.", productImage: img, userImage: img },
  { id: 3, name: "سارا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 4, name: "احمد موسوی", date: "1403/08/08", rating: 4, comment: "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me.", productImage: img, userImage: img },
  { id: 5, name: "کاوه رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 6, name: "رضا رضایی", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  { id: 7, name: "آرام جعفری", date: "1403/08/08", rating: 5, comment: "توضیحات", productImage: img, userImage: img },
  // سایر نظرات
];

const ReviewDetailPage = () => {
  const { id } = useParams();
  const review = reviews.find((r) => r.id === parseInt(id));

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
          <p className="text-muted">{review.date}</p>
          <div className="mb-3">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`star ${index < review.rating ? 'text-warning' : 'text-muted'}`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="card-text">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewDetailPage;
