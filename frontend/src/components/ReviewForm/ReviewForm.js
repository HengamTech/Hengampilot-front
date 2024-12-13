import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ReviewForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    business_name: '',
    //business_category: '',
    description: '',
    website_url: '',
    business_owner: ''
  });
  const [errors, setErrors] = useState({});

  // فرض می‌کنیم business_owner را از localStorage یا Token استخراج می‌کنیم
  const ownerId = localStorage.getItem('userId') || ''; 

  React.useEffect(() => {
    if (ownerId) {
      setFormData((prev) => ({ ...prev, business_owner: ownerId }));
    } else {
      // اگر ownerId وجود ندارد، کاربر را به صفحه لاگین هدایت کنید یا خطا نشان دهید.
      // navigate("/login");
    }
  }, [ownerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.business_name.trim()) newErrors.business_name = 'لطفاً نام شرکت را وارد کنید.';
    //if (!formData.business_category.trim()) newErrors.business_category = 'لطفاً دسته‌بندی را وارد کنید.';
    if (!formData.description.trim()) newErrors.description = 'لطفاً توضیحات را وارد کنید.';
    if (!formData.website_url.trim()) newErrors.website_url = 'لطفاً آدرس وب‌سایت را وارد کنید.';
    if (!formData.business_owner.trim()) newErrors.business_owner = 'مالک کسب‌وکار مشخص نیست.';
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
        const response = await axios.post(
          'http://127.0.0.1:8000/business_management/businesses/',
          {
            business_name: formData.business_name,
            //business_category: formData.business_category,
            description: formData.description,
            website_url: formData.website_url,
            business_owner: formData.business_owner
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (response.status === 201) {
          alert('کسب‌وکار با موفقیت ثبت شد!');
          setFormData({
            business_name: '',
            //business_category: '',
            description: '',
            website_url: '',
            business_owner: ownerId
          });
        } else {
          alert('خطا در ثبت کسب‌وکار!');
        }
      } catch (error) {
        console.error('Error submitting business:', error);
        alert('خطا در ارسال نظر. لطفا دوباره تلاش کنید.');
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
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-7">
          <form onSubmit={handleSubmit} className="p-3 border rounded" style={{ direction: 'rtl' }}>
            <div className="mb-3">
              <label htmlFor="business_name" className="form-label">نام شرکت</label>
              <input
                type="text"
                className={`form-control ${errors.business_name ? 'is-invalid' : ''}`}
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
              />
              {errors.business_name && <div className="invalid-feedback">{errors.business_name}</div>}
            </div>

           {/* <div className="mb-3">
              <label htmlFor="business_category" className="form-label">دسته‌بندی شرکت</label>
              <input
                type="text"
                className={`form-control ${errors.business_category ? 'is-invalid' : ''}`}
                id="business_category"
                name="business_category"
                value={formData.business_category}
                onChange={handleChange}
              />
              {errors.business_category && <div className="invalid-feedback">{errors.business_category}</div>}
            </div>
           */}
            <div className="mb-3">
              <label htmlFor="description" className="form-label">توضیحات</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="website_url" className="form-label">آدرس وب‌سایت</label>
              <input
                type="text"
                className={`form-control ${errors.website_url ? 'is-invalid' : ''}`}
                id="website_url"
                name="website_url"
                value={formData.website_url}
                onChange={handleChange}
              />
              {errors.website_url && <div className="invalid-feedback">{errors.website_url}</div>}
            </div>

            {/* فیلد مالک کسب‌وکار (business_owner) مخفی */}
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
