import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Card, Image, Button, Modal, Offcanvas, Form, Row, Col
} from 'react-bootstrap';
import { toast } from 'react-toastify';
import axiosInstance from '../../../api/axiosConfig';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';



const LevelCard = ({ item, onLevelClick, setRefresh }) => {
  const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [levelData, setLevelData] = useState({ name: '', description: '', image: '' });


  const handleUpdateClick = () => {
    setLevelData(item);
    setShowUpdateOffcanvas(true);
  };

  const handleDeleteClick = () => setShowDeleteModal(true);

  const handleCloseUpdateOffcanvas = () => setShowUpdateOffcanvas(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleFileChange = (files) => {
    setLevelData((prevState) => ({ ...prevState, image: files[0] }));
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setLevelData((prevState) => ({
      ...prevState,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    
    const formData = new FormData();
    formData.append('name', levelData.name);
    formData.append('description', levelData.description);
    if (levelData.image && typeof levelData.image === 'object') {
      formData.append('image', levelData.image);
    }

    // Display the form data for debugging
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      const response = await axiosInstance.put(`/level/${item.uuid}`, formData);
      console.log('Level updated:', response.data);

      setRefresh((prev) => !prev);  // Trigger refresh
      toast.success('Level updated successfully!');
      setShowUpdateOffcanvas(false);
    } catch (error) {
      console.error('Error updating level:', error);
      toast.error('Error updating level!');
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await axiosInstance.delete(`/level/${item.uuid}`);
      console.log('Level deleted:', response.data);
      setShowDeleteModal(false);
      setRefresh((prev) => !prev);  // Trigger refresh
      toast.success('Level deleted successfully!');
    } catch (error) {
      console.error('Error deleting level:', error);
      toast.error('Error deleting level!');
    }
  };

  return (
    <>
      <Card className="my-3 card-hover shadow" style={{ width: '100%' }}>
        <div onClick={() => onLevelClick(item)}>
          <Link href="#">
            <Image
              src={item.image_url}
              alt={item.name}
              className="card-img-top p-2"
              style={{ height: '160px', objectFit: 'cover' }}
            />
          </Link>
          {/* Card body */}
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

        {/* Card Footer */}
        <Card.Footer className="d-flex justify-content-start gap-3 border">
          <Button variant="outline-primary" size="sm" onClick={handleUpdateClick}>
            Edit
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleDeleteClick}>
            Remove
          </Button>
        </Card.Footer>
      </Card>

      {/* Update Level Offcanvas */}
      <Offcanvas show={showUpdateOffcanvas} onHide={handleCloseUpdateOffcanvas} placement="start" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Update Level</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <Form onSubmit={handleUpdateSubmit}>
            <Row>
              <Col xs={12} className="mb-3">
                <Form.Group controlId="formUpdateLevelName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter level name"
                    name="name"
                    value={levelData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="mb-3">
                <Form.Group controlId="formUpdateLevelDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter brief about level..."
                    name="description"
                    value={levelData.description}
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

      {/* Delete Level Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Level</Modal.Title>
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

export default LevelCard;
