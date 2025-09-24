import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Reviews() {
  const reviews = [];

  return (
    <Layout>
      <div className="reviews-page">
        <div className="page-header">
          <h1 className="page-title">Reseñas</h1>
          <p className="page-subtitle">
            Mis opiniones honestas sobre libros, fanfics y historias que me han marcado
          </p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filter-buttons">
            <Button variant="outline-primary" className="filter-btn active">Todas</Button>
            <Button variant="outline-primary" className="filter-btn">Libros</Button>
            <Button variant="outline-primary" className="filter-btn">Fanfics</Button>
            <Button variant="outline-primary" className="filter-btn">Series</Button>
          </div>
        </div>

        {/* Reviews Grid */}
        <Row className="g-4">
          {reviews.length === 0 ? (
            <Col md={12}>
              <div className="no-results">
                <i className="fas fa-star"></i>
                <h5>Próximamente</h5>
                <p>Las reseñas estarán disponibles pronto. ¡Mantente atento!</p>
              </div>
            </Col>
          ) : (
            reviews.map((review) => (
              <Col md={6} lg={4} key={review.id}>
                <Card className="review-card">
                  <div className="review-image">
                    <div className="image-placeholder">
                      <i className={`fas fa-${review.image}`}></i>
                    </div>
                    <div className="review-category">{review.category}</div>
                  </div>
                  <Card.Body>
                    <div className="review-meta">
                      <span className="review-date">{review.date}</span>
                      <span className="review-read-time">
                        <i className="fas fa-clock"></i> {review.readTime}
                      </span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < review.rating ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <h5 className="review-title">
                      <Link to={`/reviews/${review.id}`}>{review.title}</Link>
                    </h5>
                    <p className="review-summary">{review.summary}</p>
                    <div className="review-tags">
                      {review.tags.map((tag, index) => (
                        <Badge key={index} className="review-tag">{tag}</Badge>
                      ))}
                    </div>
                    <div className="review-author">
                      <div className="author-avatar">
                        <span>M</span>
                      </div>
                      <span className="author-name">Melinda</span>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>

        {/* Load More */}
        <div className="load-more-section">
          <Button className="load-more-btn">Cargar más reseñas</Button>
        </div>
      </div>
    </Layout>
  );
}

export default Reviews;
