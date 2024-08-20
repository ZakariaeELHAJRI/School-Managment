import React, { Fragment, useState, useEffect } from 'react';
import { Col, Row, Form, Button, Offcanvas } from 'react-bootstrap';
import axiosInstance from '../../../api/axiosConfig';
import LevelCard from './LevelCard';
import { toast } from 'react-toastify';
import AddLevel from '@/app/levels/_components/AddNewLevel';

const LevelsGrid = ({ onLevelClick }) => {
  const [levels, setLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axiosInstance.get('/level');
        setLevels(response.data);
        setFilteredLevels(response.data);
        console.log(response.data);
      } catch (error) {
        toast.error('Error fetching levels!');
      }
    };

    fetchLevels();
  }, [refresh]);

  const getSearchTerm = (event) => {
    let searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm !== '') {
      const newLevelsList = levels.filter((level) => {
        return Object.values(level)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setFilteredLevels(newLevelsList);
    } else {
      setFilteredLevels(levels);
    }
  };

  const handleShowOffcanvas = () => setShowOffcanvas(true);
  const handleCloseOffcanvas = () => setShowOffcanvas(false);

  return (
    <Fragment>
      {/* Search level */}
      <Row className='d-flex justify-content-between align-items-center mb-4 p-0'>
        <Col xs="auto">
          <Form.Control
            type="search"
            placeholder="Search level"
            value={searchTerm}
            onChange={getSearchTerm}
          />
        </Col>

        <Col xs="auto" className='p-0'>
          <Button className="btn btn-primary" onClick={handleShowOffcanvas}>Create Level</Button>
        </Col>
      </Row>

      {/* Show levels in grid view */}
      <Row className='bg-white p-3 mx-auto'>
        {filteredLevels.length > 0 ? (
          filteredLevels.map((level, index) => (
            <Col
              key={index}
              xxl={3}
              lg={4}
              md={6}
              sm={12}
              className="mb-4"
            >
              <LevelCard item={level} onLevelClick={onLevelClick} setRefresh={setRefresh} />
            </Col>
          ))
        ) : (
          <Col>No matching levels found.</Col>
        )}
      </Row>

      {/* Offcanvas for creating a level */}
      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} placement="start" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Create Level</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <AddLevel setRefresh={setRefresh} handleCloseOffcanvas={handleCloseOffcanvas} />
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
};

export default LevelsGrid;
