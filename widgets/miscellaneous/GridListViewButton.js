// import node module libraries
import { Nav } from 'react-bootstrap';

const GridListViewButton = ({ keyGrid, keyList }) => {
	return (
		<Nav className="flex-nowrap  gap-1" role="tablist">
			<Nav.Link
				eventKey={keyGrid}
				className="btn btn-outline-secondary btn-icon d-flex align-items-center"
				bsPrefix=' '>
				<span className="fe fe-grid"></span>
			</Nav.Link>
			<Nav.Link
				eventKey={keyList}
				className="btn btn-outline-secondary btn-icon d-flex align-items-center"
				bsPrefix=' '>
				<span className="fe fe-list"></span>
			</Nav.Link>
		</Nav>
	);
};

export default GridListViewButton;
