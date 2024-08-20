// AddLevel.js
import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';
import axiosInstance from '../../../../api/axiosConfig';

export default function AddLevel({ setRefresh, handleCloseOffcanvas }) {
  const [newData, setNewData] = useState({ name: '', description: '', image: '' });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNewData((prevState) => ({
      ...prevState,
      [name]: name === 'image' ? files[0] : value
    }));
  };

  const handleFileChange = (files) => {
    setNewData((prevState) => ({ ...prevState, image: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newData.name);
    formData.append('description', newData.description);
    formData.append('image', newData.image);
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    try {
      await axiosInstance.post('/level', formData )
      toast.success('Level created successfully!');
      setRefresh(prev => !prev);
      handleCloseOffcanvas();
    } catch (error) {
      toast.error('Error creating level!', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col xs={12} className="mb-3">
          <Form.Group controlId="formLevelName">
            <Form.Label>Name <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter level name"
              name="name"
              value={newData.name}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>

        <Col xs={12} className="mb-3">
          <Form.Group controlId="formLevelDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter brief about level..."
              name="description"
              value={newData.description}
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
          <Button onClick={handleCloseOffcanvas} variant="outline-primary" className="ms-2">Close</Button>
        </Col>
      </Row>
    </Form>
  );
}
