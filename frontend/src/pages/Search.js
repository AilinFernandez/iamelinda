import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Alert, 
  Spinner, 
  Badge,
  Card 
} from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import FanficCard from '../components/FanficCard';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  // Ejecutar búsqueda automática si hay query en URL
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && urlQuery !== query) {
      setQuery(urlQuery);
      performSearch(urlQuery);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      console.log('Buscando:', searchQuery);
      
      const response = await axios.post('/api/search', {
        query: searchQuery.trim(),
        maxResults: 12
      });

      setResults(response.data);
      
      // Actualizar URL sin recargar página
      setSearchParams({ q: searchQuery.trim() });
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setError(
        error.response?.data?.error || 
        'Error al realizar la búsqueda. Por favor, inténtalo de nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performSearch();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  return (
    <Container className="py-4">
      {/* Formulario de búsqueda */}
      <Row className="justify-content-center mb-4">
        <Col lg={8}>
          <Card className="search-form">
            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={9}>
                  <Form.Control
                    type="text"
                    size="lg"
                    placeholder="Describe el tipo de fanfic que buscas..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    disabled={loading}
                  />
                </Col>
                <Col md={3}>
                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-100 btn-gradient"
                    disabled={loading || !query.trim()}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Buscar
                      </>
                    )}
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>

      {/* Loading */}
      {loading && (
        <div className="loading-container">
          <Spinner animation="border" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3">Analizando tu consulta y buscando fanfics...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <Row className="justify-content-center">
          <Col lg={8}>
            <Alert variant="danger">
              <Alert.Heading>
                <i className="bi bi-exclamation-triangle me-2"></i>
                Error en la búsqueda
              </Alert.Heading>
              <p className="mb-0">{error}</p>
            </Alert>
          </Col>
        </Row>
      )}

      {/* Resultados */}
      {results && !loading && (
        <div className="results-section">
          {/* Explicación de IA */}
          {results.explanation && (
            <Row className="justify-content-center mb-4">
              <Col lg={10}>
                <div className="explanation-box">
                  <h5 className="mb-3">
                    <i className="bi bi-robot me-2"></i>
                    ¿Por qué estos fanfics?
                  </h5>
                  <p className="mb-0">{results.explanation}</p>
                </div>
              </Col>
            </Row>
          )}

          {/* Sugerencias */}
          {results.suggestions && results.suggestions.length > 0 && (
            <Row className="justify-content-center mb-4">
              <Col lg={10}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6 className="mb-3">
                      <i className="bi bi-lightbulb me-2"></i>
                      También podrías buscar:
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {results.suggestions.map((suggestion, index) => (
                        <Badge
                          key={index}
                          bg="light"
                          text="dark"
                          className="suggestion-chip p-2"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          {suggestion}
                        </Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {/* Header de resultados */}
          <Row className="justify-content-center mb-3">
            <Col lg={10}>
              <div className="results-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  Resultados ({results.totalResults})
                </h4>
                <div className="results-count">
                  Búsqueda completada en {results.searchTime?.toFixed(2)}s
                </div>
              </div>
            </Col>
          </Row>

          {/* Grid de fanfics */}
          <Row className="justify-content-center">
            <Col lg={10}>
              {results.fanfics.length > 0 ? (
                <Row>
                  {results.fanfics.map((fanfic, index) => (
                    <Col key={fanfic.id || index} lg={6} xl={4} className="mb-4">
                      <FanficCard fanfic={fanfic} />
                    </Col>
                  ))}
                </Row>
              ) : (
                <Alert variant="warning" className="text-center">
                  <Alert.Heading>
                    <i className="bi bi-search me-2"></i>
                    No se encontraron resultados
                  </Alert.Heading>
                  <p className="mb-3">
                    No pudimos encontrar fanfics que coincidan con tu búsqueda.
                  </p>
                  <hr />
                  <p className="mb-0">
                    <strong>Consejos:</strong> Intenta con términos más generales, 
                    diferentes fandoms, o describe el tipo de historia que buscas.
                  </p>
                </Alert>
              )}
            </Col>
          </Row>

          {/* Criterios de búsqueda (para debug) */}
          {results.searchCriteria && process.env.NODE_ENV === 'development' && (
            <Row className="justify-content-center mt-4">
              <Col lg={10}>
                <Card className="border-0 bg-light">
                  <Card.Body>
                    <h6>Criterios extraídos por IA:</h6>
                    <pre style={{ fontSize: '0.8rem' }}>
                      {JSON.stringify(results.searchCriteria, null, 2)}
                    </pre>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      )}
    </Container>
  );
}

export default Search;
