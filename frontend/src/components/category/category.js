import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import './category.css';
import { useNavigate } from "react-router-dom";

const Categories = () => {
  const [allCategories, setAllCategories] = useState([]); // آرایهٔ کلی همه دسته‌بندی‌ها
  const [categoriesRow1, setCategoriesRow1] = useState([]); // ردیف اول
  const [categoriesRow2, setCategoriesRow2] = useState([]); // ردیف دوم
  const token = localStorage.getItem("token");
    const navigate = useNavigate();
  // تابع دریافت لیست دسته‌بندی از API
  const fetchCategories = async () => {
    try {
      // اگر نیاز به توکن دارید:
      // const token = localStorage.getItem("token");
      // اگر توکن نیاز است، هدر را اضافه کنید:
      // const res = await axios.get("http://127.0.0.1:8000/business_management/category/", {
      //   headers: { Authorization: `Bearer ${token}` }
      // });

      const res = await axios.get("http://127.0.0.1:8000/business_management/category/",
      // {
      //   headers:{Authorization: `Bearer ${token}`}
      // }

      );
      // فرض می‌کنیم سرور آرایه‌ای از آبجکت‌ها برمی‌گرداند
      // [
      //   { id: 1, category_name: "غذا، رستوران، کافه", icon: "🍴", link: "/Home" },
      //   { id: 2, category_name: "ورزش", icon: "⚽" },
      //   ...
      // ]
      setAllCategories(res.data);
      console.log(res.data);
      // تقسیم لیست به دو بخش برای نمایش در دو ردیف:
      const half = Math.ceil(res.data.length / 2);
      setCategoriesRow1(res.data.slice(0, half));
      setCategoriesRow2(res.data.slice(half));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // در اولین بارگذاری کامپوننت، categories را از سرور می‌گیریم
  useEffect(() => {
    fetchCategories();
  }, []);

  // مدیریت کلیک روی کارت
  const handleClick = (id) => {
    if (id) {
      
      // اگر لینک داخلی است و می‌خواهید با React Router برگه عوض شود:
      navigate(`/categories/${id}`);
      // در کد فعلی شما از window.location.href استفاده شده:
      // window.location.href = link;
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-5" id="category">دسته‌بندی‌ها</h2>

      {/* ردیف اول */}
      <div className="row text-center">
        {categoriesRow1.map((category, index) => (
          <div
            className="category-card col-5 col-lg-2 justify-content-center"
            key={index}
            onClick={() => handleClick(category.id)}
          > 
            <div className="category-card-inner shadow p-3 mb-3 bg-white rounded h-100 hover-scale">
              <span className="fs-1 mb-2" role="img" aria-label={category.category_name}>
                {category.icon ? category.icon : "📁"}
              </span>
              <p className="m-0">{category.category_name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ردیف دوم */}
      <div className="row text-center">
        {categoriesRow2.map((category, index) => (
          <div
            className="category-card col-5 col-lg-2 justify-content-center"
            key={index}
            onClick={() => handleClick(category.id)}
          >
            <div className="category-card-inner shadow p-3 mb-3 bg-white rounded h-100 hover-scale">
              <span className="fs-1 mb-2" role="img" aria-label={category.category_name}>
                {category.icon ? category.icon : "📁"}
              </span>
              <p className="m-0">{category.category_name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
