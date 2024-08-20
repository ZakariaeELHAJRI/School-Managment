import React, { Fragment, useState, useEffect } from 'react';
import { Col, Row, Form, Button, Offcanvas } from 'react-bootstrap';
import axiosInstance from '../../../api/axiosConfig';
import CourseCard from './CourseCard';
import { toast } from 'react-toastify';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';

const ClasseGrid = ({ levelId, onClasseClick }) => {
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [showCreateOffcanvas, setShowCreateOffcanvas] = useState(false);
  const [classeData, setClasseData] = useState({
    level_uuid: levelId || '',
    teacher_uuid: '',
    name: '',
    image: '',
  });
  const [levels, setLevels] = useState([]);
  const [teachers, setTeachers] = useState([]);

  // Fetch classes based on level ID
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get(`/classe/level/${levelId}`);
        console.log('classe of level',response.data);
        setClasses(response.data);
        setFilteredClasses(response.data);
      } catch (error) {
        toast.error('Error fetching classes!');
      }
    };

    fetchClasses();
  }, [levelId, refresh]);

  // Fetch levels for the dropdown
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await axiosInstance.get('/level');
        setLevels(response.data);
      } catch (error) {
        toast.error('Error fetching levels!');
      }
    };

    fetchLevels();
  }, []);

  // Fetch teachers for the dropdown
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/teacher');
        setTeachers(response.data);
        console.log(response.data);
      } catch (error) {
        toast.error('Error fetching teachers!');
      }
    };

    fetchTeachers();
  }, []);

  const getSearchTerm = (event) => {
    let searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm !== '') {
      const newClassesList = classes.filter((classe) => {
        return Object.values(classe)
          .join(' ')
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      setFilteredClasses(newClassesList);
    } else {
      setFilteredClasses(classes);
    }
  };

  const handleAdd = () => {
    setShowCreateOffcanvas(true);
  };

  const handleCloseCreateOffcanvas = () => {
    setShowCreateOffcanvas(false);
    setClasseData({
      level_uuid: levelId || '',
      teacher_uuid: '',
      name: '',
      image: '',
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setClasseData({
      ...classeData,
      [name]: value,
    });
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setClasseData({
        ...classeData,
        image: acceptedFiles[0],
      });
    } else {
      setClasseData({
        ...classeData,
        image: null,
      });
    }
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('level_uuid', classeData.level_uuid);
    formData.append('teacher_uuid', classeData.teacher_uuid);
    formData.append('name', classeData.name);
    formData.append('image', classeData.image);

    try {
      await axiosInstance.post('/classe', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      });
      toast.success('Class created successfully!');
      setRefresh((prev) => !prev);
      handleCloseCreateOffcanvas();
    } catch (error) {
      console.error('Error creating class:', error.response?.data || error);
      toast.error('Error creating class!');
    }
  };

  return (
    <Fragment>
      {/* Search classes */}
      <Row className='d-flex justify-content-between align-items-center mb-4 p-0'>
        <Col xs="auto">
          <Form.Control
            type="search"
            placeholder="Search Classe"
            value={searchTerm}
            onChange={getSearchTerm}
          />
        </Col>

        <Col xs="auto" className='p-0'>
          <Button onClick={handleAdd} className="btn btn-primary">Create Classe</Button>
        </Col>
      </Row>

      {/* Show classes in grid view */}
      <Row className="bg-white p-3 mx-auto">
        {filteredClasses.length > 0 ? (
          filteredClasses.map((classe, index) => (
            <Col
              key={index}
              xxl={3}
              xl={4}
              lg={4}
              md={6}
              sm={12}
              className="mb-2"
            >
              <CourseCard item={classe} onClasseClick={onClasseClick} refresh={() => setRefresh(!refresh)} />
            </Col>
          ))
        ) : (
          <Col>No matching classes found.</Col>
        )}
      </Row>

      {/* Create Class Offcanvas */}
      <Offcanvas show={showCreateOffcanvas} onHide={handleCloseCreateOffcanvas} placement="start" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Create Class</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <Form onSubmit={handleCreateSubmit}>
            <Row>
              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Level</Form.Label>
                  <Form.Select
                    name="level_uuid"
                    value={classeData.level_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select the Level</option>
                    {levels.map(level => (
                      <option key={level.uuid} value={level.uuid}>
                        {level.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Teacher</Form.Label>
                  <Form.Select
                    name="teacher_uuid"
                    value={classeData.teacher_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select the Teacher</option>
                    {teachers.map(teacher => (
                      <option key={teacher.uuid} value={teacher.uuid}>
                        {teacher.firstname} {teacher.lastname}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} className="mb-3">
                <Form.Group controlId="formCreateClassName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter class name"
                    name="name"
                    value={classeData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="mb-4">
                <h5 className="mb-3">Image</h5>
                <div className="dropzone mt-4 p-4 border-dashed text-center">
                  <DropFiles onFileChange={handleFileChange} />
                </div>
              </Col>

              <Col xs={12}>
                <Button variant="primary" type="submit">Submit</Button>
                <Button onClick={handleCloseCreateOffcanvas} variant="outline-primary" className="ms-2">Close</Button>
              </Col>
            </Row>
          </Form>
        </Offcanvas.Body>
      </Offcanvas>
    </Fragment>
  );
};

export default ClasseGrid;
