import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Col, Row, Card, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import ReactQuillEditor from '../../../../widgets/editor/ReactQuillEditor';
import axiosInstance from '../../../../api/axiosConfig';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';

const AddNewSubject = () => {
  const [subjectData, setSubjectData] = useState({
    teacher_id: '',
    classe_id: '',
    name: '',
    description: '',
    // slug: '',
    image: ''
  });

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/teachers');
        setTeachers(response.data.data); // Adjust to fit the structure of your API response
        console.log('Teachers:', response.data.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    const fetchClasses = async () => {
      try {
        const response = await axiosInstance.get('/classes');
        setClasses(response.data.data); // Adjust to fit the structure of your API response
        console.log('Classes:', response.data.data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchTeachers();
    fetchClasses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSubjectData({
      ...subjectData,
      [name]: value
    });
  };

  const handleFileChange = (files) => {
    setSubjectData({
      ...subjectData,
      image: files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('teacher_id', subjectData.teacher_id);
    formData.append('classe_id', subjectData.classe_id);
    formData.append('name', subjectData.name);
    formData.append('description', subjectData.description);
    // formData.append('slug', subjectData.slug);
    formData.append('image', subjectData.image);

    // display content of formData
    for (var pair of formData.entries()) {
      console.log(pair[0] + ', ' + pair[1]);
    }
    try {
      const response = await axiosInstance.post('/subjects', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12} className="mx-auto">
          <Card>
            <Card.Header>
              <h4 className="mb-0">Create Subject</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mt-4">
                  <Col md={6} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teacher</Form.Label>
                      <Form.Select
                        name="teacher_id"
                        value={subjectData.teacher_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Please select the Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.first_name} {teacher.last_name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Class</Form.Label>
                      <Form.Select
                        name="classe_id"
                        value={subjectData.classe_id}
                        onChange={handleInputChange}
                      >
                        <option value="">Please select the Class</option>
                        {classes.map((classe) => (
                          <option key={classe.id} value={classe.id}>
                            {classe.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={12} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={subjectData.name}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col>

                  {/* <Col md={6} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Slug</Form.Label>
                      <Form.Control
                        type="text"
                        name="slug"
                        placeholder="Slug"
                        value={subjectData.slug}
                        onChange={handleInputChange}
                      />
                    </Form.Group>
                  </Col> */}
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Description"
                        value={subjectData.description}
                        onChange={handleInputChange}
                        style={{ height: '100px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Image</Form.Label>
                      <Form className="dropzone mt-4 p-4 border-dashed text-center">
                        <DropFiles onFileChange={handleFileChange} />
                      </Form>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    <Form.Group className="mb-3">
                      <Button variant="primary" type="submit" className="m-1">
                        Create
                      </Button>
                      <Link href="/subjects" passHref>
                        <Button variant="outline-secondary" className="m-1">
                          Back to Index
                        </Button>
                      </Link>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AddNewSubject;
