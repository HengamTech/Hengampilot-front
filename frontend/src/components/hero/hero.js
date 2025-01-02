import React, { useState } from "react";
import "./hero.css";
import thinkerImage from "./Untitled_Export_V1.jpeg";
import { FaSearch, FaBalanceScale, FaChartBar, FaCheckCircle, FaHeadset, FaShieldAlt, FaStar } from "react-icons/fa";
import { Container, Row, Col, ListGroup } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState([]);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setDropdownVisible(false);
      setBusinesses([]);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/business_management/businesses/", {
        params: { ordering: "business_name", search: value },
      });

      setBusinesses(response.data || []);
      setDropdownVisible(true);
    } catch (error) {
      console.error("Error fetching businesses:", error);
    }
  };

  return (
      <Container fluid className="hero-section px-4 align-content-start justify-content-start">
        <Row className="align-items-start justify-content-center mt-5">
          <Col md={5} className="text-right mx-5">
            <img src={thinkerImage} alt="Thinker" className="img-fluid thinker-image" />
          </Col>
          <Col md={5}>
            <h1 className="hero-title text-center mt-4">HENGAM PILOT</h1>
            <p className="hero-subtitle text-center">کاوش کنید، مقایسه کنید، تصمیم بگیرید</p>
            <input
                dir="rtl"
                type="text"
                className="text-filed form-control search-input text-center w-50"
                placeholder="جستجوی شرکت‌ها"
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => setDropdownVisible(businesses.length > 0)}
            />

            {isDropdownVisible && (
                <ListGroup className="search-dropdown">
                  {businesses.map((business) => (
                      <ListGroup.Item
                          key={business.id}
                          className="d-flex justify-content-between align-items-center"
                          onClick={() => (window.location.href = `/companies/${business.id}`)}
                          style={{ cursor: "pointer" }}
                      >
                        <div>
                          <h6 className="mb-1">{business.business_name}</h6>
                          <small className="text-muted">{business.website_url || "بدون آدرس وب‌سایت"}</small>
                        </div>
                        <div>
                          <p className="mb-0">{business.total_reviews} :تعداد نظر</p>
                        </div>
                      </ListGroup.Item>
                  ))}
                </ListGroup>
            )}
            <Row className="mt-4">
              <Col xs={12} sm={4} className="bb text-center">
                <FaBalanceScale className="icon mb-2" />
                <p>مقایسه سریع و ساده</p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaChartBar className="icon mb-2" />
                <p>تحلیل هوشمند داده‌ها</p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaCheckCircle className="icon mb-2" />
                <p>تصمیم‌گیری آگاهانه</p>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs={12} sm={4} className="bb text-center">
                <FaHeadset className="icon mb-2" />
                <p>پشتیبانی 24/7</p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaShieldAlt className="icon mb-2" />
                <p>امنیت تضمین‌شده</p>
              </Col>
              <Col xs={12} sm={4} className="bb text-center">
                <FaStar className="icon mb-2" />
                <p>رتبه‌بندی برتر</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
  );
};

export default HeroSection;
