'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Col, Row, Dropdown, Card, Modal, Image, Button, Breadcrumb, Offcanvas } from 'react-bootstrap';
import { Trash, Edit, MoreVertical } from 'react-feather';
import TanstackTable from '../../../widgets/advance-table/TanstackTable';
import axiosInstance from '../../../api/axiosConfig';
import DeleteModal from '@/components/DeleteModal/DeleteModal';
import UpdateFormation from './_components/UpdateFormation';
import OffcanvasCreateFormation from './_components/AddFormationCanvas';
import brokenImageUrl from '../../../public/images/course/no-picture-available.jpg';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

const getStatus = (startDate, endDate) => {
  const currentDate = new Date();
  if (currentDate < new Date(startDate)) {
    return 'Planified';
  } else if (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)) {
    return 'In Process';
  } else {
    return 'Finished';
  }
};

export default function Formations() {

  const [showCreateOffcanvas, setShowCreateOffcanvas] = useState(false);
  const [show, setShow] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [data, setData] = useState([]);
  const [formationTypes, setFormationTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const fetchFormationTypes = async () => {
    try {
      const response = await axiosInstance.get('/formation-type');
      setFormationTypes(response.data);
    } catch (error) {
      console.error('Error fetching formation types:', error);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await axiosInstance.get('/teachers');
      setTeachers(response.data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  useEffect(() => {
    fetchFormationTypes();
    fetchTeachers();
  }, []);

  const handleClose = () => setShow(false);
  const handleShow = (formation) => {
    setSelectedFormation(formation);
    setShow(true);
  };
  const handleAddNewFormationClick = () => {
    setShowCreateOffcanvas(true);
  };

  const handleCloseCreateOffcanvas = () => {
    setShowCreateOffcanvas(false);
  };

  const handleOpenDeleteModal = (formation) => {
    setSelectedFormation(formation);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFormation(null);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/formation/${selectedFormation.uuid}`);
      setData(data.filter((formation) => formation.uuid !== selectedFormation.uuid));
      setShowDeleteModal(false);
      setSelectedFormation(null);
    } catch (error) {
      console.error('Error deleting formation:', error);
    }
  };

  const fetchFormations = async () => {
    try {
      const response = await axiosInstance.get('/formation');
      const formations = response.data;

      const formationsWithTypesAndTeachers = formations.map(formation => {
        const formationType = formationTypes.find(type => type.uuid === formation.formation_type_uuid);
        const teacher = teachers.find(t => t.uuid === formation.teacher_uuid);
        return {
          ...formation,
          formation_type: formationType ? formationType.name : 'Unknown',
          teacher_name: teacher ? teacher.name : 'Unknown',
          status: getStatus(formation.start_date, formation.end_date)
        };
      });

      setData(formationsWithTypesAndTeachers);
      console.log('Formations:', formationsWithTypesAndTeachers);
    } catch (error) {
      console.error('Error fetching formations:', error);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, [formationTypes, teachers]);

  const handleUpdateFormation = () => {
    fetchFormations();
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

  const ActionMenu = ({ formation }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-secondary" />
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Header>SETTINGS</Dropdown.Header>
        <Dropdown.Item eventKey="1" onClick={() => handleShow(formation)}>
          <Edit size="15px" className="dropdown-item-icon" /> Edit
        </Dropdown.Item>
        <Dropdown.Item eventKey="2" onClick={() => handleOpenDeleteModal(formation)}>
          <Trash size="15px" className="dropdown-item-icon" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name_image',
        header: 'Formation',
        cell: ({ row }) => {
          const imageUrl = row.original.image ? row.original.image : brokenImageUrl;
          return (
            <div className="d-flex align-items-center gap-3">
              <Image
                src={imageUrl}
                alt="Formation Image"
                className='img-4by3-lg rounded'
              />
              <div>
                <h5 className="mb-0">{row.original.title}</h5>
                <small>Added on {new Date(row.original.created_at).toLocaleDateString('en-GB')}</small>
              </div>
            </div>
          );
        }
      },
      {
        accessorKey: 'formation_type',
        header: 'Formation Type',
        cell: ({ row }) => (
          <div>
            {row.original.formation_type}
          </div>
        )
      },
      {
        accessorKey: 'teacher_name',
        header: 'Teacher',
        cell: ({ row }) => (
          <div>
            {row.original.teacher_name}
          </div>
        )
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ getValue }) => (
          <div>
            {getValue()}
          </div>
        )
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <div>
            {getValue() === 'In Process' ? (
              <span className="badge bg-success">In Process</span>
            ) : getValue() === 'Planified' ? (
              <span className="badge bg-warning">Planified</span>
            ) : (
              <span className="badge bg-secondary">Finished</span>
            )}
          </div>
        )
      },
      {
        accessorKey: 'actionmenu',
        header: '',
        cell: ({ row }) => <ActionMenu formation={row.original} />
      }
    ],
    []
  );

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">
                Formation Management
              </h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Formation</Breadcrumb.Item>
                <Breadcrumb.Item active>Formation Management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div className='d-flex gap-1'>
              <Button variant="primary" className="btn-icon-end " onClick={handleAddNewFormationClick}>
                <span className='text-white'>Add New Formation</span>
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Card>
            <Card.Body className="p-0">
              <TanstackTable
                data={data}
                columns={columns}
                filter={true}
                filterPlaceholder="Search Formation"
                pagination={true}
              />
            </Card.Body>
          </Card>
        </Col>

        <Modal show={show} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Update Formation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <UpdateFormation formation={selectedFormation} onBack={handleClose} onSave={handleUpdateFormation} />
          </Modal.Body>
        </Modal>

        <Offcanvas
          show={showCreateOffcanvas}
          onHide={handleCloseCreateOffcanvas}
          placement="start"
          style={{ width: '600px' }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title as="h3">Create Formation</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="pt-0">
            <OffcanvasCreateFormation onBack={handleCloseCreateOffcanvas} onSave={fetchFormations} />
          </Offcanvas.Body>
        </Offcanvas>

        <DeleteModal
          show={showDeleteModal}
          onHide={handleCloseDeleteModal}
          onDelete={handleDelete}
          title="Are you sure you want to delete this formation?"
        />
      </Row>
    </>
  );
}
