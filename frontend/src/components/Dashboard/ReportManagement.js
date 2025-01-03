import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Form,
  Modal,
} from "react-bootstrap";
import axios from "axios";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [reportType, setReportType] = useState("all");
  const [status, setStatus] = useState("all");
  const [singleDate, setSingleDate] = useState("");

  // در اینجا اطلاعات گزارش انتخاب‌شده را در دو بخش جدا نگه می‌داریم
  // یک بخش اطلاعات خود "گزارش" (reportData)
  // یک بخش اطلاعات "ریویو" (reviewData)
  const [selectedReport, setSelectedReport] = useState(null);

  // کاربر گزارش‌کننده و کاربر ثبت‌کننده ریویو
  const [reporterInfo, setReporterInfo] = useState(null);
  const [commenterInfo, setCommenterInfo] = useState(null);

  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const token = localStorage.getItem("token");

  // گرفتن لیست تمام گزارش‌ها
  const fetchReports = async () => {
    try {
      const response = await axios.get("http://localhost:8000/review_rating/reports/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(response.data);
      setFilteredReports(response.data);
    } catch (error) {
      console.error("خطا در دریافت گزارش‌ها:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // گرفتن جزئیات گزارش انتخاب‌شده
  const fetchDetails = async (report) => {
    try {
      // کاربر گزارش‌کننده (کسی که این گزارش را ثبت کرده)
      const reporterResponse = await axios.get(
        `http://localhost:8000/user_management/users/${report.review_user_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // دریافت اطلاعات مرور (ریویو)
      const reviewResponse = await axios.get(
        `http://localhost:8000/review_rating/reviews/${report.review_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // کاربر ثبت‌کننده نظر (کسی که آن ریویو را نوشته)
      const commenterResponse = await axios.get(
        `http://localhost:8000/user_management/users/${reviewResponse.data.user}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReporterInfo(reporterResponse.data);
      setCommenterInfo(commenterResponse.data);

      // اینجا دیگر از ...report, ...reviewResponse.data استفاده نمی‌کنیم
      // تا فیلدهایی مثل id و review_id قاطی نشوند
      setSelectedReport({
        reportData: report,             // اطلاعات گزارش
        reviewData: reviewResponse.data // اطلاعات ریویو
      });

      setShowDetailsModal(true);
    } catch (error) {
      console.error("خطا در دریافت جزئیات:", error.response?.data || error.message);
    }
  };

  // نادیده گرفتن گزارش
  const ignoreReport = async (reportId) => {
    try {
      // در آرایه reports می‌گردیم تا گزارش موردنظر را پیدا کنیم
      const report = reports.find((r) => r.id === reportId);
      if (!report) {
        console.error("گزارش یافت نشد.");
        return;
      }

      const updatedReport = {
        reason_select: report.reason_select,
        result_report: "ignore",
        reason: report.reason,
        review_id: report.review_id,
        review_user_id: report.review_user_id,
      };

      await axios.put(
        `http://localhost:8000/review_rating/reports/${reportId}/`,
        updatedReport,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("گزارش نادیده گرفته شد.");
      setReports((prev) =>
        prev.map((r) =>
          r.id === reportId ? { ...r, result_report: "ignore" } : r
        )
      );
      setShowDetailsModal(false);
    } catch (error) {
      console.error("خطا در نادیده گرفتن گزارش:", error.response?.data || error.message);
    }
  };

  // حذف کاربر
  const deleteUser = async (userId) => {
    if (window.confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
      try {
        await axios.delete(`http://localhost:8000/user_management/users/${userId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("کاربر با موفقیت حذف شد.");
      } catch (error) {
        console.error("خطا در حذف کاربر:", error.response?.data || error.message);
      }
    }
  };
  // مسدود کردن کاربر
const banUser = async (userId) => {
  if (window.confirm("آیا از مسدود کردن این کاربر مطمئن هستید؟")) {
    try {
      const updatedUser = {
        is_active: false, // فرض کنید این پارامتر مشخص می‌کند که کاربر مسدود شده است
      };

      await axios.patch(
        `http://localhost:8000/user_management/users/${userId}/`,
        updatedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("کاربر با موفقیت مسدود شد.");
    } catch (error) {
      console.error("خطا در مسدود کردن کاربر:", error.response?.data || error.message);
    }
  }
};

  // اعمال فیلترها
  const applyFilters = () => {
    const filtered = reports.filter((report) => {
      const matchesType = reportType === "all" || report.reason_select === reportType;
      const matchesStatus = status === "all" || report.result_report === status;
      const matchesSearch =
        searchText === "" || report.reason.toLowerCase().includes(searchText.toLowerCase());
      const matchesDate = singleDate === "" || report.create_at === singleDate;

      return matchesType && matchesStatus && matchesSearch && matchesDate;
    });
    setFilteredReports(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [searchText, reportType, status, singleDate]);

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row>
        {/* بخش فیلترها */}
        <Col md={12}>
          <div className="bg-white p-3 border rounded">
            <h5>فیلترها</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>نوع گزارش</Form.Label>
                  <Form.Select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="all">همه</option>
                    <option value="violence">خشونت</option>
                    <option value="terrorism">ترورسیم</option>
                    <option value="accusations">اتهام</option>
                    <option value="sexual">جنسی</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>وضعیت</Form.Label>
                  <Form.Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="all">همه</option>
                    <option value="ignore">پرهیز</option>
                    <option value="Unchecked">غیرقابل چک</option>
                    <option value="UserBan">مسدود کردن کاربر</option>
                    <option value="Remove">حذف کردن یوزر</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-2">
                  <Form.Label>تاریخ گزارش</Form.Label>
                  <Form.Control
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>

        {/* جدول لیست گزارش‌ها */}
        <Col md={12} className="bg-light p-3 mt-3">
          <h3>لیست گزارش‌ها</h3>
          <Table striped bordered hover responsive className="text-center mt-3">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نوع گزارش</th>
                <th>توضیحات</th>
                <th>وضعیت</th>
                <th>تاریخ</th>
                <th>جزئیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((report, index) => (
                  <tr key={report.id}>
                    <td>{index + 1}</td>
                    <td>{report.reason_select}</td>
                    <td>{report.reason}</td>
                    <td>{report.result_report}</td>
                    <td>{report.create_at}</td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => fetchDetails(report)}
                      >
                        جزئیات
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">گزارشی یافت نشد</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* مودال جزئیات گزارش */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        dir="rtl"
      >
        <Modal.Header closeButton>
          <Modal.Title>جزئیات گزارش</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
             <p>
                <strong>کاربر ثبت‌کننده گزارش :</strong>{" "}
                {reporterInfo ? reporterInfo.username : "نامشخص"}
              </p>
              <p>
                <strong>کاربر ثبت‌کننده نظر :</strong>{" "}
                {commenterInfo ? commenterInfo.username : "نامشخص"}
              </p>
             
              <p>
                <strong>متن گزارش:</strong>{" "}
                {selectedReport.reviewData?.review_text || "نامشخص"}
              </p>
              
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {/* نادیده گرفتن گزارش */}
          {selectedReport && (
            <Button
              variant="secondary"
              onClick={() => {
                console.log("Ignoring report with ID:", selectedReport.reportData.id);
                ignoreReport(selectedReport.reportData.id);
              }}
            >
              نادیده گرفتن گزارش
            </Button>
          )}

          {/* دکمه‌های حذف و مسدود کردن کاربر ثبت‌کننده ریویو */}
          {commenterInfo && (
            <>
              <Button
                variant="danger"
                onClick={() => deleteUser(commenterInfo.id)}
              >
                حذف کاربر
              </Button>
              <Button
                variant="warning"
                onClick={() => banUser(commenterInfo.id)}
              >
                مسدود کردن کاربر
              </Button>
            </>
          )}
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            بستن
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ReportManagement;
