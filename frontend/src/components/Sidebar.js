import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="sidebar">
      {/* About Me Card */}
      <Card className="sidebar-card about-card">
        <Card.Body>
          <div className="about-avatar">
            <div className="avatar-circle">
              <span>M</span>
            </div>
          </div>
          <h5 className="about-name">Melinda</h5>
          <p className="about-title">Founder & Editor</p>
          <p className="about-description">
            Apasionada por las historias, fanfics y recomendaciones. 
            Comparto mis descubrimientos favoritos y herramientas para encontrar 
            la lectura perfecta.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="social-link">
              <i className="fas fa-globe"></i>
            </a>
          </div>
        </Card.Body>
      </Card>

      {/* Tag Cloud */}
      <Card className="sidebar-card tag-cloud-card">
        <Card.Body>
          <h6 className="sidebar-title">
            <i className="fas fa-tags"></i>
            Tag Cloud
          </h6>
          <div className="tag-cloud">
            <span className="tag-item">
              <span className="tag-dot health"></span>
              Health
            </span>
            <span className="tag-item">
              <span className="tag-dot inspiration"></span>
              Inspiration
            </span>
            <span className="tag-item">
              <span className="tag-dot lifestyle"></span>
              Lifestyle
            </span>
            <span className="tag-item">
              <span className="tag-dot music"></span>
              Music
            </span>
            <span className="tag-item">
              <span className="tag-dot technology"></span>
              Technology
            </span>
            <span className="tag-item">
              <span className="tag-dot travel"></span>
              Travel
            </span>
            <span className="tag-item">
              <span className="tag-dot video"></span>
              Video
            </span>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Posts */}
      <Card className="sidebar-card recent-posts-card">
        <Card.Body>
          <h6 className="sidebar-title">
            <i className="fas fa-clock"></i>
            Recent Posts
          </h6>
          <div className="recent-posts">
            <div className="recent-post">
              <div className="post-thumbnail">
                <div className="thumbnail-placeholder">
                  <i className="fas fa-book"></i>
                </div>
              </div>
              <div className="post-info">
                <h6 className="post-title">
                  <Link to="/reviews/1">Mi reseña de Harry Potter</Link>
                </h6>
                <p className="post-date">Septiembre 24, 2025</p>
              </div>
            </div>
            <div className="recent-post">
              <div className="post-thumbnail">
                <div className="thumbnail-placeholder">
                  <i className="fas fa-heart"></i>
                </div>
              </div>
              <div className="post-info">
                <h6 className="post-title">
                  <Link to="/blog/1">Fanfics que me cambiaron la vida</Link>
                </h6>
                <p className="post-date">Septiembre 23, 2025</p>
              </div>
            </div>
            <div className="recent-post">
              <div className="post-thumbnail">
                <div className="thumbnail-placeholder">
                  <i className="fas fa-star"></i>
                </div>
              </div>
              <div className="post-info">
                <h6 className="post-title">
                  <Link to="/reviews/2">Top 5 fanfics de romance</Link>
                </h6>
                <p className="post-date">Septiembre 22, 2025</p>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Sidebar;
