import React from 'react';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Navbar() {
  return (
    <BSNavbar expand="lg" className="zento-navbar">
      <Container>
        {/* Logo central */}
        <LinkContainer to="/">
          <BSNavbar.Brand className="zento-logo">
            <span className="logo-icon">M</span>
            <span className="logo-text">Melinda's Corner</span>
          </BSNavbar.Brand>
        </LinkContainer>
        
        {/* Navegación móvil */}
        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto mobile-nav">
            <LinkContainer to="/">
              <Nav.Link>Inicio</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/reviews">
              <Nav.Link>Reseñas</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/search">
              <Nav.Link>Recomendador</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/library">
              <Nav.Link>Biblioteca</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/blog">
              <Nav.Link>Blog</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/about">
              <Nav.Link>Sobre mí</Nav.Link>
            </LinkContainer>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
