import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const ReviewForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    category: '',
    review: '',
    rating: 0,
  });
  const [errors, setErrors] = useState({});

  const categories = [
    'خدمات مسافرتی',
    'خدمات منزل',
    'آموزشی',
    'لوازم منزل',
    'ورزش',
    'غذا',
    'رستوران و کافه',
    'خدمات عمومی',
    'مالی',
    'رسانه و اخبار',
    'خدمات حقوقی',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // پاک کردن خطا در هنگام وارد کردن مقدار
  };

  const handleStarClick = (rating) => {
    setFormData({ ...formData, rating });
    setErrors({ ...errors, rating: '' }); // پاک کردن خطا در هنگام انتخاب ستاره
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = 'لطفاً نام شرکت را وارد کنید.';
    if (!formData.category) newErrors.category = 'لطفاً دسته‌بندی را انتخاب کنید.';
    if (!formData.review.trim()) newErrors.review = 'لطفاً نظر خود را وارد کنید.';
    if (formData.rating === 0) newErrors.rating = 'لطفاً تعداد ستاره‌ها را انتخاب کنید.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      console.log('Form submitted:', formData);
      alert('نظر شما با موفقیت ثبت شد!');
      setFormData({ companyName: '', category: '', review: '', rating: 0 });
    }
  };

  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-md-5 d-flex align-items-center justify-content-center">
          <img
            src="https://img.freepik.com/free-photo/3d-rendering-pen-ai-generated_23-2150695409.jpg?t=st=1732267774~exp=1732271374~hmac=46fe48c446b61a4ed5d02ab32693475926fea40da232eb36e0f683fb4760df98&w=740"
            alt="Review Form"
            className="img-fluid rounded"
            style={{ width: '100%', height: 'auto', maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-7">
          <form onSubmit={handleSubmit} className="p-3 border rounded" style={{ direction: 'rtl' }}>
            <div className="mb-3">
              <label htmlFor="companyName" className="form-label">
                نام شرکت پیشنهادی
              </label>
              <input
                type="text"
                className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
              {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">
                دسته‌بندی شرکت
              </label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">انتخاب کنید</option>
                {categories.map((category, index) => (
                  <option key={index} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="review" className="form-label">
                نظر پیشنهادی
              </label>
              <textarea
                className={`form-control ${errors.review ? 'is-invalid' : ''}`}
                id="review"
                name="review"
                rows="4"
                value={formData.review}
                onChange={handleChange}
              ></textarea>
              {errors.review && <div className="invalid-feedback">{errors.review}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label">تعداد ستاره پیشنهادی</label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => handleStarClick(star)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '1.5rem',
                      color: star <= formData.rating ? 'gold' : 'gray',
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              {errors.rating && <div className="text-danger mt-2">{errors.rating}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              ثبت نظر
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
