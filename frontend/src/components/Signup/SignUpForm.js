import React, { useState } from 'react';
import './SignUpForm.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function LoginPage2() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // لیست فرضی از یوزرنیم‌های موجود برای چک کردن یکتایی
    const existingUsernames = ['user1', 'user2', 'exampleUser'];

    // تابع اعتبارسنجی ایمیل، رمز عبور و یوزرنیم
    const validate = () => {
        const errors = {};

        // اعتبارسنجی یوزرنیم
        if (!username) {
            errors.username = 'نام کاربری الزامی است';
        } else if (existingUsernames.includes(username)) {
            errors.username = 'این نام کاربری قبلاً استفاده شده است';
        }

        // اعتبارسنجی ایمیل
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            errors.email = 'ایمیل الزامی است';
        } else if (!email.includes('@')) {
            errors.email = 'ایمیل باید شامل @ باشد';
        } else if (!emailRegex.test(email)) {
            errors.email = 'لطفاً یک ایمیل معتبر وارد کنید';
        }

        // اعتبارسنجی رمز عبور
        const passwordRegex = /^(?=.*[A-Z])(?=.*[@#$%^&*!]).{8,}$/;
        if (!password) {
            errors.password = 'رمز عبور الزامی است';
        } else if (password.length < 8) {
            errors.password = 'رمز عبور باید حداقل ۸ کاراکتر باشد';
        } else if (!passwordRegex.test(password)) {
            errors.password = 'رمز عبور باید حداقل یک حرف بزرگ و یک کاراکتر ویژه (@, #, $, ...) داشته باشد';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the form before sending the request
    if (!validate()) return;  // If validation fails, do not send the request

    try {
        // Sending POST request to the API to create a user
        const response = await axios.post('http://127.0.0.1:8000/user_management/users/', {
            "username": username,  // Sending username
            "email": email,        // Sending email
            "password": password,  // Sending password
        });

        // Handle success response
         if (response.data.token) {
                // Save token to localStorage (or send via navigation)
                localStorage.setItem('token', response.data.token);

                // Navigate to login page
                navigate("/login", { state: { token: response.data.token } }); // Pass token in state

            }
         navigate("/login")
    } catch (error) {
        // Handle API errors
        if (error.response) {
            console.error('Error Response:', error.response);
            // Display error message from API
            setErrors({
                api: error.response.data.detail || 'Error sending request to server',
            });
        } else {
            console.error('Request Error:', error.message);
            setErrors({ api: 'Error connecting to the server' });
        }
    }
};





























    return (
        <div className="login-page">
            {/* Left Section with Illustration */}
            <div className="login-illustration_1">
                <img
                    src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/draw1.webp"
                    alt="Login Illustration"
                />
            </div>

            {/* Right Section with Login Form */}
            <div className="login-form-container">
                <div dir="rtl" className="login-form">
                    <h2 className="login-title">به هنگام پایلت خوش آمدید</h2>
                    <p className="login-subtitle">
                        لطفا ثبت نام را انجام بدید و ماجراجویی را شروع کنید
                    </p>
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
                            <label htmlFor="email">ایمیل کاربری</label>
                            <input
                                type="text"
                                id="email"
                                placeholder="ایمیل"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
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
                        <button type="submit" className="login-btn">
                            ثبت نام
                        </button>
                    </form>
                    <div className="create-account">
                        <p>قبلا ثبت نام کردید؟   <a href="http://localhost:3000/login">  ورود </a></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage2;



