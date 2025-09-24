import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import Layout from '../components/Layout';

function Library() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const libraryItems = [];

  const filteredItems = libraryItems.filter(item => {
    const matchesFilter = filter === 'all' || item.type.toLowerCase() === filter;
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      <div className="library-page">
        <div className="page-header">
          <h1 className="page-title">Mi Biblioteca</h1>
          <p className="page-subtitle">
            Mi colección personal de libros, fanfics y historias favoritas
          </p>
        </div>

        {/* Search and Filters */}
        <div className="library-controls">
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Buscar por título o autor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="library-search"
              />
            </Col>
            <Col md={6}>
              <div className="filter-buttons">
                <Button 
                  variant={filter === 'all' ? 'primary' : 'outline-primary'} 
                  className="filter-btn"
                  onClick={() => setFilter('all')}
                >
                  Todos
                </Button>
                <Button 
                  variant={filter === 'book' ? 'primary' : 'outline-primary'} 
                  className="filter-btn"
                  onClick={() => setFilter('book')}
                >
                  Libros
                </Button>
                <Button 
                  variant={filter === 'fanfic' ? 'primary' : 'outline-primary'} 
                  className="filter-btn"
                  onClick={() => setFilter('fanfic')}
                >
                  Fanfics
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        {/* Library Grid */}
        <Row className="g-4">
          {filteredItems.map((item) => (
            <Col md={6} lg={4} key={item.id}>
              <Card className="library-card">
                <Card.Body>
                  <div className="library-item-header">
                    <div className="item-type-badge">
                      <Badge className={`type-badge ${item.type.toLowerCase()}`}>
                        {item.type}
                      </Badge>
                    </div>
                    <div className="item-rating">
                      {[...Array(5)].map((_, i) => (
                        <i 
                          key={i} 
                          className={`fas fa-star ${i < item.rating ? 'filled' : ''}`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  
                  <h5 className="item-title">{item.title}</h5>
                  <p className="item-author">por {item.author}</p>
                  
                  <div className="item-meta">
                    <span className="item-genre">{item.genre}</span>
                    <span className="item-year">{item.year}</span>
                    <Badge className={`status-badge ${item.status.toLowerCase()}`}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <p className="item-description">{item.description}</p>
                  
                  <div className="item-tags">
                    {item.tags.map((tag, index) => (
                      <Badge key={index} className="item-tag">{tag}</Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {filteredItems.length === 0 && (
          <div className="no-results">
            <i className="fas fa-book"></i>
            <h5>Próximamente</h5>
            <p>Mi biblioteca personal estará disponible pronto. ¡Mantente atento!</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Library;
