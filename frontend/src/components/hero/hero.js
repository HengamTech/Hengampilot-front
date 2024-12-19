import React from "react";
import "./hero.css";
import thinkerImage from "./Untitled_Export_V1.jpeg"; // Replace with your image
import { FaSearch, FaBalanceScale, FaChartBar, FaCheckCircle } from "react-icons/fa";
import { Container, Row, Col } from "react-bootstrap";
import { FaHeadset, FaShieldAlt, FaStar } from 'react-icons/fa';
const HeroSection = ({ subjectText }) => {
  return (
    <div className="hero-section">
            {/* Thinker Section */}
            <div className="thinker-container">
                <img src={thinkerImage} alt="Thinker Guy" className="thinker-image" />
            </div>

            {/* Search Input */}
            {/* Hero Title */}
            <div className="title-container">
                <h1 className="hero-title">HENGAM PILOT</h1>
                <p className="hero-subtitle">کاوش کنید،مقایسه کنید،تصمیم بگیرید</p>
                <div className="search-bar">
                <button class="search-button">
                <FaSearch className="search-icon" />
                </button>
              <input
                dir="rtl"
                type="text"
                className="form-control search-input"
                placeholder="جستجوی شرکت‌ها"
              
              />
                </div>
                {/* کارت‌ها */}
            <Row className="mt-4">
              <Col xs={12} sm={4} className="bb text-center">
                <FaBalanceScale className="icon mb-2"style={{fontSize:"35px"}} />
                <p className="text-muted">مقایسه سریع و ساده</p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaChartBar className="icon mb-2"style={{fontSize:"35px"}}/>
                <p className="text-muted">تحلیل هوشمند داده‌ها</p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaCheckCircle className="icon mb-2" style={{fontSize:"35px"}}/>
                <p className="text-muted">تصمیم‌گیری آگاهانه</p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={12} sm={4} className="bb text-center">
                <FaHeadset className="icon mb-2" style={{fontSize:"35px"}}/>
                <p className="text-muted">    پشتیبانی 24/7
                </p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaShieldAlt className="icon mb-2" style={{fontSize:"35px"}}/>
                <p className="text-muted">    امنیت تضمین‌شده
                </p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaStar className="icon mb-2" style={{fontSize:"35px"}}/>
                <p className="text-muted">    رتبه‌بندی برتر
                </p>
              </Col>
            </Row>
            </div>
            <div className="search-container">
              
            </div>

            
          
          </div>
  );
};

export default HeroSection;
