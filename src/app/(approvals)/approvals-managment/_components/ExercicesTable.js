// import node module libraries
import React, { Fragment, useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Image, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { XCircle, MoreVertical } from 'react-feather';
import DotBadge from '../../../../../components/bootstrap/DotBadge';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';
import axiosInstance from '../../../../../api/axiosConfig';

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};

const ExercicesTable = ({ exercies_data }) => {
  console.log('Exercies_data:', exercies_data);

  const [courses, setCourses] = useState(null);

  const fetchAllCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses');
      setCourses(response.data.data);
      console.log('All courses', response.data.data);
    } catch (error) {
      console.error('Error fetching all courses', error);
    }
  };

  useEffect(() => {
    fetchAllCourses();
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

  const getCourseNameById = (id) => {
    if (!courses) return 'Unknown Course';
    const course = courses.find(course => course.id === id);
    return course ? course.title : 'Unknown Course';
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'image',
      header: 'Image',
      cell: ({ getValue }) => {
        const imageUrl = getValue() ? `${storageUrl}/${getValue().replace('public/', '')}` : '/images/course/no-picture-available.jpg';
        return <Image src={imageUrl} alt="" className="img-4by3-lg rounded" />;
      }
    },
    {
      accessorKey: 'name',
      header: 'Exercice Name',
      cell: ({ getValue }) => (
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>{getValue()}</Tooltip>}
        >
          <span>{truncateText(getValue(), 15)}</span>
        </OverlayTrigger>
      )
    },
    {
      accessorKey: 'course_id',
      header: 'Course',
      cell: ({ getValue }) => (
        <span>{truncateText(getCourseNameById(getValue()), 20)}</span>
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
  ], [courses]);

  const data = useMemo(() => exercies_data, [exercies_data]);

  return (
    <TanstackTable
      data={data}
      columns={columns}
      filter={true}
      filterPlaceholder="Search Exercice"
      pagination={true} />
  );
};

export default ExercicesTable;
