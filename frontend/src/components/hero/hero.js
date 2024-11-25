import React from 'react';
import './hero.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import adam from "./adam niga(1).png"

const PilotHeader = () => {
    return (
        <div className="pilot-header">
            <img src={adam} className="icon-man" alt="Icon" />

            <h1 className="pilot-title">HENGAM</h1>
            <span className="pilot-subtitle">PILOT</span>

            <div className="speech-bubble">
                <ul className="info-list">
                    <li>
                        با “هنگام پایلت” <span className="highlight">مقایسه کنید </span> تصمیم بگیرید و با خیال
                        راحت <span className="highlight">خرید کنید</span>
                    </li>
                    <li>
                        تجربه خرید خود را بنویسید و <span className="highlight">الهام بخش</span> دیگر کاربران
                        برای رسیدن به تجربه خریدی <span className="highlight">با اعتماد به نفس</span> شوید
                    </li>
                </ul>
            </div>

            <div className="search-container">
                <div className="search-bar">
                    <a className="search-icon" href="/">
                        <i className="fa fa-search"></i>
                    </a>
                    <input
                        type="text"
                        className="search-input"
                        placeholder="جستجوی شرکت ها"
                    />
                </div>
            </div>
        </div>
    );
};

export default PilotHeader;
