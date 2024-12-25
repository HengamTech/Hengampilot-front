import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Modal,
  Tab
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSlash, faTrash, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const ReportManagement = () => {
  // استیت‌های مربوط به نمایش مودال
  const [showUserReportsModal, setShowUserReportsModal] = useState(false);
  const [showCommentReportsModal, setShowCommentReportsModal] = useState(false);

  // تب فعال
  const [activeTab, setActiveTab] = useState("reports");

  // مثالی از متن کامنت کامل (برای نمایش در مودال گزارش کامنت)
  const fullCommentText =
    "متن طولانی کامنت ... (اینجا توضیحات کامل کامنت را قرار دهید) ...";

  // تابعی برای جابه‌جایی تب
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  // در صورت نیاز به هدایت (مثلاً به صفحه‌ای دیگر) می‌توانید از useNavigate استفاده کنید
  const handlePageChange = (url) => {
    console.log("navigate to:", url);
    // navigate(url);
  };

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row className="min-vh-100">
        <Col md={9} className="bg-light">
          <h3 className="my-3">مدیریت گزارش‌ها  </h3>

          {/* شروع Tab.Container */}
          <Tab.Container activeKey={activeTab} onSelect={handleTabSelect}>
            {/* می‌توانید اینجا Nav هم قرار دهید */}
            {/* 
               <Nav variant="tabs">
                 <Nav.Item>
                   <Nav.Link eventKey="reports">گزارش‌ها</Nav.Link>
                 </Nav.Item>
                 <Nav.Item>
                   <Nav.Link eventKey="otherTab">تب دیگر</Nav.Link>
                 </Nav.Item>
               </Nav>
            */}

            <Tab.Content>
              {/* Tab اصلی مدیریت گزارش */}
              <Tab.Pane eventKey="reports">
                <h4 className="mt-4">لیست گزارش‌ها</h4>
                <p>لیست گزارش‌های ارسال شده توسط کاربران:</p>

                <Table striped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th>ردیف</th>
                      <th>نوع گزارش</th>
                      <th>توضیحات</th>
                      <th>اقدام</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>کامنت</td>
                      <td>محتوای نامناسب</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => setShowCommentReportsModal(true)}
                        >
                          جزییات
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>کاربر</td>
                      <td>حساب مشکوک</td>
                      <td>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => setShowUserReportsModal(true)}
                        >
                          جزییات
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Tab.Pane>

              {/* اگر تب دیگری دارید */}
              <Tab.Pane eventKey="otherTab">
                <h4>محتوای تب دیگر</h4>
                <p>متن دلخواه اینجا قرار می‌گیرد...</p>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
          {/* پایان Tab.Container */}
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
