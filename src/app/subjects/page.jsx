'use client';
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Col, Row, Dropdown, Card, Modal, Image, Button, Breadcrumb } from 'react-bootstrap';
import { Trash, Edit, MoreVertical } from 'react-feather';
import TanstackTable from '../../../widgets/advance-table/TanstackTable';
import AddNewSubject from './_components/AddNewSubject';
import UpdateSubject from './_components/UpdateSubject';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import axiosInstance from '../../../api/axiosConfig';
import brokenImageUrl from '../../../public/images/course/no-picture-available.jpg';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;
export default function Subjects() {
  const [showAddNewSubject, setShowAddNewSubject] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formation, setFormation] = useState([]);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchFormation = async () => {
      try {
        const response = await axiosInstance.get('/formation');
        setFormation(response.data.data); // Adjust to fit the structure of your API response
        console.log('Formation:', response.data.data);
      } catch (error) {
        console.error('Error fetching formation:', error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/subjects');
        setSubjects(response.data.data); // Adjust to fit the structure of your API response
        console.log('Subjects:', response.data.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    fetchFormation();
    fetchSubjects();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (subject) => {
    setSelectedSubject(subject);
    setShow(true);
  };
  const handleAddNewSubjectClick = () => {
    setShowAddNewSubject(true);
  };

  const handleBackToSubjectListClick = () => {
    setShowAddNewSubject(false);
  };

  const handleOpenDeleteModal = (subject) => {
    setSelectedSubject(subject);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedSubject(null);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/subjects/${selectedSubject.id}`);
      setSubjects(subjects.filter(subject => subject.id !== selectedSubject.id));
      setShowDeleteModal(false);
      setSelectedSubject(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
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

  const ActionMenu = ({ subject }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-secondary" />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Header>SETTINGS</Dropdown.Header>
        <Dropdown.Item eventKey="1" onClick={() => handleShow(subject)}>
          <Edit size="15px" className="dropdown-item-icon" /> Edit
        </Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => handleOpenDeleteModal(subject)}>
          <Trash size="15px" className="dropdown-item-icon" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const columns = useMemo(() => {
    if (!subjects || subjects.length === 0) return [];

    return [
      {
        accessorKey: 'name',
        header: 'Subject',
        cell: ({ row }) => {
          const { name, image } = row.original;
          const imageUrl = image ? `${storageUrl}/${image.replace('public/', '')}` : brokenImageUrl;
          return (

              (<Link href="#" className="text-inherit">
                <div className="d-lg-flex align-items-center">
                  <div>
                  <Image
                src={imageUrl}
                alt={name}
                className="img-4by3-lg rounded me-2"
              />
                  </div>

                    <span className='px-3'>
                    {name}
                    </span>

                </div>
              </Link>)
          );
        }
      },
      {
        accessorKey: 'teacher',
        header: 'Teacher',
        cell: ({ row }) => {
          const teacher = row.original.teacher;
          return (
            <span>{`${teacher.first_name} ${teacher.last_name}`}</span>
          );
        }
      },
      {
        accessorKey: 'classe.name',
        header: 'Class',
        cell: ({ row }) => {
          const classe = row.original.classe;
          return (
            <span>{classe ? classe.name : 'Unknown Class'}</span>
          );
        }
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => <span>{getValue()}</span>
      },
      {
        accessorKey: 'slug',
        header: 'Slug',
        cell: ({ getValue }) => <span>{getValue()}</span>
      },
      {
        accessorKey: 'actionmenu',
        header: '',
        cell: ({ row }) => <ActionMenu subject={row.original} />
      }
    ];
  }, [subjects]);

  const data = useMemo(() => subjects, [subjects]);

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">
                Subjects Management <span className="fs-5 text-muted"></span>
              </h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Subjects</Breadcrumb.Item>
                <Breadcrumb.Item active>Subjects Management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            {!showAddNewSubject ? (
              <div className='d-flex gap-1'>
                <Button variant="primary" className="btn-icon-end " onClick={handleAddNewSubjectClick}>
                  <span className='text-white'>Add New Subject</span>
                </Button>
              </div>
            ) : (
              <Button variant="secondary" className="btn-icon-start " onClick={handleBackToSubjectListClick}>
                <span className='text-white'>Back to Subject List</span>
              </Button>
            )}
          </div>
        </Col>
      </Row>
      <Row>
        {showAddNewSubject ? (
          <Col lg={11} md={11} sm={11} className="mx-auto">
            <AddNewSubject subjects={subjects} />
          </Col>
        ) : (
          <Col lg={12} md={12} sm={12}>
            <Card>
              <Card.Body className="p-0">
                <TanstackTable
                  data={data}
                  columns={columns}
                  filter={true}
                  filterPlaceholder="Search Subject"
                  pagination={true}
                />
              </Card.Body>
            </Card>
          </Col>
        )}

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Update Subject</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateSubject subject={selectedSubject} />
          </Modal.Body>

        </Modal>

        <DeleteModal
          show={showDeleteModal}
          handleClose={handleCloseDeleteModal}
          handleDelete={handleDelete}
          itemName={selectedSubject ? selectedSubject.name : ''}
        />
      </Row>
    </>
  );
}
