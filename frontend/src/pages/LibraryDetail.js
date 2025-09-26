import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
// Usando Font Awesome en lugar de react-bootstrap-icons
import Layout from '../components/Layout';
import API_BASE_URL from '../config/api';

function LibraryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadItem();
  }, [id]);

  const loadItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/library/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Item de biblioteca no encontrado');
        } else {
          throw new Error('Error al cargar item');
        }
        return;
      }
      const data = await response.json();
      setItem(data);
    } catch (error) {
      console.error('Error cargando item:', error);
      setError('Error al cargar el item');
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };


  const getStatusColor = (status) => {
    const colors = {
      'Completed': 'success',
      'Reading': 'warning',
      'Want to Read': 'info',
      'Dropped': 'danger'
    };
    return colors[status] || 'secondary';
  };

  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando item...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <h2>Item no encontrado</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate('/library')}>
              Volver a Biblioteca
            </Button>
          </div>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container>
        {/* Header */}
        <div className="library-header mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/library')}
            className="mb-3"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver a Biblioteca
          </Button>
          
          {/* Cover Image */}
          {item.coverImage && (
            <div className="library-cover mb-4">
              <img 
                src={item.coverImage} 
                alt={`Portada de ${item.title}`}
                className="library-cover-img"
              />
            </div>
          )}
          
          <div className="library-meta mb-3">
            <Badge variant="secondary" className="me-2">
              {item.type}
            </Badge>
            <Badge variant={getStatusColor(item.status)} className="me-2">
              {item.status}
            </Badge>
            <span className="rating me-2">
              {getRatingStars(item.rating)}
            </span>
            {item.year && <span className="text-muted">{item.year}</span>}
          </div>

          <h1 className="library-title mb-2">{item.title}</h1>
          <h4 className="library-author text-muted mb-3">por {item.author}</h4>
        </div>

        <Row>
          <Col lg={8}>
            {/* Content */}
            <Card className="library-content-card">
              <Card.Body>
                <div className="library-description mb-4">
                  <h5>Descripción</h5>
                  <p className="lead">{item.description}</p>
                </div>

                {/* Placeholder for full content */}
                <div className="library-full-content">
                  <h5>Mi opinión</h5>
                  <p>
                    Aquí iría mi opinión completa sobre este item de la biblioteca. 
                    Por ahora, este es un placeholder para mostrar cómo se vería 
                    la página de detalle.
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                    Sed do eiusmod tempor incididunt ut labore et dolore magna 
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit 
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint 
                    occaecat cupidatat non proident, sunt in culpa qui officia 
                    deserunt mollit anim id est laborum.
                  </p>
                </div>

                {/* Tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="library-tags mt-4">
                    <h6>Etiquetas</h6>
                    <div className="tags-list">
                      {item.tags && Array.isArray(item.tags) && item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline-primary" className="me-2 mb-2">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            {/* Sidebar */}
            <Card className="library-sidebar-card">
              <Card.Body>
                <h6>Información del item</h6>
                <div className="library-info">
                  <div className="info-item">
                    <strong>Tipo:</strong> {item.type}
                  </div>
                  <div className="info-item">
                    <strong>Autor:</strong> {item.author}
                  </div>
                  <div className="info-item">
                    <strong>Género:</strong> {item.genre}
                  </div>
                  <div className="info-item">
                    <strong>Año:</strong> {item.year}
                  </div>
                  <div className="info-item">
                    <strong>Estado:</strong> 
                    <Badge variant={getStatusColor(item.status)} className="ms-2">
                      {item.status}
                    </Badge>
                  </div>
                  <div className="info-item">
                    <strong>Mi calificación:</strong> {getRatingStars(item.rating)}
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Author Card */}
            <Card className="author-card mt-3">
              <Card.Body>
                <div className="author-info">
                  <div className="author-avatar">
                    <span>M</span>
                  </div>
                  <div className="author-details">
                    <h6>Melinda</h6>
                    <p className="text-muted">Bibliotecaria personal</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
}

export default LibraryDetail;
