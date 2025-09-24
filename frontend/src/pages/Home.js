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
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
                quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
        <div className="no-results">
          <i className="fas fa-feather-alt"></i>
          <h5>Próximamente</h5>
          <p>Los posts estarán disponibles pronto. ¡Mantente atento!</p>
        </div>
      </div>
    </Layout>
  );
}

export default Home;