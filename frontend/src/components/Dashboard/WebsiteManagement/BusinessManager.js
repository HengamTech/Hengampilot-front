import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faTrash,
  faPlus,
  faUsers,
  faCog,
  faSignOutAlt,
  faChartBar,
  faCommentDots,
  faLevelUpAlt, // از FontAwesome
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BusinessManager = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState({});
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const [currentBusiness, setCurrentBusiness] = useState({
    id: null,
    business_name: '',
    description: '',
    website_url: '',
    category_id: '',
  });

  const token = localStorage.getItem('token');

  // -------------------------------
  // تابع دریافت لیست بیزنس‌ها
  // -------------------------------
  const fetchBusinesses = async () => {
    try {
      const response = await axios.get(
        'http://localhost:8000/business_management/businesses/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedBusinesses = response.data || [];
      setBusinesses(fetchedBusinesses);

      // گرفتن دسته‌بندی‌ها
      const categoryIds = [
        ...new Set(fetchedBusinesses.map((b) => b.business_category)),
      ].filter(Boolean);

      if (categoryIds.length > 0) {
        const categoryPromises = categoryIds.map((catId) =>
          axios
            .get(`http://localhost:8000/business_management/category/${catId}/`, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => ({
              catId,
              catName: res.data.category_name,
            }))
            .catch(() => ({ catId, catName: 'دسته‌بندی نامشخص' }))
        );

        const categoriesData = await Promise.all(categoryPromises);
        const catMap = {};
        categoriesData.forEach((c) => {
          catMap[c.catId] = c.catName;
        });
        setCategories(catMap);
      }
    } catch (error) {
      console.error('خطا در دریافت بیزنس‌ها:', error);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [token]);

  // -------------------------------
  // مدیریت باز و بسته شدن مودال
  // -------------------------------
  const handleClose = () => {
    setShowModal(false);
    setCurrentBusiness({
      id: null,
      business_name: '',
      description: '',
      website_url: '',
      category_id: '',
    });
  };

  const handleShow = (biz) => {
    setCurrentBusiness(biz);
    setShowModal(true);
  };

  // -------------------------------
  // هندل تغییرات فیلدهای فرم مودال
  // -------------------------------
  const handleChange = (e) => {
    setCurrentBusiness({ ...currentBusiness, [e.target.name]: e.target.value });
  };

  // -------------------------------
  // ثبت فرم (ویرایش بیزنس)
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentBusiness.id) {
        // ارسال درخواست به API برای به‌روزرسانی
        await axios.put(
          `http://localhost:8000/business_management/businesses/${currentBusiness.id}/`,
          currentBusiness,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // بازخوانی لیست بیزنس‌ها
        await fetchBusinesses();
      }
      handleClose();
    } catch (error) {
      console.error('خطا در ویرایش بیزنس:', error);
    }
  };

  // -------------------------------
  // حذف بیزنس
  // -------------------------------
  const handleDelete = async (id) => {
    if (window.confirm('آیا از حذف این بیزنس اطمینان دارید؟')) {
      try {
        await axios.delete(
          `http://localhost:8000/business_management/businesses/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // بازخوانی لیست بیزنس‌ها
        await fetchBusinesses();
      } catch (error) {
        console.error('خطا در حذف بیزنس:', error);
      }
    }
  };
  const userId = localStorage.getItem('userId');
  const handlegotobuisness = () =>{
    navigate(`/submit/${userId}`);
  }
  // -------------------------------
  // رندر
  // -------------------------------
  return (
    <div className="container col-md-12 mt-3">
      <h2 className="mb-4">مدیریت بیزنس‌ها</h2>
      {/* <button type="button" class="btn btn-secondary mb-4"
                        onClick={() => handlegotobuisness()}

      >افزودن بیزنس</button>     */}
        {businesses.length > 0 ? (
        <Table striped bordered hover className="text-center">
          <colgroup>
      <col style={{ width: "40px" }} />    {/* ردیف */}
      <col style={{ width: "60px" }} />   {/* نام */}
      <col style={{ width: "10px" }} />   {/* نام خانوادگی */}
      <col style={{ width: "120px" }} />   {/* یوزرنیم */}
      <col style={{ width: "100px" }} />   {/* ایمیل */}
      <col style={{ width: "100px" }} />   {/* نقش */}
    </colgroup>

          <thead>
            <tr>
              <th>ردیف</th>
              <th>دسته‌بندی</th>
              <th>نام بیزنس</th>
              <th>توضیحات</th>
              <th>آدرس وب‌سایت</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz, index) => (
              <tr key={biz.id}>
                <td>{index + 1}</td>
                <td>
                  {categories[biz.business_category] || 'دسته‌بندی نامشخص'}
                </td>
                <td>{biz.business_name}</td>
                <td>                <div style={{
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    maxHeight: '4.5em',
    overflow: 'auto'
  }}>{biz.description}</div>          </td>
                <td>{biz.website_url}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShow(biz)}
                  >
                                  <FontAwesomeIcon icon={faUserEdit} />
                    
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(biz.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>هیچ بیزنسی ثبت نشده است.</p>
      )}

      {/* مودال ویرایش */}
      <Modal dir="rtl" show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ویرایش بیزنس</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formBusinessName" className="mb-3">
              <Form.Label>نام بیزنس</Form.Label>
              <Form.Control
                type="text"
                placeholder="نام بیزنس را وارد کنید"
                name="business_name"
                value={currentBusiness.business_name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBusinessDescription" className="mb-3">
              <Form.Label>توضیحات</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="توضیحات بیزنس را وارد کنید"
                name="description"
                value={currentBusiness.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBusinessWebsite" className="mb-3">
              <Form.Label>آدرس وب‌سایت</Form.Label>
              <Form.Control
                type="text"
                placeholder="آدرس وب‌سایت را وارد کنید"
                name="website_url"
                value={currentBusiness.website_url}
                onChange={handleChange}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              بستن
            </Button>
            <Button variant="primary" type="submit">
              ذخیره تغییرات
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessManager;
