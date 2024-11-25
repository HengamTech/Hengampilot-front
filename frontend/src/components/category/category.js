import React from "react";
import './category.css';

const categories = [
  {
    icon: "🍴",
    text: "غذا، رستوران، کافه",
  },
  {
    icon: "⚽",
    text: "ورزش",
  },
  {
    icon: "📺",
    text: "لوازم منزل",
  },
  {
    icon: "🎓",
    text: "آموزشی",
  },
  {
    icon: "🏠",
    text: "خدمات منزل",
  },
  {
    icon: "✈️",
    text: "خدمات مسافرتی",
  },
  {
    icon: "⚖️",
    text: "خدمات حقوقی",
  },
  {
    icon: "📰",
    text: "رسانه و اخبار",
  },
  {
    icon: "💰",
    text: "خدمات مالی",
  },
  {
    icon: "🚶",
    text: "خدمات عمومی",
  },
  {
    icon: "",
    text: "",
  },
  {
    icon: "",
    text: "",
  },
];

const Categories = () => {
  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5">دسته‌بندی‌ها</h2>
      <div className="row text-center">
        {categories.map((category, index) => (
          <div className="category-card col-6 col-md-2 mb-3" key={index}>
            <div className="category-card-inner shadow p-3 mb-3 bg-white rounded h-100 hover-scale">
              <span
                className="fs-1 mb-2"
                role="img"
                aria-label={category.text}
              >
                {category.icon}
              </span>
              <p className="m-0">{category.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
