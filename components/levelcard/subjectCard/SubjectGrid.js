import React, { Fragment, useState, useEffect } from 'react';
import { Col, Row, Form, Button, Offcanvas } from 'react-bootstrap';
import axiosInstance from '../../../api/axiosConfig';
import SubjectCard from './SubjectCard';
import { toast } from 'react-toastify';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';

const SubjectGrid = ({ classeId, onSelectSubject }) => {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [showCreateOffcanvas, setShowCreateOffcanvas] = useState(false);
  const [subjectData, setSubjectData] = useState({
    classe_uuid: classeId || '',
    teacher_uuid: '',
    name: '',
    description: '',
    image: null,
    approvation: false,
  });

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get(`/subject/classe/${classeId}`);
      setSubjects(response.data);
      setFilteredSubjects(response.data);
    } catch (error) {
      toast.error('Error fetching subjects!');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [classeId]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get('/classe');
        setClasses(response.data);
      } catch (error) {
        toast.error('Error fetching classes!');
      }
    };
    fetchClasses();
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/teacher');
        setTeachers(response.data);
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
      const newSubjectsList = subjects.filter((subject) => {
        return (
          subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (subject.classe_name && subject.classe_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (subject.teacher_name && subject.teacher_name.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      });
      setFilteredSubjects(newSubjectsList);
    } else {
      setFilteredSubjects(subjects);
    }
  };

  const handleAdd = () => {
    setShowCreateOffcanvas(true);
  };

  const handleCloseCreateOffcanvas = () => {
    setShowCreateOffcanvas(false);
    setSubjectData({
      classe_uuid: classeId || '',
      teacher_uuid: '',
      name: '',
      description: '',
      image: null,
      approvation: false,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSubjectData({ ...subjectData, [name]: value });
  };

  const handleFileChange = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSubjectData({
        ...subjectData,
        image: acceptedFiles[0],
      });
    } else {
      setSubjectData({
        ...subjectData,
        image: null,
      });
    }
  };

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('classe_uuid', subjectData.classe_uuid);
    formData.append('teacher_uuid', subjectData.teacher_uuid);
    formData.append('name', subjectData.name);
    formData.append('description', subjectData.description);
    formData.append('approvation', subjectData.approvation);
    if (subjectData.image) {
      formData.append('image', subjectData.image);
    }

    try {
      await axiosInstance.post('/subject', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Subject created successfully!');
      fetchSubjects();  // Refresh subjects after creation
      handleCloseCreateOffcanvas();
    } catch (error) {
      toast.error('Error creating subject!');
    }
  };

  return (
    <Fragment>
      <Row className="d-flex justify-content-between align-items-center mb-4 p-0">
        <Col xs="auto">
          <Form.Control
            type="search"
            placeholder="Search subject"
            value={searchTerm}
            onChange={getSearchTerm}
          />
        </Col>

        <Col xs="auto" className="p-0">
          <Button onClick={handleAdd} className="btn btn-primary">Create Subject</Button>
        </Col>
      </Row>

      <Row className="bg-white p-3 mx-auto">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, index) => (
            <Col key={index} xxl={3} lg={4} md={6} sm={12} className="mb-4">
              <SubjectCard
                item={subject}
                onSelectSubject={onSelectSubject}
                fetchSubjects={fetchSubjects}
              />
            </Col>
          ))
        ) : (
          <Col>No matching subjects found.</Col>
        )}
      </Row>

      <Offcanvas show={showCreateOffcanvas} onHide={handleCloseCreateOffcanvas} placement="start" style={{ width: '600px' }}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title as="h3">Create Subject</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="pt-0">
          <Form onSubmit={handleCreateSubmit}>
            <Row>
              <Col md={12} sm={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Classe</Form.Label>
                  <Form.Select
                    name="classe_uuid"
                    value={subjectData.classe_uuid}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Please select the Classe</option>
                    {classes.map(classe => (
                      <option key={classe.uuid} value={classe.uuid}>
                        {classe.name}
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
                    value={subjectData.teacher_uuid}
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
                <Form.Group controlId="formCreateSubjectName">
                  <Form.Label>Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject name"
                    name="name"
                    value={subjectData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xs={12} className="mb-3">
                <Form.Group controlId="formCreateSubjectDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter brief about subject..."
                    name="description"
                    value={subjectData.description}
                    onChange={handleChange}
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

export default SubjectGrid;
