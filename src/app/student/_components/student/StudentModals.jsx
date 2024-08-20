import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../../../../api/axiosConfig';
import DeleteModal from '@/components/DeleteModal/DeleteModal';

const StudentModals = ({
  selectedStudent,
  setSelectedStudent,
  showEditModal,
  handleCloseEdit,
  showDeleteModal,
  handleCloseDelete,
  handleDelete
}) => {
  const [studentData, setStudentData] = useState({
    user_uuid: '',
    classe_uuid: '',
    firstname: '',
    lastname: ''
  });
  const [originalData, setOriginalData] = useState(null);
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [levels, setLevels] = useState([]);



  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/user');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

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




    fetchUsers();
    fetchClasses();
    fetchLevels();
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const { user_uuid, classe_uuid, firstname, lastname } = selectedStudent;
      setStudentData({ user_uuid, classe_uuid, firstname, lastname });
      setOriginalData({ user_uuid, classe_uuid, firstname, lastname });
    }
  }, [selectedStudent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData({ ...studentData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userUpdateNeeded =
      studentData.firstname !== originalData.firstname ||
      studentData.lastname !== originalData.lastname;

    const studentUpdateNeeded =
      studentData.classe_uuid !== originalData.classe_uuid ||
      studentData.level_id !== originalData.level_id;

    if (userUpdateNeeded || studentUpdateNeeded) {
      try {
        if (userUpdateNeeded) {
          const formData = new FormData();
          formData.append('firstname', studentData.firstname);
          formData.append('lastname', studentData.lastname);
          await axiosInstance.put(`/user/${studentData.user_uuid}`, formData , {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
          );
        }

        if (studentUpdateNeeded) {
          const studentDataUpdate = {
            classe_uuid: studentData.classe_uuid,
            level_id: studentData.level_id,
          };
          await axiosInstance.put(`/student/${selectedStudent.uuid}`, studentDataUpdate);
        }

        handleCloseEdit();
        setSelectedStudent(null);
        console.log('Student and/or user updated successfully');
      } catch (error) {
        console.error('Error updating student and/or user:', error);
      }
    }
  };

  return (
    <>
      <Modal show={showEditModal} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>


              <Col md={12} className="mb-3">
                <Form.Group controlId="formLevel">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    name="level_id"
                    value={studentData.level_id}
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
              <Col md={12} className="mb-3">
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
              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="firstname">First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstname"
                    placeholder="First Name"
                    value={studentData.firstname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="lastname">Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastname"
                    placeholder="Last Name"
                    value={studentData.lastname}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col xs={12}>
                <Button variant="primary" type="submit" className="m-1">
                  Update Student
                </Button>
                <Button variant="outline-secondary" onClick={handleCloseEdit} className="m-1">
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

      <DeleteModal
        show={showDeleteModal}
        handleClose={handleCloseDelete}
        handleDelete={handleDelete}
        itemName={selectedStudent ? `${selectedStudent.firstname} ${selectedStudent.lastname}` : ''}
      />
    </>
  );
};

export default StudentModals;
