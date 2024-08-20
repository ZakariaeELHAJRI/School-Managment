'use client';
import React, { useState, useEffect } from 'react';
import { Breadcrumb, Card, Col, Nav, Row, Tab } from 'react-bootstrap';
import CoursesTable from './_components/CoursesTable';
import axiosInstance from '../../../../api/axiosConfig';
import FormationsTable from './_components/FormationsTable';
import ExercicesTable from './_components/ExercicesTable';
import CompetitionsTable from './_components/CompetitionsTable';
import SolutionsTable from './_components/SolutionsTable';
import QuizTable from './_components/QuizTable';

export default function ApprovalsManagment() {

    const [allcourses, setAllCourses] = useState([]);
    const [allformations, setAllFormations] = useState([]);
    const [formationTypes, setFormationTypes] = useState([]);
    const [allexercies, setAllExercies] = useState([]);
    const [allsolutions, setAllSolutions] = useState([]);
    const [allcompetitions, setAllCompetitions] = useState([]);
    const [allquiz, setAllQuiz] = useState([]);

    useEffect(() => {
        const fetchFormationTypes = async () => {
            try {
                const response = await axiosInstance.get('/formation-type');
                console.log('Formation types:', response.data);
                setFormationTypes(response.data);
            } catch (error) {
                console.error('Error fetching formation types:', error);
            }
        };

        const fetchAllFormations = async (formationTypes) => {
            try {
                const response = await axiosInstance.get('/formation');
                const formations = response.data;
                console.log('All formations approved without types', formations);
                console.log('All formation types', formationTypes);
                const formationsWithTypes = formations.map(formation => {
                    const formationType = formationTypes.find(type => type.id === formation.formation_type_id);
                    return {
                        ...formation,
                        formation_type: formationType ? formationType.name : 'Unknown'
                    };
                });

                console.log('All formations approved with types', formationsWithTypes);
                setAllFormations(formationsWithTypes);
            } catch (error) {
                console.error('Error fetching formations:', error);
            }
        };

        const fetchAllData = async () => {
            await fetchFormationTypes();
            await fetchAllFormations(formationTypes);
            fetchAllCourses();
            fetchAllCompetitions();
            fetchAllSolutions();
            fetchAllQuiz();
            fetchAllExercies();
        };

        const fetchAllCompetitions = async () => {
            try {
                const response = await axiosInstance.get('/competition');
                setAllCompetitions(response.data);
            } catch (error) {
                console.error('Error fetching competitions:', error);
            }
        }

        const fetchAllSolutions = async () => {
            try {
                const response = await axiosInstance.get('/solution');
                setAllSolutions(response.data);
            } catch (error) {
                console.error('Error fetching solutions:', error);
            }
        }

        const fetchAllQuiz = async () => {
            try {
                const response = await axiosInstance.get('/quizzes');
                setAllQuiz(response.data);
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        }

        const fetchAllExercies = async () => {
            try {
                const response = await axiosInstance.get('/exercice');
                setAllExercies(response.data);
            } catch (error) {
                console.error('Error fetching exercies:', error);
            }
        }

        const fetchAllCourses = async () => {
            try {
                const response = await axiosInstance.get('/course');
                setAllCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        }

        fetchAllData();
    }, []);

    return (
        <>
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
                        <div className="mb-3 mb-md-0">
                            <h1 className="mb-1 h2 fw-bold">All Approvals</h1>
                            <Breadcrumb>
                                <Breadcrumb.Item href="#">Approvals</Breadcrumb.Item>
                                <Breadcrumb.Item active>All</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={12} md={12} sm={12}>
                    <Tab.Container defaultActiveKey="courses">
                        <Card>
                            <Card.Header className="border-bottom-0 p-0 bg-white">
                                <Nav className="nav-lb-tab">
                                    <Nav.Item>
                                        <Nav.Link eventKey="courses" className="mb-sm-3 mb-md-0">
                                            Courses
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="formations" className="mb-sm-3 mb-md-0">
                                            Formations
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="exercies" className="mb-sm-3 mb-md-0">
                                            Exercies
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="solutions" className="mb-sm-3 mb-md-0">
                                            Solutions
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="competitions" className="mb-sm-3 mb-md-0">
                                            Competitions
                                        </Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="quiz" className="mb-sm-3 mb-md-0">
                                            Quiz
                                        </Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Tab.Content>
                                    <Tab.Pane eventKey="courses" className="pb-4">
                                        <CoursesTable courses_data={allcourses} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="formations" className="pb-4">
                                        <FormationsTable formations_data={allformations} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="exercies" className="pb-4">
                                        <ExercicesTable exercies_data={allexercies} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="competitions" className="pb-4">
                                        <CompetitionsTable competitions_data={allcompetitions} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="solutions" className="pb-4">
                                        <SolutionsTable solutions_data={allsolutions} />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="quiz" className="pb-4">
                                        <QuizTable quiz_data={allquiz} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
            </Row>
        </>
    );
}
