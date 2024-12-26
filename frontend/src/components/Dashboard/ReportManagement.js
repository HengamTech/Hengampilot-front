import React, { useState } from "react";
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

const ReportManagement = () => {
  const [searchText, setSearchText] = useState("");
  const [reportType, setReportType] = useState("all");
  const [status, setStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [singleDate, setSingleDate] = useState("");
  const [showUserReportsModal, setShowUserReportsModal] = useState(false);
  const [showCommentReportsModal, setShowCommentReportsModal] = useState(false);
  const [fullCommentText, setFullCommentText] = useState("");

  // داده‌های نمونه برای جدول
  const [reports] = useState([
    { id: 1, type: "کامنت", description: "محتوای نامناسب", status: "بررسی‌شده", date: "2024-06-01" },
    { id: 2, type: "کاربر", description: "حساب مشکوک", status: "در حال بررسی", date: "2024-06-02" },
    { id: 3, type: "محتوا", description: "لینک غیرمجاز", status: "رد شده", date: "2024-06-03" },
  ]);

  // فیلتر کردن داده‌ها
  const filteredReports = reports.filter((report) => {
    return (
      (reportType === "all" || report.type === reportType) &&
      (status === "all" || report.status === status) &&
      (searchText === "" || report.description.includes(searchText)) &&
      (singleDate === "" || report.date === singleDate)
    );
  });

  // باز کردن مودال‌ها
  const handleShowDetails = (type) => {
    if (type === "کاربر") {
      setShowUserReportsModal(true);
    } else if (type === "کامنت") {
      setFullCommentText("این یک متن کامل برای نمایش کامنت است که بیش از 100 کاراکتر دارد...");
      setShowCommentReportsModal(true);
    }
  };

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row className="align-items-end">
        <Col md={12}>
        <div className="bg-white p-3 border rounded">
          <h5>فیلترها</h5>
          {/* فیلترها */}
          
                    {/* وضعیت */}
               <Row>
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
              {/* بازه زمانی */}
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
        
{/* دکمه بازنشانی فیلترها */}
            {/* <Button
            variant="secondary"
            className="md-2 mt-2"
            onClick={() => {
              setSearchText("");
              setReportType("all");
              setStatus("all");
              setStartDate("");
              setEndDate("");
            }}
          >
            بازنشانی فیلترها
          </Button> */}
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
                    <td>{report.type}</td>
                    <td>{report.description}</td>
                    <td>{report.status}</td>
                    <td>{report.date}</td>
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

    {/* مودال گزارش کاربران */}
    <Modal
        show={showUserReportsModal}
        onHide={() => setShowUserReportsModal(false)}
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title>گزارش کاربران</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover className="text-center w-auto mx-auto">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نام کاربر</th>
                <th>دلیل گزارش</th>
                <th>تاریخ</th>
                <th>اقدام</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>کاربرA</td>
                <td>تخلف در پروفایل</td>
                <td>2024-05-01</td>
                <td>
                  <Button variant="warning" size="sm">
                    <FontAwesomeIcon icon={faUserSlash} /> بن کردن یوزر
                  </Button>
                </td>
              </tr>
              <tr>
                <td>2</td>
                <td>کاربرB</td>
                <td>نام کاربری نامناسب</td>
                <td>2024-05-02</td>
                <td>
                  <Button variant="warning" size="sm">
                    <FontAwesomeIcon icon={faUserSlash} /> بن کردن یوزر
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowUserReportsModal(false)}
          >
            بستن
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال گزارش کامنت */}
      <Modal
        show={showCommentReportsModal}
        onHide={() => setShowCommentReportsModal(false)}
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title>گزارش کامنت‌ها</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Table striped bordered hover className="w-auto mx-auto text-center">
              <tbody>
                <tr>
                  <td>متن کامنت</td>
                  <td>
                    {(() => {
                      if (fullCommentText.length > 100) {
                        const shortText = fullCommentText.substring(0, 100);
                        return (
                          <span>
                            {shortText}...
                            <span
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => handlePageChange("review/4")}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.textDecoration = "none")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.textDecoration =
                                  "underline")
                              }
                            >
                              بیشتر
                            </span>
                          </span>
                        );
                      } else {
                        return fullCommentText;
                      }
                    })()}
                  </td>
                </tr>
                <tr>
                  <td>دلیل گزارش</td>
                  <td>اسپم تبلیغاتی</td>
                </tr>
                <tr>
                  <td>متن گزارش</td>
                  <td>حاوی اطلاعات نادرست</td>
                </tr>
                <tr>
                  <td>اقدامات</td>
                  <td>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => alert("کامنت حذف شد!")}
                    >
                      <FontAwesomeIcon icon={faTrash} /> حذف کامنت
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="me-2"
                      onClick={() => alert("این گزارش نادیده گرفته شد.")}
                    >
                      <FontAwesomeIcon icon={faEyeSlash} /> نادیده گرفتن
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => alert("کاربر بن شد!")}
                    >
                      <FontAwesomeIcon icon={faUserSlash} /> بن کردن یوزر
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowCommentReportsModal(false)}
          >
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportManagement;
