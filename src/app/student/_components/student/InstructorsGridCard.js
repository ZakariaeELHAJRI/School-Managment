import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { Col, Card, Image, Row } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-feather';
import StudentActionMenu from './StudentActionMenu';
import axiosInstance from '../../../../../api/axiosConfig';

function InstructorsGridCard({ students, handleShowEdit, handleShowDelete }) {
  const [instructors, setInstructorsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchClassAndLevelNames = async (student) => {
    try {
      const [classResponse, levelResponse] = await Promise.all([
        axiosInstance.get(`/classe/${student.classe_uuid}`),
        axiosInstance.get(`/level/${student.level_uuid}`),
      ]);

      return {
        ...student,
        classeName: classResponse.data.name,
        levelName: levelResponse.data.name,
      };
    } catch (error) {
      console.error('Error fetching class or level data:', error);
      return student;
    }
  };

  const fetchAndSetStudents = async () => {
    try {
      const response = await axiosInstance.get('/student');
      const studentsData = await Promise.all(response.data.map(fetchClassAndLevelNames));
      setInstructorsList(studentsData.slice(0, 500));
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchAndSetStudents();
  }, [students]);

  const instructorsPerPage = 8;
  const [pageNumber, setPageNumber] = useState(0);
  const pagesVisited = pageNumber * instructorsPerPage;
  const pageCount = Math.ceil(instructors.length / instructorsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
    if (searchTerm !== '') {
      const filteredList = instructors.filter((instructor) =>
        instructor.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.lastname.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setInstructorsList(filteredList.slice(0, 500));
    } else {
      fetchAndSetStudents();
    }
    setPageNumber(0);
  };

  const displayInstructors = instructors
    .slice(pagesVisited, pagesVisited + instructorsPerPage)
    .map((instructor) => {
      const imageUrl = instructor.image
        ? instructor.image
        : '/images/course/no-picture-available.jpg';

      return (
        <Col xl={3} lg={6} md={6} sm={12} key={instructor.uuid} >
          <Card className="mb-5">
            <Card.Body className='p-0'>
              <div className='d-flex flex-reverse justify-content-end ' >
                 <StudentActionMenu student={instructor} onEdit={handleShowEdit} onDelete={handleShowDelete}  />
              </div>
             
              <div className="text-center">
                <Image
                  src={imageUrl}
                  className="rounded-circle avatar-xl mb-3"
                  alt={`${instructor.firstname} ${instructor.lastname}`}
                />
                <h4 className="mb-0 ">{instructor.firstname} {instructor.lastname}</h4>

              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2 mt-4">
                <span>Courses</span>
                <span className="text-dark">5</span> {/* Static data for missing courses */}
              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2 mt-4">
                <span>Class</span>
                <span className="text-dark">{instructor.classeName}</span> {/* Static data for missing courses */}
              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2 mt-4">
                <span>Level</span>
                <span className="text-dark">{instructor.levelName}</span> {/* Static data for missing courses */}
              </div>

            </Card.Body>
          </Card>
        </Col>
      );
    });

  return (
    <>
      <Row className="m-0">
        <Col lg={12} md={12} sm={12} className="mb-2 py-4 bg-white">
          <input
            type="search"
            className="form-control"
            value={searchTerm}
            placeholder="Search Students"
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <Row className="m-0">
        {displayInstructors.length > 0 ? (
          displayInstructors
        ) : (
          <Col>No matching students found.</Col>
        )}
      </Row>
      <ReactPaginate
        previousLabel={<ChevronLeft size="14px" />}
        nextLabel={<ChevronRight size="14px" />}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={'justify-content-center mb-0 pagination'}
        previousLinkClassName={'page-link mx-1 rounded'}
        nextLinkClassName={'page-link mx-1 rounded'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link mx-1 rounded'}
        disabledClassName={'paginationDisabled'}
        activeClassName={'active'}
      />
    </>
  );
}

export default InstructorsGridCard;
