import React from 'react';
import { Row, Col, Card, Badge } from 'react-bootstrap';
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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <p className="intro-text">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                  <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                    eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                    sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>
                  <p>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                    doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                    veritatis et quasi architecto beatae vitae dicta sunt explicabo.
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                  quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="mission-text">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                  eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                  sunt in culpa qui officia deserunt mollit anim id est laborum.
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
