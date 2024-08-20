'use client';
// import node module libraries
import React, { Fragment, useState, useEffect , useCallback } from 'react';
import { Col, Row, Table, Button } from 'react-bootstrap';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table';
import Link from 'next/link';
import Pagination from '../../../widgets/advance-table/Pagination';
import GlobalFilter from '../../../widgets/advance-table/GlobalFilter';
import NewCourse from './NewCourse';
import axiosInstance from '../../../api/axiosConfig';

const TanstackTable = ({ subjectId, data, columns, filter = true, pagination = false, filterPlaceholder, exportButton = false, handleRowClick }) => {
    const [filtering, setFiltering] = useState('');
    const [rowSelection, setRowSelection] = useState({});
    const [showNewCourse, setShowNewCourse] = useState(false);
    const [courses, setCourses] = useState([]); // This state should hold the fetched courses

    const fetchCourses = useCallback(async () => {
        try {
          const response = await axiosInstance.get(`/course/subject/${subjectId}`);
          setCourses(response.data); // Update the state with the fetched data
        } catch (error) {
          toast.error('Error fetching courses!');
        }
    }, [subjectId ,data]);

    // Ensure to call fetchCourses when `TanstackTable` mounts and when `subjectId` changes
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    const table = useReactTable({
        data: courses, // Use the courses state here
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter: filtering,
            rowSelection,
        },
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setFiltering,
        debugTable: false,
    });

    const handleAdd = () => {
        setShowNewCourse(true); // Show the NewCourse component
    };

    const handleRowClickWithPropagation = (e, row) => {
        // Prevent row click if it's an action within the row
        if (e.target.closest('.action-menu') || e.target.closest('.dropdown-item-icon')) return;
        handleRowClick(row);
    };

    return (
        <Fragment>
            {showNewCourse ? (
                <NewCourse setShowNewCourse={setShowNewCourse} refresh={fetchCourses}/>
            ) : (
                <>
                    {!exportButton && filter && (
                        <div className="overflow-hidden">
                            <Row className='d-flex justify-content-between p-3'>
                                <Col xs="auto">
                                    <GlobalFilter filtering={filtering} setFiltering={setFiltering} placeholder={filterPlaceholder} />
                                </Col>
                                <Col xs="auto">
                                    <Button onClick={handleAdd} className="btn btn-primary">Create Course</Button>
                                </Col>
                            </Row>
                        </div>
                    )}

                    {exportButton && filter && (
                        <Row>
                            <Col className="mb-lg-0 mb-2 ps-5 py-4">
                                <GlobalFilter filtering={filtering} setFiltering={setFiltering} placeholder={filterPlaceholder} />
                            </Col>
                            <Col xs="auto" className="mb-lg-0 mb-2 pe-5 py-4">
                                <Link href="#" className="btn btn-secondary">
                                    Export CSV
                                </Link>
                            </Col>
                        </Row>
                    )}

                    <div className="border-0 overflow-y-hidden">
                        <Table hover responsive className="text-nowrap table-centered">
                            <thead className="table-light">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id} onClick={(e) => handleRowClickWithPropagation(e, row.original)}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {pagination && <Pagination table={table} />}
                </>
            )}
        </Fragment>
    );
};

export default TanstackTable;
