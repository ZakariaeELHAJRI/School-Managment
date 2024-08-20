import React, { Fragment, useState, useEffect } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import axiosInstance from '../../../../api/axiosConfig';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';

const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

const UpdateFormation = ({ formation, onBack, onSave }) => {
  const [formationTypes, setFormationTypes] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [isNewImageSelected, setIsNewImageSelected] = useState(false);

  useEffect(() => {
    const fetchFormationTypes = async () => {
      try {
        const response = await axiosInstance.get('/formation-type');
        setFormationTypes(response.data);
      } catch (error) {
        console.error('Error fetching formation types:', error);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axiosInstance.get('/teacher');
        setTeachers(response.data);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    };

    fetchFormationTypes();
    fetchTeachers();
  }, []);

  const [formData, setFormData] = useState({
    title: '',
    formation_type_uuid: '',
    teacher_uuid: '',
    description: '',
    image: '',
    start_date: '',
    end_date: '',
    approvation: false
  });

  useEffect(() => {
    if (formation) {
      setFormData({
        title: formation.title,
        formation_type_uuid: formation.formation_type_uuid,
        teacher_uuid: formation.teacher_uuid,
        description: formation.description,
        image: formation.image,
        start_date: formation.start_date ? new Date(formation.start_date).toISOString().split('T')[0] : '',
        end_date: formation.end_date ? new Date(formation.end_date).toISOString().split('T')[0] : '',
        approvation: formation.approvation
      });
    }
  }, [formation]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (files) => {
    setFormData(prevState => ({ ...prevState, image: files[0] }));
    setIsNewImageSelected(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('formation_type_uuid', formData.formation_type_uuid);
      formDataToSend.append('teacher_uuid', formData.teacher_uuid);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('start_date', formData.start_date);
      formDataToSend.append('end_date', formData.end_date);
      formDataToSend.append('approvation', formData.approvation);

      if (isNewImageSelected && formData.image) {
        formDataToSend.append('image', formData.image);
      }

      await axiosInstance.put(`/formation/${formation.uuid}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onSave();
      onBack();
    } catch (error) {
      console.error('Error updating formation:', error);
    }
  };

  return (
    <Fragment>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Formation Type</Form.Label>
          <Form.Select
            name="formation_type_uuid"
            value={formData.formation_type_uuid}
            onChange={handleChange}
            required
          >
            <option value="">Select Formation Type</option>
            {formationTypes.map((type) => (
              <option key={type.uuid} value={type.uuid}>
                {type.title}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Teacher</Form.Label>
          <Form.Select
            name="teacher_uuid"
            value={formData.teacher_uuid}
            onChange={handleChange}
            required
          >
            <option value="">Select Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.uuid} value={teacher.uuid}>
                {teacher.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Image</Form.Label>
          {formData.image && !isNewImageSelected && (
            <div className="mb-3">
              <Image
                src={formData.image}
                alt="Formation Image"
                rounded
                style={{ maxWidth: '200px' }}
              />
            </div>
          )}
          <div className="dropzone mt-4 p-4 border-dashed text-center">
            <DropFiles onFileChange={handleImageChange} />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            name="approvation"
            label="Approved"
            checked={formData.approvation}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="formUpdateCourseDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter brief about course..."
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="d-flex justify-content-start mt-3 gap-2">
          <Button variant="primary" type="submit">Save Changes</Button>
          <Button variant="outline-secondary" onClick={onBack}>Close</Button>
        </Form.Group>
      </Form>
    </Fragment>
  );
};

export default UpdateFormation;
