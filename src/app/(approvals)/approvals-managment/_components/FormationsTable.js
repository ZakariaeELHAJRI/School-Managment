// import node module libraries
import React, { Fragment, useMemo } from 'react';
import Link from 'next/link';
import { Button,Image, Dropdown } from 'react-bootstrap';
import { XCircle, MoreVertical } from 'react-feather';
import DotBadge from '../../../../../components/bootstrap/DotBadge';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

const FormationsTable = ({ formations_data }) => {

    console.log('Formations_data:', formations_data);    
    const brokenImageUrl = '/images/course/no-picture-available.jpg';
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
        (<Link
            href="#"
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                onClick(e);
            }}
            className="btn-icon btn btn-ghost btn-sm rounded-circle">
            {children}
        </Link>)
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
            accessorKey: 'name_image',
            header: 'Formation',
            cell: ({ row }) => {
              const imageUrl = row.original.image ? `${storageUrl}/${row.original.image.replace('public/', '')}` : brokenImageUrl;
              return (
                <div className="d-flex align-items-center gap-3">
                  <Image
                    src={imageUrl}
                    alt="Formation Image"
                    className='img-4by3-lg rounded'
                  />
                  <div>
                    <h5 className="mb-0">{row.original.name}</h5>
                    <small>Added on {new Date(row.original.created_at).toLocaleDateString('en-GB')}</small>
                  </div>
                </div>
              );
            }
          },
          {
            accessorKey: 'formation_type.name',
            header: 'Formation Type',
            cell: ({ row }) => (
              <div>
                {row.original.formation_type}
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
        //     accessorKey: 'shortcutmenu',
        //     header: '',
        //     cell: () => {
        //         return <ActionMenu />;
        //     }
        // }
    ], []);

    const data = useMemo(() => formations_data, [formations_data]);

    return (
        <TanstackTable
            data={data}
            columns={columns}
            filter={true}
            filterPlaceholder="Search Course"
            pagination={true} />
    );
};

export default FormationsTable;

