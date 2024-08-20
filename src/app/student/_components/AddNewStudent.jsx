import React, { useState, useEffect } from 'react';
import { Form, Col, Row, Button } from 'react-bootstrap';
import axiosInstance from '../../../../api/axiosConfig';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';
import { toast } from 'react-toastify';

const AddNewStudent = ({ user, next, previous, handleBackToStudentListClick, fetchStudents }) => {
  
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

  const [studentData, setStudentData] = useState({
    enrollment_date: '',
    level_uuid: '',
    classe_uuid: '',
  });
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

  const [classes, setClasses] = useState([]);
  const [levels, setLevels] = useState([]);



  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get('/classe');
        setClasses(response.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    const fetchLevels = async () => {
      try {
        const response = await axiosInstance.get('/level');
        setLevels(response.data);
      } catch (error) {
        console.error('Error fetching levels:', error);
      }
    };

    fetchLevels();
    fetchClasses();
  }, []);




  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name in studentData) {
      setStudentData((prevState) => ({
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

      // Step 2: Create the Student using the newly created user's UUID
      const  studentDataPayload = {
        user_uuid: userUuid,
        ...studentData
      };
      await axiosInstance.post('/student', studentDataPayload , {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.success('Student created successfully');
      handleBackToStudentListClick();
      fetchStudents();
    } catch (error) {
      toast.error('Error creating user or Student');
      console.error('Error creating user or Student:', error);
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
        <Col md={12} sm={12}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="enrollment_date">Enrollment Date</Form.Label>
            <Form.Control
              type="date"
              name="enrollment_date"
              placeholder="Enrollment Date"
              value={studentData.enrollment_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formClasse">
            <Form.Label>Classe</Form.Label>
            <Form.Select
              name="classe_uuid"
              value={studentData.classe_uuid}
              onChange={handleChange}
              required
            >
              <option value="">Select Classe</option>
              {classes.map((classe) => (
                <option key={classe.uuid} value={classe.uuid}>
                  {classe.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6} className="mb-3">
          <Form.Group controlId="formLevel">
            <Form.Label>Level</Form.Label>
            <Form.Select
              name="level_uuid"
              value={studentData.level_uuid}
              onChange={handleChange}
              required
            >
              <option value="">Select Level</option>
              {levels.map((level) => (
                <option key={level.uuid} value={level.uuid}>
                  {level.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col xs={12}>
          <Button variant="primary" type="submit" className="m-1">
            Create Student
          </Button>
          <Button variant="secondary" onClick={previous} className="m-1">
            Previous
          </Button>
          <Button variant="outline-secondary" onClick={handleBackToStudentListClick} className="m-1">
            Cancel
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default AddNewStudent;
