import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const ReviewForm = () => {
  const navigate = useNavigate();

  // state داده‌های فرم
  const [formData, setFormData] = useState({
    business_name: '',
    business_category: '', // مقدار آیدی دسته‌بندی را در این فیلد نگه می‌داریم
    description: '',
    website_url: '',
    business_owner: ''
  });

  // state مربوط به لیست دسته‌بندی‌ها
  const [categories, setCategories] = useState([]);

  const [errors, setErrors] = useState({});

  // اگر مالک کسب‌وکار (ID کاربر) در localStorage است:
  const ownerId = localStorage.getItem('userId') || ''; 

  // بعد از بارگذاری کامپوننت:
  useEffect(() => {
    // ست کردن ownerId در فرم (اگر موجود باشد)
    if (ownerId) {
      setFormData((prev) => ({ ...prev, business_owner: ownerId }));
    } else {
      // اگر نیاز دارید کاربر را به لاگین هدایت کنید:
      // navigate("/login");
    }

    // گرفتن لیست دسته‌بندی‌ها از سرور
    fetchCategories();
  }, [ownerId]); // یا بسته به شرایط [ ]

  // تابع گرفتن لیست دسته‌بندی‌ها از سرور
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        // اگر توکن ندارید
        alert("ابتدا لاگین کنید.");
        navigate("/login");
        return;
      }

      const response = await axios.get(
        'http://127.0.0.1:8000/business_management/category/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // فرض بر این است که سرور آرایه‌ای از آبجکت‌ها برمی‌گرداند
      // [{ id: 1, category_name: "غذایی" }, { id: 2, category_name: "ورزشی" }, ...]
      setCategories(response.data);
      console.log(response.data)
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // مدیریت تغییر مقدار فیلدهای فرم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); 
  };

  // اعتبارسنجی ساده فرم
  const validateForm = () => {
    const newErrors = {};
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'لطفاً نام شرکت را وارد کنید.';
    }
    // بررسی انتخاب دسته‌بندی
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
    return newErrors;
  };

  // سابمیت فرم
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
        // درخواست POST به سرور
        const response = await axios.post(
          'http://127.0.0.1:8000/business_management/businesses/',
          {
            business_name: formData.business_name,
            business_category: formData.business_category, // آیدی دسته‌بندی انتخاب‌شده
            description: formData.description,
            website_url: formData.website_url,
            business_owner: formData.business_owner
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 201) {
          alert('کسب‌وکار با موفقیت ثبت شد!');
          navigate("/AdminDashboard");
          // ریست فرم
          setFormData({
            business_name: '',
            business_category: '',
            description: '',
            website_url: '',
            business_owner: ownerId
          });
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
              objectFit: 'cover'
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

            {/* انتخاب دسته‌بندی به صورت کشویی */}
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

            {/* فیلد مخفی برای مالک کسب‌وکار */}
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
