'use client';
import React, { useState } from 'react';
import { Col, Row, Card, Tab, Breadcrumb, Button } from 'react-bootstrap';


import InstructorsListItems from './_components/student/InstructorsListItems';
import InstructorsGridCard from './_components/student/InstructorsGridCard';
import GridListViewButton from '../../../widgets/miscellaneous/GridListViewButton';
import AddNewStudent from './_components/AddNewStudent';
export default function students() {
  const [showAddNewStudent, setShowAddNewStudent] = useState(false);
  const handleAddNewStudentClick = () => {
    setShowAddNewStudent(true);
  };

  const handleBackToStudentListClick = () => {
    setShowAddNewStudent(false);
  }


  const data2 = {
    title: 'Instructor',
    breadcrumbs: [
      { label: 'Dashboard', href: '/' },
      { label: 'User', href: '/user' },
      { label: 'Instructor' },
    ],
    viewToggle: true,
  };
  return (
    <>
      <Tab.Container defaultActiveKey="grid">

        <Row>
          <Col lg={12} md={12} sm={12}>
            <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
              <div className="mb-3 mb-md-0">
                <h1 className="mb-1 h2 fw-bold">
                  Students Managment
                </h1>
                <Breadcrumb>
                  <Breadcrumb.Item href="#">Students</Breadcrumb.Item>
                  <Breadcrumb.Item active>Students Managment</Breadcrumb.Item>
                </Breadcrumb>
              </div>
              {!showAddNewStudent ? (
                <div className='d-flex gap-1'>

                  <GridListViewButton keyGrid="grid" keyList="list" />
                  <Button variant="primary" className="btn-icon-end" onClick={handleAddNewStudentClick}>
                    <span className='text-white'>Add New Student</span>
                  </Button>
                </div>
              ) : (
                <Button variant="secondary" className="btn-icon-start" onClick={handleBackToStudentListClick}>
                  <span className='text-white'>Back to Students List</span>
                </Button>
              )}
            </div>
          </Col>
        </Row>
        {showAddNewStudent ? (

          <Col lg={11} md={11} sm={11} className="mx-auto">
            <AddNewStudent />
          </Col>
        ) : (
          <Tab.Content>
            <Tab.Pane eventKey="grid" className="pb-4">
              <InstructorsGridCard />
            </Tab.Pane>
            <Tab.Pane eventKey="list" className="pb-4">
              <Card className="mb-5 ">
                <Card.Body className="p-0">
                  <InstructorsListItems />
                </Card.Body>
              </Card>
            </Tab.Pane>
          </Tab.Content>
        )}
      </Tab.Container>
    </>
  )
}
