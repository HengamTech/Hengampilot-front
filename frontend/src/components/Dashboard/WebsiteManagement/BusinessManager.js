// src/components/BusinessManager.js
import React, { useState } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';

const BusinessManager = () => {
  const [businesses, setBusinesses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState({ id: null, name: '', description: '' });

  const handleClose = () => {
    setShowModal(false);
    setCurrentBusiness({ id: null, name: '', description: '' });
  };
  const handleShow = () => setShowModal(true);

  const handleChange = (e) => {
    setCurrentBusiness({ ...currentBusiness, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentBusiness.id) {
      // ویرایش بیزنس
      setBusinesses(businesses.map(biz => biz.id === currentBusiness.id ? currentBusiness : biz));
    } else {
      // اضافه کردن بیزنس جدید
      setBusinesses([...businesses, { ...currentBusiness, id: Date.now() }]);
    }
    handleClose();
  };

  const handleEdit = (biz) => {
    setCurrentBusiness(biz);
    handleShow();
  };
  const handleGoToCommentPage = () => {
    const userId = userData.id; // فرض بر این است که شناسه کاربر در داده‌ها وجود دارد
    navigate(`/submit/${userId}`); // انتقال به صفحه ثبت نظر
};
  const handleDelete = (id) => {
    if (window.confirm('آیا از حذف این بیزنس اطمینان دارید؟')) {
      setBusinesses(businesses.filter(biz => biz.id !== id));
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">مدیریت بیزنس‌ها</h2>
      <Button variant="primary" onClick={handleShow} className="mb-4">
        اضافه کردن بیزنس ها
      </Button>

      {businesses.length > 0 ? (
        <Table striped bordered hover className="text-center">
          <thead>
            <tr>
              <th>شناسه</th>
              <th>نوع دسته بندی</th>
              <th>نام بیزنس</th>
              <th>توضیحات</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz, index) => (
              <tr key={biz.id}>
                <td>{index + 1}</td>
                <td>{biz.catagory}</td>
                <td>{biz.name}</td>
                <td>{biz.description}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(biz)}>
                    ویرایش
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(biz.id)}>
                    حذف
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>هیچ بیزنسی ثبت نشده است.</p>
      )}

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentBusiness.id ? 'ویرایش بیزنس' : 'اضافه کردن بیزنس'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group controlId="formBusinessName" className="mb-3">
              <Form.Label>نام بیزنس</Form.Label>
              <Form.Control
                type="text"
                placeholder="نام بیزنس را وارد کنید"
                name="name"
                value={currentBusiness.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBusinessDescription">
              <Form.Label>توضیحات</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="توضیحات بیزنس را وارد کنید"
                name="description"
                value={currentBusiness.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              بستن
            </Button>
            <Button variant="primary" type="submit">
              {currentBusiness.id ? 'ذخیره تغییرات' : 'اضافه کردن'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default BusinessManager;
