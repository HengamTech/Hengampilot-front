// Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from './Logo1.png';

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    // بررسی وضعیت لاگین در هنگام بارگذاری اولیه
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    if (token && storedUsername) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
    } else {
      setIsLoggedIn(false);
      setUsername('');
    }

    // تعریف توابع هندلر برای رویدادهای سفارشی
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

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

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

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <a
          className="navbar-brand d-flex align-items-center me-0"
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
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0"style={{marginLeft:"540px"}}>
            <li className="nav-item">
              <a className="nav-link" href="#categories">دسته بندی</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#blog">وبلاگ</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#feedback">ثبت انتقادات</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#aboutus">درباره ما</a>
            </li>
          </ul>
          <form className="d-flex me-3 mb-2 mb-lg-0">
            <input
              className="form-control"
              type="search"
              placeholder="جستجو شرکت ها"
              aria-label="Search"
            />
          </form>
          {!isLoggedIn ? (
            <div className="d-flex">
              <button
                className="btn btn-outline-success me-2"
                style={{marginLeft:"10px"}}
                onClick={handleLogin}
              >
                ورود
              </button>
              <button
                className="btn btn-success"
                onClick={handleSignUp}
              >
                ثبت نام
              </button>
            </div>
          ) : (
            <div className="dropdown">
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
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li>
                  <button className="dropdown-item" onClick={handleDashboard}>
                    داشبورد
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
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
