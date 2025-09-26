import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import API_BASE_URL from '../config/api';

function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/posts`);
      if (!response.ok) {
        throw new Error('Error al cargar posts');
      }
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error cargando posts:', error);
      setError('Error al cargar los posts');
    } finally {
      setLoading(false);
    }
  };

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
          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p className="mt-3">Cargando posts...</p>
            </div>
          ) : error ? (
            <div className="alert alert-danger">
              {error}
            </div>
          ) : posts.length === 0 ? (
            <div className="no-results">
              <i className="fas fa-feather-alt"></i>
              <h5>Próximamente</h5>
              <p>Los posts del blog estarán disponibles pronto. ¡Mantente atento!</p>
            </div>
          ) : (
            <Row className="g-4">
              {posts.map((post) => (
                <Col md={6} lg={4} key={post.id}>
                  <Card className="blog-card">
                    <div className="blog-image">
                      {post.bannerImage ? (
                        <img 
                          src={post.bannerImage} 
                          alt={post.title}
                          className="blog-banner-img"
                        />
                      ) : (
                        <div className="image-placeholder">
                          <i className={`fas fa-${post.image}`}></i>
                        </div>
                      )}
                      <div className="blog-category">{post.category}</div>
                    </div>
                    <Card.Body>
                      <div className="blog-meta">
                        <span className="blog-date">{post.date}</span>
                        <span className="blog-read-time">
                          <i className="fas fa-clock"></i> {post.readTime}
                        </span>
                      </div>
                      <h5 className="blog-title">
                        <Link to={`/blog/${post.id}`}>{post.title}</Link>
                      </h5>
                      <p className="blog-summary">{post.summary}</p>
                      <div className="blog-tags">
                        {post.tags && Array.isArray(post.tags) && post.tags.map((tag, index) => (
                          <Badge key={index} className="blog-tag">{tag}</Badge>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
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
