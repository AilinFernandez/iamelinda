import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import Layout from '../components/Layout';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el formulario
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <Layout showSidebar={false}>
      <div className="contact-page">
        <div className="page-header">
          <h1 className="page-title">Contacto</h1>
          <p className="page-subtitle">
            ¿Tienes alguna pregunta, sugerencia o quieres colaborar? ¡Me encantaría escucharte!
          </p>
        </div>

        <Row className="g-5">
          <Col lg={8}>
            <Card className="contact-form-card">
              <Card.Body>
                <h4 className="form-title">Envíame un mensaje</h4>
                {showAlert && (
                  <Alert variant="success" className="contact-alert">
                    ¡Mensaje enviado! Te responderé pronto.
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Nombre *</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="contact-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="contact-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Asunto *</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="contact-input"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group>
                        <Form.Label>Mensaje *</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={6}
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          className="contact-input"
                          placeholder="Cuéntame qué tienes en mente..."
                        />
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Button type="submit" className="contact-submit-btn">
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar Mensaje
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <div className="contact-info">
              <Card className="info-card">
                <Card.Body>
                  <h5 className="info-title">Información de Contacto</h5>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="contact-details">
                      <h6>Email</h6>
                      <p>melinda@example.com</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="contact-details">
                      <h6>Tiempo de respuesta</h6>
                      <p>24-48 horas</p>
                    </div>
                  </div>
                  <div className="contact-item">
                    <div className="contact-icon">
                      <i className="fas fa-heart"></i>
                    </div>
                    <div className="contact-details">
                      <h6>Me encanta hablar sobre</h6>
                      <p>Libros, fanfics, tecnología y recomendaciones</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>

              <Card className="social-card">
                <Card.Body>
                  <h5 className="social-title">Sígueme en redes</h5>
                  <div className="social-links">
                    <a href="#" className="social-link">
                      <i className="fab fa-twitter"></i>
                      <span>Twitter</span>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-instagram"></i>
                      <span>Instagram</span>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-goodreads"></i>
                      <span>Goodreads</span>
                    </a>
                    <a href="#" className="social-link">
                      <i className="fab fa-github"></i>
                      <span>GitHub</span>
                    </a>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default Contact;
