import React, { useState } from "react";
import { Link } from "react-router-dom"; // برای هدایت به صفحه ویرایش
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserEdit, faTrash, faPlus, faUsers, faCog, faSignOutAlt, faChartBar, faCommentDots } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: "علی", lastName: "رضایی", role: "کاربر عادی", email: "ali@example.com", isBlocked: false, comments: ["نظر 1", "نظر 2"] },
    { id: 2, name: "زهرا", lastName: "کریمی", role: "مدیر", email: "zahra@example.com", isBlocked: false, comments: ["نظر 3"] },
  ]);
  
  const [newUser, setNewUser] = useState({ name: "", lastName: "", role: "کاربر عادی", email: "" });
  const [activePage, setActivePage] = useState("manageUsers");
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.lastName) {
      setUsers([...users, { id: users.length + 1, ...newUser, isBlocked: false, comments: [] }]);
      setNewUser({ name: "", lastName: "", role: "کاربر عادی", email: "" });
    } else {
      alert("لطفاً نام، نام خانوادگی و ایمیل کاربر را وارد کنید.");
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const handleBlockUser = (id) => {
    setUsers(users.map((user) => 
      user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
    ));
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(user => {
    // بررسی جستجو در ترکیب نام و نام خانوادگی
    const fullName = `${user.name} ${user.lastName}`;
    return (
      fullName.includes(searchTerm) || 
      user.email.includes(searchTerm) // ایمیل هم چک می‌شود
    );
  });
// مدیریت تغییر صفحه
const handlePageChange = (page) => {
  setActivePage(page);
  navigate(`/${page}`); // مسیرها را در App.js تعریف کنید
};

  const navigate = useNavigate();
  const handleDashboardAdmin = () => {
    navigate('/AdminDashboard');
  };

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row min-vh-100">
        {/* Sidebar */}
        <aside className="col-12 col-md-3 bg-dark text-white p-3">
          <div className="text-center mb-4">
            <h4>مدیر سیستم</h4>
            <p>نقش: مدیر</p>
          </div>
          <nav>
            <ul className="nav flex-column">
              <li className="nav-item mb-3">
                {/* اصلاح اینجا: onClick باید درون تگ a باشد */}
                <a href="#" className="nav-link text-white d-flex align-items-center gap-2" onClick={handleDashboardAdmin}>
                  <FontAwesomeIcon icon={faChartBar} />
                  داشبورد
                </a>
              </li>
              <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "manageUsers" ? "bg-primary" : ""}`}
                onClick={() => setActivePage("manageUsers")}>
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت کاربران
                </a>
              </li>
              <li className="nav-item mb-3">
                <a href="#" className="nav-link text-white d-flex align-items-center gap-2"
                   onClick={() => handlePageChange("Reviewmanagement")}>
                  <FontAwesomeIcon icon={faCommentDots} />
                  مدیریت نظرات
                </a>
              </li>
             {/* <li className="nav-item mb-3">
                <a
                  href="#"
                  className={`nav-link text-white d-flex align-items-center gap-2 ${activePage === "manageSite" ? "bg-primary" : ""}`}
                  onClick={() => handlePageChange("manageSite")}
                >
                  <FontAwesomeIcon icon={faUsers} />
                  مدیریت سایت
                </a>
              </li>
             */}
 
              <li className="nav-item mb-3">
                <a href="#" className="nav-link text-white d-flex align-items-center gap-2"
                 onClick={() => handlePageChange("settings")}

                >
                  <FontAwesomeIcon icon={faCog} />
                  تنظیمات
                </a>
              </li>
              <li className="nav-item">
                <a href="#" className="nav-link text-white d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                  خروج
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="col-12 col-md-9 bg-light p-4">
          <h3 className="my-4">مدیریت کاربران</h3>

          {/* Search Bar */}
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="جستجو بر اساس نام، نام خانوادگی یا ایمیل"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Add User */}
          <div className="card p-3 mb-4">
            <h5>اضافه کردن کاربر جدید</h5>
            <div className="row g-3 align-items-center mt-3">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="نام"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="نام خانوادگی"
                  value={newUser.lastName}
                  onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
                />
              </div>
              <div className="col-md-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="ایمیل"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                >
                  <option value="کاربر عادی">کاربر عادی</option>
                  <option value="مدیر">مدیر</option>
                </select>
              </div>
              <div className="col-md-1">
                <button className="btn btn-primary" onClick={handleAddUser}>
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </div>

          {/* User Table */}
          <div className="card p-3">
            <h5>لیست کاربران</h5>
            <table className="table table-bordered table-striped mt-3 text-center">
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>نام</th>
                  <th>نام خانوادگی</th>
                  <th>ایمیل</th>
                  <th>نقش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.lastName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {/* استفاده از Link برای هدایت به صفحه ویرایش کاربر */}
                      <Link to={`/edit-user/${user.id}`} className="btn btn-sm btn-warning mx-1">
                        <FontAwesomeIcon icon={faUserEdit} />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger mx-1"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className={`btn btn-sm ${user.isBlocked ? 'btn-secondary' : 'btn-info'} mx-1`}
                        onClick={() => handleBlockUser(user.id)}
                      >
                        {user.isBlocked ? "رفع مسدودی" : "مسدود کردن"}
                      </button>
                      <Link to={`/user-comments/${user.id}`} className="btn btn-sm btn-primary mx-1">
                        <FontAwesomeIcon icon={faCommentDots} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
