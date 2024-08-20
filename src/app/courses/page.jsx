'use client';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Col, Row, Dropdown, Card, Modal, Image, Button, Breadcrumb, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Trash, Edit, MoreVertical } from 'react-feather';
import TanstackTable from '../../../widgets/advance-table/TanstackTable';
import AddNewCourse from './_components/AddNewCourse';
import UpdateCourse from './_components/UpdateCourse';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import  axiosInstance  from '../../../api/axiosConfig';
import brokenImageUrl from '../../../public/images/course/no-picture-available.jpg';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

export default function Courses() {
  const [showAddNewCourse, setShowAddNewCourse] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get('/course');
        setCourses(response.data.data); // Adjust to fit the structure of your API response
        console.log('Courses:', response.data.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/subject');
        setSubjects(response.data.data); // Adjust to fit the structure of your API response
        console.log('Subjects:', response.data.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchCourses();
    fetchSubjects();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (course) => {
    setSelectedCourse(course);
    setShow(true);
  };
  const handleAddNewCourseClick = () => {
    setShowAddNewCourse(true);
  };

  const handleBackToCourseListClick = () => {
    setShowAddNewCourse(false);
  };

  const handleOpenDeleteModal = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedCourse(null);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/course/${selectedCourse.uuid}`);
      setCourses(courses.filter(course => course.uuid !== selectedCourse.uuid));
      setShowDeleteModal(false);
      setSelectedCourse(null);
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

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

  const ActionMenu = ({ course }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-secondary" />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Header>SETTINGS</Dropdown.Header>
        <Dropdown.Item eventKey="1" onClick={() => handleShow(course)}>
          <Edit size="15px" className="dropdown-item-icon" /> Edit
        </Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => handleOpenDeleteModal(course)}>
          <Trash size="15px" className="dropdown-item-icon" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const truncateText = (text, length = 50) => {
    if (!text) return '';
    return text.length > length ? `${text.substring(0, length)}...` : text;
  };

  const columns = useMemo(() => {
    if (!courses || courses.length === 0) return [];

    return [
      {
        accessorKey: 'image',
        header: 'Image',
        cell: ({ getValue }) => {
          const imageUrl = getValue() ? getValue() : brokenImageUrl;
          return <Image src={imageUrl} alt="" className="img-4by3-lg rounded m-2" />
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
        accessorKey: 'subject_id',
        header: 'Subject',
        cell: ({ getValue }) => {
          const subject = subjects.find(subject => subject.id === getValue());
          return <span>{subject ? subject.name : 'Unknown Subject'}</span>;
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
        accessorKey: 'body',
        header: 'Details Course',
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
        accessorKey: 'added_on',
        header: 'Added On',
        cell: () => <span>7 July, 2020</span> // Static date
      },
      {
        accessorKey: 'actionmenu',
        header: '',
        cell: ({ row }) => <ActionMenu course={row.original} />
      }
    ];
  }, [courses, subjects]);

  const data = useMemo(() => courses, [courses]);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">
                Courses Management <span className="fs-5 text-muted"></span>
              </h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Courses</Breadcrumb.Item>
                <Breadcrumb.Item active>Courses Management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            {!showAddNewCourse ? (
              <div className='d-flex gap-1'>
                <Button variant="primary" className="btn-icon-end " onClick={handleAddNewCourseClick}>
                  <span className='text-white'>Add New Course</span>
                </Button>
              </div>
            ) : (
              <Button variant="secondary" className="btn-icon-start " onClick={handleBackToCourseListClick}>
                <span className='text-white'>Back to Course List</span>
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {showAddNewCourse ? (
          <Col lg={11} md={11} sm={11} className="mx-auto">
            <AddNewCourse subjects={subjects} courses={courses} />
          </Col>
        ) : (
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body className="p-0">
                <TanstackTable
                  data={data}
                  columns={columns}
                  filter={true}
                  filterPlaceholder="Search "
                  pagination={true}
                />
              </Card.Body>
            </Card>
          </Col>
        )}

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Update Course</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateCourse course={selectedCourse} subjects={subjects} onClose={handleClose} />
          </Modal.Body>
        </Modal>

        <DeleteModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemName={selectedCourse ? selectedCourse.title : ''}
        />
      </Row>
    </>
  );
}
