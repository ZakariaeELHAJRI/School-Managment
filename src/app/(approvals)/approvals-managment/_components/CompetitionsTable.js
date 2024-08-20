// import node module libraries
import React, { Fragment, useMemo, useEffect, useState } from 'react';
import Link from 'next/link';
import { Button, Image, Dropdown, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { XCircle, MoreVertical } from 'react-feather';
import DotBadge from '../../../../../components/bootstrap/DotBadge';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';
import axiosInstance from '../../../../../api/axiosConfig';
import { getStatusColor } from '../../../../../helper/utils';

// Helper function to truncate text
const truncateText = (text, maxLength) => {
  if (text.length > maxLength) {
    return `${text.substring(0, maxLength)}...`;
  }
  return text;
};
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
const CompetitionsTable = ({ competitions_data }) => {
  console.log('Competitions_data:', competitions_data);

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
        const imageUrl = getValue() ? `${process.env.NEXT_PUBLIC_STORAGE}/${getValue().replace('public/', '')}` : '/images/course/no-picture-available.jpg';
        return <Image src={imageUrl} alt="" className="img-4by3-lg rounded" />;
      }
    },
    {
      accessorKey: 'name',
      header: 'Competition Name',
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
      accessorKey: 'description',
      header: 'Description',
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
      accessorKey: 'created_at',
      header: 'Added On',
      cell: ({ getValue }) => (
        <span>{new Date(getValue()).toLocaleDateString()}</span>
      )
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
      header: 'Action',
      accessorKey: 'action',
      cell: ({ getValue }) => (
        getValue === 1 ?
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
  ], []);

//   const data = useMemo(() => competitions_data, [competitions_data]);

  const data = useMemo(
    () => competitions_data.map(competition_data => ({
      ...competition_data,
      status: getStatus(competition_data.date_start, competition_data.date_end)
    })), 
    [competitions_data]
  );
  return (
    <TanstackTable
      data={data}
      columns={columns}
      filter={true}
      filterPlaceholder="Search Competition"
      pagination={true} />
  );
};

export default CompetitionsTable;
