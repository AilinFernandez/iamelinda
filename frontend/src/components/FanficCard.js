import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

function FanficCard({ fanfic }) {
  const {
    titulo,
    autor,
    resumen,
    etiquetas = [],
    advertencias,
    enlace
  } = fanfic;

  // Extraer fandom principal de las etiquetas
  const fandomTag = etiquetas.find(tag => 
    tag.includes('Harry Potter') || 
    tag.includes('Marvel') || 
    tag.includes('Twilight') ||
    tag.includes('Percy Jackson') ||
    tag.includes('Avatar') ||
    tag.includes('Lord of the Rings') ||
    tag.includes('Star Wars')
  );

  // Mostrar solo las primeras 6 etiquetas para no sobrecargar
  const displayTags = etiquetas.slice(0, 6);

  return (
    <Card className="fanfic-card h-100 fade-in-up">
      <Card.Body className="d-flex flex-column">
        <div className="mb-3">
          <Card.Title className="mb-2">{titulo}</Card.Title>
          <Card.Subtitle className="text-muted mb-2">
            <i className="bi bi-person me-1"></i>
            {autor}
          </Card.Subtitle>
          {fandomTag && (
            <Badge bg="primary" className="mb-2">
              <i className="bi bi-collection me-1"></i>
              {fandomTag}
            </Badge>
          )}
        </div>

        {resumen && (
          <Card.Text className="flex-grow-1 mb-3">
            {resumen.length > 200 
              ? `${resumen.substring(0, 200)}...` 
              : resumen}
          </Card.Text>
        )}

        {displayTags.length > 0 && (
          <div className="mb-3">
            {displayTags.map((tag, index) => (
              <Badge 
                key={index} 
                bg="secondary" 
                className="me-1 mb-1" 
                style={{ fontSize: '0.7rem' }}
              >
                {tag}
              </Badge>
            ))}
            {etiquetas.length > 6 && (
              <Badge bg="light" text="dark" className="me-1 mb-1">
                +{etiquetas.length - 6} más
              </Badge>
            )}
          </div>
        )}

        {advertencias && advertencias !== 'Advertencias no encontradas' && (
          <div className="mb-3">
            <Badge bg="warning" text="dark">
              <i className="bi bi-exclamation-triangle me-1"></i>
              Advertencias
            </Badge>
          </div>
        )}

        <div className="mt-auto">
          <Button 
            href={enlace} 
            target="_blank" 
            rel="noopener noreferrer"
            variant="gradient"
            size="sm"
            className="w-100"
          >
            <i className="bi bi-box-arrow-up-right me-2"></i>
            Leer en AO3
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default FanficCard;
