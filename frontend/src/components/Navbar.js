import React from 'react';
import { Navbar as BSNavbar, Nav, Container, Form, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Navbar() {
  return (
    <BSNavbar expand="lg" className="zento-navbar">
      <Container>
        {/* Barra de búsqueda izquierda */}
        <div className="navbar-search">
          <Form.Control 
            type="search" 
            placeholder="Quick Search..." 
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
        
        {/* Logo central */}
        <LinkContainer to="/">
          <BSNavbar.Brand className="zento-logo">
            <span className="logo-icon">M</span>
            <span className="logo-text">Melinda's Corner</span>
          </BSNavbar.Brand>
        </LinkContainer>
        
        {/* Navegación derecha */}
        <div className="navbar-right">
          <LinkContainer to="/contact">
            <Button className="contact-btn">Contacto</Button>
          </LinkContainer>
          <div className="menu-icon">
            <i className="fas fa-ellipsis-v"></i>
          </div>
        </div>
        
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
            <LinkContainer to="/contact">
              <Nav.Link>Contacto</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/admin">
              <Nav.Link>Admin</Nav.Link>
            </LinkContainer>
          </Nav>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  );
}

export default Navbar;
