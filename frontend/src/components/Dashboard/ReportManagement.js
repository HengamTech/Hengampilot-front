import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserSlash,
  faTrash,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [reportType, setReportType] = useState("all");
  const [status, setStatus] = useState("all");
  const [singleDate, setSingleDate] = useState("");
  const [showUserReportsModal, setShowUserReportsModal] = useState(false);
  const [showCommentReportsModal, setShowCommentReportsModal] = useState(false);
  const [fullCommentText, setFullCommentText] = useState("");

  const token = localStorage.getItem("token");

  // 📥 دریافت گزارش‌ها از اندپوینت
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8000/review_rating/reports/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setReports(response.data);
      setFilteredReports(response.data); // تنظیم اولیه
      console.log("heyس",response.data);
    } catch (error) {
      console.error("خطا در دریافت گزارش‌ها:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // 📋 فیلتر کردن گزارش‌ها
  const applyFilters = () => {
    const filtered = reports.filter((report) => {
      const matchesType = reportType === "all" || report.type === reportType;
      const matchesStatus = status === "all" || report.status === status;
      const matchesSearch =
        searchText === "" || report.description.includes(searchText);
      const matchesDate = singleDate === "" || report.date === singleDate;

      return matchesType && matchesStatus && matchesSearch && matchesDate;
    });

    setFilteredReports(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, reportType, status, singleDate]);

  // 📋 نمایش جزئیات گزارش
  const handleShowDetails = (type) => {
    if (type === "کاربر") {
      setShowUserReportsModal(true);
    } else if (type === "کامنت") {
      setFullCommentText(
        "این یک متن کامل برای نمایش کامنت است که بیش از 100 کاراکتر دارد..."
      );
      setShowCommentReportsModal(true);
    }
  };

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row className="align-items-end">
        <Col md={12}>
          <div className="bg-white p-3 border rounded">
            <h5>فیلترها</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>نوع گزارش</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="all">همه</option>
                    <option value="کاربر">کاربر</option>
                    <option value="کامنت">کامنت</option>
                    <option value="محتوا">محتوا</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>وضعیت</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">همه</option>
                    <option value="بررسی‌شده">بررسی‌شده</option>
                    <option value="در حال بررسی">در حال بررسی</option>
                    <option value="رد شده">رد شده</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>تاریخ گزارش</Form.Label>
                  <Form.Control
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={9} className="bg-light p-3">
          <h3>لیست گزارش‌ها</h3>
          <Table striped bordered hover responsive className="text-center mt-3">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نوع گزارش</th>
                <th>توضیحات</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={report.id}>
                    <td>{index + 1}</td>
                    <td>{report.reason_select}</td>
                    <td>{report.reason}</td>
                    <td>{report.result_report}</td>
                    <td>{report.create_at}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowDetails(report.type)}
                      >
                        جزئیات
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">گزارشی یافت نشد</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportManagement;
