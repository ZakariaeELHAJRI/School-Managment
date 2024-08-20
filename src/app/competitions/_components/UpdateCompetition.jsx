import React, { Fragment, useState, useEffect } from 'react';
import { Form, FormControl, InputGroup, Button, Image } from 'react-bootstrap';
import ReactQuillEditor from '../../../../widgets/editor/ReactQuillEditor';
import FormSelect from '../../../../widgets/form-select/FormSelect';

const UpdateCompetition = ({ competition }) => {
  const parentOptions = [
    { value: '', label: 'Select' },
    { value: 'competition', label: 'competition' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'company', label: 'Company' }
  ];

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    parent: '',
    description: '',
    image: null
  });

  useEffect(() => {
    if (competition) {
      setFormData({
        title: competition.title || '',
        slug: competition.slug || '',
        parent: competition.parent || '',
        description: competition.description || '',
        image: competition.image || null
      });
    }
  }, [competition]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const  handleImageChange = (e) => {
    setFormData({ ...formData, image: URL.createObjectURL(e.target.files[0]) });
  };

  return (
    <Fragment>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Write a Category"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            Field must contain a unique value
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Slug</Form.Label>
          <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon3">
              https://example.com/
            </InputGroup.Text>
            <FormControl
              name="slug"
              aria-describedby="basic-addon3"
              placeholder="designcompetitions"
              value={formData.slug}
              onChange={handleChange}
            />
          </InputGroup>
          <Form.Text className="text-muted">
            Field must contain a unique value
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Parent</Form.Label>
          <FormSelect
            options={parentOptions}
            name="parent"
            value={formData.parent}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <ReactQuillEditor
            initialValue={formData.description}
            onChange={handleEditorChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>competition Image</Form.Label>
          {formData.image && (
            <div className="mb-3">
                <Image
                src={formData.image}
                rounded
                className="img-fluid"
                style={{ maxWidth: '200px', height: 'auto' }} // Adjust the maxWidth as needed
                />
            </div>
            )}
          <Form.Control
            type="file"
            name="image"
            onChange={handleImageChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Enabled</Form.Label>
          <Form.Check
            type="checkbox"
            name="enabled"
            defaultChecked
            className="form-switch"
            onChange={handleChange}
          />
        </Form.Group>
      </Form>
    </Fragment>
  );
};

export default UpdateCompetition;
