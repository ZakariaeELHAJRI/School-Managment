// import node module libraries
import React, { Fragment, useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Image, Dropdown, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { XCircle, MoreVertical } from 'react-feather';
import axiosInstance from '../../../../../api/axiosConfig';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';
import { toast } from 'react-toastify';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

// Helper function to truncate text
const truncateText = (text, maxLength = 20) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const CoursesTable = ({ courses_data }) => {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/subjects');
        setSubjects(response.data.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
        toast.error('Error fetching subjects!');
      }
    };

    fetchSubjects();
  }, []);

  const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
    <Link
      href="#"
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

  const ActionMenu = () => {
    return (
      <Dropdown>
        <Dropdown.Toggle as={CustomToggle}>
          <MoreVertical size="15px" className="text-secondary" />
        </Dropdown.Toggle>
        <Dropdown.Menu align="end">
          <Dropdown.Header>SETTINGS</Dropdown.Header>
          <Dropdown.Item eventKey="1">
            <XCircle size="15px" className="me-1" />Reject with Feedback
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ getValue }) => {
        const imageUrl = getValue() ? `${storageUrl}/${getValue().replace('public/', '')}` : '/images/course/no-picture-available.jpg';
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
        const subject = subjects.find(subject => subject.id === getValue);
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
      accessorKey: 'created_at',
      header: 'Added On',
      cell: ({ getValue }) => (
        <span>{new Date(getValue()).toLocaleDateString()}</span>
      )
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ getValue }) => (
        getValue() === 1 ?
          <Button href="#" variant="secondary" className="btn-sm">
            Change Status
          </Button> :
          <Fragment>
            <Button
              href="#"
              variant="outline"
              className="btn-outline-secondary btn-sm"
            >
              Reject
            </Button>{' '}
            <Button href="#" variant="success" className="btn-sm">
              Approved
            </Button>
          </Fragment>
      )
    },
    // {
    //   accessorKey: 'shortcutmenu',
    //   header: '',
    //   cell: () => {
    //     return <ActionMenu />;
    //   }
    // }
  ], [subjects]);

  const data = useMemo(() => courses_data, [courses_data]);

  return (
    <TanstackTable
      data={data}
      columns={columns}
      filter={true}
      filterPlaceholder="Search Course"
      pagination={true} />
  );
};

export default CoursesTable;
