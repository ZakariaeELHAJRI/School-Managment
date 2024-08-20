import React from 'react';
import { Row, Col ,Tab } from 'react-bootstrap';
import Link from 'next/link';

import { MdNavigateBefore } from 'react-icons/md';
import { FlatPickr } from '../../../widgets/flat-pickr/FlatPickr';
import GridListViewButton from '../../../widgets/miscellaneous/GridListViewButton';

const MainHeader = ({ data }) => {
  return (
    <Tab.Container defaultActiveKey="grid">
    <Row>
      <Col lg={12} md={12} sm={12}>
        <div className="border-bottom pb-4 mb-4 d-flex align-items-center justify-content-between">
          <div className="mb-3 mb-md-0">
            <h1 className="mb-0 h2 fw-bold">{data.title}</h1>
            {data.breadcrumbs && (
              <nav aria-label="breadcrumb">
                <ol style={{ listStyle: 'none', display: 'flex', padding: 0, justifyContent: 'flex-end' }}>
                  {data.breadcrumbs.map((breadcrumb, index) => (
                    <li 
                      key={index} 
                      style={{ display: 'flex', alignItems: 'center', marginLeft: index > 0 ? '10px' : '0' }}
                      aria-current={index === data.breadcrumbs.length - 1 ? 'page' : undefined}
                    >
                      {index > 0 && <MdNavigateBefore style={{ margin: '0 5px' }} />}
                      {breadcrumb.href ? (
                        <Link href={breadcrumb.href}>
                          <div style={{ textDecoration: 'none', color: index === data.breadcrumbs.length - 1 ? 'black' : 'blue' }}>
                            {breadcrumb.label}
                          </div>
                        </Link>
                      ) : (
                        <span style={{ color: index === data.breadcrumbs.length - 1 ? 'black' : 'blue' }}>
                          {breadcrumb.label}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            )}
          </div>
          <div className="d-flex">
            {data.datePicker && (
              <div className="input-group me-3">
                <FlatPickr value={''} />
                <span className="input-group-text text-muted" id="basic-addon2">
                  <i className="fe fe-calendar"></i>
                </span>
              </div>
            )}
            {data.addNewLabel && data.addNewHref && (
              <Link href={data.addNewHref} className="btn btn-primary">
                {data.addNewLabel}
              </Link>
            )}
            {data.settingLink && (
              <Link href={data.settingLink} className="btn btn-primary">
                Setting
              </Link>
            )}
            {data.viewToggle && (
              <div>
                {/* Replace with actual view toggle component if needed */}
                <GridListViewButton keyGrid="grid" keyList="list" />
              </div>
            )}
          </div>
        </div>
      </Col>
    </Row>
    </Tab.Container>
  );
};

export default MainHeader;

