import React, { useMemo } from 'react';
import { Image } from 'react-bootstrap';
import Icon from '@mdi/react';
import { mdiStar } from '@mdi/js';
import { numberWithCommas } from '../../../../../helper/utils';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';
import TeacherActionMenu from './TeacherActionMenu';

const InstructorsListItems = ({ teachers = [], handleShowEdit, handleShowDelete }) => {

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const { firstname, lastname, image } = row.original;
          const imageUrl = image
            ? `${process.env.NEXT_PUBLIC_STORAGE}/${image.replace('public/', '')}`
            : '/images/course/no-picture-available.jpg';

          return (
            <div className="d-flex align-items-center">
              <Image
                src={imageUrl}
                alt={`${firstname} ${lastname}`}
                className="rounded-circle avatar-md me-2"
              />
              <h5 className="mb-0">{`${firstname} ${lastname}`}</h5>
            </div>
          );
        }
      },
      { accessorKey: 'specialization', header: 'Specialization', cell: ({ row }) => row.original.specialization },
      { accessorKey: 'courses', header: 'Courses', cell: () => '15' }, // Static or placeholder value
      { accessorKey: 'joined', header: 'Joined', cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString() },
      {
        accessorKey: 'students',
        header: 'Students',
        cell: () => numberWithCommas(120) // Static or placeholder value
      },
      {
        accessorKey: 'salary',
        header: 'Salary',
        cell: ({ row }) => `$${numberWithCommas(row.original.salary)}`
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: () => (
          <div className="align-middle text-warning border-top-0">
            4.5 <Icon path={mdiStar} size={0.6} />
          </div>
        ) // Static or placeholder value
      },
      {
        accessorKey: 'shortcutmenu',
        header: '',
        cell: ({ row }) => {
          return <TeacherActionMenu teacher={row.original} onEdit={handleShowEdit} onDelete={handleShowDelete} />;
        }
      }
    ],
    [handleShowEdit, handleShowDelete]
  );

  const data = useMemo(() => teachers, [teachers]);

  return (
    <>
        <TanstackTable
          data={data}
          columns={columns}
          filter={true}
          filterPlaceholder="Search Instructors"
          pagination={true}
        />
    </>
  );
};

export default InstructorsListItems;
