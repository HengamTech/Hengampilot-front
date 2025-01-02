import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from './Logo1.png';

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // بررسی وضعیت لاگین در بارگذاری اولیه
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    }

    // مدیریت رویدادهای ورود و خروج
    const handleLoginEvent = (e) => {
      setIsLoggedIn(true);
      setUsername(e.detail.username);
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUsername('');
    };

    // افزودن شنونده رویدادها
    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('logout', handleLogoutEvent);

    // پاکسازی شنونده‌ها در هنگام unmount
    return () => {
      window.removeEventListener('login', handleLoginEvent);
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, []);

  const handleLogin = () => navigate('/login');
  const handleSignUp = () => navigate('/signup');
  const handleDashboard = () => navigate('/dashboard');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    // ارسال رویداد سفارشی خروج
    const logoutEvent = new Event('logout');
    window.dispatchEvent(logoutEvent);

    navigate('/');
  };
  const handleaboutus = () =>{
    navigate('/aboutus');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ">
      <div className="container-fluid">
        <a
          className="navbar-brand d-flex align-items-center me-0 "
          href="/"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <img src={Logo} alt="Logo" width="60" height="60" />
          HengamPilot
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse " id="navbarNav">
        {/* <ul className="navbar-nav ms-30 mb-3 mb-lg-0 text-nowrap" style={{ marginRight: "20px" }}> */}

          <ul className="navbar-nav d-flex justify-content-between w-20 " style={{ marginRight: "20px" }}>
            <li className="nav-item" >
              <a className="nav-link" href="#categories"
              >دسته بندی</a>
            </li>
            <li className="nav-item" >
              <a className="nav-link" href="#blog">وبلاگ</a>
            </li>
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#feedback">ثبت انتقادات</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={handleaboutus}

              >درباره ما</a>
            </li>
          </ul>
          <form className="flex-grow-1 mx-3">
            <input
              className="form-control rounded"
              type="search"
              placeholder="جستجوی شرکت ها"
              aria-label="Search"
            />
          </form>
          
          {!isLoggedIn ? (
            <div className="d-flex">
              <button
                className="btn btn-primary flex-fill me-2 "
                style={{ marginLeft: "10px" }}
                onClick={handleLogin}
              >
                ورود
              </button>
              <button
                className="btn btn-outline-primary flex-fill"
                onClick={handleSignUp}
              >
                ثبت نام
              </button>
            </div>
          ) : (
            <div className="dropdown" key={username}>
              <button
                className="btn btn-secondary dropdown-toggle"
                style={{ marginRight: "35px" }}
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user me-2"></i> {username}
              </button>
              <ul className="dropdown-menu dropdown-menu-end right-to-left" aria-labelledby="dropdownMenuButton">
                <li>
                  <button className="dropdown-item right-to-left" onClick={handleDashboard}>
                    داشبورد
                  </button>
                </li>
                <li>
                  <button className="dropdown-item right-to-left" onClick={handleLogout}>
                    خروج
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
