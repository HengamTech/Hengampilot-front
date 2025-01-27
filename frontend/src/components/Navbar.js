import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import Logo from "./Logo1.png";
import { ListGroup } from "react-bootstrap";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css";
import '../assets/fonts/global.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faCommentDots,
  faChartBar,
  faFileAlt,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import { API_BASE_URL } from './config';

function Navbar() {
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState(null); 
  // اگر userImage خالی باشد، آیکون کاربری نشان داده می‌شود.
  const[Userrole,setUserrole] =useState(null);
  // --- state‌های مربوط به جستجو ---
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  useEffect(() => {
    // بررسی وضعیت لاگین در بارگذاری اولیه
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId");

    if (token && storedUsername && storedUserId) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      // دریافت عکس پروفایل کاربر
      fetchUserProfile(storedUserId); 
    }

    // مدیریت رویدادهای ورود و خروج
    const handleLoginEvent = async (e) => {
      setIsLoggedIn(true);
      setUsername(e.detail.username || ""); 
      // اگر لاگین انجام شده، ولی هنوز userId در localStorage نیست، 
      // لازم است در صفحه‌ی لاگین این را ست کنید.
      const newUserId = localStorage.getItem("userId");
      if (newUserId) {
        await fetchUserProfile(newUserId);
      }
    };

    const handleLogoutEvent = () => {
      setIsLoggedIn(false);
      setUsername("");
      setUserImage(null);
    };

    window.addEventListener("login", handleLoginEvent);
    window.addEventListener("logout", handleLogoutEvent);

    return () => {
      window.removeEventListener("login", handleLoginEvent);
      window.removeEventListener("logout", handleLogoutEvent);
    };
  }, []);

  // تابع کمکی برای گرفتن عکس پروفایل (و سایر اطلاعات کاربر)
  const fetchUserProfile = async (userId) => {
    if (!userId) return; // اگر userId نباشد، بی‌فایده است

    try {
      // درخواست به اندپوینت user_management
      const response = await axios.get(
        `${API_BASE_URL}/user_management/users/${userId}/`
      );
      setUserrole(response.data.is_admin);
      // فرض بر این است که فیلد user_image آدرس عکس کاربر باشد
      if (response.data.user_image) {
        setUserImage(response.data.user_image);
      } else {
        setUserImage(null); 
      }
    } catch (error) {
      console.error("خطا در دریافت پروفایل کاربر:", error);
    }
  };
  const handlecategory = () =>{
    navigate("/");
    setTimeout(() =>{
    const section1 = document.getElementById("Categories");
    section1.scrollIntoView({behavior:"smooth"});
    },100);
  }
  const handlereview = () => {
  navigate("/"); // بازگشت به صفحه اصلی
  setTimeout(() => {
    const section = document.getElementById("latestreview");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" }); // اسکرول به بخش مورد نظر
    } else {
      console.error("Section with ID 'latestreview' not found.");
    }
  }, 100); // تاخیر برای اطمینان از بارگذاری DOM
};

  const handleLogin = () => navigate("/login");
  const handleSignUp = () => navigate("/signup");
  const handleDashboard = () =>{
    if(Userrole ===false){
    navigate("/dashboard");
    }
    else {
      navigate("/admindashboard");
    }
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setIsLoggedIn(false);

    const logoutEvent = new Event("logout");
    window.dispatchEvent(logoutEvent);

    navigate("/");
  };

  const handleaboutus = () => {
    navigate("/aboutus");
  };

  // --- تابع جستجو ---
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setIsDropdownVisible(false);
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/business_management/businesses/`,
        {
          params: { ordering: "business_name", search: value },
        }
      );
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
              <a className="nav-link" href="#Categories" onClick={handlecategory}>
                دسته بندی
              </a>
            </li>
            <li className="nav-item">
              {/* <a className="nav-link" href="#blog">
                هنگام
              </a> */}
            </li>
            <li className="nav-item text-nowrap">
              <a className="nav-link" href="#latestreview" onClick={handlereview}>
                نظر های اخیر
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" onClick={handleaboutus} href="/aboutus">
                درباره ما
              </a>
            </li>
          </ul>

          {/* بخش جستجو */}
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
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {biz.website_url || "بدون آدرس وب‌سایت"}
                      </small>
                      <br/>
                      <strong>{biz.business_name}<span><img src={biz.business_image}width="40px"></img></span></strong>

                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            )}
          </div>

          {!isLoggedIn ? (
            <div className="d-flex mt-3 mt-lg-0">
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
            <div className="dropdown mt-3 mt-lg-0 profile-mobile" key={username}>
              <button
                className="btn btn-light dropdown-toggle"
                style={{ marginRight: "35px" }}
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {/* اگر عکس پروفایل داریم */}
                {userImage ? (
                  <img
                    src={userImage}
                    // alt="User Avatar"
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                      marginRight: "5px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  // در غیر این صورت آیکون قبلی
                  <i className="fas fa-user me-2"style={{fontSize:"26px"}}></i>
                )}
                {/* {username} */}
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end "
                aria-labelledby="dropdownMenuButton"
                style={{
                  position: "absolute", // موقعیت منوی کشویی
                  top: "100%", // دقیقا زیر دکمه
                  marginTop: "5px", // فاصله از دکمه
                  width: "20px", // عرض منوی کشویی
                  
                }}
              >
                <div className="text-end">
                <li >
                  <button
                    className="dropdown-item right-to-left"
                    onClick={handleDashboard}
                  >
                    <FontAwesomeIcon icon={faChartBar} /> داشبورد <i class="fas fa-arrow-left"style={{marginRight:"50px"}}></i>
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item right-to-left"
                    onClick={handleLogout}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} /> خروج <i class="fas fa-arrow-left"style={{marginRight:"60px"}}></i>
                  </button>
                </li>
                </div>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
