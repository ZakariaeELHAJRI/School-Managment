import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card, Image, Button, Modal, Offcanvas, Form, Row, Col
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosConfig';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';


const CourseCard = ({ item, onClasseClick, refresh }) => {
  const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classeData, setClasseData] = useState({
    level_uuid: '',
    teacher_uuid: '',
    name: '',
    image: '',
  });
  const [levels, setLevels] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const fetchLevels = async () => {
    try {
      const response = await axiosInstance.get('/level');
      setLevels(response.data);
    } catch (error) {
      console.error('Error fetching levels:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/teacher');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchLevels();
    fetchTeachers();
  }, []);

  const image = item.image ? item.image : '/images/course/no-picture-available.jpg';

  const handleUpdateClick = () => {
    setClasseData({
      level_uuid: item.level_uuid || '',
      teacher_uuid: item.teacher_uuid || '',
      name: item.name || '',
      image: item.image || '',
    });
    setShowUpdateOffcanvas(true);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleCloseUpdateOffcanvas = () => setShowUpdateOffcanvas(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClasseData({
      ...classeData,
      [name]: value,
    });
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setClasseData({
        ...classeData,
        image: acceptedFiles[0],
      });
    } else {
      setClasseData({
        ...classeData,
        image: null,
      });
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('level_uuid', classeData.level_uuid);
    formData.append('teacher_uuid', classeData.teacher_uuid);
    formData.append('name', classeData.name);
    if (classeData.image instanceof File) {
      formData.append('image', classeData.image);
    }

    try {
      const response = await axiosInstance.put(`/classe/${item.uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      console.log('Class updated:', response.data);
      toast.success('Class updated successfully!');
      setShowUpdateOffcanvas(false);
      refresh();
    } catch (error) {
      console.error('Error updating class:', error.response?.data || error);
      toast.error('Error updating class!');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await axiosInstance.delete(`/classe/${item.uuid}`);
      console.log('Class deleted:', response.data);
      toast.success('Class deleted successfully!');
      setShowDeleteModal(false);
      refresh();
    } catch (error) {
      console.error('Error deleting class:', error.response?.data || error);
      toast.error('Error deleting class!');
    }
  };

  return (
    <>
      <Card className="my-3 card-hover shadow" style={{ width: '100%' }}>
        <div onClick={() => onClasseClick(item)}>
          <Link href="#">
            <Image
              src={image}
              alt={item.name}
              className="card-img-top p-2"
              style={{ height: '160px', objectFit: 'cover' }}
            />
          </Link>
          <Card.Body>
            <h5 className="text-truncate-line-2" style={{ fontSize: '1rem' }}>
              <Link href="#" className="text-inherit">
                {item.name}
              </Link>
            </h5>
            <p className="mb-0" style={{ fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.description}
            </p>
          </Card.Body>
        </div>
        <Card.Footer className="d-flex justify-content-start gap-3 border">
          <Button variant="outline-primary" size="sm" onClick={handleUpdateClick}>
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDeleteClick}>
            Remove
          </Button>
        </Card.Footer>
      </Card>

      {/* Update Class Offcanvas */}
      <Offcanvas show={showUpdateOffcanvas} onHide={handleCloseUpdateOffcanvas} placement="start" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Update Class</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    name="level_uuid"
                    value={classeData.level_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select the Level</option>
                    {levels.map(level => (
                      <option key={level.uuid} value={level.uuid}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Teacher</Form.Label>
                  <Form.Select
                    name="teacher_uuid"
                    value={classeData.teacher_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select the Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.uuid} value={teacher.uuid}>
                        {teacher.firstname} {teacher.lastname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} className="mb-3">
                <Form.Group controlId="formUpdateClassName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter class name"
                    name="name"
                    value={classeData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col xs={12} className="mb-4">
                <h5 className="mb-3">Image</h5>
                <div className="dropzone mt-4 p-4 border-dashed text-center">
                  <DropFiles onFileChange={handleFileChange} />
                </div>
              </Col>
              <Col xs={12}>
                <Button variant="primary" type="submit">Submit</Button>
                <Button onClick={handleCloseUpdateOffcanvas} variant="outline-primary" className="ms-2">Close</Button>
              </Col>
            </Row>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Delete Class Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Class</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {item ? item.name : ''}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteSubmit}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CourseCard;
