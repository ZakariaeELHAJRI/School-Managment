'use client';
import React, { useState, useEffect } from 'react';
import { Col, Row, Tab, Breadcrumb, Button } from 'react-bootstrap';
import InstructorsListItems from './_components/teacher/InstructorsListItems';
import InstructorsGridCard from './_components/teacher/InstructorsGridCard';
import GridListViewButton from '../../../widgets/miscellaneous/GridListViewButton';
import axiosInstance from '../../../api/axiosConfig';
import AddNewTeacherSteps from './_components/AddNewTeacherSteps';
import TeacherModals from './_components/teacher/TeacherModals';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Teachers() {
  const [showAddNewTeacher, setShowAddNewTeacher] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddNewTeacherClick = () => setShowAddNewTeacher(true);
  const handleBackToTeacherListClick = () => setShowAddNewTeacher(false);

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/teacher');
      setTeachers(response.data);
      console.log('Teachers:', response.data);  
      setFilteredTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Failed to fetch teachers');
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleFilterChange = (searchTerm) => {
    const filtered = teachers.filter((teacher) =>
      teacher.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTeachers(filtered);
  };

  const handleShowEdit = (teacher) => {
    setSelectedTeacher(teacher);
    setShowEditModal(true);
  };

  const handleShowDelete = (teacher) => {
    setSelectedTeacher(teacher);
    setShowDeleteModal(true);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    fetchTeachers();
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    fetchTeachers();
  };

  const handleDelete = async () => {
    if (!selectedTeacher) return;

    try {
      await axiosInstance.delete(`/teacher/${selectedTeacher.uuid}`);
      toast.success(`Successfully deleted: ${selectedTeacher.firstname} ${selectedTeacher.lastname}`);
      setShowDeleteModal(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (error) {
      toast.error('Error deleting teacher');
      console.error('Error deleting teacher:', error);
    }
  };

  return (
    <>
      <Tab.Container defaultActiveKey="grid">
        <Row>
          <Col lg={12}>
            <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
              <div className="mb-3 mb-md-0">
                <h1 className="mb-1 h2 fw-bold">Teachers Management</h1>
                <Breadcrumb>
                  <Breadcrumb.Item href="#">Teachers</Breadcrumb.Item>
                  <Breadcrumb.Item active>Teachers Management</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="d-flex gap-1">
                <GridListViewButton keyGrid="grid" keyList="list" />
                {!showAddNewTeacher ? (
                  <Button variant="primary" onClick={handleAddNewTeacherClick}>
                    Add New Teacher
                  </Button>
                ) : (
                  <Button variant="secondary" onClick={handleBackToTeacherListClick}>
                    Back to Teachers List
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {showAddNewTeacher ? (
            <Col lg={12} className="mx-auto">
              <AddNewTeacherSteps
                handleBackToTeacherListClick={handleBackToTeacherListClick}
                fetchTeachers={fetchTeachers}
              />
            </Col>
          ) : (
            <Col lg={12}>
              <Tab.Content>
                <Tab.Pane eventKey="grid">
                  <InstructorsGridCard 
                    teachers={filteredTeachers} 
                    handleShowEdit={handleShowEdit} 
                    handleShowDelete={handleShowDelete} 
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="list">
                  <InstructorsListItems 
                    teachers={filteredTeachers} 
                    handleShowEdit={handleShowEdit} 
                    handleShowDelete={handleShowDelete} 
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          )}
        </Row>
      </Tab.Container>
      <TeacherModals
        selectedTeacher={selectedTeacher}
        setSelectedTeacher={setSelectedTeacher}
        showEditModal={showEditModal}
        handleCloseEdit={handleCloseEdit}
        showDeleteModal={showDeleteModal}
        handleCloseDelete={handleCloseDelete}
        handleDelete={handleDelete}
      />
      <ToastContainer />
    </>
  );
}
