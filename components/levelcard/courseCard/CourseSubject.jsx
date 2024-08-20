import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Card, Col, Image, Dropdown, Modal, Offcanvas, Form, Button, Row, Tooltip, OverlayTrigger
} from 'react-bootstrap';

import axiosInstance from '../../../api/axiosConfig';
import Link from 'next/link';
import { MoreVertical, Edit, Trash } from 'react-feather';

import { toast } from 'react-toastify';
import TanstackTable from './TanstackTableCourse';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';
import Dashboard from '@/app/levels/_components/CoursesDashboard';

const CourseSubject = ({ subjectId }) => {
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [selectedCourseRow, setSelectedCourseRow] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateOffcanvas, setShowUpdateOffcanvas] = useState(false);
  const [showCreateOffcanvas, setShowCreateOffcanvas] = useState(false);
  const [isActive, setIsActive] = useState(false); // Separate state for the checkbox
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    subject_uuid: subjectId,
    teacher_uuid: '',
    approvation: false,
    image: ''
  });
  const [initialCourseData, setInitialCourseData] = useState({});

  useEffect(() => {
    fetchCourses();
    fetchSubjects();
    fetchTeachers();
  }, [subjectId]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/course/subject/${subjectId}`);
      setCourses(response.data);
    } catch (error) {
      toast.error('Error fetching courses!');
    }
  }, [subjectId]);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/subject');
      setSubjects(response.data);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      toast.error('Error fetching subjects!');
    }
  }, []);

  const fetchTeachers = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/teacher');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast.error('Error fetching teachers!');
    }
  }, []);

  const handleDeleteSubmit = async () => {
    try {
      await axiosInstance.delete(`/course/${courseData.uuid}`);
      toast.success('Course deleted successfully!');
      setShowDeleteModal(false);
      setCourses(courses.filter(course => course.uuid !== courseData.uuid));
    } catch (error) {
      toast.error('Error deleting course!');
    }
  };

  const handleFileChange = (files) => {
    setCourseData((prevState) => ({ ...prevState, image: files[0] }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setIsActive(checked);
    setCourseData((prevState) => ({ ...prevState, approvation: checked }));
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setCourseData((prevState) => ({
      ...prevState,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append only the changed fields to the FormData
    Object.keys(courseData).forEach((key) => {
      if (courseData[key] !== initialCourseData[key]) {
        formData.append(key, courseData[key]);
      }
    });

    // Append the `isActive` state to the FormData
    formData.append('approvation', isActive);

    // display the FormData in the console
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }

    try {
      await axiosInstance.put(`/course/${courseData.uuid}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Course updated successfully!');
      setShowUpdateOffcanvas(false);
      fetchCourses(); // Refresh courses data
    } catch (error) {
      toast.error('Error updating course!');
    }
  };

  const handleOpenUpdateOffcanvas = (course) => {
    setCourseData(course);
    setInitialCourseData(course);
    setIsActive(course.approvation); // Set the initial state of the checkbox
    setShowUpdateOffcanvas(true);
  };

  const handleRowClick = useCallback((course) => {
    setSelectedCourseRow(course);
  }, []);

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="btn-icon btn btn-ghost btn-sm rounded-circle">
      {children}
    </Link>
  ));
  CustomToggle.displayName = 'CustomToggle';

  const ActionMenu = ({ course }) => {
    const handleMenuClick = (e, action) => {
      e.stopPropagation(); // Stop the click event from propagating to the row
      if (action === 'edit') {
        handleOpenUpdateOffcanvas(course);
      } else if (action === 'delete') {
        setCourseData(course);
        setShowDeleteModal(true);
      }
    };

    return (
      <Dropdown className="action-menu">
        <Dropdown.Toggle as={CustomToggle}>
          <MoreVertical size="15px" className="text-secondary" />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Header>SETTINGS</Dropdown.Header>
          <Dropdown.Item eventKey="1" onClick={(e) => handleMenuClick(e, 'edit')}>
            <Edit size="15px" className="dropdown-item-icon" /> Edit
          </Dropdown.Item>
          <Dropdown.Item eventKey="2" onClick={(e) => handleMenuClick(e, 'delete')}>
            <Trash size="15px" className="dropdown-item-icon" /> Delete
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const truncateText = useCallback((text, length = 50) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  }, []);

  const columns = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    return [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ getValue }) => {
          const imageUrl = getValue() || '/images/course/no-picture-available.jpg';
          return <Image src={imageUrl} alt="" className="img-4by3-lg rounded m-2" />;
        }
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ getValue }) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{getValue()}</Tooltip>}
          >
            <span>{truncateText(getValue())}</span>
          </OverlayTrigger>
        )
      },
      {
        accessorKey: 'subject_uuid',
        header: 'Subject',
        cell: ({ getValue }) => {
          const subject = subjects.find(subject => subject.uuid === getValue());
          return <span>{subject ? subject.name : 'Unknown Subject'}</span>;
        }
      },
      {
        accessorKey: 'teacher_uuid',
        header: 'Teacher',
        cell: ({ getValue }) => {
          const teacher = teachers.find(teacher => teacher.uuid === getValue());
          return <span>{teacher ? `${teacher.firstname} ${teacher.lastname}` : 'Unknown Teacher'}</span>;
        }
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => (
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{getValue()}</Tooltip>}
          >
            <span>{truncateText(getValue())}</span>
          </OverlayTrigger>
        )
      },
      {
        accessorKey: 'approvation',
        header: 'Is Active',
        cell: ({ getValue }) => (
          <span>{getValue() ? 'Active' : 'Inactive'}</span>
        )
      },
      {
        accessorKey: 'created_at',
        header: 'Added On',
        cell: ({ getValue }) => (
          <span>{new Date(getValue()).toLocaleDateString()}</span>
        )
      },
      {
        accessorKey: 'actionmenu',
        header: '',
        cell: ({ row }) => <ActionMenu course={row.original} />
      }
    ];
  }, [courses, subjects, teachers, truncateText]);

  const data = useMemo(() => courses, [courses]);

  return (
    <>
      {selectedCourseRow ? (
        <Dashboard course={selectedCourseRow} handleBackClick={() => setSelectedCourseRow(null)} />
      ) : (
        <Row>
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body className="p-0">
                <TanstackTable
                  data={data}
                  subjectId={subjectId}
                  columns={columns}
                  filter={true}
                  filterPlaceholder="Search Course"
                  pagination={true}
                  handleRowClick={handleRowClick}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Update Course Offcanvas */}
          <Offcanvas show={showUpdateOffcanvas} onHide={() => setShowUpdateOffcanvas(false)} placement="start" style={{ width: '600px' }}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title as="h3">Update Course</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body className="pt-0">
              <Form onSubmit={handleUpdateSubmit}>
                <Row>
                  <Col xs={12} className="mb-3">
                    <Form.Group controlId="formUpdateCourseTitle">
                      <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter course title"
                        name="title"
                        value={courseData.title}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mb-3">
                    <Form.Group controlId="formUpdateCourseSubject">
                      <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="subject_uuid"
                        value={courseData.subject_uuid}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Please select the Subject</option>
                        {subjects.map(subject => (
                          <option key={subject.uuid} value={subject.uuid}>
                            {subject.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mb-3">
                    <Form.Group controlId="formUpdateCourseTeacher">
                      <Form.Label>Teacher <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="teacher_uuid"
                        value={courseData.teacher_uuid}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Please select the Teacher</option>
                        {teachers.map(teacher => (
                          <option key={teacher.uuid} value={teacher.uuid}>
                            {teacher.firstname} {teacher.lastname}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mb-3">
                    <Form.Group controlId="formUpdateCourseDescription">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter brief about course..."
                        name="description"
                        value={courseData.description}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mb-3">
                    <Form.Group controlId="formUpdateCourseIsActive">
                      <Form.Label>Is Active</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="approvation"
                        className="form-switch"
                        checked={isActive}  // Bind the checkbox to isActive
                        onChange={handleCheckboxChange}  // Use handleCheckboxChange for checkbox
                      />
                    </Form.Group>
                  </Col>

                  <Col xs={12} className="mb-4">
                    <h5 className="mb-3">Image</h5>
                    <div className="dropzone mt-4 p-4 border-dashed text-center">
                      <DropFiles onFileChange={handleFileChange} />
                    </div>
                  </Col>

                  <Col xs={12}>
                    <Button variant="primary" type="submit">Submit</Button>
                    <Button onClick={() => setShowUpdateOffcanvas(false)} variant="outline-primary" className="ms-2">Close</Button>
                  </Col>
                </Row>
              </Form>
            </Offcanvas.Body>
          </Offcanvas>

          {/* Delete Course Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Delete Course</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete {courseData ? courseData.title : ''}?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Close
              </Button>
              <Button variant="danger" onClick={handleDeleteSubmit}>
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </Row>
      )}
    </>
  );
};

export default CourseSubject;
