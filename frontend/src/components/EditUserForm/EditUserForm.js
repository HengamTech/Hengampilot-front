// EditUserForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditUserForm = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
const [previewImage, setPreviewImage] = useState(null); // پیش‌نمایش تصویر
    
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    user_image_url: "", // پیش‌نمایش تصویر موجود (اگر وجود دارد)
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("توکن احراز هویت یافت نشد. لطفاً وارد شوید.");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/user_management/users/${userId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("User data fetched:", response.data);

        setFormData({
          first_name:response.data.first_name || "",
          last_name:response.data.last_name || "",
          email: response.data.email || "",
          username: response.data.username || "",
          password: "", // پسورد خالی برای امنیت
          user_image_url: response.data.user_image || "",
        
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(
          err.response
            ? `خطا: ${err.response.status} - ${err.response.data.detail || "خطای ناشناخته"}`
            : "خطا در دریافت اطلاعات کاربر"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("File selected:", file); // کنسول لاگ برای نمایش فایل انتخاب‌شده
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // نمایش پیش‌نمایش
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("توکن احراز هویت یافت نشد. لطفاً وارد شوید.");
      navigate("/login");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("first_name",formData.first_name);
      formDataToSend.append("last_name",formData.last_name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
        formDataToSend.append("is_active", true);
      if (selectedFile) {
        formDataToSend.append("user_image", selectedFile);
      }

      console.log("FormData to send:", [...formDataToSend.entries()]); // نمایش کل داده‌های FormData

      const response = await axios.put(
        `http://127.0.0.1:8000/user_management/users/${userId}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from server:", response.data);

      if (response.status === 200) {
        alert("اطلاعات با موفقیت به‌روزرسانی شد.");
        navigate("/dashboard");
      } else {
        alert("خطا در به‌روزرسانی اطلاعات.");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err.response
          ? `خطا: ${err.response.status} - ${JSON.stringify(err.response.data)}`
          : "خطا در به‌روزرسانی اطلاعات"
      );
    }
  };

  if (loading) return <p>در حال بارگذاری...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  localStorage.setItem('username',formData.username);
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">ویرایش اطلاعات کاربر</h2>

      <div className="row">
        <div className="col-md-6">
          <img
            src="https://img.freepik.com/free-photo/resumes-desk_144627-43369.jpg"
            alt="ویرایش کاربر"
            className="img-fluid"
          />
        </div>


        <div className="col-md-6" dir="rtl">
          <form onSubmit={handleSubmit}>
          <div className="mb-3">
              <label htmlFor="first_name" className="form-label">
                نام
              </label>
              <input
                type="first_name"
                className="form-control"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="last_name" className="form-label">
                نام خانوادگی
              </label>
              <input
                type="last_name"
                className="form-control"
                id="last_name"
                name="last_name"
                value={formData.last_name}
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
                نام کاربری
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
              <label htmlFor="user_image" className="form-label">
                تصویر کاربر (آپلود فایل)
              </label>
              <input
                type="file"
                className="form-control"
                id="user_image"
                name="user_image"
                accept="image/*"
                onChange={handleFileChange}
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
