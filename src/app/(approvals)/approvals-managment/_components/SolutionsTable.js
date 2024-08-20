// import node module libraries
import React, { Fragment, useMemo } from 'react';
import Link from 'next/link';
import { Button,Image, Dropdown } from 'react-bootstrap';
import { XCircle, MoreVertical } from 'react-feather';
import DotBadge from '../../../../../components/bootstrap/DotBadge';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';



const SolutionsTable = ({ solutions_data }) => {
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
            header: 'Courses',
            accessorKey: 'title',
            cell: ({ row, getValue }) => (
                <Link href="#" className="text-inherit">
                    <div className="d-lg-flex align-items-center">
                        <div>
                            <Image
                                src={row.original.image}
                                alt=""
                                className="img-4by3-lg rounded"
                            />
                        </div>
                        <div className="ms-lg-3 mt-2 mt-lg-0">
                            <h4 className="mb-1 text-primary-hover">{getValue()}...</h4>
                            <span className="text-inherit">
                                {row.original.date_added}
                            </span>
                        </div>
                    </div>
                </Link>
            ),
        },
        {
            header: 'Instructor',
            accessorKey: 'instructor_name',
            cell: ({ row, getValue }) => (
                <div className="d-flex align-items-center">
                    <Image
                        src={row.original.instructor_image}
                        alt=""
                        className="rounded-circle avatar-xs me-2"
                    />
                    <h5 className="mb-0">{getValue()}</h5>
                </div>
            ),
        },
        {
            header: 'Status',
            accessorKey: 'status',
            cell: ({ getValue }) => {
                const status = getValue();
                return (
                    <Fragment>
                        <DotBadge
                            bg={
                                status && status.toLowerCase() === 'pending'
                                    ? 'warning'
                                    : status && status.toLowerCase() === 'live'
                                        ? 'success'
                                        : ''
                            }
                        ></DotBadge>
                        {status ? status.charAt(0).toUpperCase() + status.slice(1) : ''}
                    </Fragment>
                );
            }
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

    const data = useMemo(() => solutions_data, []);

    return (
        <TanstackTable
            data={data}
            columns={columns}
            filter={true}
            filterPlaceholder="Search Course"
            pagination={true} />
    );
};

export default SolutionsTable;

