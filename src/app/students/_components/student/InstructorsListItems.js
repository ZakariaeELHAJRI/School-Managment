// import node module libraries
import React, { useMemo } from 'react';
import Link from 'next/link';
import {
	Dropdown,
	Image,
	OverlayTrigger,
	Tooltip
} from 'react-bootstrap';
import { MoreVertical, Trash, Edit, Mail } from 'react-feather';

// import MDI icons
import Icon from '@mdi/react';
import { mdiStar } from '@mdi/js';


import InstructorData from '../../../../../data/users/InstructorData';
import { numberWithCommas } from '../../../../../helper/utils';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';


const InstructorsListItems = () => {
	// The forwardRef is important!!
	// Dropdown needs access to the DOM node in order to position the Menu
	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		(<Link
			href=""
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
						<Edit size="15px" className="dropdown-item-icon" /> Edit
					</Dropdown.Item>
					<Dropdown.Item eventKey="2">
						<Trash size="15px" className="dropdown-item-icon" /> Remove
					</Dropdown.Item>
				</Dropdown.Menu>
			</Dropdown>
		);
	};

	const columns = useMemo(
		() => [
			{
				accessorKey: 'name',
				header: 'Name',
				cell: ({ getValue, row }) => {
					return (
						<div className="d-flex align-items-center">
							<Image
								src={row.original.image}
								alt=""
								className="rounded-circle avatar-md me-2"
							/>
							<h5 className="mb-0">{getValue()}</h5>
						</div>
					);
				}
			},
			{ accessorKey: 'topic', header: 'Topic' },
			{ accessorKey: 'courses', header: 'Courses' },
			{ accessorKey: 'joined', header: 'Joined' },
			{
				accessorKey: 'students',
				header: 'Students',
				cell: ({ getValue }) => {
					return numberWithCommas(getValue());
				}
			},
			{
				accessorKey: 'rating',
				header: 'Rating',
				cell: ({ getValue }) => {
					return (
						<div className="align-middle text-warning border-top-0">
							{getValue()} <Icon path={mdiStar} size={0.6} />
						</div>
					);
				}
			},
			
			{
				accessorKey: 'shortcutmenu',
				header: '',
				cell: () => {
					return <ActionMenu />;
				}
			}
		],
		[]
	);

	const data = useMemo(() => InstructorData, []);

	return (
		<TanstackTable
			data={data}
			columns={columns}
			filter={true}
			filterPlaceholder="Search Instructors"
			pagination={true} />
	);
};

export default InstructorsListItems;
