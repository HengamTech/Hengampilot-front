import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./category.css";

const Categories = ({id}) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/business_management/category/");
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleClick = (id) => {
    if (id) {
      navigate(`/categories/${id}`);
    }
  };

  return (
    <section id={id}>
    <div className="container mt-4">
      <h2 className="text-center mb-5" id="category">دسته‌بندی‌ها</h2>

      <div className="row text-center">
        {categories.map((category, index) => (
          <div
            className="category-card col-12 col-sm-10 col-md-4 col-lg-2 mb-4"
            key={index}
            onClick={() => handleClick(category.category_name)}
          >
            <div className="cs category-card-inner shadow p-3 bg-white rounded h-100 hover-scale">
              <div className="mb-2">
                {category.category_image ? (
                  <img
                    src={category.category_image}
                    alt={category.category_name}
                    style={{
                      width: "50px",
                      height: "50px",
                      objectFit: "cover",
                      borderRadius: "50%",
                    }}
                  />
                ) : (
                  <span
                  style={{
                 fontSize: "35px",    // اندازه فونت برای ایموجی
                  }}
                >
                  📁
                </span>
                                )}
              </div>
              <p className="m-0">{category.category_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    </section>
  );
};

export default Categories;
