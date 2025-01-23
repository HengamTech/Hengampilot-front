import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../config';

const ReviewForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: '',
    business_category: '',
    description: '',
    website_url: '',
    business_owner: '',
    business_image: null, // فایل عکس
  });

  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null); // پیش‌نمایش تصویر

  const ownerId = localStorage.getItem('userId') || '';

  useEffect(() => {
    if (ownerId) {
      setFormData((prev) => ({ ...prev, business_owner: ownerId }));
    }
    fetchCategories();
  }, [ownerId]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("ابتدا لاگین کنید.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API_BASE_URL}/business_management/category/`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, business_image: file });
      setPreviewImage(URL.createObjectURL(file)); // ایجاد پیش‌نمایش
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'لطفاً نام شرکت را وارد کنید.';
    }
    if (!formData.business_category) {
      newErrors.business_category = 'لطفاً یک دسته‌بندی را انتخاب کنید.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'لطفاً توضیحات را وارد کنید.';
    }
    if (!formData.website_url.trim()) {
      newErrors.website_url = 'لطفاً آدرس وب‌سایت را وارد کنید.';
    }
    if (!formData.business_owner.trim()) {
      newErrors.business_owner = 'مالک کسب‌وکار مشخص نیست.';
    }
    if (!formData.business_image) {
      newErrors.business_image = 'لطفاً یک عکس برای شرکت آپلود کنید.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('توکن وجود ندارد. لطفاً وارد شوید.');
        navigate('/login');
        return;
      }

      try {
        const formDataToSend = new FormData();
        formDataToSend.append('business_name', formData.business_name);
        formDataToSend.append('business_category', formData.business_category);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('website_url', formData.website_url);
        formDataToSend.append('business_owner', formData.business_owner);
        if (formData.business_image) {
          formDataToSend.append('business_image', formData.business_image);
        }

        const response = await axios.post(
          `${API_BASE_URL}/business_management/businesses/`,
          formDataToSend,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.status === 201) {
          alert('کسب‌وکار با موفقیت ثبت شد!');
          navigate("/AdminDashboard");
          setFormData({
            business_name: '',
            business_category: '',
            description: '',
            website_url: '',
            business_owner: ownerId,
            business_image: null,
          });
          setPreviewImage(null);
        } else {
          alert('خطا در ثبت کسب‌وکار!');
        }
      } catch (error) {
        console.error('Error submitting business:', error);
        alert('خطا در ارسال اطلاعات. لطفا دوباره تلاش کنید.');
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-5 d-flex align-items-center justify-content-center">
            <img
              src="https://img.freepik.com/free-photo/3d-rendering-pen-ai-generated_23-2150695409.jpg"
              alt="Business Form"
              className="img-fluid rounded"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '500px',
                objectFit: 'cover',
              }}
            />
          
        </div>
        <div className="col-md-7">
          <form
            onSubmit={handleSubmit}
            className="p-3 border rounded"
            style={{ direction: 'rtl' }}
          >
            <div className="mb-3">
              <label htmlFor="business_name" className="form-label">
                نام شرکت
              </label>
              <input
                type="text"
                className={`form-control ${errors.business_name ? 'is-invalid' : ''}`}
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
              />
              {errors.business_name && (
                <div className="invalid-feedback">{errors.business_name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="business_category" className="form-label">
                دسته‌بندی شرکت
              </label>
              <select
                className={`form-select ${errors.business_category ? 'is-invalid' : ''}`}
                id="business_category"
                name="business_category"
                value={formData.business_category}
                onChange={handleChange}
              >
                <option value="">لطفاً انتخاب کنید</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
              {errors.business_category && (
                <div className="invalid-feedback">
                  {errors.business_category}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                توضیحات
              </label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="website_url" className="form-label">
                آدرس وب‌سایت
              </label>
              <input
                type="text"
                className={`form-control ${errors.website_url ? 'is-invalid' : ''}`}
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
              />
              {errors.website_url && (
                <div className="invalid-feedback">{errors.website_url}</div>
              )}
            </div>
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
            <div className="mb-3">
              <label htmlFor="business_image" className="form-label">
                آپلود عکس
              </label>
              <input
                type="file"
                className={`form-control ${errors.business_image ? 'is-invalid' : ''}`}
                id="business_image"
                name="business_image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {errors.business_image && (
                <div className="invalid-feedback">{errors.business_image}</div>
              )}
            </div>

            <input
              type="hidden"
              name="business_owner"
              value={formData.business_owner}
              onChange={handleChange}
            />

            <button type="submit" className="btn btn-primary w-100">
              ثبت کسب‌وکار
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
