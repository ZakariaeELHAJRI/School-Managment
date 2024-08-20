
import styles from "./page.module.css";
import React from 'react';

import { Row, Col } from "react-bootstrap";
import { stats } from "./data";
import dynamic from "next/dynamic";

// Dynamically import StatRightIcon with SSR disabled
const StatRightIcon = dynamic(() => import("../../widgets/stats/StatRightIcon"), { ssr: false });

export default function Home() {

  return (
    <>
          <Row>
        {stats.map((stat, index) => (
          <Col xl={3} lg={6} md={12} sm={12} key={index}>
            <StatRightIcon {...stat} />
          </Col>
        ))}
      </Row>

      
    </>


  );
}
