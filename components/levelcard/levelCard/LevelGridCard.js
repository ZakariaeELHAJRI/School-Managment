import React, { useState } from 'react';
import Link from 'next/link';
import {
   Card, Image, Dropdown, Modal, Offcanvas, Form, Button,
  Row, Col
  } from 'react-bootstrap';
import axiosInstance from '../../../api/axiosConfig';
import styles from './LevelGridCard.module.css';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';
import { toast } from 'react-toastify';


const LevelGridCard = ({ item, onLevelClick, refresh }) => {
  const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [updateLevelData, setUpdateLevelData] = useState({ name: '', description: '', image: '' });

  // const image = item.image ? item.image: '/images/course/no-picture-available.jpg';

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="btn-icon btn btn-ghost btn-sm rounded-circle">
      {children}
    </Link>
  ));
  CustomToggle.displayName = 'CustomToggle';

  const handleUpdateLevel = () => {
    setUpdateLevelData(item);
    setShowUpdateOffcanvas(true);
  };

  const handleDeleteLevel = () => {
    setShowDeleteModal(true);
  };

  const handleCloseUpdateOffcanvas = () => setShowUpdateOffcanvas(false);
  const handleCloseDeleteModal = () => setShowDeleteModal(false);

  const handleUpdateFileChange = (files) => {
    setUpdateLevelData((prevState) => ({ ...prevState, image: files[0] }));
  };

  const handleUpdateChange = (e) => {
    const { name, value, files } = e.target;
    setUpdateLevelData((prevState) => ({
      ...prevState,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
  
    // Convert form data to URL-encoded string
    const formData = new URLSearchParams();
    formData.append('name', updateLevelData.name);
    formData.append('description', updateLevelData.description);
    if (updateLevelData.image) formData.append('image', updateLevelData.image);
  
    // Display the form data
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
  
    const updateLevel = async () => {
      try {
        const response = await axiosInstance.put(`/levels/${item.id}`, formData.toString(), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.log(response.data);
        toast.success('Level updated successfully!');
        setShowUpdateOffcanvas(false);
        refresh();
      } catch (error) {
        toast.error('Error updating level!');
      }
    };
  
    updateLevel();
  };
  

  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`/levels/${item.id}`);
      toast.success('Level deleted successfully!');
      setShowDeleteModal(false);
      refresh();
    } catch (error) {
      toast.error('Error deleting level!');
    }
  };

  const ActionMenu = () => (
    <Dropdown as="span">
      <Dropdown.Toggle as={CustomToggle}>
        <i className="fe fe-more-horizontal fs-4"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu align="start">
        <Dropdown.Header>SETTINGS</Dropdown.Header>
        <Dropdown.Item eventKey="1" onClick={handleDeleteLevel}>
          <i className="fe fe-trash-2 dropdown-item-icon"></i>Remove
        </Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={handleUpdateLevel}>
          <i className="fe fe-edit dropdown-item-icon"></i>Edit
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <>
      <Card className={`my-3 profile-card ${styles.card}`}>
        <Card.Body className="d-flex justify-content-between align-items-center  ">
          <div className="d-flex align-items-center cursor-pointer" onClick={() => onLevelClick(item)}>
            <div className={`avatar avatar-lg mx-2 ${styles.avatar}`}>
              <Image src={image} className="rounded" alt="" />
            </div>
            <div className={`ms-3 ${styles.details}`}>
              <h4 className={`mb-0 ${styles.title}`}>
                <Link href="#" className="text-inherit" onClick={(e) => e.preventDefault()}>
                  {item.name}
                </Link>
              </h4>
              <p className={`mb-0 text-muted ${styles.description}`}>{item.description}</p>
            </div>
          </div>
          <div className="">
            <ActionMenu />
          </div>
        </Card.Body>
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
                    value={updateLevelData.name}
                    onChange={handleUpdateChange}
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
                    value={updateLevelData.description}
                    onChange={handleUpdateChange}
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="mb-4">
                <h5 className="mb-3">Image </h5>
                <div className="dropzone mt-4 p-4 border-dashed text-center">
                  <DropFiles onFileChange={handleUpdateFileChange} />
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
          Are you sure you want to delete{' '}
          {item ? item.name : ''}?
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

export default LevelGridCard;
