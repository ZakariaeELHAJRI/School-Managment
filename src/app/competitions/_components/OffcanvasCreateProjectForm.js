import React, { useState, useEffect } from 'react';
import { Col, Row, Form, InputGroup, Button } from 'react-bootstrap';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import { toast } from 'react-toastify';
import axiosInstance from '../../../../api/axiosConfig';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';

const OffcanvasCreateProjectForm = ({ competition, onClick }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
    approvation: '',
  });

  useEffect(() => {
    if (competition) {
      setFormData({
        title: competition.title,
        description: competition.description,
        start_date: competition.start_date,
        end_date: competition.end_date,
        status: competition.status,
        approvation: competition.approvation,
      });
    }
  }, [competition]);

  const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? e.target.checked : value,
    }));
  };

  const handleDateChange = (name, date) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  const handleImageChange = (files) => {
    setFormData((prevState) => ({ ...prevState, image: files[0] }));
    setIsNewImageSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('start_date', formData.start_date);
    submitData.append('end_date', formData.end_date);
    submitData.append('status', formData.status);
    submitData.append('approvation', formData.approvation);

    if (isNewImageSelected && formData.image) {
      submitData.append('image', formData.image);
    }

    try {
      if (competition) {
        await axiosInstance.put(`/competition/${competition.uuid}`, submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Competition updated successfully');
      } else {
        await axiosInstance.post('/competition', submitData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Competition created successfully');
      }

      onClick();
    } catch (error) {
      console.error('Error saving competition:', error);
      toast.error('Error saving competition');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col xs={12} className="mb-3">
          <Form.Group controlId="formCompetitionName">
            <Form.Label>
              Title <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter competition title"
                required
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} className="mb-3">
          <Form.Group controlId="formCompetitionDescription">
            <Form.Label>Description</Form.Label>
            <InputGroup>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description..."
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={12} xs={12} className="mb-3">
          <Form.Group controlId="formCompetitionStartDate">
            <Form.Label>
              Start Date <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Flatpickr
                className="form-control"
                name="start_date"
                value={formData.start_date}
                onChange={(date) => handleDateChange('start_date', date[0])}
                options={{ dateFormat: 'Y-m-d' }}
                placeholder="Select start date"
                required
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={12} xs={12} className="mb-3">
          <Form.Group controlId="formCompetitionEndDate">
            <Form.Label>
              End Date <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Flatpickr
                className="form-control"
                name="end_date"
                value={formData.end_date}
                onChange={(date) => handleDateChange('end_date', date[0])}
                options={{ dateFormat: 'Y-m-d' }}
                placeholder="Select end date"
                required
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} className="mb-3">
          <Form.Group controlId="formCompetitionStatus">
            <Form.Label>
              Status <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Form.Control
                as="select"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="">Select status</option>
                <option value="In Process">In Process</option>
                <option value="Planified">Planified</option>
                <option value="Finished">Finished</option>
              </Form.Control>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col xs={12} className="mb-3">
          <Form.Group controlId="formCompetitionApprovation">
            <Form.Label>
              Approvation <span className="text-danger">*</span>
            </Form.Label>
            <InputGroup>
              <Form.Control
                as="select"
                name="approvation"
                value={formData.approvation}
                onChange={handleChange}
                required
              >
                <option value="">Select approvation</option>
                <option value="true">Approved</option>
                <option value="false">Not Approved</option>
              </Form.Control>
            </InputGroup>
          </Form.Group>
        </Col>
        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          <div className="dropzone mt-4 p-4 border-dashed text-center">
            <DropFiles onFileChange={handleImageChange} />
          </div>
        </Form.Group>
        <Col xs={12} className="d-flex justify-content-start gap-2">
          <Button onClick={onClick} variant="outline-primary">
            Close
          </Button>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default OffcanvasCreateProjectForm;
