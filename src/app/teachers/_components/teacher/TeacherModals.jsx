import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../../../../api/axiosConfig';
import { DropFiles } from '../../../../../widgets/dropfiles/DropFiles';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import { toast } from 'react-toastify';

const TeacherModals = ({
  selectedTeacher,
  setSelectedTeacher,
  showEditModal,
  handleCloseEdit,
  showDeleteModal,
  handleCloseDelete,
  handleDelete,
}) => {
  const [teacherData, setTeacherData] = useState({
    user_uuid: '',
    specialization: '',
    salary: '',
    bio: '',
    experience_years: '',
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/user');
        setUsers(response.data); // Adjust to fit the structure of your API response
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedTeacher) {
      setTeacherData({
        user_uuid: selectedTeacher.user_uuid,
        specialization: selectedTeacher.specialization,
        salary: selectedTeacher.salary,
        bio: selectedTeacher.bio,
        experience_years: selectedTeacher.experience_years,
      });
    }
  }, [selectedTeacher]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTeacherData({ ...teacherData, [name]: value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedTeacher = {
        specialization: teacherData.specialization,
        salary: teacherData.salary,
        bio: teacherData.bio,
        experience_years: teacherData.experience_years,
      };

      await axiosInstance.put(`/teacher/${selectedTeacher.uuid}`, updatedTeacher);

      toast.success('Teacher updated successfully');
      handleCloseEdit();
      setSelectedTeacher(null);
    } catch (error) {
      toast.error('Error updating teacher');
      console.error('Error updating teacher:', error);
    }
  };

  return (
    <>
      <Modal show={showEditModal} onHide={handleCloseEdit} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Update Teacher</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={12} className="mb-3">
                <Form.Group controlId="formRole">
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    name="user_uuid"
                    value={teacherData.user_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select User</option>
                    {users.map((user) => (
                      <option key={user.uuid} value={user.uuid}>
                        {user.firstname} {user.lastname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={12} sm={12}>
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
              <Col md={12} sm={12}>
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
              <Col md={6} sm={12}>
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
              <Col md={6} sm={12}>
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
                  Update Teacher
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
        itemName={selectedTeacher ? `${selectedTeacher.firstname} ${selectedTeacher.lastname}` : ''}
      />
    </>
  );
};

export default TeacherModals;
