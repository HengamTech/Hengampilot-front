import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faTrash,
  faBan,
  faUnlock,
  faCommentDots,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { API_BASE_URL } from '../config';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/user_management/users/`, {
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

  const handleDeleteUser = async (id) => {
    if (window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${API_BASE_URL}/user_management/users/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(users.filter((user) => user.id !== id));
      } catch (error) {
        console.error("خطا در حذف کاربر:", error);
      }
    }
  };

  const handleToggleBlockUser = async (id, isActive) => {
    const confirmationMessage = isActive
      ? "آیا از مسدود کردن این کاربر مطمئن هستید؟"
      : "آیا از رفع مسدودی این کاربر مطمئن هستید؟";

    if (window.confirm(confirmationMessage)) {
      try {
        const token = localStorage.getItem("token");
        const updatedUser = {
          is_active: !isActive,
        };

        await axios.patch(
          `${API_BASE_URL}/user_management/users/${id}/`,
          updatedUser,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === id ? { ...user, is_active: !isActive } : user
          )
        );

        alert(isActive ? "کاربر با موفقیت مسدود شد." : "کاربر با موفقیت رفع مسدودی شد.");
      } catch (error) {
        console.error("خطا در تغییر وضعیت کاربر:", error.response?.data || error.message);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter((user) => {
    const fullName = `${user.first_name} ${user.lastName}`; // توجه کنید lastName یا last_name بسته به مدل
    return (
      fullName.includes(searchTerm) ||
      user.email.includes(searchTerm) ||
      user.username.includes(searchTerm)
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
          <div className="table-responsive p-2">
            <h5>لیست کاربران</h5>
            <table
              className="table table-bordered table-striped mt-3 text-center"
              style={{ tableLayout: "fixed", width: "100%" }}
            >
              <colgroup>
                <col style={{ width: "50px" }} />
                <col style={{ width: "120px", wordWrap: "break-word", whiteSpace: "pre-wrap" }} />
              {isLargeScreen  && (  <col style={{ width: "180px", wordWrap: "break-word", whiteSpace: "pre-wrap"}}  />
              )}
                <col style={{ width: "100px" }} />
                <col style={{ width: "120px" }} />
              </colgroup>
              <thead>
                <tr>
                  <th>ردیف</th>
                  <th>یوزرنیم</th>
                  {isLargeScreen && (
                  <th>ایمیل</th>
                  )}
                  <th>نقش</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} style={{ verticalAlign: "top" }}>
                    <td>{index + 1}</td>
                    <td style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                      {user.username}
                    </td>
                    {isLargeScreen && (
                    <td  style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                      {user.email}
                    </td>
                    )}
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
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <button
                        className={`btn btn-sm ${
                          user.is_active ? "btn-danger" : "btn-secondary"
                        } mx-1`}
                        onClick={() => handleToggleBlockUser(user.id, user.is_active)}
                      >
                        {user.is_active ? <FontAwesomeIcon icon={faBan} className="me-2" /> :           <FontAwesomeIcon icon={faUnlock} className="me-2" />}
                      </button>
                      <Link
                        to={`/UserReview/${user.id}`}
                        className="btn btn-sm btn-primary"
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
