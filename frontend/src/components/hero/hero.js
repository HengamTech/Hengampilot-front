import React, { useState, useEffect } from "react";
import "./hero.css";
import thinkerImage from "./Untitled_Export_V1.jpeg";
import { FaSearch, FaBalanceScale, FaChartBar, FaCheckCircle } from "react-icons/fa";
import { Container, Row, Col ,ListGroup } from "react-bootstrap";
import { FaHeadset, FaShieldAlt, FaStar } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const HeroSection = ({ subjectText }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isDropdownVisible, setDropdownVisible] = useState(false); // نمایش لیست جستجو

  // گرفتن داده‌های کسب‌وکارها بر اساس جستجو
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // اگر متن خالی شد، لیست را مخفی کن
    if (!value.trim()) {
      setDropdownVisible(false);
      setBusinesses([]);
      return;
    }

    try {
      // درخواست به API جستجو
      const response = await axios.get(
        "http://localhost:8000/business_management/businesses/",
        {
          params: {
            ordering: "business_name",
            search: value,
          },
        }
      );

      setBusinesses(response.data || []);
      setDropdownVisible(true); // نمایش لیست نتایج
    } catch (error) {
      console.error("خطا در جستجوی بیزنس‌ها:", error);
    }
  };

  const handleSearchClick = () => {
    // با کلیک روی جستجو به صفحه بیزنس دیتیل منتقل شو
    if (businesses.length > 0) {
      window.location.href = `/companies/${businesses[0]?.id}`; // به صفحه جزئیات اولین بیزنس برو
    }
  };

  return (
    <div className="hero-section">
      <div className="thinker-container">
        <img src={thinkerImage} alt="Thinker Guy" className="thinker-image" />
      </div>

      <div className="title-container">
        <h1 className="hero-title">HENGAM PILOT</h1>
        <p className="hero-subtitle">کاوش کنید، مقایسه کنید، تصمیم بگیرید</p>
        <div className="search-bar">
          <button className="search-button" onClick={handleSearchClick}>
            <FaSearch className="search-icon" />
          </button>
          <input
            dir="rtl"
            type="text"
            className="form-control search-input"
            placeholder="جستجوی شرکت‌ها"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => setDropdownVisible(businesses.length > 0)} // وقتی فوکوس شد و لیست وجود داشت، نمایش بده
          />
        </div>

         {/* لیست نتایج جستجو */}
         {isDropdownVisible && (
          <div className="search-dropdown">
            <ListGroup>
              {businesses.map((business) => (
                <ListGroup.Item
                  key={business.id}
                  className="d-flex justify-content-between align-items-center"
                  onClick={() => (window.location.href = `/companies/${business.id}`)}
                  style={{ cursor: "pointer", marginLeft:"57px" }}
                >
                  <div>
                    <h6 className="mb-1">{business.business_name}</h6>
                    <small className="text-muted">{business.website_url || "بدون آدرس وب‌سایت"}</small>
                  </div>
                  <div>
                    
                    {/* <span>{business.rating?.toFixed(1) || "N/A"} <FaStar style={{ color: "#FFD700", marginLeft: "5px" }} /></span> */}
                    <div>
                    <p3>{business.total_reviews} :تعداد نظر</p3>
                  </div>
                  </div>
                  
                  
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* کارت‌ها */}
        <Row className="mt-4">
          <Col xs={12} sm={4} className="bb text-center">
            <FaBalanceScale className="icon mb-2" style={{ fontSize: "35px" }} />
            <p className="text-muted">مقایسه سریع و ساده</p>
          </Col>
          <Col xs={12} sm={4} className="bb text-center">
            <FaChartBar className="icon mb-2" style={{ fontSize: "35px" }} />
            <p className="text-muted">تحلیل هوشمند داده‌ها</p>
          </Col>
          <Col xs={12} sm={4} className="bb text-center">
            <FaCheckCircle className="icon mb-2" style={{ fontSize: "35px" }} />
            <p className="text-muted">تصمیم‌گیری آگاهانه</p>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col xs={12} sm={4} className="bb text-center">
            <FaHeadset className="icon mb-2" style={{ fontSize: "35px" }} />
            <p className="text-muted">پشتیبانی 24/7</p>
          </Col>
          <Col xs={12} sm={4} className="bb text-center">
            <FaShieldAlt className="icon mb-2" style={{ fontSize: "35px" }} />
            <p className="text-muted">امنیت تضمین‌شده</p>
          </Col>
          <Col xs={12} sm={4} className="bb text-center">
            <FaStar className="icon mb-2" style={{ fontSize: "35px" }} />
            <p className="text-muted">رتبه‌بندی برتر</p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HeroSection;
