import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Button, InputGroup } from 'react-bootstrap';
import axiosInstance from '../../../api/axiosConfig';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';

const AddNewUser = ({ data, handleChange, next }) => {
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axiosInstance.get('/role');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchRoles();
  }, []);

  const handleFileChange = (files) => {
    handleChange({
      target: {
        name: 'image',
        value: files[0],
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    next(); // Proceed to the next step
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formFirstname">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              placeholder="Enter first name"
              value={data.firstname}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formLastname">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              placeholder="Enter last name"
              value={data.lastname}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Enter username"
              value={data.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Enter password"
              value={data.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formBirthday">
            <Form.Label>Birthday</Form.Label>
            <InputGroup>
              <Form.Control
                type="date"
                name="birthday"
                value={data.birthday}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formGender">
            <Form.Label>Gender</Form.Label>
            <Form.Select
              name="gender"
              value={data.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role_uuid"
              value={data.role_uuid}
              onChange={handleChange}
              required
            >
              <option value="">Select role</option>
              {roles.map((role) => (
                <option key={role.uuid} value={role.uuid}>
                  {role.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mb-3">
          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form className="dropzone mt-4 p-4 border-dashed text-center">
              <DropFiles onFileChange={handleFileChange} />
            </Form>
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Button variant="primary" type="submit" className="m-1">
            Next
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewUser;
