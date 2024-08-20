import React, { useMemo, useState, useEffect } from 'react';
import { Image, Row, Col, Form } from 'react-bootstrap';
import TanstackTable from '../../../../../widgets/advance-table/TanstackTable';
import StudentActionMenu from './StudentActionMenu';
import axiosInstance from '../../../../../api/axiosConfig';

const InstructorsListItems = ({ students, handleShowEdit, handleShowDelete }) => {
  const [allstudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
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

  const fetchStudents = async () => {
    try {
      const response = await axiosInstance.get('/student');
      const studentsData = await Promise.all(response.data.map(fetchClassAndLevelNames));
      setAllStudents(studentsData);
      setFilteredStudents(studentsData);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [students]);

  useEffect(() => {
    if (searchTerm !== '') {
      const filteredList = allstudents.filter((student) =>
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filteredList);
    } else {
      setFilteredStudents(allstudents);
    }
  }, [searchTerm, allstudents]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const { firstname, lastname, image } = row.original;
          const imageUrl = image
            ? image
            : '/images/course/no-picture-available.jpg';

          return (
            <div className="d-flex align-items-center">
              <Image
                src={imageUrl}
                alt={`${firstname} ${lastname}`}
                className="rounded-circle avatar-md me-2"
              />
              <h5 className="mb-0">{`${firstname} ${lastname}`}</h5>
            </div>
          );
        }
      },
      {
        accessorKey: 'classeName',
        header: 'Class',
        cell: ({ row }) => row.original.classeName || 'N/A'
      },
      {
        accessorKey: 'levelName',
        header: 'Level',
        cell: ({ row }) => row.original.levelName || 'N/A'
      },
      { accessorKey: 'courses', header: 'Courses', cell: () => '5' }, // Static data for missing 'courses'
      {
        accessorKey: 'joined',
        header: 'Joined',
        cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString()
      },
      {
        accessorKey: 'shortcutmenu',
        header: '',
        cell: ({ row }) => (
          <div className="z-3">
            <StudentActionMenu student={row.original} onEdit={handleShowEdit} onDelete={handleShowDelete} />
          </div>
        )
      }
    ],
    [handleShowEdit, handleShowDelete]
  );

  const data = useMemo(() => filteredStudents, [filteredStudents]);

  return (
    <>
      <Row className="mb-3">
        <Col lg={12} md={12} sm={12}>
          <Form.Control
            type="search"
            className="form-control"
            value={searchTerm}
            placeholder="Search Students"
            onChange={handleSearch}
          />
        </Col>
      </Row>
      <TanstackTable
        data={data}
        columns={columns}
        filter={false} // Filter handled by local state
        pagination={true}
      />
    </>
  );
};

export default InstructorsListItems;