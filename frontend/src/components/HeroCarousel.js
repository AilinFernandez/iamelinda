import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselData, setCarouselData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarouselData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 4);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const loadCarouselData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/latest`);
      if (!response.ok) {
        throw new Error('Error al cargar datos');
      }
      const data = await response.json();
      setCarouselData(data);
    } catch (error) {
      console.error('Error cargando datos del carrusel:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % 4);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + 4) % 4);
  };

  const getSlideContent = (slideIndex) => {
    if (!carouselData) return null;

    switch (slideIndex) {
      case 0:
        return {
          title: "Hey, I'm Melinda 👋",
          subtitle: "Welcome to my corner of the internet",
          description: "Passionate about stories, fanfics, and discovering amazing reads. Join me on this journey of literary exploration and personal growth.",
          buttonText: "Explore My World",
          buttonLink: "/about",
          backgroundImage: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          overlay: "personal"
        };
      
      case 1:
        return {
          title: "🤖 AI-Powered Recommender",
          subtitle: "Discover Your Next Favorite Story",
          description: "Tell me what you're looking for and I'll find the perfect fanfics, books, or stories for you. Powered by advanced AI to understand your preferences and suggest amazing reads.",
          buttonText: "Try the Recommender",
          buttonLink: "/search",
          backgroundImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          overlay: "ai"
        };
      
      case 2:
        const review = carouselData.latest.review;
        if (!review) return null;
        return {
          title: review.title,
          subtitle: `Latest Review • ${review.category}`,
          description: review.summary,
          buttonText: "Read Review",
          buttonLink: `/reviews/${review.id}`,
          backgroundImage: review.bannerImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          overlay: "review"
        };
      
      case 3:
        const post = carouselData.latest.post;
        if (!post) return null;
        return {
          title: post.title,
          subtitle: `Latest Blog Post • ${post.category}`,
          description: post.summary,
          buttonText: "Read Post",
          buttonLink: `/blog/${post.id}`,
          backgroundImage: post.bannerImage || "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          overlay: "blog"
        };
      
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="hero-carousel loading">
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const slides = [0, 1, 2, 3];
  const currentContent = getSlideContent(currentSlide);

  if (!currentContent) {
    return null;
  }

  return (
    <div className="hero-carousel">
      <div className="carousel-container">
        {/* Background Image */}
        <div 
          className="carousel-background"
          style={{ backgroundImage: `url(${currentContent.backgroundImage})` }}
        />
        
        {/* Overlay */}
        <div className={`carousel-overlay ${currentContent.overlay}`} />
        
        {/* Content */}
        <Container className="carousel-content">
          <Row className="align-items-center min-vh-50">
            <Col lg={8}>
              <div className="carousel-text">
                <h1 className="carousel-title">{currentContent.title}</h1>
                <p className="carousel-subtitle">{currentContent.subtitle}</p>
                <p className="carousel-description">{currentContent.description}</p>
                <Button 
                  as={Link} 
                  to={currentContent.buttonLink}
                  className="carousel-button"
                  size="lg"
                >
                  {currentContent.buttonText}
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
        
        {/* Navigation Arrows */}
        <button className="carousel-nav carousel-prev" onClick={prevSlide}>
          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="carousel-nav carousel-next" onClick={nextSlide}>
          <i className="fas fa-chevron-right"></i>
        </button>
        
        {/* Dots Indicator */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;
