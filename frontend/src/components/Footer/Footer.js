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
                        <img src={Logo} alt="Logo" />
                        <h4>HengamPilot</h4>
                    </div>
                </div>
                <div className="footer-section">
                    <h4>انجمن</h4>
                    <ul>
                        <li>اطمینان به بازخورد</li>
                        <li>ورود</li>
                        <li>ثبت نام</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>کسب و کار</h4>
                    <ul>
                        <li>HengamPilot</li>
                        <li>وبلاگ برای کسب و کار</li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>درباره ما</h4>
                    <ul>
                        <li>درباره ما</li>
                        <li>ارتباط با ما</li>
                        <li>وبلاگ</li>
                        <li>چگونه دستیار هنگام کار می کند</li>
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
        </footer>
    );
};

export default Footer;
