import React from 'react';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Blog() {
  const blogPosts = [];

  return (
    <Layout>
      <div className="blog-page">
        <div className="page-header">
          <h1 className="page-title">Blog Personal</h1>
          <p className="page-subtitle">
            Reflexiones, experiencias y pensamientos sobre lectura, escritura y la vida
          </p>
        </div>

        {/* Featured Post */}
        <div className="featured-post">
          <Card className="featured-card">
            <Row className="g-0">
              <Col md={6}>
                <div className="featured-image">
                  <div className="image-placeholder">
                    <i className="fas fa-heart"></i>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <Card.Body className="featured-content">
                  <Badge className="featured-badge">Destacado</Badge>
                  <h3 className="featured-title">
                    <Link to="/blog/1">Por qué amo los fanfics más que las historias originales</Link>
                  </h3>
                  <p className="featured-summary">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <div className="featured-meta">
                    <span className="featured-date">September 26, 2025</span>
                    <span className="featured-read-time">4 min read</span>
                  </div>
                  <div className="featured-tags">
                    <Badge className="featured-tag">Fanfiction</Badge>
                    <Badge className="featured-tag">Writing</Badge>
                    <Badge className="featured-tag">Personal</Badge>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="blog-posts">
          <h4 className="section-title">Últimos Posts</h4>
          <div className="no-results">
            <i className="fas fa-feather-alt"></i>
            <h5>Próximamente</h5>
            <p>Los posts del blog estarán disponibles pronto. ¡Mantente atento!</p>
          </div>
        </div>

        {/* Load More */}
        <div className="load-more-section">
          <Button className="load-more-btn">Cargar más posts</Button>
        </div>
      </div>
    </Layout>
  );
}

export default Blog;
