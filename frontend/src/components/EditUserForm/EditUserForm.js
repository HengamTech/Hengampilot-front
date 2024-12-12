// EditUserForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditUserForm = () => {
    // دریافت userId از URL
    const { userId } = useParams();
    
    // state برای ذخیره داده‌های فرم
    const [formData, setFormData] = useState({
        //name: '',
        //lastName: '',
        email: '',
        username: '',
        password: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("توکن احراز هویت یافت نشد. لطفاً وارد شوید.");
                navigate("/login");
                return;
            }

            try {
                // فرض بر این است که API Endpoint شما برای واکشی کاربر بر اساس userId به این شکل است:
                const response = await axios.get(
                    `http://127.0.0.1:8000/user_management/users/${userId}/`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // فرض بر این است که داده‌های کاربر شامل name، lastName، email، username و password است
                setFormData({
                    //name: response.data.name || '',
                    //lastName: response.data.lastName || '',
                    email: response.data.email || '',
                    username: response.data.username || '',
                    password: response.data.password || '', // بهتر است پسورد در واکشی نمایش داده نشود
                });
            } catch (err) {
                if (err.response) {
                    setError(`خطا: ${err.response.status} - ${err.response.data.detail || "خطای ناشناخته"}`);
                } else if (err.request) {
                    setError("پاسخی از سمت سرور دریافت نشد. لطفا اتصال اینترنت خود را بررسی کنید.");
                } else {
                    setError(`خطا در ارسال درخواست: ${err.message}`);
                }
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    // تابع برای بروزرسانی state فرم
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // تابع برای ارسال فرم
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) {
            setError("توکن احراز هویت یافت نشد. لطفاً وارد شوید.");
            navigate("/login");
            return;
        }

        try {
            // فرض بر این است که API Endpoint برای به‌روزرسانی کاربر به این شکل است:
            const response = await axios.put(
                `http://127.0.0.1:8000/user_management/users/${userId}/`,
                {
                    //name: formData.name,
                    //lastName: formData.lastName,
                    email: formData.email,
                    username: formData.username,
                    password: formData.password, // توجه داشته باشید که ارسال پسورد به صورت ساده ممکن است امنیتی نباشد
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert('اطلاعات با موفقیت به‌روزرسانی شد.');
                navigate('/login'); // هدایت به داشبورد بعد از ویرایش
            } else {
                alert('خطا در به‌روزرسانی اطلاعات.');
            }
        } catch (err) {
            if (err.response) {
                setError(`خطا: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
                alert(`خطا در به‌روزرسانی اطلاعات: ${JSON.stringify(err.response.data)}`);
            } else if (err.request) {
                setError("پاسخی از سمت سرور دریافت نشد. لطفا اتصال اینترنت خود را بررسی کنید.");
                alert('خطا در ارسال درخواست. لطفاً دوباره تلاش کنید.');
            } else {
                setError(`خطا: ${err.message}`);
                alert(`خطا: ${err.message}`);
            }
            console.error("Update Error:", err);
        }
    };

    // نمایش وضعیت بارگذاری، خطا یا محتوای اصلی فرم
    if (loading) return <p>در حال بارگذاری...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;

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
