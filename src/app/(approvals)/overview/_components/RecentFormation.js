// import node module libraries
import React, { useEffect ,useState } from 'react';
import Link from 'next/link';
import { Col, Row, Card, ListGroup, Dropdown, Image } from 'react-bootstrap';
import axiosInstance from '../../../../../api/axiosConfig';

// import data files


const RecentFormation = ({ title }) => {
	const storageUrl = process.env.NEXT_PUBLIC_STORAGE;
	const [allformations, setAllFormations] = useState([]);

	const fetchAllFormations = async () => {
		try {
			const response = await axiosInstance.get('/formation');
			setAllFormations(response.data);
			console.log('All formations', response.data);
		} catch (error) {
			console.error('Error fetching all formations', error);
		}
	};

	useEffect(() => {
		fetchAllFormations();
	}, []);

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
			<div>
				<Dropdown>
					<Dropdown.Toggle as={CustomToggle}>
						<i className="fe fe-more-vertical text-muted"></i>
						
					</Dropdown.Toggle>
					<Dropdown.Menu align="end">
						<Dropdown.Item eventKey="1" className='d-flex gap-2'>
							<i className="fe fe-eye dropdown-item-icon"></i> View Details
						</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>
		);
	};

	return (
		<Card className="h-100">
			<Card.Header className="d-flex align-items-center justify-content-between card-header-height">
				<h4 className="mb-0">{title}</h4>
				<Link href="#" className="btn btn-outline-secondary btn-sm">
					View all
				</Link>
			</Card.Header>
			<Card.Body>
				<ListGroup variant="flush">
					{allformations.slice(0, 4).map((item, index) => (
						<ListGroup.Item
							className={`px-0 ${index === 0 ? 'pt-0' : ''}`}
							key={index}
						>
							<Row>
								<Col xs="auto">
									<Link href="#">
										<Image
											src={ item.image? item.image: '/images/course/no-picture-available.jpg'}
											alt=""
											className="img-fluid rounded img-4by3-lg"
										/>
									</Link>
								</Col>
								<Col className='d-flex flex-column m-auto'>
									<Link href="#">
										<h5 className="text-primary-hover">{item.name}</h5>
									</Link>
									<div className="d-flex align-items-center">

										<span className="fs-6">{item.description}</span>
									</div>
								</Col>
								<Col className='d-flex flex-column align-items-end m-auto'>
									<ActionMenu />
								</Col>
							</Row>
						</ListGroup.Item>
					))}
				</ListGroup>
			</Card.Body>
		</Card>
	);
};
export default RecentFormation;
