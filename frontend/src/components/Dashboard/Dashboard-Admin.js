import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Tab, Form, Button, Table, Modal } from "react-bootstrap";
import "./Dashboard-Admin.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import UserManagement from "../UserManagement/UserManagement";
import ReviewManagementPage from "./ReviewManagementPage";
import SettingsPage from "../Settings/Settings";
import BusinessManager from "./WebsiteManagement/BusinessManager";
import ReportManagement from "./ReportManagement";
import {
  faUsers,
  faCommentDots,
  faChartBar,
  faFileAlt,
  faCog,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

import { Line } from "react-chartjs-2";
import moment from "moment"; // برای تبدیل تاریخ‌ها
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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [startDate, setStartDate] = useState(""); // تاریخ شروع فیلتر نمودار
  const [endDate, setEndDate] = useState("");   // تاریخ پایان فیلتر نمودار
  const [activePage, setActivePage] = useState("");
  const [activeTab, setActiveTab] = useState("AdminDashboard");

  // ----- state های مربوط به نمودار -----
  const [chartLabels, setChartLabels] = useState([
    // در ابتدا می‌توانیم خالی بگذاریم، چون با fetch جایگزین می‌شوند
  ]);
  const [chartDataValues, setChartDataValues] = useState([
    // در ابتدا خالی
  ]);

  // داده پیش‌فرض نمودار:
  // مقدار دهی داینامیک در useEffect
  let chartData = {
    labels: chartLabels, // بر اساس state پویا
    datasets: [
      {
        label: "تعداد نظرات ثبت‌شده",
        data: chartDataValues, // بر اساس state پویا
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.1)",
      },
    ],
  };

  // فیلتر داده‌ها بر اساس تاریخ میلادی
  const filteredData = {
    ...chartData,
    labels: chartData.labels.filter((date) => {
      const isAfterStartDate = startDate
        ? moment(date, "YYYY/MM/DD").isSameOrAfter(moment(startDate, "YYYY/MM/DD"))
        : true;
      const isBeforeEndDate = endDate
        ? moment(date, "YYYY/MM/DD").isSameOrBefore(moment(endDate, "YYYY/MM/DD"))
        : true;
      return isAfterStartDate && isBeforeEndDate;
    }),
    datasets: [
      {
        ...chartData.datasets[0],
        data: chartData.datasets[0].data.filter((_, idx) => {
          const date = chartData.labels[idx];
          const isAfterStartDate = startDate
            ? moment(date, "YYYY/MM/DD").isSameOrAfter(moment(startDate, "YYYY/MM/DD"))
            : true;
          const isBeforeEndDate = endDate
            ? moment(date, "YYYY/MM/DD").isSameOrBefore(moment(endDate, "YYYY/MM/DD"))
            : true;
          return isAfterStartDate && isBeforeEndDate;
        }),
      },
    ],
  };

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [totalUsers, setTotalUsers] = useState(null);
  const [TotalReviews, setTotalReviews] = useState(null);
  const [totalReports, setTotalReports] = useState(null); // تعداد کل گزارش‌ها
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userids, setUserIds] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("user_admin");
    const logoutEvent = new Event("logout");
    window.dispatchEvent(logoutEvent);
    navigate("/login");
  };

  // چک کردن ادمین بودن کاربر
  useEffect(() => {
    const user_admin = localStorage.getItem("user_admin");
    if (!token || Boolean(user_admin) === false) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  // تعداد کل کاربران
  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const response = await axios.get("http://localhost:8000/user_management/users/total-users/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(response.data.total_users);
        setLoading(false);
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };
    fetchTotalUsers();
  }, [token]);

  // تعداد کل نظرات
  useEffect(() => {
    const fetchTotalReviews = async () => {
      try {
        const response = await axios.get("http://localhost:8000/review_rating/reviews/count-all-reviews/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalReviews(response.data.count);
        setLoading(false);
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };
    fetchTotalReviews();
  }, [token]);

  // گرفتن userId بر اساس username
  useEffect(() => {
    const fetchuserid = async () => {
      const username = localStorage.getItem("username");
      try {
        const response = await axios.get(
          `http://localhost:8000/user_management/users/fetch-by-username/?username=${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        localStorage.setItem("userId", response.data.id);
        setUserIds(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };
    fetchuserid();
  }, [token]);

  // تعداد کل گزارش‌ها
  useEffect(() => {
    const fetchTotalReports = async () => {
      try {
        const response = await axios.get("http://localhost:8000/review_rating/reports/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalReports(response.data.length);
        setLoading(false);
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات گزارش‌ها");
        setLoading(false);
      }
    };
    fetchTotalReports();
  }, [token]);

  // گرفتن اطلاعات نظرات برای نمودار روزانه
  useEffect(() => {
    const fetchAllReviewsForChart = async () => {
    try {
      const resp = await axios.get("http://localhost:8000/review_rating/reviews/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const reviews = resp.data; // آرایه نظرات
      const dailyCounts = {};

      reviews.forEach((review) => {
        // تاریخ میلادی را از فیلد `created_at` بگیریم و با moment.utc پردازش کنیم
        const dateStr = review.created_at
          ? moment.utc(review.created_at).format("YYYY-MM-DD") // تاریخ استاندارد شده
          : null;

        if (!dateStr) return;

        // افزایش شمارنده
        if (!dailyCounts[dateStr]) {
          dailyCounts[dateStr] = 0;
        }
        dailyCounts[dateStr]++;
      });

      // مرتب‌سازی تاریخ‌ها
      const sortedDates = Object.keys(dailyCounts).sort(
        (a, b) => new Date(a) - new Date(b)
      );

      // تنظیم labelها و داده‌ها
      setChartLabels(sortedDates);
      setChartDataValues(sortedDates.map((d) => dailyCounts[d]));
    } catch (err) {
      console.error("خطا در دریافت نظرات برای نمودار:", err);
    }
  };

  fetchAllReviewsForChart();
  }, [token]);

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row min-vh-100">
        {/* Sidebar */}
        <aside
          className="col-12 col-md-3 bg-dark text-white p-3"
          style={{
            position: "sticky",
            top: 0,
            maxHeight: "72vh",
          }}
        >
          <div className="text-center mb-4">
            <h4>{username}</h4>
            <p>مدیر</p>
          </div>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${
                    activeTab === "AdminDashboard" ? "bg-primary" : ""
                  }`}
                  onClick={() => setActiveTab("AdminDashboard")}
                >
                  <FontAwesomeIcon icon={faChartBar} />
                  داشبورد
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${
                    activeTab === "usermanagement" ? "bg-primary" : ""
                  }`}
                  onClick={() => setActiveTab("usermanagement")}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت کاربران
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${
                    activeTab === "reviewmanagementpage" ? "bg-primary" : ""
                  }`}
                  onClick={() => setActiveTab("reviewmanagementpage")}
                >
                  <FontAwesomeIcon icon={faCommentDots} />
                  مدیریت نظرات
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${
                    activeTab === "BusinessManager" ? "bg-primary" : ""
                  }`}
                  onClick={() => setActiveTab("BusinessManager")}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت بیزنس
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${
                    activeTab === "ReportsManager" ? "bg-primary" : ""
                  }`}
                  onClick={() => setActiveTab("ReportsManager")}
                >
                  <FontAwesomeIcon icon={faFileAlt} />
                  مدیریت گزارش ها
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${
                    activeTab === "settings" ? "bg-primary" : ""
                  }`}
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
                  onClick={() => handleLogout()}
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
                    <div
                      className="card card-hover text-center text-white p-4 hoverEffect"
                      onClick={() => setActiveTab("usermanagement")}
                    >
                      <h5>تعداد کاربران</h5>
                      <h2>{totalUsers}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="card text-center p-4 hoverEffect1  text-white"
                      onClick={() => setActiveTab("reviewmanagementpage")}
                    >
                      <h5>تعداد نظرات</h5>
                      <h2>{TotalReviews}</h2>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div
                      className="card text-center p-4 hoverEffect2 text-dark"
                      onClick={() => setActiveTab("ReportsManager")}
                    >
                      <h5>گزارش‌های جدید</h5>
                      {/* مقدار 12 را با totalReports جایگزین می‌کنیم */}
                      <h2>{totalReports}</h2>
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
                <UserManagement />
              </Tab.Pane>
              <Tab.Pane eventKey="reviewmanagementpage">
                <ReviewManagementPage />
              </Tab.Pane>
              <Tab.Pane eventKey="settings">
                <SettingsPage />
              </Tab.Pane>
              <Tab.Pane eventKey="BusinessManager">
                <BusinessManager />
              </Tab.Pane>
              <Tab.Pane eventKey="ReportsManager">
                <ReportManagement />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
