'use client';
import React, { useState, useEffect } from 'react';
import { Col, Row, Card, Tab, Breadcrumb, Button } from 'react-bootstrap';
import InstructorsListItems from './_components/student/InstructorsListItems';
import InstructorsGridCard from './_components/student/InstructorsGridCard';
import GridListViewButton from '../../../widgets/miscellaneous/GridListViewButton';
import axiosInstance from '../../../api/axiosConfig';
import AddNewStudentSteps from './_components/AddNewStudentSteps';
import StudentModals from './_components/student/StudentModals';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Students() {
  const [showAddNewStudent, setShowAddNewStudent] = useState(false);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleAddNewStudentClick = () => {
    setShowAddNewStudent(true);
  };

  const handleBackToStudentListClick = () => {
    setShowAddNewStudent(false);
  };


  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/student');
      const studentsData = response.data;
  
      console.log('Fetched students data:', studentsData);
  
  
      setStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };
  
  
  useEffect(() => {
    fetchStudents();
  }, [showEditModal , showDeleteModal]);

  const handleFilterChange = (searchTerm) => {
    const filtered = students.filter((student) =>
      student.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastname.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleShowEdit = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleShowDelete = (student) => {
    setSelectedStudent(student);
    setShowDeleteModal(true);
  };

  const handleCloseEdit = () => {
    fetchStudents();
    setShowEditModal(false);
  }
  const handleCloseDelete = () => {
    fetchStudents();
    setShowDeleteModal(false);
  }

  const handleDelete = () => {
    console.log('delete clicked');
    try {
      axiosInstance.delete(`/student/${selectedStudent.uuid}`);
      handleCloseDelete();
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  return (
    <>
      <Tab.Container defaultActiveKey="grid">
        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
              <div className="mb-3 mb-md-0">
                <h1 className="mb-1 h2 fw-bold">Students Management</h1>
                <Breadcrumb>
                  <Breadcrumb.Item href="#">Students</Breadcrumb.Item>
                  <Breadcrumb.Item active>Students Management</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              <div className="d-flex gap-1">
                <GridListViewButton keyGrid="grid" keyList="list" />
                {!showAddNewStudent ? (
                  <Button variant="primary" className="btn-icon-end" onClick={handleAddNewStudentClick}>
                    <span className="text-white">Add New Student</span>
                  </Button>
                ) : (
                  <Button variant="secondary" className="btn-icon-start" onClick={handleBackToStudentListClick}>
                    <span className="text-white">Back to Students List</span>
                  </Button>
                )}
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          {showAddNewStudent ? (
            <Col lg={12} md={12} sm={12} className="mx-auto">
              <AddNewStudentSteps handleBackToStudentListClick={handleBackToStudentListClick} fetchStudents={fetchStudents} />
            </Col>
          ) : (
            students && (
              <Col lg={12} md={12} sm={12}>
                <Tab.Content>
                  <Tab.Pane eventKey="grid" className="pb-4">
                    <InstructorsGridCard 
                      students={filteredStudents} 
                      handleShowEdit={handleShowEdit} 
                      handleShowDelete={handleShowDelete} 
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="list" className="pb-4">
                    <Card className="mb-5">
                      <Card.Body className="p-0">
                        <InstructorsListItems 
                          students={filteredStudents} 
                          handleShowEdit={handleShowEdit} 
                          handleShowDelete={handleShowDelete} 
                        />
                      </Card.Body>
                    </Card>
                  </Tab.Pane>
                </Tab.Content>
              </Col>
            )
          )}
        </Row>
      </Tab.Container>
      <StudentModals 
        selectedStudent={selectedStudent} 
        setSelectedStudent={setSelectedStudent} 
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
