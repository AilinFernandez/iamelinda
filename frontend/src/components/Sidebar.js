import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import API_BASE_URL from '../config/api';

function Sidebar() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentPosts();
  }, []);

  const loadRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/latest`);
      if (response.ok) {
        const data = await response.json();
        setRecentPosts(data.recent || []);
      }
    } catch (error) {
      console.error('Error cargando posts recientes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      'review': 'fas fa-star',
      'post': 'fas fa-feather-alt',
      'library': 'fas fa-book'
    };
    return icons[type] || 'fas fa-file';
  };

  const getTypeLink = (type, id) => {
    const links = {
      'review': `/reviews/${id}`,
      'post': `/blog/${id}`,
      'library': `/library/${id}`
    };
    return links[type] || '/';
  };
  return (
    <div className="sidebar">

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
            {loading ? (
              <div className="text-center">
                <p>Cargando...</p>
              </div>
            ) : recentPosts.length > 0 ? (
              recentPosts.map((post, index) => (
                <div key={index} className="recent-post">
                  <div className="post-thumbnail">
                    <div className="thumbnail-placeholder">
                      <i className={getTypeIcon(post.type)}></i>
                    </div>
                  </div>
                  <div className="post-info">
                    <h6 className="post-title">
                      <Link to={getTypeLink(post.type, post.id)}>{post.title}</Link>
                    </h6>
                    <p className="post-date">{post.date}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p>No hay posts recientes</p>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Sidebar;
