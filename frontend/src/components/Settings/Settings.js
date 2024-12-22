import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Container, Row, Col, Tab, Form, Button, Table, Modal 
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartBar, faUsers, faCommentDots, faCog, faSignOutAlt,
  faTrash, faEyeSlash, faUserSlash
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import BusinessManager from "../Dashboard/WebsiteManagement/BusinessManager";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [activePage, setActivePage] = useState("settings");

  // دسته‌بندی‌ها را از سرور می‌گیریم
  const [categories, setCategories] = useState([]);

  // فیلدهای دسته‌بندی جدید
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");

  // برای ویرایش
  const [editModalShow, setEditModalShow] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [editCategoryText, setEditCategoryText] = useState("");
  const [editCategoryIcon, setEditCategoryIcon] = useState("");

  // مودال گزارش کاربران و کامنت‌ها
  const [showUserReportsModal, setShowUserReportsModal] = useState(false);
  const [showCommentReportsModal, setShowCommentReportsModal] = useState(false);

  // متن کامل کامنت فرضی
  const fullCommentText = "Inception is, without a doubt, one of my favourite movies ...";
  let displayedCommentText = fullCommentText;
  let showMore = false;
  if (fullCommentText.length > 100) {
    displayedCommentText = fullCommentText.substring(0, 100);
    showMore = true;
  }

  const navigate = useNavigate();

  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/${page}`);
  };

  // ۱) گرفتن دسته‌بندی‌ها از سرور
  useEffect(() => {
    fetchCategories();
  }, []);

  // تابع کمکی برای دریافت توکن از localStorage (یا هر منبع دیگر)
  const getToken = () => {
    return localStorage.getItem("token"); // یا sessionStorage.getItem("token")
  };

  const fetchCategories = async () => {
    const token = getToken();
    try {
      const res = await axios.get(
        "http://localhost:8000/business_management/category/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCategories(res.data);
      console.log(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ۲) افزودن دسته‌بندی جدید (POST)
  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const token = getToken();
      try {
        const res = await axios.post(
          "http://localhost:8000/business_management/category/",
          {
            category_name: newCategory.trim(),
            //icon: newCategoryIcon.trim() ? newCategoryIcon.trim() : "-",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // شیء ایجادشده را به آرایه دسته‌بندی‌ها اضافه می‌کنیم
        const createdCategory = res.data;
        setCategories((prev) => [...prev, createdCategory]);

        // ریست فیلدهای ورودی
        setNewCategory("");
        setNewCategoryIcon("");
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  // -- تابع حذف دسته‌بندی (DELETE)
  const handleDeleteCategory = async (id) => {
    const token = getToken();
    try {
      await axios.delete(
        `http://localhost:8000/business_management/category/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // حذف آیتم از state (فیلتر)
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  // ویرایش (ابتدا مودال را باز می‌کنیم)
  const handleEditCategory = (index) => {
    const cat = categories[index];
    setEditCategoryIndex(index);
    setEditCategoryText(cat.category_name);
    setEditCategoryIcon(cat.icon || "");
    setEditModalShow(true);
  };

  // ذخیره تغییرات دسته‌بندی (PUT یا PATCH)
  const handleSaveEdit = async () => {
    if (editCategoryText.trim()) {
      const token = getToken();
      try {
        const catId = categories[editCategoryIndex].id;
        const updatedData = {
          category_name: editCategoryText.trim(),
          icon: editCategoryIcon.trim() || "-",
        };

        // اگر سرور PUT می‌خواهد:
        const res = await axios.put(
          `http://localhost:8000/business_management/category/${catId}/`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // یا اگر PATCH می‌خواهد (به جای PUT):
        // const res = await axios.patch(
        //   `http://localhost:8000/business_management/category/${catId}/`,
        //   updatedData,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );

        // بروزرسانی در لیست محلی
        const updatedCategories = [...categories];
        updatedCategories[editCategoryIndex] = res.data;
        setCategories(updatedCategories);

        // بستن مودال و ریست
        setEditModalShow(false);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row className="min-vh-100">
        
        {/* Sidebar (دلخواه) */}
        
        {/* محتوای اصلی */}
        <Col md={9} className="bg-light">
          <h2 className="text-center mb-4">صفحه تنظیمات</h2>

          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              {/* تب مدیریت صفحات */}
              <Tab.Pane eventKey="pages">
                <BusinessManager />
                <h4>مدیریت صفحات</h4>
                <Form>
                  <Form.Group controlId="contactUs" className="mb-3">
                    <Form.Label>صفحه تماس با ما</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="متن تماس با ما..."
                    />
                  </Form.Group>
                  <Button variant="primary">ذخیره تغییرات</Button>
                </Form>
              </Tab.Pane>

              {/* تب تنظیمات (جایی که دسته‌بندی‌ها را مدیریت می‌کنید) */}
              <Tab.Pane eventKey="settings">
                <h4>تعریف دسته‌بندی‌ها</h4>
                {/* فیلدهای افزودن */}
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
                </Form.Group>

                <Button variant="success" onClick={handleAddCategory}>
                  اضافه کردن
                </Button>

                {/* جدول نمایش دسته‌بندی‌ها */}
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
                      <tr key={cat.id || index}>
                        <td>{index + 1}</td>
                        <td>{cat.icon ? cat.icon : "-"}</td>
                        <td>{cat.category_name}</td>
                        <td className="d-flex justify-content-center gap-2">
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleEditCategory(index)}
                          >
                            ویرایش
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            حذف
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* مدیریت گزارش‌ها (مثال) */}
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
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>

      {/* مودال گزارش کاربر */}
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
                  {/* بن کردن یوزر با آیکون faUserSlash */} 
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
          <Button variant="secondary" onClick={() => setShowUserReportsModal(false)}>
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
                            {shortText}
                            <span 
                              style={{ cursor: 'pointer', textDecoration: 'underline' }} 
                              onClick={() => handlePageChange("review/4")}
                              onMouseOver={(e) => e.currentTarget.style.textDecoration = 'none'}
                              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'underline'}
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
                    {/* حذف کردن کامنت با آیکون faTrash */}
                    <Button variant="danger" size="sm" className="me-2" onClick={() => alert("کامنت حذف شد!")}>
                      <FontAwesomeIcon icon={faTrash} /> حذف کامنت
                    </Button>
                    {/* نادیده گرفتن کامنت با آیکون faEyeSlash */}
                    <Button variant="secondary" size="sm" className="me-2" onClick={() => alert("این گزارش نادیده گرفته شد.")}>
                      <FontAwesomeIcon icon={faEyeSlash} /> نادیده گرفتن
                    </Button>
                    {/* بن کردن یوزر با آیکون faUserSlash */}
                    <Button variant="warning" size="sm" className="me-2" onClick={() => alert("کاربر بن شد!")}>
                      <FontAwesomeIcon icon={faUserSlash} /> بن کردن یوزر
                    </Button>
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
