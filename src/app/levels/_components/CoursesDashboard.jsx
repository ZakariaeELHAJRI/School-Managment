import React from 'react';
import { Container, Row, Col, Card, Button, Accordion, ProgressBar, Image, ListGroup } from 'react-bootstrap';
import { FaBook, FaFile, FaVideo, FaTv } from 'react-icons/fa';

const courseData = {
  assignee: {
    name: 'Marvin McKinney',
    role: 'Owner',
    image: 'https://via.placeholder.com/40'
  },
  team: ['https://via.placeholder.com/40', 'https://via.placeholder.com/40'],
  startDate: '01 Jan, 2021',
  endDate: '30 Dec, 2021',
  estimatedTime: '30 Days',
  cost: '$18,000',
  progress: 50,
  description: `لاحظ أن النهاية موجودة ∀x∈R
 وبالتالي فإن الدالة x→x2
 قابلة للإشتقاق على R
 ولدينا : ∀x∈R(x2)′=2x


ملحوظة : اشتقاق دالة في نقطة a
 عبارة عن نهاية. وبالتالي يمكننا تعريف الاشتقاق على يمين النقطة a
 وعلى يسارها.

تذكير : النهاية على يمين النقطة a
 هو عندما تؤول x
 إلى a
 مع x>a
 : أي تقترب x
 من a
 من جهة اليمين, أما اليسار فالعكس وهو x<a
.

النهاية على اليمين وعلى اليسار
رسم يوضح النهاية على اليمين وعلى اليسار


الاشتقاق على اليمين f′d(a)=limx→a+f(x)−f(a)x−a


الاشتقاق على اليسار f′g(a)=limx→a−f(x)−f(a)x−a


وتكون f
 قابلة للاشتقاق فى نقطة a
 إذا وفقط إذا كانت قابلة للاشتقاق فى يمين a
 و فى يسار النقطة a
 و f′d(a)=f′g(a)
.

مماس دالة في نقطة
مثال لمماس دالة
رسم مبياني للدالة x² (اللون الأحمر) . ومماسها في النقطة x = 1 (اللون الأزرق ) . وكيف أن المنحييان يتقاربان جدا بجوار النقطة A .
لتكن f
 دالة قابلة للإشتقاق في نقطة a∈I
 . إذن توجد دالة h
 معرفة بجوار مفتوح للنقطة a
 (باستثناء a
) بحيث :

limx→ah(x)=0
 و f(x)−f(a)x−a=f′(a)+h(x)



تذكير : جوار مفتوح لنقطة a∈R
 هو المجال V(a)=]a−h,a+h[
 بحيث h>0
 ويكون h
 عدد صغير موجب غير منعدم.

بكل بساطة الدالة h
 هي ∀x∈V(a)∖{a} : h(x)=f(x)−f(a)x−a−f′(a)


لدينا بجوار النقطة a
 :

f(x)=(h(x)+f′(a))(x−a)+f(a)


معادلة المماس للدالة f
 في النقطة a
 هي y=f′(a)(x−a)+f(a)
 .

لاحظ أنه بجوار a
 لدينا limx→ah(x)=0
 إذن : f(x)≈f′(a)(x−a)+f(a)
 .

مثال : نعتبر الدالة f(x)=x2
, لنحدد معادلة المماس في النقطة a=1
 :

كما رأينا سابقا لدينا ∀x∈Rf′(x)=2x


وبالتالي فإن معادلة المماس في a=1
 هي y=2(x−1)+1=2x−1
`,
  targetAudience: 'Target audience details here',
  competition: 'Competition details here',
  videos: ['Video 1', 'Video 2', 'Video 3'],
  lives: ['Live 1', 'Live 2', 'Live 3'],
  files: ['File 1', 'File 2', 'File 3'],
  exercises: ['Exercise 1', 'Exercise 2', 'Exercise 3'],
  teacher: {
    name: 'محمد علي',
    role: 'أستاذ مادة الفلسفة',
    courses: 15,
    lives: 8,
    formations: 10,
    salary: '2,000',
    profileImage: 'https://via.placeholder.com/80',
  }
};

const Dashboard = ({ course = courseData, handleBackClick }) => {
  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Button onClick={handleBackClick}>Back to Courses</Button>
        </Col>
      </Row>
      <Row>
        <Col lg={9}>
          <Card>
            <Card.Body>
            <h3 className="mb-3">Course </h3>
            <p>{course.title}</p>
              <h5 className="mb-3">Course  Description</h5>
              <p>{courseData.description}</p>
              <h5 className="mb-3">Target Audience</h5>
              <p>{course.targetAudience}</p>
              <h5 className="mb-3">Competition</h5>
              <p>{course.competition}</p>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3}>
          <Row>
            <Col lg={12}>
              <Card className="h-100">
                <Card.Body>
                  <h5 className="mb-3">Teacher Information</h5>
                  {courseData.teacher?.profileImage && (
                    <Image src={courseData.teacher.profileImage} roundedCircle width="80" className="mb-2" />
                  )}
                  {courseData.teacher?.name && (
                    <h5>{courseData.teacher.name}</h5>
                  )}
                  {courseData.teacher?.role && (
                    <p>{courseData.teacher.role}</p>
                  )}
                  {courseData.teacher && (
                    <ListGroup variant="flush">
                      <ListGroup.Item>
                        <strong>Courses</strong> {courseData.teacher.courseDatas}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Lives:</strong> {courseData.teacher.lives}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Formations:</strong> {courseData.teacher.formations}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Salary:</strong> {courseData.teacher.salary}
                      </ListGroup.Item>
                    </ListGroup>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                  <Accordion.Header><FaVideo className="me-2 text-warning ml-auto" /> Videos</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      {course.videos && course.videos.map((video, index) => (
                        <ListGroup.Item key={index}>{video}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header><FaTv className="me-2 text-danger custom-icon-left" /> Lives</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      {course.lives && course.lives.map((live, index) => (
                        <ListGroup.Item key={index}>{live}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header><FaFile className="me-2 text-success custom-icon-left" /> Files</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      {course.files && course.files.map((file, index) => (
                        <ListGroup.Item key={index}>{file}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header><FaBook className="me-2 text-primary custom-icon-left" /> Exercises</Accordion.Header>
                  <Accordion.Body>
                    <ListGroup>
                      {course.exercises && course.exercises.map((exercise, index) => (
                        <ListGroup.Item key={index}>{exercise}</ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;
