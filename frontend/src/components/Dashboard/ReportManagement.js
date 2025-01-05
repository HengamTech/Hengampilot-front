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
  FormLabel,
} from "react-bootstrap";
import axios from "axios";

const ReportManagement = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [reportType, setReportType] = useState("all");
  const [status, setStatus] = useState("all");
  const [singleDate, setSingleDate] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);
  const [reporterInfo, setReporterInfo] = useState(null);
  const [commenterInfo, setCommenterInfo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const token = localStorage.getItem("token");

  // نقشهٔ ترجمه برای reason_select
  const reasonSelectMap = {
    violence: "خشونت",
    terrorism: "تروریسم",
    accusations: "اتهام",
    sexual: "جنسی",
  };

  // نقشهٔ ترجمه برای result_report
  const resultReportMap = {
    ignore: "نادیده گرفته شده",
    Unchecked: "بررسی نشده",
    UserBan: "مسدود کردن کاربر",
    Remove: "حذف کردن کاربر",
  };

  // تابع تبدیل تاریخ میلادی به شمسی
  const toJalali = (gregorianDate) => {
    if (!gregorianDate) return "نامشخص"; // اگر خالی بود یا undefined بود
    const g2j = (gYear, gMonth, gDay) => {
      const gDaysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      const jDaysInMonth = [31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29, 29];

      let gy = gYear - 1600;
      let gm = gMonth - 1;
      let gd = gDay - 1;

      let gDayNo =
        365 * gy +
        Math.floor((gy + 3) / 4) -
        Math.floor((gy + 99) / 100) +
        Math.floor((gy + 399) / 400);

      for (let i = 0; i < gm; ++i) {
        gDayNo += gDaysInMonth[i];
      }
      // سال کبیسه میلادی
      if (
        gm > 1 &&
        ((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0)
      ) {
        ++gDayNo;
      }
      gDayNo += gd;

      let jDayNo = gDayNo - 79;
      let jNp = Math.floor(jDayNo / 12053);
      jDayNo %= 12053;

      let jy = 979 + 33 * jNp + 4 * Math.floor(jDayNo / 1461);
      jDayNo %= 1461;

      if (jDayNo >= 366) {
        jy += Math.floor((jDayNo - 1) / 365);
        jDayNo = (jDayNo - 1) % 365;
      }

      let jm = 0;
      for (let i = 0; i < 11 && jDayNo >= jDaysInMonth[i]; ++i) {
        jDayNo -= jDaysInMonth[i];
        jm++;
      }
      let jd = jDayNo + 1;

      return { year: jy, month: jm + 1, day: jd };
    };

    const parts = gregorianDate.split("-");
    if (parts.length < 3) return "نامشخص";
    const gYear = parseInt(parts[0], 10);
    const gMonth = parseInt(parts[1], 10);
    const gDay = parseInt(parts[2], 10);

    const { year, month, day } = g2j(gYear, gMonth, gDay);
    return `${year}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
  };

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
      const reporterResponse = await axios.get(
        `http://localhost:8000/user_management/users/${report.review_user_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reviewResponse = await axios.get(
        `http://localhost:8000/review_rating/reviews/${report.review_id}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const commenterResponse = await axios.get(
        `http://localhost:8000/user_management/users/${reviewResponse.data.user}/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReporterInfo(reporterResponse.data);
      setCommenterInfo(commenterResponse.data);

      setSelectedReport({
        reportData: report,
        reviewData: reviewResponse.data,
      });

      setShowDetailsModal(true);
    } catch (error) {
      console.error("خطا در دریافت جزئیات:", error.response?.data || error.message);
    }
  };

  // نادیده گرفتن گزارش
  const ignoreReport = async (reportId) => {
    try {
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

  const banUser = async (userId) => {
    if (window.confirm("آیا از مسدود کردن این کاربر مطمئن هستید؟")) {
      try {
        const updatedUser = {
          is_active: false,
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

  const applyFilters = () => {
    const filtered = reports.filter((report) => {
      // نوع گزارش
      const matchesType =
        reportType === "all" || report.reason_select === reportType;
      // وضعیت
      const matchesStatus =
        status === "all" || report.result_report === status;
      // جستجو در توضیحات
      const matchesSearch =
        searchText === "" ||
        report.reason.toLowerCase().includes(searchText.toLowerCase());
      // تاریخ
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
        <Col md={12}>
        <h3>لیست گزارش‌ها</h3>
          
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
                    <option value="terrorism">تروریسم</option>
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
                    <option value="ignore">نادیده گرفته شده</option>
                    <option value="Unchecked">بررسی نشده</option>
                    <option value="UserBan">مسدود کردن کاربر</option>
                    <option value="Remove">حذف کردن کاربر</option>
                  </Form.Select>
                  
                </Form.Group>
              </Col>
              <Col md={4}>
              
                {/* اگر نیاز بود، فیلتر تاریخ را برگردانید */}
                {/* 
                <Form.Group className="mb-2">
                  <Form.Label>تاریخ گزارش</Form.Label>
                  <Form.Control
                    type="date"
                    value={singleDate}
                    onChange={(e) => setSingleDate(e.target.value)}
                  />
                </Form.Group> 
                */}
              </Col>
            </Row>
            <Row>
            <div className="mb-3">
            <FormLabel>جستجو در نوع گزارش</FormLabel>
            <Form.Control
              type="text"
              placeholder="جستجو در توضیحات گزارش..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
            </Row>
          </div>
        </Col>

        <Col md={12} className="bg-light p-3 mt-3">
       

          <Table striped bordered hover responsive className="text-center mt-3">
            <thead>
              <tr>
                <th>ردیف</th>
                <th>نوع گزارش</th>
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
                    {/* ترجمه reason_select به فارسی */}
                    <td>{reasonSelectMap[report.reason_select] || "نامشخص"}</td>


                    {/* ترجمه result_report به فارسی */}
                    <td>{resultReportMap[report.result_report] || "نامشخص"}</td>

                    {/* تبدیل تاریخ به شمسی */}
                    <td>{toJalali(report.create_at)}</td>

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

      {/* مودال نمایش جزئیات گزارش */}
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        dir="rtl"
      >
        <Modal.Header closeButton  >
          <closeButton></closeButton>
          <Modal.Title style={{marginLeft:"65%"}}>جزئیات گزارش</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReport && (
            <>
              <p>
                <strong>کاربر ثبت‌کننده گزارش:</strong>{" "}
                {reporterInfo ? reporterInfo.username : "نامشخص"}
              </p>
              <p>
                <strong>کاربر ثبت‌کننده کامنت:</strong>{" "}
                {commenterInfo ? commenterInfo.username : "نامشخص"}
              </p>
              <p>
                <strong>تاریخ گزارش:</strong>{" "}
                {toJalali(selectedReport.reportData.create_at)}
              </p>

              <hr />
              <p>
                <strong>توضیحات گزارش:</strong>
              </p>
              <div
                style={{
                  maxHeight: "200px",
                  overflow: "auto",
                  textAlign: "justify",
                  lineHeight: "1.8",
                  padding: "10px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  direction: "rtl",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {selectedReport.reportData.reason || "نامشخص"}
              </div>

              <hr />
              <p>
                <strong>متن کامنت کاربر:</strong>
              </p>
              <div
                style={{
                  maxHeight: "200px",
                  overflow: "auto",
                  textAlign: "justify",
                  lineHeight: "1.8",
                  padding: "10px",
                  border: "2px solid #ddd",
                  borderRadius: "8px",
                  backgroundColor: "#f9f9f9",
                  direction: "rtl",
                  wordBreak: "break-word",
                  whiteSpace: "pre-wrap",
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                {selectedReport.reviewData?.review_text || "نامشخص"}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedReport && (
            <Button
              variant="secondary"
              onClick={() => ignoreReport(selectedReport.reportData.id)}
            >
              نادیده گرفتن گزارش
            </Button>
          )}
          {commenterInfo && (
            <>
              <Button variant="danger" onClick={() => deleteUser(commenterInfo.id)}>
                حذف کاربر
              </Button>
              <Button variant="warning" onClick={() => banUser(commenterInfo.id)}>
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
