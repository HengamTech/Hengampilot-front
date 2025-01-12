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
  const [activeTab, setActiveTab] = useState("AdminDashboard");

  // ----- state های مربوط به نمودار -----
  const [chartLabels, setChartLabels] = useState([]);
  const [chartDataValues, setChartDataValues] = useState([]);

  // ----- state های مربوط به لاگ‌ها -----
  const [auditLogs, setAuditLogs] = useState([]);
  const [showAllLogs, setShowAllLogs] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");
  const [totalUsers, setTotalUsers] = useState(null);
  const [TotalReviews, setTotalReviews] = useState(null);
  const [totalReports, setTotalReports] = useState(null); // تعداد کل گزارش‌ها
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // متد خروج
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
        const response = await axios.get(
          "http://localhost:8000/user_management/users/total-users/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
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
        const response = await axios.get(
          "http://localhost:8000/review_rating/reviews/count-all-reviews/",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setTotalReviews(response.data.count);
        setLoading(false);
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات");
        setLoading(false);
      }
    };
    fetchTotalReviews();
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

        const reviews = resp.data; 
        const dailyCounts = {};

        reviews.forEach((review) => {
          const dateStr = review.created_at
            ? moment.utc(review.created_at).format("YYYY-MM-DD")
            : null;
          if (!dateStr) return;
          if (!dailyCounts[dateStr]) {
            dailyCounts[dateStr] = 0;
          }
          dailyCounts[dateStr]++;
        });

        const sortedDates = Object.keys(dailyCounts).sort(
          (a, b) => new Date(a) - new Date(b)
        );
        setChartLabels(sortedDates);
        setChartDataValues(sortedDates.map((d) => dailyCounts[d]));
      } catch (err) {
        console.error("خطا در دریافت نظرات برای نمودار:", err);
      }
    };
    fetchAllReviewsForChart();
  }, [token]);

  // -------------------------------
  //      مدیریت لاگ‌های اخیر
  // -------------------------------
  const [logsLoading, setLogsLoading] = useState(false);

  // تبدیل action_type به فارسی
  const mapActionTypeToFarsi = (action) => {
    switch (action) {
      case "CREATE":
        return "ایجاد";
      case "DELETE":
        return "حذف";
      case "UPDATE":
        return "ویرایش";
      default:
        return action;
    }
  };

  // تبدیل content_type به فارسی
  const mapContentTypeToFarsi = (contentType) => {
    switch (contentType) {
      case "business_management | category":
        return " دسته بندی";
      case "user_management | user":
        return "کاربر";
      case "review_rating | review":
        return "نظر";
      case "review_rating | reports":
        return "گزارش کاربر";
      case "review_rating | vote":
        return "لایک کاربر";
      case "business_management | business":
        return "مدیریت بیزنس";

      default:
        return contentType || "نامشخص";
    }
  };

  const toJalali = (gregorianDateStr) => {
    if (!gregorianDateStr) return "نامشخص"; // بررسی ورودی نامعتبر
  
    // دریافت تاریخ میلادی
    const gregorianDate = new Date(gregorianDateStr);
    if (isNaN(gregorianDate)) return "نامشخص"; // بررسی تاریخ نامعتبر
  
    // محاسبه منطقه زمانی تهران (UTC+3:30 یا UTC+4:30 با توجه به تغییرات تابستانی)
    const tehranOffset = 3.5 * 60 * 60 * 1000; // اختلاف تهران با UTC
    const tehranDate = new Date(gregorianDate.getTime() + tehranOffset);
  
    // استخراج سال، ماه و روز میلادی
    const gYear = tehranDate.getUTCFullYear();
    const gMonth = tehranDate.getUTCMonth() + 1; // ماه از 0 شروع می‌شود
    const gDay = tehranDate.getUTCDate();
  
    // محاسبات تبدیل به شمسی
    const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const jDaysInMonth = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  
    const gLeap = (gYear % 4 === 0 && gYear % 100 !== 0) || gYear % 400 === 0;
    if (gLeap) gDaysInMonth[1] = 29;
  
    const gy = gYear - 1600;
    const gm = gMonth - 1;
    const gd = gDay - 1;
  
    let gDayNo =
      365 * gy +
      Math.floor((gy + 3) / 4) -
      Math.floor((gy + 99) / 100) +
      Math.floor((gy + 399) / 400);
  
    for (let i = 0; i < gm; ++i) gDayNo += gDaysInMonth[i];
    gDayNo += gd;
  
    let jDayNo = gDayNo - 79;
  
    const jNp = Math.floor(jDayNo / 12053);
    jDayNo %= 12053;
  
    let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
    jDayNo %= 1461;
  
    if (jDayNo >= 366) {
      jy += Math.floor((jDayNo - 1) / 365);
      jDayNo = (jDayNo - 1) % 365;
    }
  
    let jm, jd;
    for (jm = 0; jm < 11 && jDayNo >= jDaysInMonth[jm]; ++jm)
      jDayNo -= jDaysInMonth[jm];
    jd = jDayNo + 1;
  
    // استخراج ساعت، دقیقه و ثانیه
    const hours = tehranDate.getUTCHours();
    const minutes = tehranDate.getUTCMinutes();
    const seconds = tehranDate.getUTCSeconds();
  
    // فرمت‌دهی خروجی نهایی
    return `${jy}/${jm + 1 < 10 ? "0" : ""}${jm + 1}/${jd < 10 ? "0" : ""}${jd} ${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  

  // گرفتن لاگ‌ها از اندپوینت جدید
  useEffect(() => {
    const fetchAuditLogs = async () => {
      setLogsLoading(true);
      try {
        const resp = await axios.get("http://localhost:8000/analytics/audit-logs/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const logsData = resp.data || [];

        // چون گفتید object_id همان شناسه کاربر است، نام کاربر را هم می‌گیریم
        const enrichedLogs = await Promise.all(
          logsData.map(async (logItem) => {
            let userName = "نامشخص";
            try {
              if (logItem.object_id) {
                const userResp = await axios.get(
                  `http://localhost:8000/user_management/users/${logItem.object_id}/`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                userName = userResp.data.username || "نامشخص";
              }
            } catch (error) {
              console.error("خطا در گرفتن نام کاربر برای لاگ:", error);
            }

            const faActionType = mapActionTypeToFarsi(logItem.action_type);
            const faContentType = mapContentTypeToFarsi(logItem.content_type);

            return {
              ...logItem,
              userName,
              faActionType,
              faContentType,
            };
          })
        );

        setAuditLogs(enrichedLogs);
      } catch (error) {
        console.error("خطا در گرفتن لاگ‌ها:", error);
      } finally {
        setLogsLoading(false);
      }
    };
    fetchAuditLogs();
  }, [token]);

  // فقط 5 لاگ اول یا همه
  const visibleLogs = showAllLogs ? auditLogs : auditLogs.slice(0, 5);

  // داده پیش‌فرض نمودار
  let chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "تعداد نظرات ثبت‌شده",
        data: chartDataValues,
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
                  onClick={handleLogout}
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
                      <h2>{totalReports}</h2>
                    </div>
                  </div>
                </div>

                {/* آخرین فعالیت‌ها: جایگزینی با لاگ‌های جدید */}
                <div className="mt-5">
                  <h5>آخرین فعالیت‌ها</h5>
                  <table className="table table-striped table-bordered text-center">
                    <thead>
                      <tr>
                        <th>ردیف</th>
                        <th>کاربر</th>
                        <th>عملیات</th>
                        <th>نوع محتوا</th>
                        <th>تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogs.length === 0 && (
                        <tr>
                          <td colSpan="5">هیچ فعالیتی ثبت نشده است.</td>
                        </tr>
                      )}
                      {(showAllLogs ? auditLogs : auditLogs.slice(0, 5)).map((logItem, index) => (
                        <tr key={logItem.id || index}>
                          <td>{index + 1}</td>
                          <td>{logItem.userName || "نامشخص"}</td>
                          <td>{logItem.faActionType || "نامشخص"}</td>
                          <td>{logItem.faContentType || "نامشخص"}</td>
                          <td>{toJalali(logItem.action_time)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {auditLogs.length > 5 && (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setShowAllLogs(!showAllLogs)}
                    >
                      {showAllLogs ? "نمایش کمتر" : "لاگ‌های بیشتر"}
                    </button>
                  )}
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
                  <Line
                    data={{
                      labels: filteredData.labels,
                      datasets: filteredData.datasets,
                    }}
                  />
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
