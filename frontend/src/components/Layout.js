import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Sidebar from './Sidebar';

function Layout({ children, showSidebar = true }) {
  return (
    <Container fluid className="layout-container">
      <Row className="layout-row">
        {showSidebar && (
          <Col lg={3} className="sidebar-col">
            <Sidebar />
          </Col>
        )}
        <Col lg={showSidebar ? 9 : 12} className="main-content-col">
          <div className="main-content">
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Layout;
