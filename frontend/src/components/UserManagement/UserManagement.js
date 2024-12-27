import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // برای هدایت به صفحه ویرایش
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faTrash,
  faPlus,
  faUsers,
  faCog,
  faSignOutAlt,
  faChartBar,
  faCommentDots,
  faLevelUpAlt, // از FontAwesome
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const UserManagement = () => {
  // ابتدای کار آرایه‌ی کاربران را خالی می‌گذاریم
  const [users, setUsers] = useState([]);

  // نمونه‌ی اولیه برای افزودن کاربر جدید
  const [newUser, setNewUser] = useState({
    name: "",
    lastName: "",
    role: "کاربر عادی",
    email: "",
  });

  const [activePage, setActivePage] = useState("manageUsers");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // گرفتن لیست کاربران از API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // اگر نیاز به توکن دارید
        const response = await fetch("http://localhost:8000/user_management/users/", {
          headers: {
            Authorization: `Bearer ${token}`, // اگر نیاز به توکن داشتید
          },
        });
        const data = await response.json();

        // با توجه به ساختار پاسخ سرور، مقدار برگشتی را در users ذخیره کنید:
        // اینجا فرض شده data خودش آرایه کاربران است؛ در صورت تفاوت ساختار، اصلاح کنید.
        setUsers(data);
      } catch (error) {
        console.error("خطا در دریافت کاربران:", error);
      }
    };

    fetchUsers();
  }, []);

  // افزودن کاربر جدید (به‌صورت موقت در state محلی؛
  // در صورت نیاز می‌توانید برای API ایجاد کاربر هم درخواست بزنید)
  const handleAddUser = () => {
    if (newUser.name && newUser.email && newUser.lastName) {
      setUsers([
        ...users,
        { id: users.length + 1, ...newUser, isBlocked: false, comments: [] },
      ]);
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
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
      )
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    // بررسی جستجو در ترکیب نام و نام خانوادگی
    const fullName = `${user.name} ${user.lastName}`;
    return (
      fullName.includes(searchTerm) ||
      user.email.includes(searchTerm) // ایمیل هم چک می‌شود
    );
  });

  // مدیریت تغییر صفحه (در صورت نیاز)
  const handlePageChange = (page) => {
    setActivePage(page);
    navigate(`/${page}`); // مسیرها را در App.js تعریف کنید
  };

  const handleDashboardAdmin = () => {
    navigate("/AdminDashboard");
  };

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row min-vh-100">
        {/* این بخش سایدبار کامنت شده را دست نمی‌زنیم چون گفتید تغییر UI نمی‌خواهید */}
        {/* 
        <aside className="col-12 col-md-3 bg-dark text-white p-3">
          ...
        </aside>
        */}

        {/* Main Content */}
        <main className="col-12 col-md-12 bg-light p-0">
          <h3>مدیریت کاربران</h3>

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
            <h5></h5>
            <div className="row g-3 align-items-center mt-3">
              {/* این فیلد اگر واقعاً نیاز دارید، آن‌کامنت کنید */}
              {/* 
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="نام"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                />
              </div>
              */}
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="نام خانوادگی"
                  value={newUser.lastName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, lastName: e.target.value })
                  }
                />
              </div>
              <div className="col-md-4">
                <input
                  type="email"
                  className="form-control"
                  placeholder="ایمیل"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
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
          <div className="card p-4">
  <h5>لیست کاربران</h5>
  {/* حتماً برای ثابت‌شدن عرض ستون‌ها از table-layout: fixed استفاده کنید */}
  <table
    className="table table-bordered table-striped mt-3 text-center"
    style={{ tableLayout: "fixed" }}
  >
    {/* با colgroup عرض هر ستون را مشخص می‌کنیم */}
    <colgroup>
      <col style={{ width: "50px" }} />    {/* ردیف */}
      <col style={{ width: "100px" }} />   {/* نام */}
      <col style={{ width: "100px" }} />   {/* نام خانوادگی */}
      <col style={{ width: "120px" }} />   {/* یوزرنیم */}
      <col style={{ width: "190px" }} />   {/* ایمیل */}
      <col style={{ width: "100px" }} />   {/* نقش */}
      <col style={{ width: "300px" }} />   {/* عملیات */}
    </colgroup>

    <thead>
      <tr>
        <th>ردیف</th>
        <th>نام</th>
        <th>نام خانوادگی</th>
        <th>یوزرنیم</th>
        <th>ایمیل</th>
        <th>نقش</th>
        <th>عملیات</th>
      </tr>
    </thead>
    <tbody>
      {filteredUsers.map((user, index) => (
        <tr key={user.id}>
          <td>{index + 1}</td>
          <td>{user.first_name}</td>
          <td>{user.lastName}</td>
          <td>{user.username}</td>
          <td>{user.email}</td>
        <td>{user.is_admin ? "مدیر" : "کاربر معمولی"}</td> 
          
          <td>
            {/* دکمه‌ها و لینک‌های عملیات */}
            <Link
              to={`/edit-user/${user.id}`}
              className="btn btn-sm btn-warning mx-1"
            >
              <FontAwesomeIcon icon={faUserEdit} />
            </Link>
            <button
              className="btn btn-sm btn-danger mx-1"
              onClick={() => handleDeleteUser(user.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
            <button
              className={`btn btn-sm ${
                user.isBlocked ? "btn-secondary" : "btn-info"
              } mx-1`}
              onClick={() => handleBlockUser(user.id)}
            >
              {user.isBlocked ? "رفع مسدودی" : "مسدود کردن"}
            </button>
            <Link
              to={`/reivew/${user.id}`}
              className="btn btn-sm btn-primary mx-1"
            >
              <FontAwesomeIcon icon={faCommentDots} />
            </Link>
            <button className="btn btn-primary" onClick={handleAddUser}>
              <FontAwesomeIcon icon={faLevelUpAlt} />
            </button>
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
