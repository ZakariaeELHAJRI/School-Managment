// Levels.js
'use client';

import React, { useState } from 'react';
import { Col, Row, Breadcrumb, Offcanvas, Button } from 'react-bootstrap';
import LevelsGrid from '../../../components/levelcard/levelCard/LevelGrid';
import ClasseGrid from '../../../components/levelcard/classeCard/ClasseGrid';
import SubjectGrid from '../../../components/levelcard/subjectCard/SubjectGrid';
import CourseSubject from '../../../components/levelcard/courseCard/courseSubject';
import { ToastContainer } from 'react-toastify';

export default function Levels() {
  const [breadcrumbItems, setBreadcrumbItems] = useState(['Levels', 'Levels']);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedClasse, setSelectedClasse] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setBreadcrumbItems(['Levels', level.name, 'Classes']);
  };

  const handleClasseClick = (classe) => {
    setSelectedClasse(classe);
    setBreadcrumbItems(['Levels', selectedLevel.name, 'Classes', classe.name, 'Subjects']);
  };

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject);
    setBreadcrumbItems(['Levels', selectedLevel.name, 'Classes', selectedClasse.name, 'Subjects', subject.name, 'Courses']);
  };

  const handleCourseClick = (course) => {
    setSelectedCourse(course);
    setBreadcrumbItems(['Levels', selectedLevel.name, 'Classes', selectedClasse.name, 'Subjects', selectedSubject.name, 'Courses', course.name]);
  };

  const handleBackClick = () => {
    if (selectedCourse) {
      setSelectedCourse(null);
      setBreadcrumbItems(breadcrumbItems.slice(0, -1));
    } else if (selectedSubject) {
      setSelectedSubject(null);
      setBreadcrumbItems(breadcrumbItems.slice(0, -2));
    } else if (selectedClasse) {
      setSelectedClasse(null);
      setBreadcrumbItems(breadcrumbItems.slice(0, -2));
    } else if (selectedLevel) {
      setSelectedLevel(null);
      setBreadcrumbItems(['Levels', 'Levels']);
    }
  };

  const handleAdd = () => {
    setShowOffcanvas(true);
  };

  const handleCloseOffcanvas = () => {
    setShowOffcanvas(false);
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">
                {breadcrumbItems[breadcrumbItems.length - 1]}
              </h1>
              <Breadcrumb>
                {breadcrumbItems.map((item, index) => (
                  <Breadcrumb.Item key={index} active={index === breadcrumbItems.length - 1}>
                    {item}
                  </Breadcrumb.Item>
                ))}
              </Breadcrumb>
            </div>
            <div className="d-flex align-items-center">
              {breadcrumbItems.length > 2 && (
                <button onClick={handleBackClick} className="btn btn-outline-secondary">Back</button>
              )}
              {/* {breadcrumbItems.length > 2 && !showNewCourse && (
                    <Button onClick={handleBackClick} className="btn btn-outline-secondary">Back</Button>
                )} */}
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        {!selectedLevel && <LevelsGrid onLevelClick={handleLevelClick} />}
        {selectedLevel && !selectedClasse && <ClasseGrid levelId={selectedLevel.uuid} onClasseClick={handleClasseClick} />}
        {selectedClasse && !selectedSubject && <SubjectGrid classeId={selectedClasse.uuid} onSelectSubject={handleSubjectClick} />}
        {selectedSubject && <CourseSubject subjectId={selectedSubject} onCourseClick={handleCourseClick} />}
      </Row>

      <ToastContainer />
    </>
  );
}
