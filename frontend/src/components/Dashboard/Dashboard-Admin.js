import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Tab, Form, Button, Table, Modal } from "react-bootstrap";
import "./Dashboard-Admin.css";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserManagement from "../UserManagement/UserManagement";
import ReviewManagementPage from "./ReviewManagementPage";
import SettingsPage from "../Settings/Settings";
import BusinessManager from "./WebsiteManagement/BusinessManager";
import {
  faUsers,
  faCommentDots,
  faChartBar,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import moment from "moment"; // استفاده از moment برای تبدیل تاریخ‌ها به میلادی
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const adminData = {
    name: "ادمین ",
    role: "مدیر سیستم",
  };

  const [startDate, setStartDate] = useState(""); // تاریخ شروع
  const [endDate, setEndDate] = useState(""); // تاریخ پایان
  const [activePage, setActivePage] = useState(""); // اضافه کردن state برای پیگیری صفحه فعال
  const [activeTab, setActiveTab] = useState("AdminDashboard");
  
  // داده‌های نمودار با تاریخ‌های میلادی
  const chartData = {
    labels: ["2023/11/01", "2023/11/02", "2023/11/03", "2023/11/04", "2023/11/05"], // تاریخ‌های میلادی
    datasets: [
      {
        label: "تعداد نظرات ثبت‌شده",
        data: [5, 8, 6, 10, 7],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
      },
    ],
  };

  // فیلتر داده‌ها بر اساس تاریخ میلادی
  const filteredData = {
    ...chartData,
    labels: chartData.labels.filter((date, index) => {
      const isAfterStartDate = startDate ? moment(date, "YYYY/MM/DD").isSameOrAfter(moment(startDate, "YYYY/MM/DD")) : true;
      const isBeforeEndDate = endDate ? moment(date, "YYYY/MM/DD").isSameOrBefore(moment(endDate, "YYYY/MM/DD")) : true;
      return isAfterStartDate && isBeforeEndDate;
    }),
    datasets: [
      {
        ...chartData.datasets[0],
        data: chartData.datasets[0].data.filter((_, index) => {
          const date = chartData.labels[index];
          const isAfterStartDate = startDate ? moment(date, "YYYY/MM/DD").isSameOrAfter(moment(startDate, "YYYY/MM/DD")) : true;
          const isBeforeEndDate = endDate ? moment(date, "YYYY/MM/DD").isSameOrBefore(moment(endDate, "YYYY/MM/DD")) : true;
          return isAfterStartDate && isBeforeEndDate;
        }),
      },
    ],
  };
// مدیریت تغییر صفحه
const handlePageChange = (page) => {
  setActivePage(page);
  navigate(`/${page}`); // مسیرها را در App.js تعریف کنید
};

  const navigate = useNavigate();
  const handleUserManagement = () => {
    navigate('/UserManagement');
  };


  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row min-vh-100">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 bg-dark text-white p-3"style={{     position: "sticky",
    top: 0,
    maxHeight: "60vh",
    overflowY: "auto"
}}>
          <div className="text-center mb-4">
          <h4>مدیر سیستم</h4>
            <p>نقش: مدیر</p>

          </div>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activeTab === "AdminDashboard" ? "bg-primary" : ""}`}
                  onClick={() => setActiveTab("AdminDashboard")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  داشبورد
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activeTab === "usermanagement" ? "bg-primary" : ""}`}
                  onClick={() => setActiveTab("usermanagement")}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت کاربران
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activeTab === "reviewmanagementpage" ? "bg-primary" : ""}`}
                  onClick={() => setActiveTab("reviewmanagementpage")}
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                  مدیریت نظرات
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activeTab === "BusinessManager" ? "bg-primary" : ""}`}
                  onClick={() => setActiveTab("BusinessManager")}
                >
                  <FontAwesomeIcon icon={faUsers } />
                  مدیریت سایت
                </a>
              </li>
              
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activeTab === "settings" ? "bg-primary" : ""}`}
                  onClick={() => setActiveTab("settings")}
                >
                  <FontAwesomeIcon icon={faCog} />
                  تنظیمات
                </a>
              </li>
              <li className="nav-item">
                <a
                  href="#"
                  className="nav-link text-white d-flex align-items-center gap-2"
                  onClick={() => handlePageChange("logout")}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  خروج
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 bg-light p-4">
          <Tab.Container activeKey={activeTab}>
          <Tab.Content>

            <Tab.Pane eventKey="AdminDashboard">
            <h3>پنل مدیریت</h3>
          {/* Summary Cards */}
          <div className="row mt-4">
            <div className="col-md-4">
              <div className="card card-hover text-center text-white p-4 hoverEffect"
              
                                onClick={() => setActiveTab("usermanagement")}

              >
                <h5>تعداد کاربران</h5>
                <h2>150</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center p-4 hoverEffect1  text-white"
                  onClick={() => setActiveTab("reviewmanagementpage")}

              >
                <h5>تعداد نظرات</h5>
                <h2>320</h2>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card text-center p-4 hoverEffect2 text-dark">
                <h5>گزارش‌های جدید</h5>
                <h2>12</h2>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-5">
            <h5>آخرین فعالیت‌ها</h5>
            <table className="table table-striped table-bordered text-center">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>کاربر</th>
                  <th>عملیات</th>
                  <th>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>علی</td>
                  <td>ایجاد نظر جدید</td>
                  <td>2023/11/12</td> {/* تاریخ میلادی */}
                </tr>
                <tr>
                  <td>2</td>
                  <td>زهرا</td>
                  <td>ارتقا حساب کاربری</td>
                  <td>2023/11/10</td> {/* تاریخ میلادی */}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Filters */}
          <div className="row mt-5">
            <div className="col-md-6">
              <label htmlFor="startDate" className="form-label">
                تاریخ شروع:
              </label>
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="endDate" className="form-label">
                تاریخ پایان:
              </label>
              <input
                type="date"
                id="endDate"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Chart */}
          <div className="mt-5">
            <h5>نمودار نظرات</h5>
            <Line data={filteredData} />
          </div>
          </Tab.Pane>
          <Tab.Pane eventKey="usermanagement">
            <UserManagement/>
          
          </Tab.Pane>
          <Tab.Pane eventKey="reviewmanagementpage">
          <ReviewManagementPage/>
          </Tab.Pane>
          <Tab.Pane eventKey="settings">
            <SettingsPage/>

          </Tab.Pane>
          <Tab.Pane eventKey="BusinessManager">
            <BusinessManager/>
          </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
