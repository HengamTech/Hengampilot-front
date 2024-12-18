import React from "react";
import "./hero.css"; // Custom styles
import thinkerImage from "./Untitled_Export_V1.jpeg"; // Replace with your thinker guy image

const HeroSection = ({ subjectText }) => {
    return (
        <div className="hero-section">
            {/* Thinker Section */}
            <div className="thinker-container">
                <img src={thinkerImage} alt="Thinker Guy" className="thinker-image" />
            </div>

            {/* Search Input */}
            {/* Hero Title */}
            <div className="title-container">
                <h1 className="hero-title">HENGAM</h1>
                <p className="hero-subtitle">Explore, Compare, and Decide</p>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="جستجوی شرکت‌ها"
                    />
                </div>
            </div>
            <div className="search-container">

            </div>
        </div>
    );
};

export default HeroSection;
