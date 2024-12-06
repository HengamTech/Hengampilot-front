import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// داده‌های فرضی کاربران
const users = [
  { id: 1, name: "علی", lastName: "رضایی", email: "ali@example.com", username: "ali123", password: "12345" },
  { id: 2, name: "زهرا", lastName: "کریمی", email: "zahra@example.com", username: "zahra123", password: "54321" },
];

const EditUserForm = () => {
  // دریافت userId از URL
  const { userId } = useParams();

  // state برای ذخیره داده‌های فرم
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const navigate = useNavigate();

  // بارگذاری داده‌های کاربر از آرایه (یا API) بر اساس userId
  useEffect(() => {
    const selectedUser = users.find((user) => user.id === parseInt(userId));
    if (selectedUser) {
      setFormData({
        name: selectedUser.name,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        username: selectedUser.username,
        password: selectedUser.password,
      });
    } else {
      // در صورتی که کاربر با این id وجود نداشته باشد
      alert("کاربر پیدا نشد");
    }
  }, [userId]);

  // تابع برای بروزرسانی state فرم
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // تابع برای ارسال فرم
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('ویرایش اطلاعات کاربر:', formData);

    // پس از ارسال تغییرات، به صفحه مدیریت کاربران برمی‌گردیم
    navigate('/UserManagement');
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">ویرایش اطلاعات کاربر</h2>

      <div className="row">
        {/* بخش تصویر */}
        <div className="col-md-6">
          <img
            src="https://img.freepik.com/free-photo/resumes-desk_144627-43369.jpg?t=st=1733147090~exp=1733150690~hmac=b3b88c0fd3a6aa52229ed5241af94594d60145c758059e55c17fb775e3eadc6f&w=996"
            alt="ویرایش کاربر"
            className="img-fluid"
          />
        </div>

        {/* بخش فرم */}
        <div className="col-md-6" dir="rtl">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                نام
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">
                نام خانوادگی
              </label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                ایمیل
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                یوزرنیم
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                پسورد
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              ذخیره تغییرات
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserForm;
