'use client';
import PopularInstructor from './_components/PopularInstructor'
import RecentCourses from './_components/RecentCourses'
import Activity from './_components/Activity'
import { Row, Col, Breadcrumb } from 'react-bootstrap'
import StatRightIcon from '../../../../widgets/stats/StatRightIcon'
import Link from 'next/link'
import RecentFormation from './_components/RecentFormation';
import RecentExercice from './_components/RecentExercice';
import RecentSolution from './_components/RecentSolution';
import RecentCompetitions from './_components/RecentCompetitions';
import RecentQuiz from './_components/RecentQuiz';

export default function Overview() {
  return (
    <> 
    <Row>
				<Col lg={12} md={12} sm={12}>
					<div className="border-bottom pb-4 mb-4 d-md-flex align-items-center justify-content-between">
						<div className="mb-3 mb-md-0">
							<h1 className="mb-1 h2 fw-bold">Approvals Dashboard</h1>
							<Breadcrumb>
								<Breadcrumb.Item href="#">Approvals</Breadcrumb.Item>
								<Breadcrumb.Item active>Overview</Breadcrumb.Item>
							</Breadcrumb>
						</div>

					</div>
				</Col>
			</Row>


    			<Row>
				<Col xl={3} lg={6} md={12} sm={12}>
					<StatRightIcon
						title="SALES"
						value="$10,800"
						summary="Number of sales"
						summaryValue="+20.9$"
						summaryIcon="up"
						showSummaryIcon
						iconName="shopping-bag"
						iconColorVariant="primary"
						classValue="mb-4"
					/>
				</Col>

				<Col xl={3} lg={6} md={12} sm={12}>
					<StatRightIcon
						title="COURSES"
						value="2,456"
						summary="Number of pending"
						summaryValue="120+"
						summaryIcon="down"
						iconName="book-open"
						iconColorVariant="primary"
						classValue="mb-4"
					/>
				</Col>

				<Col xl={3} lg={6} md={12} sm={12}>
					<StatRightIcon
						title="STUDENTS"
						value="1,22,456"
						summary="Students"
						summaryValue="+1200"
						summaryIcon="up"
						showSummaryIcon
						iconName="users"
						iconColorVariant="primary"
						classValue="mb-4"
					/>
				</Col>

				<Col xl={3} lg={6} md={12} sm={12}>
					<StatRightIcon
						title="INSTRUCTOR"
						value="22,786"
						summary="Instructor"
						summaryValue="+200"
						summaryIcon="up"
						showSummaryIcon
						iconName="user-check"
						iconColorVariant="primary"
						classValue="mb-4"
					/>
				</Col>
			</Row>

      <Row>

				<Col xl={4} lg={6} md={12} className="mb-4">
					<RecentCourses title="Recent Courses" />
				</Col>
        <Col xl={4} lg={6} md={12} className="mb-4">
					<RecentFormation title="Recent Formations" />
				</Col>
        <Col xl={4} lg={6} md={12} className="mb-4">
					<RecentExercice title="Recent Exercies" />
				</Col>
        <Col xl={4} lg={6} md={12} className="mb-4">
					<RecentSolution title="Recent Solutions" />
				</Col>
        <Col xl={4} lg={6} md={12} className="mb-4">
					<RecentCompetitions title="Recent Competitions" />
				</Col>
        <Col xl={4} lg={6} md={12} className="mb-4">
					<RecentQuiz title="Recent Quiz" />
				</Col>

			</Row>
    
    </>
  )
}
