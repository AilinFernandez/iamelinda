import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
// Usando Font Awesome en lugar de react-bootstrap-icons
import Layout from '../components/Layout';
import API_BASE_URL from '../config/api';

function ReviewDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReview();
  }, [id]);

  const loadReview = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reviews/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Reseña no encontrada');
        } else {
          throw new Error('Error al cargar reseña');
        }
        return;
      }
      const data = await response.json();
      setReview(data);
    } catch (error) {
      console.error('Error cargando reseña:', error);
      setError('Error al cargar la reseña');
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };


  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando reseña...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error || !review) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <h2>Reseña no encontrada</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate('/reviews')}>
              Volver a Reseñas
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
        <div className="review-header mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/reviews')}
            className="mb-3"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver a Reseñas
          </Button>
          
          {/* Banner Image */}
          {review.bannerImage && (
            <div className="review-banner mb-4">
              <img 
                src={review.bannerImage} 
                alt={review.title}
                className="img-fluid rounded"
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="review-meta mb-3">
            <Badge variant="secondary" className="me-2">
              {review.category}
            </Badge>
            <span className="rating me-2">
              {getRatingStars(review.rating)}
            </span>
            <span className="text-muted">{review.date}</span>
          </div>

          <h1 className="review-title mb-3">{review.title}</h1>
        </div>

        <Row>
          <Col lg={8}>
            {/* Content */}
            <Card className="review-content-card">
              <Card.Body>
                <div className="review-summary mb-4">
                  <h5>Resumen</h5>
                  <p className="lead">{review.summary}</p>
                </div>

                {/* Full content */}
                <div className="review-full-content">
                  <h5>Contenido completo</h5>
                  {review.content ? (
                    <div 
                      className="content-html"
                      dangerouslySetInnerHTML={{ __html: review.content }}
                    />
                  ) : (
                    <p className="text-muted">
                      <i>No hay contenido completo disponible para esta reseña.</i>
                    </p>
                  )}
                </div>

                {/* Tags */}
                {review.tags && review.tags.length > 0 && (
                  <div className="review-tags mt-4">
                    <h6>Etiquetas</h6>
                    <div className="tags-list">
                      {review.tags && Array.isArray(review.tags) && review.tags.map((tag, index) => (
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
            <Card className="review-sidebar-card">
              <Card.Body>
                <h6>Información de la reseña</h6>
                <div className="review-info">
                  <div className="info-item">
                    <strong>Categoría:</strong> {review.category}
                  </div>
                  <div className="info-item">
                    <strong>Calificación:</strong> {getRatingStars(review.rating)}
                  </div>
                  <div className="info-item">
                    <strong>Fecha:</strong> {review.date}
                  </div>
                  <div className="info-item">
                    <strong>Tiempo de lectura:</strong> {review.readTime}
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
                    <p className="text-muted">Autora de la reseña</p>
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

export default ReviewDetail;
