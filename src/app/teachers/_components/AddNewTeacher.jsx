import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';
import axiosInstance from '../../../../api/axiosConfig';
import { toast } from 'react-toastify';

const AddNewTeacher = ({ user, previous, handleBackToTeacherListClick, fetchTeachers }) => {
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
  const [userData, setUserData] = useState({
    firstname: user.firstname || '',
    lastname: user.lastname || '',
    username: user.username || '',
    password: user.password || '',
    gender: user.gender || '',
    image: user.image || '',
    birthday: user.birthday || '',
    role_uuid: user.role_uuid || ''
  });

  const [teacherData, setTeacherData] = useState({
    specialization: '',
    salary: '',
    bio: '',
    experience_years: '',
  });


  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name in teacherData) {
      setTeacherData((prevState) => ({
        ...prevState,
        [name]: name === 'image' ? files[0] : value,
      }));
    } else {
      setUserData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Step 1: Create the User
      const userFormData = new FormData();
      userFormData.append('firstname', userData.firstname);
      userFormData.append('lastname', userData.lastname);
      userFormData.append('username', userData.username);
      userFormData.append('password', userData.password);
      userFormData.append('gender', userData.gender)
      userFormData.append('birthday', userData.birthday);
      userFormData.append('role_uuid', userData.role_uuid);
      userFormData.append('image', userData.image);
      const userResponse = await axiosInstance.post('/user', userFormData);
      const userUuid = userResponse.data.uuid;

      // Step 2: Create the Teacher using the newly created user's UUID
      const teacherDataPayload = {
        user_uuid: userUuid,
        specialization: teacherData.specialization,
        salary: teacherData.salary,
        bio: teacherData.bio,
        experience_years: teacherData.experience_years,
      };

      await axiosInstance.post('/teacher', teacherDataPayload , {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Teacher created successfully');
      handleBackToTeacherListClick();
      fetchTeachers();
    } catch (error) {
      toast.error('Error creating user or teacher');
      console.error('Error creating user or teacher:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="firstname">First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstname"
              placeholder="First Name"
              value={userData.firstname}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="lastname">Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={userData.lastname}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="username">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              placeholder="Username"
              value={userData.username}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="password">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Password"
              value={userData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="gender">Gender</Form.Label>
            <Form.Select
              name="gender"
              value={userData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="birthday">Birthday</Form.Label>
            <Form.Control
              type="date"
              name="birthday"
              value={userData.birthday}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
      <Col md={12} className="mb-3">
          <Form.Group controlId="formRole">
            <Form.Label>Role</Form.Label>
            <Form.Select
              name="role_uuid"
              value={user.role_uuid}
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
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="specialization">Specialization</Form.Label>
            <Form.Control
              type="text"
              name="specialization"
              placeholder="Specialization"
              value={teacherData.specialization}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="bio">Bio</Form.Label>
            <Form.Control
              as="textarea"
              name="bio"
              placeholder="Bio"
              value={teacherData.bio}
              onChange={handleChange}
              style={{ height: '100px' }}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="salary">Salary</Form.Label>
            <Form.Control
              type="number"
              name="salary"
              placeholder="Salary"
              value={teacherData.salary}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="experience_years">Experience Years</Form.Label>
            <Form.Control
              type="number"
              name="experience_years"
              placeholder="Experience Years"
              value={teacherData.experience_years}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Button variant="primary" type="submit" className="m-1">
            Create Teacher
          </Button>
          <Button variant="secondary" onClick={previous} className="m-1">
            Previous
          </Button>
          <Button variant="outline-secondary" onClick={handleBackToTeacherListClick} className="m-1">
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewTeacher;
