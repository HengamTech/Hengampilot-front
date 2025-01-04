import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from './Logo1.png';
// اگر از React-Bootstrap یا هر کتابخانه دیگری برای لیست نتایج استفاده می‌کنید، آن را ایمپورت کنید:
import { ListGroup } from 'react-bootstrap';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');

  // --- stateهای مربوط به جستجو ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

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

    window.addEventListener('login', handleLoginEvent);
    window.addEventListener('logout', handleLogoutEvent);

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

    const logoutEvent = new Event('logout');
    window.dispatchEvent(logoutEvent);

    navigate('/');
  };
  const handleaboutus = () => {
    navigate('/aboutus');
  };

  // --- تابع جستجو: مشابه آنچه در HeroSection داشتید ---
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setIsDropdownVisible(false);
      setSearchResults([]);
      return;
    }

    try {
      // درخواست به سرور برای دریافت نتایج
      const response = await axios.get("http://localhost:8000/business_management/businesses/", {
        params: { ordering: "business_name", search: value },
      });
      setSearchResults(response.data || []);
      setIsDropdownVisible(true);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light ">
      <div className="container-fluid">
        <a
          className="navbar-brand d-flex align-items-center me-0 "
          href="/"
          style={{ display: "flex", justifyContent: "flex-end" }}
        >
          <img src={Logo} alt="Logo" width="60" height="60" className="logo" />
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
          <ul
            className="navbar-nav d-flex justify-content-between w-20 "
            style={{ marginRight: "20px" }}
          >
            <li className="nav-item">
              <a className="nav-link" href="#categories">
                دسته بندی
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#blog">
                هنگام
              </a>
            </li>
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#feedback">
 نظر های اخیر
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={handleaboutus} href="/aboutus">
                درباره ما
              </a>
            </li>
          </ul>

          {/* بخش جستجو: یک ظرف با position: relative */}
          <div className="mx-3 flex-grow-1" style={{ position: "relative" }}>
            <input
              className="form-control rounded"
              type="search"
              placeholder="جستجوی شرکت ها"
              aria-label="Search"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownVisible(searchResults.length > 0)}
            />
            {/* کشویی نتایج جستجو */}
            {isDropdownVisible && (
              <ListGroup
                className="position-absolute bg-white"
                style={{
                  top: "100%",
                  left: 0,
                  right: 0,
                  zIndex: 999,
                }}
              >
                {searchResults.map((biz) => (
                  <ListGroup.Item
                    key={biz.id}
                    onClick={() => {
                      // انتقال به صفحه‌ی شرکت
                      window.location.href = `/companies/${biz.id}`;
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div>
                      <strong>{biz.business_name}</strong>
                      <br />
                      <small className="text-muted">{biz.website_url || "بدون آدرس وب‌سایت"}</small>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="d-flex">
              <button
                className="btn btn-primary flex-fill me-2"
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
              <ul
                className="dropdown-menu dropdown-menu-end right-to-left"
                aria-labelledby="dropdownMenuButton"
              >
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
