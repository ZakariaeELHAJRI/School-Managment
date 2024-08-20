import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { Col, Card, Image, Row } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-feather';
import Icon from '@mdi/react';
import { mdiStar } from '@mdi/js';
import { numberWithCommas } from '../../../../../helper/utils';
import TeacherActionMenu from './TeacherActionMenu';

function InstructorsGridCard({ teachers = [], handleShowEdit, handleShowDelete }) {
  const [instructors, setInstructorsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const storageUrl = process.env.NEXT_PUBLIC_STORAGE;

  useEffect(() => {
    if (teachers && teachers.length > 0) {
      setInstructorsList(teachers.slice(0, 500));
    }
  }, [teachers]);

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
      const filteredList = teachers.filter((instructor) =>
        instructor.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.lastname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        instructor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setInstructorsList(filteredList.slice(0, 500));
    } else {
      setInstructorsList(teachers.slice(0, 500));
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
        <Col xl={3} lg={6} md={6} sm={12} key={instructor.id}>
          <Card className="mb-5 shadow-sm">
            <Card.Body className="p-0">
              <div className="d-flex justify-content-end p-2">
                <TeacherActionMenu teacher={instructor} onEdit={handleShowEdit} onDelete={handleShowDelete} />
              </div>
              <div className="text-center">
                <Image
                  src={imageUrl}
                  className="rounded-circle avatar-xl mb-3"
                  alt={`${instructor.firstname} ${instructor.lastname}`}
                />
                <h5 className="mb-1">{instructor.firstname} {instructor.lastname}</h5>
                <p className="text-muted mb-3">{instructor.specialization}</p>
              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2">
                <span>Courses</span>
                <span className="text-dark">15</span>
              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2">
                <span>Specialty</span>
                <span className="text-dark">{instructor.specialization}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2">
                <span>Lives</span>
                <span className="text-dark">{numberWithCommas(8)}</span>
              </div>
              <div className="d-flex justify-content-between border-bottom px-3 py-2">
                <span>Formations</span>
                <span className="text-dark">{numberWithCommas(10)}</span>
              </div>
              <div className="d-flex justify-content-between px-3 py-2">
                <span>Salary</span>
                <span className="text-dark">${numberWithCommas(instructor.salary)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      );
    });

  return (
    <>
      <Row className="m-0 mb-3">
        <Col lg={12} md={12} sm={12} className="bg-white">
          <input
            type="search"
            className="form-control"
            value={searchTerm}
            placeholder="Search Instructors"
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <Row className="m-0">
        {displayInstructors.length > 0 ? (
          displayInstructors
        ) : (
          <Col>No matching instructors found.</Col>
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
