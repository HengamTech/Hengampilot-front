import React, { useState } from "react";
import { Container, Row, Col, Tab, Form, Button, Table, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar, faUsers, faCommentDots, faCog, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [activePage, setActivePage] = useState("settings");

  // دسته‌بندی‌های اولیه
  const [categories, setCategories] = useState([
    { icon: "🍴", text: "غذا، رستوران، کافه" },
    { icon: "⚽", text: "ورزش" },
    { icon: "📺", text: "لوازم منزل" },
    { icon: "🎓", text: "آموزشی" },
    { icon: "🏠", text: "خدمات منزل", link: "/Home" },
    { icon: "⚖️", text: "خدمات حقوقی" },
    { icon: "📰", text: "رسانه و اخبار" },
    { icon: "💰", text: "خدمات مالی" },
    { icon: "🚶", text: "خدمات عمومی" },
    { icon: "✈️", text: "خدمات مسافرتی" },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");

  const [editModalShow, setEditModalShow] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [editCategoryText, setEditCategoryText] = useState("");
  const [editCategoryIcon, setEditCategoryIcon] = useState("");

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const newCat = {
        text: newCategory.trim(),
        icon: newCategoryIcon.trim() ? newCategoryIcon.trim() : "-"
      };
      setCategories([...categories, newCat]);
      setNewCategory("");
      setNewCategoryIcon("");
    }
  };

  const handleEditCategory = (index) => {
    const cat = categories[index];
    setEditCategoryIndex(index);
    setEditCategoryText(cat.text);
    setEditCategoryIcon(cat.icon || "");
    setEditModalShow(true);
  };

  const handleSaveEdit = () => {
    if (editCategoryText.trim()) {
      const updatedCategories = [...categories];
      updatedCategories[editCategoryIndex] = {
        ...updatedCategories[editCategoryIndex],
        text: editCategoryText.trim(),
        icon: editCategoryIcon.trim() ? editCategoryIcon.trim() : "-"
      };
      setCategories(updatedCategories);
      setEditModalShow(false);
    }
  };

  const navigate = useNavigate();
  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  const [showUserReportsModal, setShowUserReportsModal] = useState(false);
  const [showCommentReportsModal, setShowCommentReportsModal] = useState(false);

  // متن کامل کامنت
  const fullCommentText = "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me.";

  let displayedCommentText = fullCommentText;
  let reviewId = 4;
  if (fullCommentText.length > 100) {
    displayedCommentText = fullCommentText.substring(0, 100);
  }

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row className="min-vh-100">
        {/* Sidebar */}
        <Col md={3} className="bg-dark text-white p-3">
          <div className="text-center mb-4">
            <h4>مدیر سیستم</h4>
            <p>نقش: مدیر</p>
          </div>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                  onClick={() => handlePageChange("AdminDashboard")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  داشبورد
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                  onClick={() => handlePageChange("usermanagement")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  مدیریت کاربران
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                  onClick={() => handlePageChange("Reviewmanagement")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  مدیریت نظرات
                </a>
              </li>
             {/* <li className="nav-item mb-3">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                  onClick={() => setActiveTab("pages")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  مدیریت سایت
                </a>
              </li>
             */}
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activeTab === "settings" ? "bg-primary" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <FontAwesomeIcon icon={faCog} />
                  تنظیمات 
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  خروج
                </a>
              </li>
            </ul>
          </nav>
        </Col>

        {/* Main Content */}
        <Col md={9} className="bg-light p-4">
          <h2 className="text-center mb-4">صفحه تنظیمات</h2>
          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              {/* مدیریت صفحات */}
              <Tab.Pane eventKey="pages">
                <h4>مدیریت صفحات</h4>
                <Form>
                  <Form.Group controlId="contactUs" className="mb-3">
                    <Form.Label>صفحه تماس با ما</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="متن تماس با ما را وارد کنید..." />
                  </Form.Group>
                  <Button variant="primary">ذخیره تغییرات</Button>
                </Form>
              </Tab.Pane>

              {/* تب تنظیمات */}
              <Tab.Pane eventKey="settings">
                <h4>تعریف دسته‌بندی‌ها</h4>

                <Form.Group className="mb-3">
                  <Form.Label>نام دسته‌بندی جدید</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثلاً غذای دریایی"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>آیکون دسته‌بندی (اختیاری)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثلاً 🚗"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                  />
                  <Form.Text className="text-muted">
                    می‌توانید ایموجی یا کاراکتر خاص به عنوان آیکون وارد کنید.
                  </Form.Text>
                </Form.Group>

                <Button variant="success" onClick={handleAddCategory}>
                  اضافه کردن
                </Button>

                <Table striped bordered hover className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th>ردیف</th>
                      <th>آیکون</th>
                      <th>نام دسته‌بندی</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{cat.icon ? cat.icon : "-"}</td>
                        <td>{cat.text}</td>
                        <td>
                          <Button variant="info" size="sm" onClick={() => handleEditCategory(index)}>
                            ویرایش
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                <h4 className="mt-4">مدیریت گزارش‌ها</h4>
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
                        <Button variant="info" size="sm" onClick={() => setShowCommentReportsModal(true)}>جزییات</Button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>کاربر</td>
                      <td>حساب مشکوک</td>
                      <td>
                        <Button variant="info" size="sm" onClick={() => setShowUserReportsModal(true)}>جزییات</Button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>

      {/* مودال جزییات گزارش‌های کاربران */}
      <Modal show={showUserReportsModal} dir="rtl" onHide={() => setShowUserReportsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>گزارش‌های کاربران</Modal.Title>
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
                <td><Button variant="warning" size="sm">بلاک</Button></td>
              </tr>
              <tr>
                <td>2</td>
                <td>کاربرB</td>
                <td>نام کاربری نامناسب</td>
                <td>2024-05-02</td>
                <td><Button variant="warning" size="sm">بلاک</Button></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserReportsModal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال جزییات گزارش‌های کامنت‌ها */}
      <Modal show={showCommentReportsModal} dir="rtl" onHide={() => setShowCommentReportsModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>گزارش‌های کامنت‌ها</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <Table striped bordered hover className="w-auto mx-auto text-center">
              <tbody>
                <tr>
                  <td>متن کامنت</td>
                  <td>
                    {(()=>{
                      const fullText = "Inception is, without a doubt, one of my favourite movies of all time. Directed by Christopher Nolan, this film delivers a unique blend of mind-bending storytelling, impeccable performances, and stunning visuals that have left a lasting impression on me.";
                      if (fullText.length > 100) {
                        const shortText = fullText.substring(0,100);
                        return (
                          <span>
                            {shortText}
                            <span 
                              style={{cursor:'pointer',padding:'5px',backgroundColor:'yellow'}} 
                              onClick={() => handlePageChange("review/4")}
                              onMouseOver={(e) => e.currentTarget.style.textDecoration='none'}
                              onMouseOut={(e) => e.currentTarget.style.textDecoration='underline'}
                            >
                              بیشتر
                            </span>
                          </span>
                        );
                      } else {
                        return fullText;
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
                <Button variant="danger" size="sm">حذف</Button>
                <Button disabled>Disabled</Button>

                <Button variant="danger" size="sm">نادیده گرفتن</Button>  
                <Button variant="danger" size="sm">بن کردن یوزر</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCommentReportsModal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>

      {/* مودال ویرایش دسته‌بندی */}
      <Modal show={editModalShow} onHide={() => setEditModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ویرایش دسته‌بندی</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>نام دسته‌بندی</Form.Label>
            <Form.Control
              type="text"
              value={editCategoryText}
              onChange={(e) => setEditCategoryText(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>آیکون دسته‌بندی (اختیاری)</Form.Label>
            <Form.Control
              type="text"
              placeholder="مثلاً 🚗"
              value={editCategoryIcon}
              onChange={(e) => setEditCategoryIcon(e.target.value)}
            />
            <Form.Text className="text-muted">
              می‌توانید یک ایموجی یا کاراکتر خاص به عنوان آیکون وارد کنید.
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditModalShow(false)}>
            لغو
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            ذخیره تغییرات
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
