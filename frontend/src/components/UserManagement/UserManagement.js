import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faTrash,
  faPlus,
  faCommentDots,
  faLevelUpAlt,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/user_management/users/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("خطا در دریافت کاربران:", error);
      }
    };

    fetchUsers();
  }, []);
console.log("users",users);
  // تابع حذف کاربر
  const handleDeleteUser = async (id) => {
    if (window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/user_management/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // حذف کاربر از لیست محلی پس از موفقیت در درخواست
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("خطا در حذف کاربر:", error);
      }
    }
  };

  const handleToggleBlockUser = async (id, isActive) => {
    const confirmationMessage = isActive
      ? "آیا از رفع مسدودی این کاربر مطمئن هستید؟"
      : "آیا از مسدود کردن این کاربر مطمئن هستید؟";
  
    if (window.confirm(confirmationMessage)) {
      try {
        const token = localStorage.getItem("token");
        const updatedUser = {
          is_active: !isActive, // تغییر وضعیت is_active
        };
  
        await axios.patch(
          `http://localhost:8000/user_management/users/${id}/`,
          updatedUser,
          { headers: { Authorization: `Bearer ${token}` } }
        );
  
        // به‌روزرسانی وضعیت در لیست محلی
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, is_active: !isActive } : user
          )
        );
  
        alert(isActive ? "کاربر با موفقیت رفع مسدودی شد." : "کاربر با موفقیت مسدود شد.");
      } catch (error) {
        console.error("خطا در تغییر وضعیت کاربر:", error.response?.data || error.message);
      }
    }
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.lastName}`;
    return (
      fullName.includes(searchTerm) ||
      user.email.includes(searchTerm)
    );
  });

  return (
    <div className="container-fluid" style={{ direction: "rtl" }}>
      <div className="row min-vh-100">
        <main className="col-12 col-md-12 bg-light p-0">
          <h3>مدیریت کاربران</h3>
          <div className="mb-4">
            <input
              type="text"
              className="form-control"
              placeholder="جستجو بر اساس نام، نام خانوادگی یا ایمیل"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="card p-4">
            <h5>لیست کاربران</h5>
            <table
              className="table table-bordered table-striped mt-3 text-center"
              style={{ tableLayout: "fixed" }}
            >
              <colgroup>
                <col style={{ width: "50px" }} />
                {/* <col style={{ width: "100px" }} /> */}
                {/* <col style={{ width: "100px" }} /> */}
                <col style={{ width: "120px" }} />
                <col style={{ width: "190px" }} />
                <col style={{ width: "100px" }} />
                <col style={{ width: "200px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ردیف</th>
                  {/* <th>نام</th> */}
                  {/* <th>نام خانوادگی</th> */}
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
                    {/* <td>{user.first_name}</td> */}
                    {/* <td>{user.lastName}</td> */}
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.is_admin ? "مدیر" : "کاربر معمولی"}</td>
                    <td>
                      <Link
                        to={`/edit-user/${user.id}`}
                        className="btn btn-sm btn-warning mx-1"
                      >
                        <FontAwesomeIcon icon={faUserEdit} />
                      </Link>
                      <button
                        className="btn btn-sm btn-danger mx-1"
                        onClick={() => handleDeleteUser(user.id)}
                        data-testid="test"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
  className={`btn btn-sm ${user.is_active ? "btn-danger" : "btn-secondary"} mx-1`}
  onClick={() => handleToggleBlockUser(user.id, user.is_active)}
>
  {user.is_active ? "مسدود کردن" : "رفع مسدودی"}
</button>
                      <Link
                        to={`/UserReview/${user.id}`}
                        className="btn btn-sm btn-primary mx-1"
                      >
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
