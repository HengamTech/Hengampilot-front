import React from "react";
import { useParams } from "react-router-dom"; // برای دریافت پارامتر از URL
import { Link } from "react-router-dom";

const UserCommentsPage = () => {
  const { userId } = useParams(); // دریافت userId از URL
  // فرض کنیم که اطلاعات کاربران از قبل بارگذاری شده باشد (می‌توانید از API یا Context برای بارگذاری استفاده کنید)
  const users = [
    { id: 1, name: "علی", comments: ["نظر 1", "نظر 2"] },
    { id: 2, name: "زهرا", comments: ["نظر 3"] },
  ];

  const user = users.find(u => u.id === parseInt(userId)); // پیدا کردن کاربر با شناسه از URL

  if (!user) return <div>کاربر یافت نشد.</div>;

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <h3>نظرات {user.name}</h3>
      <ul>
        {user.comments.map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>
      <Link to="/UserManagement" className="btn btn-secondary">بازگشت به مدیریت کاربران</Link>
    </div>
  );
};

export default UserCommentsPage;
