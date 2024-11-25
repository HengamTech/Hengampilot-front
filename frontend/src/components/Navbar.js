import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';
import Logo from './Logo1.png';

function Navbar() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  return (
    <nav className="navbar">
      <div className="navbar__right">
        <div className="navbar__logo">
          <span>HengamPilot</span>
          <img src={Logo} alt="Logo" />
        </div>
        <a href="#categories" className="navbar__link">دسته بندی</a>
        <a href="#blog" className="navbar__link">وبلاگ</a>
        <a href="#feedback" className="navbar__link">ثبت انتقادات</a>
        <a href="#aboutus" className="navbar__link">درباره ما</a>
      </div>
      <div className="navbar__left">
        <div className="navbar__search">
          <input type="text" placeholder="جستجو شرکت ها" className="navbar__search-input" />
          <svg class="navbar__search-button" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 50 50">
              {/*<path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>*/}
          </svg>
          <button className="navbar__search-button"></button>
        </div>
        <button className="navbar__button" onClick={handleLogin}>ورود</button>
        <button className="navbar__button navbar__button--inactive" onClick={handleSignUp}>ثبت نام</button>
      </div>
    </nav>
  );
}

export default Navbar;
