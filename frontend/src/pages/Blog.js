import React from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Por qué amo los fanfics más que las historias originales",
      summary: "Una reflexión personal sobre cómo los fanfics me han enseñado más sobre la escritura y la creatividad que muchos libros publicados.",
      category: "Personal",
      date: "September 26, 2025",
      readTime: "4 min read",
      tags: ["Fanfiction", "Writing", "Personal"],
      image: "heart"
    },
    {
      id: 2,
      title: "Mi rutina de lectura: cómo leo 50 libros al año",
      summary: "Comparto mis secretos para mantener una rutina de lectura constante y encontrar tiempo para leer en un mundo lleno de distracciones.",
      category: "Lifestyle",
      date: "September 25, 2025",
      readTime: "6 min read",
      tags: ["Reading", "Productivity", "Habits"],
      image: "book"
    },
    {
      id: 3,
      title: "El poder de las historias: cómo los libros cambian vidas",
      summary: "Una exploración de cómo las historias que leemos nos moldean como personas y nos ayudan a entender el mundo que nos rodea.",
      category: "Reflection",
      date: "September 24, 2025",
      readTime: "5 min read",
      tags: ["Stories", "Life", "Philosophy"],
      image: "star"
    },
    {
      id: 4,
      title: "Mi experiencia construyendo un recomendador de IA",
      summary: "El proceso detrás de crear una herramienta que usa inteligencia artificial para ayudar a otros a encontrar su próxima lectura perfecta.",
      category: "Technology",
      date: "September 23, 2025",
      readTime: "8 min read",
      tags: ["AI", "Technology", "Personal Project"],
      image: "robot"
    },
    {
      id: 5,
      title: "Los mejores lugares para leer (según mi experiencia)",
      summary: "Una guía personal de los lugares más cómodos y atmosféricos para disfrutar de una buena lectura, desde cafés hasta parques.",
      category: "Lifestyle",
      date: "September 22, 2025",
      readTime: "3 min read",
      tags: ["Reading Spots", "Comfort", "Atmosphere"],
      image: "coffee"
    },
    {
      id: 6,
      title: "Cómo superé el bloqueo lector",
      summary: "Mi experiencia personal con períodos donde no podía concentrarme en la lectura y las estrategias que me ayudaron a superarlo.",
      category: "Personal",
      date: "September 21, 2025",
      readTime: "4 min read",
      tags: ["Reading Slump", "Mental Health", "Tips"],
      image: "lightbulb"
    }
  ];

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
                    Una reflexión personal sobre cómo los fanfics me han enseñado más sobre la escritura 
                    y la creatividad que muchos libros publicados.
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
          <Row className="g-4">
            {blogPosts.slice(1).map((post) => (
              <Col md={6} lg={4} key={post.id}>
                <Card className="blog-card">
                  <div className="blog-image">
                    <div className="image-placeholder">
                      <i className={`fas fa-${post.image}`}></i>
                    </div>
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
                      {post.tags.map((tag, index) => (
                        <Badge key={index} className="blog-tag">{tag}</Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
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
