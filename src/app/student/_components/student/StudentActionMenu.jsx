import React from 'react';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { MoreVertical, Trash, Edit } from 'react-feather';
import Link from 'next/link';

const StudentActionMenu = ({ student, onEdit, onDelete }) => {
  return (
    <Dropdown className='z-3'>
      <Dropdown.Toggle as={CustomToggle}>
        <MoreVertical size="15px" className="text-secondary" />
      </Dropdown.Toggle>
      <Dropdown.Menu align="start">
        <Dropdown.Header>SETTINGS</Dropdown.Header>
        <Dropdown.Item onClick={() => onEdit(student)}>
          <Edit size="15px" className="dropdown-item-icon" /> Edit
        </Dropdown.Item>
        <Dropdown.Item onClick={() => onDelete(student)}>
          <Trash size="15px" className="dropdown-item-icon" /> Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
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

export default StudentActionMenu;
