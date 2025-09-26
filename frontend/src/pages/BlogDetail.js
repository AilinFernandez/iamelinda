import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Spinner, Button } from 'react-bootstrap';
// Usando Font Awesome en lugar de react-bootstrap-icons
import Layout from '../components/Layout';
import API_BASE_URL from '../config/api';

function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/posts/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Post no encontrado');
        } else {
          throw new Error('Error al cargar post');
        }
        return;
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Error cargando post:', error);
      setError('Error al cargar el post');
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Cargando post...</p>
          </div>
        </Container>
      </Layout>
    );
  }

  if (error || !post) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <h2>Post no encontrado</h2>
            <p>{error}</p>
            <Button variant="primary" onClick={() => navigate('/blog')}>
              Volver al Blog
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
        <div className="blog-header mb-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/blog')}
            className="mb-3"
          >
            <i className="fas fa-arrow-left me-2"></i>
            Volver al Blog
          </Button>
          
          {/* Banner Image */}
          {post.bannerImage && (
            <div className="blog-banner mb-4">
              <img 
                src={post.bannerImage} 
                alt={post.title}
                className="img-fluid rounded"
                style={{ width: '100%', height: '300px', objectFit: 'cover' }}
              />
            </div>
          )}

          <div className="blog-meta mb-3">
            <Badge variant="secondary" className="me-2">
              {post.category}
            </Badge>
            <span className="text-muted">{post.date}</span>
            <span className="text-muted ms-2">• {post.readTime}</span>
          </div>

          <h1 className="blog-title mb-3">{post.title}</h1>
        </div>

        <Row>
          <Col lg={8}>
            {/* Content */}
            <Card className="blog-content-card">
              <Card.Body>
                <div className="blog-summary mb-4">
                  <h5>Resumen</h5>
                  <p className="lead">{post.summary}</p>
                </div>

                {/* Full content */}
                <div className="blog-full-content">
                  <h5>Contenido completo</h5>
                  {post.content ? (
                    <div 
                      className="content-html"
                      dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                  ) : (
                    <p className="text-muted">
                      <i>No hay contenido completo disponible para este post.</i>
                    </p>
                  )}
                </div>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="blog-tags mt-4">
                    <h6>Etiquetas</h6>
                    <div className="tags-list">
                      {post.tags && Array.isArray(post.tags) && post.tags.map((tag, index) => (
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
            <Card className="blog-sidebar-card">
              <Card.Body>
                <h6>Información del post</h6>
                <div className="blog-info">
                  <div className="info-item">
                    <strong>Categoría:</strong> {post.category}
                  </div>
                  <div className="info-item">
                    <strong>Fecha:</strong> {post.date}
                  </div>
                  <div className="info-item">
                    <strong>Tiempo de lectura:</strong> {post.readTime}
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
                    <p className="text-muted">Autora del blog</p>
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

export default BlogDetail;
