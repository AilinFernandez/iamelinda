import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';

function About() {
  const stats = [
    { number: "500+", label: "Libros leídos" },
    { number: "1000+", label: "Fanfics descubiertos" },
    { number: "50+", label: "Reseñas escritas" },
    { number: "3", label: "Años blogueando" }
  ];

  const interests = [
    { name: "Fantasy", color: "primary" },
    { name: "Romance", color: "danger" },
    { name: "Sci-Fi", color: "info" },
    { name: "Historical Fiction", color: "warning" },
    { name: "Young Adult", color: "success" },
    { name: "Fanfiction", color: "secondary" }
  ];

  return (
    <Layout showSidebar={false}>
      <div className="about-page">
        <div className="page-header">
          <h1 className="page-title">Sobre Mí</h1>
          <p className="page-subtitle">
            Conoce un poco más sobre mi historia, mis pasiones y mi amor por las historias
          </p>
        </div>

        {/* Hero Section */}
        <Row className="align-items-center mb-5">
          <Col lg={6}>
            <div className="about-hero">
              <div className="about-avatar-large">
                <div className="avatar-circle-large">
                  <span>M</span>
                </div>
              </div>
            </div>
          </Col>
          <Col lg={6}>
            <div className="about-intro">
              <h2 className="intro-title">Hola, soy Melinda 👋</h2>
              <p className="intro-text">
                Soy una apasionada lectora, escritora amateur y desarrolladora que cree 
                firmemente en el poder transformador de las historias. Desde que era niña, 
                los libros han sido mi refugio, mi inspiración y mi ventana al mundo.
              </p>
              <p className="intro-text">
                En <strong>Melinda's Corner</strong> comparto mis descubrimientos literarios, 
                reflexiones personales y herramientas que he creado para ayudar a otros 
                a encontrar su próxima lectura perfecta.
              </p>
            </div>
          </Col>
        </Row>

        {/* Stats Section */}
        <div className="stats-section mb-5">
          <Row className="g-4">
            {stats.map((stat, index) => (
              <Col md={3} key={index}>
                <Card className="stat-card text-center">
                  <Card.Body>
                    <h3 className="stat-number">{stat.number}</h3>
                    <p className="stat-label">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Story Section */}
        <Row className="mb-5">
          <Col lg={8}>
            <Card className="story-card">
              <Card.Body>
                <h3 className="story-title">Mi Historia</h3>
                <div className="story-content">
                  <p>
                    Todo comenzó cuando tenía 8 años y mi abuela me regaló mi primer libro de Harry Potter. 
                    Desde ese momento, quedé completamente enganchada al mundo de la literatura. 
                    Pasaba horas leyendo bajo las sábanas con una linterna, soñando con ser parte 
                    de las aventuras que leía.
                  </p>
                  <p>
                    A medida que crecía, mi amor por la lectura se expandió más allá de los libros tradicionales. 
                    Descubrí el mundo de los fanfics y me fascinó cómo los fans podían tomar personajes 
                    y universos que amaban y crear historias completamente nuevas y emocionantes.
                  </p>
                  <p>
                    Como desarrolladora, siempre busco formas de combinar mi pasión por la tecnología 
                    con mi amor por las historias. Esa búsqueda me llevó a crear este sitio y el 
                    recomendador de IA que puedes encontrar aquí.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="interests-card">
              <Card.Body>
                <h4 className="interests-title">Mis Géneros Favoritos</h4>
                <div className="interests-list">
                  {interests.map((interest, index) => (
                    <Badge key={index} className={`interest-badge ${interest.color}`}>
                      {interest.name}
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mission Section */}
        <Row>
          <Col lg={12}>
            <Card className="mission-card">
              <Card.Body>
                <h3 className="mission-title">Mi Misión</h3>
                <p className="mission-text">
                  Creo que cada persona merece encontrar historias que la muevan, la inspiren y la hagan 
                  sentir menos sola. Mi objetivo es crear un espacio donde los amantes de las historias 
                  puedan descubrir nuevas lecturas, compartir sus experiencias y conectarse con otros 
                  que comparten su pasión.
                </p>
                <p className="mission-text">
                  A través de mis reseñas, recomendaciones y herramientas tecnológicas, espero hacer 
                  que el mundo de la literatura sea más accesible y emocionante para todos.
                </p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </Layout>
  );
}

export default About;
