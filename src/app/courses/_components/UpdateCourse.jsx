import React, { Fragment, useState, useEffect } from 'react';
import { Form, Col, Row, Button, Image } from 'react-bootstrap';
import ReactQuillEditor from '../../../../widgets/editor/ReactQuillEditor';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';
import  axiosInstance   from '../../../../api/axiosConfig';
import brokenImageUrl from '../../../../public/images/course/no-picture-available.jpg';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

const UpdateCourse = ({ course, subjects, onClose }) => {
  const [formData, setFormData] = useState({
    subject_id: '',
    title: '',
    description: '',
    image: '',
    body: '',
  });

  useEffect(() => {
    if (course) {
      setFormData({
        subject_id: course.subject_id || '',
        title: course.title || '',
        description: course.description || '',
        image: course.image || '',
        body: course.body || '',
      });
    }
  }, [course]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (value) => {
    setFormData((prevFormData) => ({ ...prevFormData, body: value }));
  };

  const handleImageChange = (files) => {
    setFormData({ ...formData, image: files[0] });
  };

  const handleSaveChanges = async () => {
    const updatedCourse = {
      ...course,
      ...formData,
    };

    const formDataObj = new FormData();
    formDataObj.append('subject_id', updatedCourse.subject_id);
    formDataObj.append('title', updatedCourse.title);
    formDataObj.append('description', updatedCourse.description);
    formDataObj.append('body', updatedCourse.body);
    if (updatedCourse.image instanceof File) {
      formDataObj.append('image', updatedCourse.image);
    }

    // Log FormData for debugging
    for (let [key, value] of formDataObj.entries()) {
      console.log(`${key}, ${value}`);
    }

    try {
      const response = await axiosInstance.put(`/courses/${updatedCourse.id}`, formDataObj, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Course updated:', response.data);
    } catch (error) {
      console.error('Error updating course:', error);
    }
  };

  return (
    <Fragment>
      <Form>
        <Row className="mt-4">
          <Col md={6} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                placeholder="Title"
                value={formData.title}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6} sm={12}>
            <Form.Group className="mb-3">
              <Form.Label>Subject</Form.Label>
              <Form.Select
                name="subject_id"
                value={formData.subject_id}
                onChange={handleChange}
              >
                <option value="">Please select the Subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
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
                value={formData.description}
                onChange={handleChange}
                style={{ height: '100px' }}
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
              <Form.Label>Body</Form.Label>
              <ReactQuillEditor
                initialValue={formData.body}
                onChange={handleEditorChange}
                style={{ minHeight: '200px' }}
              />
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

export default UpdateCourse;
