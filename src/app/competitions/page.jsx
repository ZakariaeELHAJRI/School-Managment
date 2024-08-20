'use client';
import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Col,
  Row,
  Dropdown,
  Table,
  Card,
  Form,
  Button,
  Offcanvas,
  Modal, 
  Breadcrumb,
  Image
} from 'react-bootstrap';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable
} from '@tanstack/react-table';import OffcanvasCreateProjectForm from './_components/OffcanvasCreateProjectForm';
import { getStatusColor } from '../../../helper/utils';
import GlobalFilter from '../../../widgets/advance-table/GlobalFilter';
import FormSelect from '../../../widgets/form-select/FormSelect';
import Pagination from '../../../widgets/advance-table/Pagination';
import axiosInstance from '../../../api/axiosConfig';
import { toast, ToastContainer } from 'react-toastify';
import brokenImageUrl from '../../../public/images/course/no-picture-available.jpg';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

const ProjectListTable = ({ onNewProject, onEditProject, onDeleteProject ,competitions }) => {
  const [filtering, setFiltering] = useState('');
  const [rowSelection, setRowSelection] = useState({});


  const filterOptions = [
    { value: 'In Process', label: 'In Process' },
    { value: 'Planified', label: 'Planified' },
    { value: 'Finished', label: 'Finished' }
  ];

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      className="btn-icon btn btn-ghost btn-sm rounded-circle"
    >
      {children}
    </Link>
  ));
  CustomToggle.displayName = 'CustomToggle';

  const ActionMenu = ({ competition }) => (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle}>
        <i className="fe fe-more-vertical text-muted"></i>
      </Dropdown.Toggle>
      <Dropdown.Menu align="end">
        <Dropdown.Header>Settings</Dropdown.Header>
        <Dropdown.Item onClick={() => onEditProject(competition)}>
          <i className="fe fe-edit dropdown-item-icon"></i>Edit Details
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onDeleteProject(competition)}>
          <i className="fe fe-trash dropdown-item-icon"></i>Delete Competition
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'title',
        header: 'Competition',
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
      { accessorKey: 'description', header: 'Description' },
      { accessorKey: 'start_date', header: 'Start Date',
        cell: ({ getValue }) => new Date(getValue()).toISOString().split('T')[0]
      },
      { accessorKey: 'end_date', header: 'End Date',
        cell: ({ getValue }) => new Date(getValue()).toISOString().split('T')[0]
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => (
          <span
            className={`badge bg-light-${getStatusColor(
              getValue()
            )} text-dark-${getStatusColor(getValue())}`}
          >
            {getValue()}
          </span>
        )
      },
      {
        accessorKey: 'approvation',
        header: 'Approvation',
        cell: ({ getValue }) => {
          const value = getValue();
          return (
            <span
              className={`badge ${
                value ? 'bg-success' : 'bg-danger'
              } text-white`}
            >
              {value ? (
                <>
                  <FaCheckCircle className="me-1" /> Approved
                </>
              ) : (
                <>
                  <FaTimesCircle className="me-1" /> Not Approved
                </>
              )}
            </span>
          );
        }
      },
      {
        accessorKey: 'action',
        header: '',
        cell: ({ row }) => <ActionMenu competition={row.original} />
      }
    ],
    []
  );

  const data = useMemo(
    () => competitions.map(competition => ({
      ...competition,
      status: getStatus(competition.date_start, competition.date_end)
    })), 
    [competitions]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
      rowSelection
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setFiltering,
    debugTable: false
  });

  return (
    <>
      <Row className="justify-content-md-between mb-4 mb-xl-0">
        <Col xl={2} lg={4} md={6} xs={12}>
          <div className="mb-2 mb-lg-4">
            <GlobalFilter
              filtering={filtering}
              setFiltering={setFiltering}
              placeholder="Search by competition name"
            />
          </div>
        </Col>
        <Col xxl={2} lg={2} md={6} xs={12}>
          <Form.Control
            as={FormSelect}
            placeholder="Filter"
            options={filterOptions}
          />
        </Col>
      </Row>

      <Row>
        <Col lg={12} md={12} sm={12}>
          <Card>
            <Card.Body className="p-0">
              <div className="border-0 overflow-y-hidden">
                <Table hover responsive className="text-nowrap table-centered">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="align-middle" colSpan="7">
                        <div className="d-flex align-items-center">
                          <Button
                            variant="link"
                            className="text-muted border border-2 rounded-3 card-dashed-hover p-0"
                            onClick={onNewProject}
                          >
                            <div className="icon-shape icon-lg">+</div>
                          </Button>
                          <div className="ms-3">
                            <h4 className="mb-0">
                              <Link
                                href="#"
                                onClick={onNewProject}
                                className="text-inherit"
                              >
                                New Competition
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
          <div className="mt-4">
            <Pagination table={table} />
          </div>
        </Col>
      </Row>
    </>
  );
};

const CompetitionManagement = () => {
  const [showCreateOffcanvas, setShowCreateOffcanvas] = useState(false);
  const [showEditOffcanvas, setShowEditOffcanvas] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCompetition, setSelectedCompetition] = useState(null);
  const [competitions, setCompetitions] = useState([]);

  const fetchCompetitions = async () => {
    try {
      const response = await axiosInstance.get('/competition');
      setCompetitions(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching competitions:', error);
      toast.error('Error fetching competitions');
    }
  };

  useEffect(() => {
    fetchCompetitions();
  }, []);
  const handleShowCreateOffcanvas = () => {
    setSelectedCompetition(null); // Reset selected competition when creating a new one
    setShowCreateOffcanvas(true);
  };
  const handleCloseCreateOffcanvas = () =>{
    setShowCreateOffcanvas(false);
    fetchCompetitions();
  }
    


  const handleShowEditOffcanvas = (competition) => {
    setSelectedCompetition(competition);
    setShowEditOffcanvas(true);
  };
  const handleCloseEditOffcanvas = () => {
    setSelectedCompetition(null);
    setShowEditOffcanvas(false);
    fetchCompetitions();
  };

  const handleShowDeleteModal = (competition) => {
    setSelectedCompetition(competition);
    setShowDeleteModal(true);
  };
  const handleCloseDeleteModal = () => {
    setSelectedCompetition(null);
    setShowDeleteModal(false);
  };

  const handleDeleteCompetition = async () => {
    try {
      await axiosInstance.delete(`/competition/${selectedCompetition.uuid}`);
      fetchCompetitions();
      setShowDeleteModal(false);
      toast.success('Competition deleted successfully');
    } catch (error) {
      console.error('Error deleting competition:', error);
      toast.error('Error fetching competitions');
    }
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
            <div className="mb-3 mb-md-0">
              <h1 className="mb-1 h2 fw-bold">Competition Management</h1>
              <Breadcrumb>
                <Breadcrumb.Item href="#">Competition</Breadcrumb.Item>
                <Breadcrumb.Item active>Competition Management</Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <div>
              <Button onClick={handleShowCreateOffcanvas}>
                Create a Competition
              </Button>
              <Offcanvas
                show={showCreateOffcanvas}
                onHide={handleCloseCreateOffcanvas}
                placement="start"
                style={{ width: '600px' }}
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title as="h3">Create Competition</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="pt-0">
                  <OffcanvasCreateProjectForm
                    competition={selectedCompetition}
                    onClick={handleCloseCreateOffcanvas}
                  />
                </Offcanvas.Body>
              </Offcanvas>
            </div>
          </div>
        </Col>
      </Row>
      <ProjectListTable
        onNewProject={handleShowCreateOffcanvas}
        onEditProject={handleShowEditOffcanvas}
        onDeleteProject={handleShowDeleteModal}
        competitions={competitions}
      />
      <Offcanvas
        show={showEditOffcanvas}
        onHide={handleCloseEditOffcanvas}
        placement="start"
        style={{ width: '600px' }}
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Edit Competition</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <OffcanvasCreateProjectForm
            competition={selectedCompetition}
            onClick={handleCloseEditOffcanvas}
          />
        </Offcanvas.Body>
      </Offcanvas>
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Competition</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{' '}
          {selectedCompetition ? selectedCompetition.title : ''}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Close
          </Button>
          <Button variant="danger" onClick={handleDeleteCompetition}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CompetitionManagement;
