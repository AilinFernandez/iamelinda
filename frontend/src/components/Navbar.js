import React from 'react';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Navbar() {
  return (
    <BSNavbar expand="lg" className="navbar-custom">
      <Container>
        <LinkContainer to="/">
          <BSNavbar.Brand>
            <i className="bi bi-book me-2"></i>
            iamelinda
          </BSNavbar.Brand>
        </LinkContainer>
        
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="bi bi-house me-1"></i>
                Inicio
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/search">
              <Nav.Link>
                <i className="bi bi-search me-1"></i>
                Buscar
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin">
              <Nav.Link>
                <i className="bi bi-gear me-1"></i>
                Admin
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
