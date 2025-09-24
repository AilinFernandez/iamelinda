import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Reviews() {
  const reviews = [
    {
      id: 1,
      title: "Mi reseña de Harry Potter",
      summary: "Una reflexión personal sobre cómo esta serie cambió mi perspectiva sobre la literatura juvenil y la magia de las historias.",
      category: "Books",
      rating: 5,
      date: "September 26, 2025",
      readTime: "3 min read",
      tags: ["Fantasy", "Young Adult", "Classic"],
      image: "book"
    },
    {
      id: 2,
      title: "Top 5 fanfics de romance que me hicieron llorar",
      summary: "Una lista personal de las historias románticas más emotivas que he leído, con spoilers mínimos y recomendaciones honestas.",
      category: "Fanfics",
      rating: 4,
      date: "September 25, 2025",
      readTime: "5 min read",
      tags: ["Romance", "Fanfiction", "Emotional"],
      image: "heart"
    },
    {
      id: 3,
      title: "Por qué 'The Seven Husbands of Evelyn Hugo' es perfecto",
      summary: "Un análisis profundo de esta novela que combina drama, romance y misterio de una manera magistral.",
      category: "Books",
      rating: 5,
      date: "September 24, 2025",
      readTime: "4 min read",
      tags: ["Drama", "Romance", "Mystery"],
      image: "star"
    },
    {
      id: 4,
      title: "Fanfics de Marvel que superan a las películas",
      summary: "Descubre historias alternativas del MCU que exploran personajes y tramas de maneras que las películas nunca pudieron.",
      category: "Fanfics",
      rating: 4,
      date: "September 23, 2025",
      readTime: "6 min read",
      tags: ["Marvel", "Alternative Universe", "Character Development"],
      image: "robot"
    }
  ];

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
          {reviews.map((review) => (
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
          ))}
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
