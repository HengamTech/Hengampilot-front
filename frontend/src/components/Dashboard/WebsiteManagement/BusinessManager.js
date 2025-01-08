import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const BusinessManager = () => {
  const [businesses, setBusinesses] = useState([]);
  const [categories, setCategories] = useState({});
  const [showModal, setShowModal] = useState(false);            // مودال ویرایش
  const [showDescriptionModal, setShowDescriptionModal] = useState(false); // مودال نمایش توضیحات
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const id = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  // شیء بیزنسی که در حال ویرایش یا نمایش توضیحات است
  const [currentBusiness, setCurrentBusiness] = useState({
    business_owner: id,
    business_name: '',
    description: '',
    website_url: '',
    category_id: '',
    business_image: '',
  });

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

      // استخراج دسته‌بندی‌ها
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

  // -------------------------------
  // Hook بارگذاری اولیه کامپوننت
  // -------------------------------
  useEffect(() => {
    fetchBusinesses();
  }, [token]);

  // -------------------------------
  // بستن مودال و ریست کردن state
  // -------------------------------
  const handleClose = () => {
    setShowModal(false);
    setCurrentBusiness({
      business_owner: id,
      business_name: '',
      description: '',
      website_url: '',
      category_id: '',
      business_image: '',
    });
    setPreviewImage(null);
    setSelectedFile(null);
  };

  // بستن مودال توضیحات
  const handleCloseDescription = () => {
    setShowDescriptionModal(false);
    // در صورت نیاز اگر می‌خواهید بعد از بستن مودال، currentBusiness خالی شود:
    // setCurrentBusiness({});
  };

  // -------------------------------
  // نمایش مودال ویرایش برای بیزنس خاص
  // -------------------------------
  const handleShow = (biz) => {
    setCurrentBusiness(biz);
    setPreviewImage(biz.business_image || null);
    setShowModal(true);
  };

  // -------------------------------
  // نمایش مودال توضیحات
  // -------------------------------
  const handleDescriptionClick = (biz) => {
    setCurrentBusiness(biz);
    setShowDescriptionModal(true);
  };

  // -------------------------------
  // تغییر مقادیر ورودی فرم
  // -------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentBusiness({ ...currentBusiness, [name]: value });
  };

  // -------------------------------
  // انتخاب عکس و پیش‌نمایش
  // -------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // -------------------------------
  // ثبت فرم ویرایش
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('business_owner', id);
      formData.append('business_name', currentBusiness.business_name);
      formData.append('description', currentBusiness.description);
      formData.append('website_url', currentBusiness.website_url);
      formData.append('category_id', currentBusiness.category_id);

      if (selectedFile) {
        formData.append('business_image', selectedFile);
      }

      if (currentBusiness.id) {
        await axios.put(
          `http://localhost:8000/business_management/businesses/${currentBusiness.id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          }
        );
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
        await fetchBusinesses();
      } catch (error) {
        console.error('خطا در حذف بیزنس:', error);
      }
    }
  };

  // دکمه افزودن بیزنس (انتقال به صفحه ثبت بیزنس جدید)
  const userId = localStorage.getItem('userId');
  const handlegotobuisness = () => {
    navigate(`/submit/${userId}`);
  };

  // -------------------------------
  // رندر
  // -------------------------------
  return (
    <div className="container col-md-12 mt-3">
      <h2 className="mb-4">مدیریت بیزنس‌ها</h2>

      <button
        type="button"
        className="btn btn-secondary mb-4"
        onClick={handlegotobuisness}
      >
        افزودن بیزنس
      </button>

      {businesses.length > 0 ? (
        <Table striped bordered hover className="text-center">
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
                <td>{categories[biz.business_category] || 'دسته‌بندی نامشخص'}</td>
                <td>{biz.business_name}</td>

                {/* توضیحات را به شکل کلیک‌پذیر (جزئیات) در یک سلول نمایش می‌دهیم */}
                <td
                  onClick={() => handleDescriptionClick(biz)}
                  style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
                >
                  مشاهده توضیحات
                </td>

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

      {/* مودال ویرایش بیزنس */}
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

            <Form.Group controlId="formBusinessImage" className="mb-3">
              <Form.Label>عکس بیزنس</Form.Label>
              {previewImage && (
                <div className="mb-2">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="img-fluid rounded"
                    style={{ maxWidth: '100px', height: 'auto' }}
                  />
                </div>
              )}
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
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

      {/* مودال نمایش توضیحات بیزنس */}
      <Modal
        dir="rtl"
        show={showDescriptionModal}
        onHide={handleCloseDescription}
      >
        <Modal.Header closeButton>
          <Modal.Title style={{marginLeft:"65%"}}>توضیحات بیزنس</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div
            style={{
              maxHeight: "200px",
              overflow: "auto",
              textAlign: "justify",
              lineHeight: "1.8",
              padding: "10px",
              border: "2px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              direction: "rtl",
              fontSize: "14px",
              color: "#333",
              wordBreak: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            <p>{currentBusiness.description}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDescription}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BusinessManager;
