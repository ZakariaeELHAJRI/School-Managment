// import node module libraries

import { Video, Link as LinkIcon, Image as ImageIcon } from 'react-feather';
import {
	Col,
	Row,
	Card,
	Button,
	Form,
	InputGroup,
	FormControl,
} from 'react-bootstrap';
import { FlatPickr } from '../../../../widgets/flat-pickr/FlatPickr';
import FormSelect from '../../../../widgets/form-select/FormSelect';
import ReactQuillEditor from '../../../../widgets/editor/ReactQuillEditor';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';



const AddNewStudent = () => {
	const initialValue = `<h4>One Ring to Rule Them All</h4>
  <br />
  <p>
  Three Rings for the
  <i> Elven-kingsunder</i> the sky, <br />
  Seven for the <u>Dwarf-lords</u> in halls of stone,
  Nine for Mortal Men, <br />
  doomed to die, One for the Dark Lord on his dark
  throne. <br />
  In the Land of Mordor where the Shadows lie.
  <br />
  <br />
  </p>
  <p>
  One Ring to
  <b>rule</b> them all, <br />
  One Ring to find them, <br />
  One Ring to bring them all and in the darkness bind
  them. <br />
  In the Land of Mordor where the Shadows lie.
  </p>
  <p>
  <br />
  </p>`;

	const categoryOptions = [
		{ value: 'course', label: 'Course' },
		{ value: 'post-category', label: 'Post Category' },
		{ value: 'workshop', label: 'Workshop' },
		{ value: 'marketing', label: 'Marketing' }
	];

	return (
		<>
      <Row>
        <Col lg={12} md={12} sm={12} className="mx-auto" >
          <Card>
            <Card.Header>
              <h4 className="mb-0">Create New Student</h4>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <Button variant="outline-secondary" className="me-1 mb-1">
                  <ImageIcon size="15px" className="me-1" />
                  Photo
                </Button>

                <Button variant="outline-secondary" className="me-1 mb-1">
                  <Video size="15px" className="me-1" /> Video
                </Button>

                <Button variant="outline-secondary" className="me-1 mb-1">
                  {' '}
                  Quote
                </Button>

                <Button variant="outline-secondary" className="mb-1">
                  <LinkIcon size="15px" className="me-1" />{' '}
                  Link
                </Button>
              </div>

              <Form action="#" className="dropzone mt-4 p-4 border-dashed text-center">
                <DropFiles />
              </Form>

              <Form className="mt-4">
                <Row>
                  <Col md={6} sm={12}>
                    {/* Date */}
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="selectDate">Date</Form.Label>
                      <FlatPickr value={''} />
                    </Form.Group>
                  </Col>

                  <Col md={6} sm={12}>
                    {/* Title */}
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="postTitle">Title</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Post Title"
                        id="postTitle"
                      />

                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    {/* Slug */}
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="basic-url">Slug</Form.Label>
                      <InputGroup>
                        <InputGroup.Text id="basic-addon3">
                          https://example.com/
                        </InputGroup.Text>
                        <FormControl
                          id="basic-url"
                          aria-describedby="basic-addon3"
                          placeholder="designcourses"
                        />
                      </InputGroup>
                      <Form.Text className="text-muted">
                        {' '}
                        Field must contain a unique value
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    {/* Excerpt */}
                    <Form.Group className="mb-3">
                      <Form.Label htmlFor="Excerpt">Excerpt</Form.Label>
                      <Form.Control
                        as="textarea"
                        placeholder="Excerpt"
                        id="Excerpt"
                        style={{ height: '100px' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    {/* Category */}
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <FormSelect options={categoryOptions} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    {/* Editor */}
                    <Form.Group className="mb-3">
                      <ReactQuillEditor initialValue={initialValue} />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={12} sm={12}>
                    {/* Button */}
                    <Form.Group className="mb-3">
                      <Button variant="primary" className="m-1">
                        Publish
                      </Button>
                      <Button variant="outline-secondary">Save to Draft</Button>
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

export default AddNewStudent;
