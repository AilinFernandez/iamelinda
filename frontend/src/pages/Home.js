import React from 'react';
import { Row, Col, Card, Button, Form } from 'react-bootstrap';
import Layout from '../components/Layout';

function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <div className="hero-section">
        <Row className="align-items-center">
          <Col lg={6}>
            <div className="hero-content">
              <h1 className="hero-title">
                Hey, I'm <span className="hero-name">Melinda</span> 👋
              </h1>
              <p className="hero-description">
                I'm a <strong>story enthusiast</strong> and <strong>fanfic curator</strong> 
                who loves discovering amazing stories. Welcome to <strong>Melinda's Corner</strong> 
                where I share my favorite recommendations and tools to help you find 
                your next perfect read.
              </p>
              
              {/* Let's connect section */}
              <div className="connect-section">
                <h6 className="connect-title">Let's connect</h6>
                <div className="connect-form">
                  <Form.Control 
                    type="email" 
                    placeholder="Enter your email address"
                    className="connect-input"
                  />
                  <Button className="connect-btn">Get Started</Button>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="hero-illustration">
              <div className="illustration-placeholder">
                <i className="fas fa-book-open"></i>
                <p>Illustration coming soon</p>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Trending Topics Section */}
      <div className="trending-section">
        <h5 className="trending-title">
          <i className="fas fa-bolt"></i>
          Trending Topics
        </h5>
        <Card className="trending-card">
          <Card.Body>
            <div className="trending-categories">
              <div className="category-item">
                <div className="category-circle lifestyle">
                  <i className="fas fa-heart"></i>
                  <div className="category-badge">5</div>
                </div>
                <span className="category-name">Lifestyle</span>
              </div>
              <div className="category-item">
                <div className="category-circle inspiration">
                  <i className="fas fa-star"></i>
                  <div className="category-badge">7</div>
                </div>
                <span className="category-name">Inspiration</span>
              </div>
              <div className="category-item">
                <div className="category-circle technology">
                  <i className="fas fa-robot"></i>
                  <div className="category-badge">4</div>
                </div>
                <span className="category-name">Technology</span>
              </div>
              <div className="category-item">
                <div className="category-circle music">
                  <i className="fas fa-music"></i>
                  <div className="category-badge">3</div>
                </div>
                <span className="category-name">Music</span>
              </div>
              <div className="category-item">
                <div className="category-circle travel">
                  <i className="fas fa-plane"></i>
                  <div className="category-badge">3</div>
                </div>
                <span className="category-name">Travel</span>
              </div>
              <Button className="explore-btn">Explore All</Button>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Recent Posts Grid */}
      <div className="posts-section">
        <h5 className="posts-title">Latest Posts</h5>
        <Row className="g-4">
          <Col md={6} lg={4}>
            <Card className="post-card">
              <div className="post-image">
                <div className="image-placeholder">
                  <i className="fas fa-book"></i>
                </div>
                <div className="post-category inspiration">Inspiration</div>
              </div>
              <Card.Body>
                <div className="post-meta">
                  <span className="post-date">September 26, 2025</span>
                  <span className="post-read-time">
                    <i className="fas fa-clock"></i> 1 Min Read
                  </span>
                  <span className="post-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </span>
                </div>
                <h6 className="post-title">Mi reseña de Harry Potter</h6>
                <p className="post-summary">
                  Una reflexión personal sobre cómo esta serie cambió mi perspectiva 
                  sobre la literatura juvenil y la magia de las historias.
                </p>
                <div className="post-tags">
                  <span className="tag">Lifestyle</span>
                  <span className="tag">Books</span>
                </div>
                <div className="post-author">
                  <div className="author-avatar">
                    <span>M</span>
                  </div>
                  <span className="author-name">Melinda</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="post-card">
              <div className="post-image">
                <div className="image-placeholder">
                  <i className="fas fa-heart"></i>
                </div>
                <div className="post-category lifestyle">Lifestyle</div>
              </div>
              <Card.Body>
                <div className="post-meta">
                  <span className="post-date">September 25, 2025</span>
                  <span className="post-read-time">
                    <i className="fas fa-clock"></i> 2 Min Read
                  </span>
                  <span className="post-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </span>
                </div>
                <h6 className="post-title">Fanfics que me cambiaron la vida</h6>
                <p className="post-summary">
                  Una lista personal de las historias que más me impactaron y 
                  por qué creo que todo el mundo debería leerlas.
                </p>
                <div className="post-tags">
                  <span className="tag">Fanfics</span>
                  <span className="tag">Personal</span>
                </div>
                <div className="post-author">
                  <div className="author-avatar">
                    <span>M</span>
                  </div>
                  <span className="author-name">Melinda</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} lg={4}>
            <Card className="post-card">
              <div className="post-image">
                <div className="image-placeholder">
                  <i className="fas fa-robot"></i>
                </div>
                <div className="post-category technology">Technology</div>
              </div>
              <Card.Body>
                <div className="post-meta">
                  <span className="post-date">September 24, 2025</span>
                  <span className="post-read-time">
                    <i className="fas fa-clock"></i> 3 Min Read
                  </span>
                  <span className="post-rating">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                  </span>
                </div>
                <h6 className="post-title">Cómo funciona mi recomendador IA</h6>
                <p className="post-summary">
                  Una explicación técnica pero accesible sobre cómo la inteligencia 
                  artificial puede ayudarte a encontrar tu próxima lectura perfecta.
                </p>
                <div className="post-tags">
                  <span className="tag">Technology</span>
                  <span className="tag">AI</span>
                </div>
                <div className="post-author">
                  <div className="author-avatar">
                    <span>M</span>
                  </div>
                  <span className="author-name">Melinda</span>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default Home;