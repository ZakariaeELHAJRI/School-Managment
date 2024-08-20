import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, Image, Button, Modal, Offcanvas, Form, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosConfig';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

const SubjectCard = ({ item, onSelectSubject, fetchSubjects }) => {
  const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subjectData, setSubjectData] = useState({
    classe_uuid: item.classe_uuid || '',
    teacher_uuid: item.teacher_uuid || '',
    name: item.name || '',
    description: item.description || '',
    image: null,
    approvation: item.approvation || false,
  });
  
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const fetchClasses = async () => {
    try {
      const response = await axiosInstance.get('/classe');
      setClasses(response.data);
    } catch (error) {
      toast.error('Error fetching classes!');
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/teacher');
      setTeachers(response.data);
    } catch (error) {
      toast.error('Error fetching teachers!');
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, []);

  const image = item.image ? item.image : '/images/course/no-picture-available.jpg';

  const handleUpdateClick = () => {
    setSubjectData({
      ...subjectData,
      classe_uuid: item.classe_uuid || '',
      teacher_uuid: item.teacher_uuid || '',
      name: item.name || '',
      description: item.description || '',
      image: item.image,  // Ensure that the image is handled separately
      approvation: item.approvation || false,
    });
    setShowUpdateOffcanvas(true);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleCloseUpdateOffcanvas = () => setShowUpdateOffcanvas(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubjectData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSubjectData((prevState) => ({
        ...prevState,
        image: acceptedFiles[0],
      }));
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('classe_uuid', subjectData.classe_uuid);
    formData.append('teacher_uuid', subjectData.teacher_uuid);
    formData.append('name', subjectData.name);
    formData.append('description', subjectData.description);
    formData.append('approvation', subjectData.approvation);
    if (subjectData.image instanceof File) {
      formData.append('image', subjectData.image);
    }

    try {
      await axiosInstance.put(`/subject/${item.uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Subject updated successfully!');
      fetchSubjects();  // Refresh subjects after update
      setShowUpdateOffcanvas(false);
    } catch (error) {
      toast.error('Error updating subject!');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`/subject/${item.uuid}`);
      toast.success('Subject deleted successfully!');
      fetchSubjects();  // Refresh subjects after delete
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Error deleting subject!');
    }
  };

  return (
    <>
      <Card className="my-3 card-hover shadow" style={{ width: '100%' }}>
        <div onClick={() => onSelectSubject(item.uuid)}>
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

      {/* Update Subject Offcanvas */}
      <Offcanvas show={showUpdateOffcanvas} onHide={handleCloseUpdateOffcanvas} placement="start" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Update Subject</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Classe</Form.Label>
                  <Form.Select
                    name="classe_uuid"
                    value={subjectData.classe_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select the Classe</option>
                    {classes.map(classe => (
                      <option key={classe.uuid} value={classe.uuid}>
                        {classe.name}
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
                    value={subjectData.teacher_uuid}
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
                <Form.Group controlId="formUpdateSubjectName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject name"
                    name="name"
                    value={subjectData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="mb-3">
                <Form.Group controlId="formUpdateSubjectDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter brief about subject..."
                    name="description"
                    value={subjectData.description}
                    onChange={handleChange}
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

      {/* Delete Subject Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Subject</Modal.Title>
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

export default SubjectCard;
