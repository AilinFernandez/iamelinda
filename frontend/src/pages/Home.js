import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleExampleClick = (example) => {
    setSearchQuery(example);
  };

  const examples = [
    "fanfics de Harry Potter donde los padres estén vivos",
    "historias románticas de Marvel con Iron Man",
    "fanfics completos de Percy Jackson",
    "Twilight desde la perspectiva de otros personajes",
    "crossovers de Avatar con otros universos"
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h1 className="display-4 fw-bold mb-4">
                <i className="bi bi-book me-3"></i>
                iamelinda
              </h1>
              <p className="lead mb-5">
                Descubre fanfics increíbles con la ayuda de inteligencia artificial.
                Busca historias usando lenguaje natural y encuentra exactamente lo que buscas.
              </p>
              
              <div className="search-box">
                <Form onSubmit={handleSearch}>
                  <Row className="g-3">
                    <Col md={9}>
                      <Form.Control
                        type="text"
                        size="lg"
                        placeholder="Ej: fanfics de Harry Potter donde los padres estén vivos..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-0"
                        style={{ 
                          background: 'rgba(255,255,255,0.9)', 
                          backdropFilter: 'blur(10px)' 
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <Button 
                        type="submit" 
                        size="lg" 
                        className="w-100 btn-gradient"
                        disabled={!searchQuery.trim()}
                      >
                        <i className="bi bi-search me-2"></i>
                        Buscar
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Examples Section */}
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8}>
            <h3 className="text-center mb-4">
              <i className="bi bi-lightbulb me-2"></i>
              Ejemplos de búsqueda
            </h3>
            <p className="text-center text-muted mb-4">
              Prueba con estas búsquedas para ver cómo funciona la IA:
            </p>
            
            <div className="d-flex flex-wrap justify-content-center gap-2">
              {examples.map((example, index) => (
                <Button
                  key={index}
                  variant="outline-primary"
                  size="sm"
                  className="suggestion-chip mb-2"
                  onClick={() => handleExampleClick(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* Features Section */}
      <Container className="py-5">
        <Row>
          <Col md={4} className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-robot" style={{ fontSize: '3rem', color: '#667eea' }}></i>
            </div>
            <h5>Búsqueda Inteligente</h5>
            <p className="text-muted">
              Usa lenguaje natural para describir exactamente lo que quieres encontrar.
              La IA entiende contexto y matices.
            </p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-collection" style={{ fontSize: '3rem', color: '#667eea' }}></i>
            </div>
            <h5>Base de Datos</h5>
            <p className="text-muted">
              Fanfics seleccionados de Archive of Our Own con metadatos detallados
              y organizados por categorías.
            </p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="mb-3">
              <i className="bi bi-lightning" style={{ fontSize: '3rem', color: '#667eea' }}></i>
            </div>
            <h5>Resultados Precisos</h5>
            <p className="text-muted">
              Obtén recomendaciones personalizadas con explicaciones de por qué
              cada fanfic coincide con tu búsqueda.
            </p>
          </Col>
        </Row>
      </Container>

      {/* CTA Section */}
      <section style={{ background: '#f8f9fa' }} className="py-5">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={6}>
              <h3 className="mb-3">¿Listo para encontrar tu próxima lectura favorita?</h3>
              <p className="text-muted mb-4">
                Comienza tu búsqueda ahora y descubre historias que no sabías que estabas buscando.
              </p>
              <Button 
                size="lg" 
                className="btn-gradient"
                onClick={() => navigate('/search')}
              >
                <i className="bi bi-search me-2"></i>
                Comenzar Búsqueda
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Home;
