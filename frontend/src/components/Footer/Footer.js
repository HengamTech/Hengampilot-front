import React from 'react';
import './Footer.css';
import { FaInstagram, FaYoutube, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Logo from './Logo1.png';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">
                        <img src={Logo} alt="Logo"/>
                        <a href="/"><h4>Hengam pilot</h4></a>
                    </div>
                    <ul>
                        <li></li>
                    </ul>

                </div>
                <div className="footer-section">
                    <h4>انجمن</h4>
                    <ul>
                        <li><a href="/trust"> اطمینان به بازخورد</a></li>
                        <li><a href="login">ورود</a></li>
                        <li><a href="/signup">ثبت نام</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>کسب و کار</h4>
                    <ul>
                        <li><a href="/">HengamPilot</a></li>
                        <li><a href="/login">ورود برای کسب و کار</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>درباره ما</h4>
                    <ul>
                        <li><a href="/aboutus">درباره ما</a></li>
                        <li><a href="/contactUs">ارتباط با ما</a></li>
                        <li><a href="/">چگونه دستیار هنگام کار می کند</a></li>
                    </ul>
                </div>
            </div>
            
            <hr className="footer-divider" />

            <div className="footer-social-media">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                <a href="mailto:info@hengampilot.com" target="_blank" rel="noopener noreferrer"><FaEnvelope /></a>
            </div>

            <h5>تمامی حقوق این سایت متعلق به هنگام پایلت است </h5>
        </footer>
    );
};

export default Footer;
