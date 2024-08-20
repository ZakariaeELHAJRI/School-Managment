import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Col, Row, Card, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import ReactQuillEditor from '../../../../widgets/editor/ReactQuillEditor';
import  axiosInstance  from '../../../../api/axiosConfig';
import { DropFiles } from '../../../../widgets/dropfiles/DropFiles';

const AddNewCourse = ({subjects,courses}) => {
	const [courseData, setCourseData] = useState({
		subject_id: '',
		title: '',
		description: '',
		image: '',
		body: ''
	});



	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCourseData({
			...courseData,
			[name]: value
		});
	};

	const handleEditorChange = (value) => {
		setCourseData((prevData) => ({
		  ...prevData,
		  body: value
		}));
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
		formData.append('subject_id', courseData.subject_id);
		formData.append('title', courseData.title);
		formData.append('description', courseData.description);
		formData.append('body', courseData.body);
		formData.append('image', courseData.image);

		// display content of formData
		for (var pair of formData.entries()) {
			console.log(pair[0]+ ', ' + pair[1]); 
		}
		try {
			const response = await axiosInstance.post('/courses', formData, {
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
							<h4 className="mb-0">Create Course</h4>
						</Card.Header>
						<Card.Body>
							<Form onSubmit={handleSubmit}>
								<Row className="mt-4">
									<Col md={6} sm={12}>
										<Form.Group className="mb-3">
											<Form.Label>Title</Form.Label>
											<Form.Control
												type="text"
												name="title"
												placeholder="Title"
												value={courseData.title}
												onChange={handleInputChange}
											/>
										</Form.Group>
									</Col>

									<Col md={6} sm={12}>
										<Form.Group className="mb-3">
											<Form.Label>Subject</Form.Label>
											<Form.Select
												name="subject_id"
												value={courseData.subject_id}
												onChange={handleInputChange}
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
												value={courseData.description}
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
											<Form.Label>Body</Form.Label>
											<ReactQuillEditor
												initialValue={courseData.body}
												onChange={handleEditorChange}
												style={{ minHeight: '400px' }}
											/>
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

export default AddNewCourse;