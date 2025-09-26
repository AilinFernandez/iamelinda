import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Form, Spinner, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import HeroCarousel from '../components/HeroCarousel';
import API_BASE_URL from '../config/api';

function Home() {
  const [latestData, setLatestData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadLatestData();
  }, []);

  const loadLatestData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/latest`);
      if (!response.ok) {
        throw new Error('Error al cargar datos');
      }
      const data = await response.json();
      setLatestData(data);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'review': 'fas fa-star',
      'post': 'fas fa-feather-alt',
      'library': 'fas fa-book'
    };
    return icons[type] || 'fas fa-file';
  };

  const getTypeLabel = (type) => {
    const labels = {
      'review': 'Reseña',
      'post': 'Post',
      'library': 'Biblioteca'
    };
    return labels[type] || 'Item';
  };

  const getTypeLink = (type) => {
    const links = {
      'review': '/reviews',
      'post': '/blog',
      'library': '/library'
    };
    return links[type] || '/';
  };
  return (
    <div className="home-page">
      {/* Hero Carousel - Same width as content below */}
      <div className="hero-content-width">
        <HeroCarousel />
      </div>

      {/* Main Content with Sidebar */}
      <Layout showSidebar={true}>

      {/* Latest Posts Grid */}
      <div className="posts-section">
        <h5 className="posts-title">Latest Posts</h5>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando posts...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger">
            {error}
          </div>
        ) : latestData && (latestData.latest.review || latestData.latest.post || latestData.latest.library) ? (
          <Row className="g-4">
            {latestData.latest.review && (
              <Col md={4}>
                <Card className="review-card">
                  <div className="review-image">
                    {latestData.latest.review.bannerImage ? (
                      <img 
                        src={latestData.latest.review.bannerImage} 
                        alt={latestData.latest.review.title}
                        className="review-banner-img"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <i className={`fas fa-${latestData.latest.review.image}`}></i>
                      </div>
                    )}
                    <div className="review-category">{latestData.latest.review.category}</div>
                  </div>
                  <Card.Body>
                    <div className="review-meta">
                      <span className="review-date">{latestData.latest.review.date}</span>
                      <span className="review-read-time">
                        <i className="fas fa-clock"></i> {latestData.latest.review.readTime}
                      </span>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < latestData.latest.review.rating ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <h5 className="review-title">
                      <Link to={`/reviews/${latestData.latest.review.id}`}>{latestData.latest.review.title}</Link>
                    </h5>
                    <p className="review-summary">{latestData.latest.review.summary}</p>
                    <div className="review-tags">
                      {latestData.latest.review.tags && Array.isArray(latestData.latest.review.tags) && latestData.latest.review.tags.slice(0, 2).map((tag, index) => (
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
            )}
            {latestData.latest.post && (
              <Col md={4}>
                <Card className="blog-card">
                  <div className="blog-image">
                    {latestData.latest.post.bannerImage ? (
                      <img 
                        src={latestData.latest.post.bannerImage} 
                        alt={latestData.latest.post.title}
                        className="blog-banner-img"
                      />
                    ) : (
                      <div className="image-placeholder">
                        <i className={`fas fa-${latestData.latest.post.image}`}></i>
                      </div>
                    )}
                    <div className="blog-category">{latestData.latest.post.category}</div>
                  </div>
                  <Card.Body>
                    <div className="blog-meta">
                      <span className="blog-date">{latestData.latest.post.date}</span>
                      <span className="blog-read-time">
                        <i className="fas fa-clock"></i> {latestData.latest.post.readTime}
                      </span>
                    </div>
                    <h5 className="blog-title">
                      <Link to={`/blog/${latestData.latest.post.id}`}>{latestData.latest.post.title}</Link>
                    </h5>
                    <p className="blog-summary">{latestData.latest.post.summary}</p>
                    <div className="blog-tags">
                      {latestData.latest.post.tags && Array.isArray(latestData.latest.post.tags) && latestData.latest.post.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} className="blog-tag">{tag}</Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
            {latestData.latest.library && (
              <Col md={4}>
                <Card className="library-card">
                  {latestData.latest.library.coverImage && (
                    <div className="library-image">
                      <img 
                        src={latestData.latest.library.coverImage} 
                        alt={latestData.latest.library.title}
                        className="library-banner-img"
                      />
                    </div>
                  )}
                  <Card.Body>
                    <div className="library-item-header">
                      <div className="item-type-badge">
                        <Badge className={`type-badge ${latestData.latest.library.type.toLowerCase()}`}>
                          {latestData.latest.library.type}
                        </Badge>
                      </div>
                      <div className="item-rating">
                        {[...Array(5)].map((_, i) => (
                          <i 
                            key={i} 
                            className={`fas fa-star ${i < latestData.latest.library.rating ? 'filled' : ''}`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    
                    <h5 className="item-title">{latestData.latest.library.title}</h5>
                    <p className="item-author">por {latestData.latest.library.author}</p>
                    
                    <div className="item-meta">
                      <span className="item-genre">{latestData.latest.library.genre}</span>
                      <span className="item-year">{latestData.latest.library.year}</span>
                      <Badge className={`status-badge ${latestData.latest.library.status.toLowerCase()}`}>
                        {latestData.latest.library.status}
                      </Badge>
                    </div>

                    <p className="item-description">{latestData.latest.library.description}</p>

                    <div className="item-tags">
                      {latestData.latest.library.tags && Array.isArray(latestData.latest.library.tags) && latestData.latest.library.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} className="item-tag">{tag}</Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            )}
          </Row>
        ) : (
          <div className="no-results">
            <i className="fas fa-feather-alt"></i>
            <h5>Próximamente</h5>
            <p>Los posts estarán disponibles pronto. ¡Mantente atento!</p>
          </div>
        )}
      </div>
      </Layout>
    </div>
  );
}

export default Home;