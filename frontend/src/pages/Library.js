import React, { useState } from 'react';
import { Row, Col, Card, Badge, Button, Form } from 'react-bootstrap';
import Layout from '../components/Layout';

function Library() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const libraryItems = [
    {
      id: 1,
      title: "Harry Potter and the Philosopher's Stone",
      author: "J.K. Rowling",
      type: "Book",
      genre: "Fantasy",
      rating: 5,
      status: "Completed",
      year: "1997",
      description: "The magical journey begins with Harry's first year at Hogwarts.",
      tags: ["Magic", "School", "Friendship"]
    },
    {
      id: 2,
      title: "The Seven Husbands of Evelyn Hugo",
      author: "Taylor Jenkins Reid",
      type: "Book",
      genre: "Drama",
      rating: 5,
      status: "Completed",
      year: "2017",
      description: "A captivating story about a reclusive Hollywood icon.",
      tags: ["Hollywood", "Secrets", "Love"]
    },
    {
      id: 3,
      title: "All the Young Dudes",
      author: "MsKingBean89",
      type: "Fanfic",
      genre: "Romance",
      rating: 5,
      status: "Completed",
      year: "2017",
      description: "A Marauders era fanfic that reimagines the Harry Potter universe.",
      tags: ["Marauders", "Wolfstar", "Long"]
    },
    {
      id: 4,
      title: "The Song of Achilles",
      author: "Madeline Miller",
      type: "Book",
      genre: "Historical Fiction",
      rating: 5,
      status: "Completed",
      year: "2011",
      description: "A retelling of the Iliad from Patroclus's perspective.",
      tags: ["Greek Mythology", "Love", "Tragedy"]
    },
    {
      id: 5,
      title: "The Last of Us",
      author: "Various",
      type: "Fanfic",
      genre: "Drama",
      rating: 4,
      status: "Reading",
      year: "2023",
      description: "Post-apocalyptic stories exploring Joel and Ellie's relationship.",
      tags: ["Post-Apocalyptic", "Father-Daughter", "Survival"]
    },
    {
      id: 6,
      title: "Six of Crows",
      author: "Leigh Bardugo",
      type: "Book",
      genre: "Fantasy",
      rating: 4,
      status: "Completed",
      year: "2015",
      description: "A heist story set in the Grishaverse.",
      tags: ["Heist", "Magic", "Found Family"]
    }
  ];

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
            <i className="fas fa-search"></i>
            <h5>No se encontraron resultados</h5>
            <p>Intenta con otros términos de búsqueda o filtros</p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Library;
