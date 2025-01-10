import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Tab,
  Form,
  Button,
  Table,
  Modal
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("settings");
  const [categories, setCategories] = useState([]);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const [selectedCategoryImage, setSelectedCategoryImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [editModalShow, setEditModalShow] = useState(false);
  const [editCategoryIndex, setEditCategoryIndex] = useState(null);
  const [editCategoryText, setEditCategoryText] = useState("");
  const [editCategoryIcon, setEditCategoryIcon] = useState("");
  const [editSelectedCategoryImage, setEditSelectedCategoryImage] = useState(null);
  const [editPreviewImage, setEditPreviewImage] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const fetchCategories = async () => {
    const token = getToken();
    try {
      const res = await axios.get("http://localhost:8000/business_management/category/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedCategoryImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleEditCategoryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditSelectedCategoryImage(file);
      setEditPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (newCategory.trim()) {
      const token = getToken();
      try {
        const formData = new FormData();
        formData.append("category_name", newCategory.trim());
        if (newCategoryIcon.trim()) formData.append("icon", newCategoryIcon.trim());
        if (selectedCategoryImage) formData.append("category_image", selectedCategoryImage);

        const res = await axios.post(
          "http://localhost:8000/business_management/category/",
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCategories((prev) => [...prev, res.data]);
        setNewCategory("");
        setNewCategoryIcon("");
        setSelectedCategoryImage(null);
        setPreviewImage(null);
      } catch (error) {
        console.error("Error adding category:", error);
      }
    }
  };

  const handleEditCategory = (index) => {
    const cat = categories[index];
    setEditCategoryIndex(index);
    setEditCategoryText(cat.category_name);
    setEditCategoryIcon(cat.icon || "");
    setEditSelectedCategoryImage(null);
    setEditPreviewImage(cat.category_image || null);
    setEditModalShow(true);
  };

  const handleSaveEdit = async () => {
    if (editCategoryText.trim()) {
      const token = getToken();
      try {
        const catId = categories[editCategoryIndex].id;
        const formData = new FormData();
        formData.append("category_name", editCategoryText.trim());
        if (editCategoryIcon.trim()) formData.append("icon", editCategoryIcon.trim());
        if (editSelectedCategoryImage) formData.append("category_image", editSelectedCategoryImage);

        const res = await axios.put(
          `http://localhost:8000/business_management/category/${catId}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const updatedCategories = [...categories];
        updatedCategories[editCategoryIndex] = res.data;
        setCategories(updatedCategories);

        setEditModalShow(false);
        setEditSelectedCategoryImage(null);
        setEditPreviewImage(null);
      } catch (error) {
        console.error("Error updating category:", error);
      }
    }
  };

  const handleDeleteCategory = async (id) => {
    const token = getToken();
    try {
      await axios.delete(`http://localhost:8000/business_management/category/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <Container fluid className="mt-4" dir="rtl">
      <Row>
        <Col md={12}>
          <h2 className="text-center mb-4">صفحه تنظیمات</h2>

          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              <Tab.Pane eventKey="settings">
                <h4>تعریف دسته‌بندی‌ها</h4>
                <Form.Group className="mb-3">
                  <Form.Label>نام دسته‌بندی جدید</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثلاً غذای دریایی"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  />
                </Form.Group>
                {/* <Form.Group className="mb-3">
                  <Form.Label>آیکون دسته‌بندی (اختیاری)</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثلاً 🚗"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                  />
                </Form.Group> */}
                <Form.Group className="mb-3">
                  <Form.Label>تصویر دسته‌بندی (اختیاری)</Form.Label>
                  {previewImage && (
                    <div className="mb-2">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="img-fluid rounded"
                        style={{ maxWidth: "100px"}}
                      />
                    </div>
                  )}
                  <Form.Control type="file" accept="image/*" onChange={handleCategoryImageChange} />
                </Form.Group>
                <Button variant="success" onClick={handleAddCategory}>
                  اضافه کردن
                </Button>

                <Table striped bordered hover className="mt-3 text-center">
                  <thead>
                    <tr>
                      <th>ردیف</th>
                      <th>تصویر</th>
                      <th>نام دسته‌بندی</th>
                      <th>عملیات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, index) => (
                      <tr key={cat.id || index}>
                        <td>{index + 1}</td>
                        <td>
                          {cat.category_image ? (
                            <img
                              src={cat.category_image}
                              alt={cat.category_name}
                              style={{ width: "30px", objectFit: "cover" }}
                            />
                          ) : (
                            "-"
                          )}
                        </td>
                        <td>{cat.category_name}</td>
                        <td>
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => handleEditCategory(index)}
                          >
                            ویرایش
                          </Button>{" "}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteCategory(cat.id)}
                          >
                            حذف  <FontAwesomeIcon icon={faTrash} />
                             
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Col>
      </Row>

      <Modal show={editModalShow} dir="rtl" onHide={() => setEditModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title style={{marginLeft:"65%"}}>ویرایش دسته‌بندی</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>نام دسته‌بندی</Form.Label>
            <Form.Control
              type="text"
              value={editCategoryText}
              onChange={(e) => setEditCategoryText(e.target.value)}
            />
          </Form.Group>
            {/* <Form.Group className="mb-3">
              <Form.Label>آیکون دسته‌بندی (اختیاری)</Form.Label>
              <Form.Control
                type="text"
                placeholder="مثلاً 🚗"
                value={editCategoryIcon}
                onChange={(e) => setEditCategoryIcon(e.target.value)}
              />
            </Form.Group> */}
          <Form.Group className="mb-3">
            <Form.Label>تصویر دسته‌بندی (اختیاری)</Form.Label>
            {editPreviewImage && (
              <div className="mb-2">
                <img
                  src={editPreviewImage}
                  alt="Preview"
                  className="img-fluid rounded"
                  style={{ maxWidth: "100px", height: "auto" }}
                />
              </div>
            )}
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleEditCategoryImageChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-start">
          <Button variant="secondary" onClick={() => setEditModalShow(false)}>
            لغو
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            ذخیره تغییرات
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default SettingsPage;
