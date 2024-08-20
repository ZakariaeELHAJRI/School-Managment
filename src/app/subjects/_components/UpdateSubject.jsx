import React, { Fragment, useState, useEffect } from 'react';
import { Form, Row, Button,Col , Image } from 'react-bootstrap';
import ReactQuillEditor from '../../../../widgets/editor/ReactQuillEditor';
import axiosInstance from '../../../../api/axiosConfig';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';
import brokenImageUrl from '../../../../public/images/course/no-picture-available.jpg';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

const UpdateSubject = ({ subject, onClose }) => {
  const [formData, setFormData] = useState({
    teacher_id: '',
    classe_id: '',
    name: '',
    description: '',
    image: null
  });

  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (subject) {
      setFormData({
        teacher_id: subject.teacher_id || '',
        classe_id: subject.classe_id || '',
        name: subject.name || '',
        description: subject.description || '',
        image: subject.image || null
      });
    }

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
  }, [subject]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const handleImageChange = (files) => {
    setFormData({ ...formData, image: files[0] });
  };

  const handleSaveChanges = async () => {
    const updatedSubject = {
      ...subject,
      ...formData,
    };

    const formDataObj = new FormData();
    formDataObj.append('teacher_id', updatedSubject.teacher_id);
    formDataObj.append('classe_id', updatedSubject.classe_id);
    formDataObj.append('name', updatedSubject.name);
    formDataObj.append('description', updatedSubject.description);
    if (updatedSubject.image instanceof File) {
      formDataObj.append('image', updatedSubject.image);
    }

    // Log FormData for debugging
    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}, ${value}`);
    }

    try {
      const response = await axiosInstance.put(`/subjects/${updatedSubject.id}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Subject updated:', response.data);
    } catch (error) {
      console.error('Error updating subject:', error);
    }
  };

  return (
    <Fragment>
      <Form>
        <Row className="mt-4">
          <Col md={6} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Teacher</Form.Label>
              <Form.Select
                name="teacher_id"
                value={formData.teacher_id}
                onChange={handleChange}
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
                value={formData.classe_id}
                onChange={handleChange}
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
                value={formData.name}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>


        </Row>

        <Row>
          <Col md={12} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <ReactQuillEditor
                initialValue={formData.description}
                onChange={handleEditorChange}
                style={{ minHeight: '200px' }}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              {formData.image && (
                <div className="mb-3">
                  <Image
                    src={formData.image instanceof File ? URL.createObjectURL(formData.image) : `${storageUrl}/${formData.image.replace('public/', '')}`}
                    rounded
                    className="img-fluid"
                    style={{ maxWidth: '200px', height: 'auto' }} // Adjust the maxWidth as needed
                  />
                </div>
              )}
              <Form className="dropzone mt-4 p-4 border-dashed text-center">
                <DropFiles onFileChange={handleImageChange} />
              </Form>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12} sm={12}>
            <Form.Group className="mb-3">
              <Button variant="primary" onClick={handleSaveChanges} className="m-1">
                Save Changes
              </Button>
              <Button variant="outline-secondary" onClick={onClose} className="m-1">
                Close
              </Button>
            </Form.Group>
          </Col>
        </Row>
      </Form>
    </Fragment>
  );
};

export default UpdateSubject;
