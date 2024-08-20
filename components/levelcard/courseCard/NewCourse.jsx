import { useState, useEffect } from 'react';
import { Col, Row, Card, Button, Form } from 'react-bootstrap';
import axiosInstance from '../../../api/axiosConfig';
import { DropFiles } from '../../../widgets/dropfiles/DropFiles';
import ReactQuillEditor from '../../../widgets/editor/ReactQuillEditor';
import { toast } from 'react-toastify';

const NewCourse = ({ setShowNewCourse, refresh }) => {
  const [teachers, setTeachers] = useState([]);
  const [courseData, setCourseData] = useState({
    uuid: '',               
    title: '',
    image: '',            
    description: '',
    subject_uuid: '',       
    teacher_uuid: '',       
    approvation: false      
  });
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axiosInstance.get('/subject');
        console.log('subjects', response.data);
        setSubjects(response.data);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/teacher');
        console.log('teachers', response.data);
        if (Array.isArray(response.data)) {
          setTeachers(response.data);
        } else {
          console.error('Unexpected response data format:', response.data);
          setTeachers([]); 
        }
      } catch (error) {
        console.error('Error fetching teachers:', error);
        setTeachers([]); 
      }
    };

    fetchTeachers();
    fetchSubjects();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCourseData({
      ...courseData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (files) => {
    setCourseData({
      ...courseData,
      image: files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', courseData.title);
    formData.append('description', courseData.description);
    formData.append('subject_uuid', courseData.subject_uuid);
    formData.append('teacher_uuid', courseData.teacher_uuid);
    formData.append('approvation', courseData.approvation);
    if (courseData.image) {
      formData.append('image', courseData.image);
    }

    try {
      const response = await axiosInstance.post('/course', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      toast.success('Course created successfully!');
      refresh(); 
      setShowNewCourse(false);
    } catch (error) {
      console.error(error);
      toast.error('Error creating course!');
    }
  };

  return (
    <>
      <Row>
        <Col lg={12} md={12} sm={12} className="mx-auto">
          <Card>
            <Card.Header>
              <h4 className="mb-0">Create Course</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row className="mt-4">
                  <Col md={4} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        placeholder="Title"
                        value={courseData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Subject</Form.Label>
                      <Form.Select
                        name="subject_uuid"
                        value={courseData.subject_uuid}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Please select the Subject</option>
                        {subjects.map(subject => (
                          <option key={subject.uuid} value={subject.uuid}>
                            {subject.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Teacher</Form.Label>
                      <Form.Select
                        name="teacher_uuid"
                        value={courseData.teacher_uuid}
                        onChange={handleInputChange}
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
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Description</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="description"
                        placeholder="Description"
                        value={courseData.description}
                        onChange={handleInputChange}
                        style={{ height: '100px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Col md={6} className="mb-3">
                  <Form.Group controlId="formIsActive">
                    <Form.Label>Approval Status</Form.Label>
                    <Form.Check
                      type="checkbox"
                      name="approvation"
                      className="form-switch"
                      checked={courseData.approvation}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>

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
                        Publish
                      </Button>
                      <Button variant="outline-secondary" type="button" className="m-1">
                        Save to Draft
                      </Button>
                      <Button variant="outline-primary" type="button" className="m-1" onClick={() => setShowNewCourse(false)}>
                        Cancel
                      </Button>
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

export default NewCourse;
