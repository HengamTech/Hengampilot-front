import React, { useState } from 'react';
import './loginForm.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // اعتبارسنجی اطلاعات ورودی
    const validate = () => {
        const errors = {};
        if (!username) errors.username = 'نام کاربری الزامی است';
        if (!password) errors.password = 'رمز عبور الزامی است';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // مدیریت ثبت فرم
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            // درخواست به سرور برای دریافت توکن
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password,
            });

            if (response.status === 200) {
                // ذخیره توکن در localStorage
                const token = response.data.token;
                localStorage.setItem('token', token);

                // تنظیم توکن در هدر درخواست‌ها
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                // ریدایرکت به داشبورد
                navigate('/dashboard');
            }
        } catch (error) {
            setErrors({ login: 'ورود ناموفق بود، لطفاً دوباره تلاش کنید!' });
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-illustration">
                <img
                    src="https://img.freepik.com/free-vector/login-concept-illustration_114360-739.jpg"
                    alt="Login Illustration"
                />
            </div>

            <div className="login-form-container">
                <div dir="rtl" className="login-form">
                    <h2 className="login-title">به هنگام پایلت خوش آمدید</h2>
                    <p className="login-subtitle">لطفا وارد حساب کاربری خود شوید</p>
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">نام کاربری</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="نام کاربری"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {errors.username && <p style={{ color: 'red' }}>{errors.username}</p>}
                        </div>
                        <div className="input-group">
                            <label htmlFor="password">رمز عبور</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="رمز عبور"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {errors.password && <p style={{ color: 'red' }}>{errors.password}</p>}
                        </div>
                        {errors.login && <p style={{ color: 'red' }}>{errors.login}</p>}
                        <div className="remember-me">
                            <input type="checkbox" id="remember" />
                            <label htmlFor="remember">من را بخاطر داشته باش</label>
                        </div>
                        <button type="submit" className="login-btn" disabled={loading}>
                            {loading ? 'در حال ورود...' : 'ورود'}
                        </button>
                    </form>
                    <div className="create-account">
                        <p>ثبت نام نکردی؟ <a href="http://localhost:3000/signup">حساب کاربری درست کن</a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;

