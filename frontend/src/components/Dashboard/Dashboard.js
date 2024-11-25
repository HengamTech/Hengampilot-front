import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faCommentDots,
  faListUl,
  faSignOutAlt,
  faUser,
  faCrown,
} from "@fortawesome/free-solid-svg-icons";

const UserDashboard = () => {
  const userData = {
    firstName: "بهرام",
    lastName: "دیانتی",
    username: "bahramd1",
    email: "bahramd1@example.com",
    address: "تهران، خیابان آزادی",
    reviewsCount: 5,
    accountType: "آزاد", // یا "پرمیوم"
  };

  const accountIcon =
    userData.accountType === "پرمیوم" ? (
      <FontAwesomeIcon icon={faCrown} className="text-warning ms-2" />
    ) : (
      <FontAwesomeIcon icon={faUser} className="text-info ms-2" />
    );

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row min-vh-10">
        {/* Sidebar */}
        <aside className="col-4 col-md-3 bg-dark text-white p-3">
          <div className="text-center mb-4">
            <img
              src="https://via.placeholder.com/80"
              alt="User"
              className="rounded-circle mb-2"
            />
            <h5>{`${userData.firstName} ${userData.lastName}`}</h5>
            <p className="d-flex align-items-center justify-content-center">
              {accountIcon}
              {userData.accountType}
            </p>
          </div>

          {/* Navbar */}
          <nav className="navbar navbar-expand-md navbar-dark bg-dark border-dark">
            <button
              className="navbar-toggler mb-1"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="sidebarMenu">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faUserEdit} />
                    ویرایش پروفایل
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faCommentDots} />
                    ثبت نظر
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faListUl} />
                    لیست نظرات
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    خروج
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 bg-light p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>داشبورد کاربری</h4>
            <a href="#" className="btn btn-outline-primary">
              بازگشت به صفحه اصلی
            </a>
          </div>

          <div className="card mb-4 p-3">
            <h5 className="card-title">مشخصات کاربر</h5>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>نام:</strong> {userData.firstName}
                </div>
                <div className="col-md-6">
                  <strong>نام خانوادگی:</strong> {userData.lastName}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>یوزرنیم:</strong> {userData.username}
                </div>
                <div className="col-md-6">
                  <strong>ایمیل:</strong> {userData.email}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-md-6">
                  <strong>آدرس:</strong> {userData.address}
                </div>
                <div className="col-md-6">
                  <strong>تعداد نظرات ثبت‌شده:</strong> {userData.reviewsCount}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <strong>نوع حساب کاربری:</strong> {userData.accountType}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="alert alert-info">
              اطلاعیه: برای دریافت امکانات بیشتر، حساب خود را به پرمیوم ارتقا دهید!
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
