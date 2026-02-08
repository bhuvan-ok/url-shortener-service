import React from 'react';
import { useNavigate } from 'react-router-dom';
import { truncateUrl, formatDate } from '../utils/helpers';
import { ExternalLink } from 'lucide-react';

const RecentUrls = ({ urls, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="card">
        <h3>📋 Recent URLs</h3>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>📋 Recent URLs</h3>
      <div className="recent-list">
        {urls.length === 0 ? (
          <p className="info-text">No URLs yet. Create your first one!</p>
        ) : (
          urls.map((url) => (
            <div key={url._id} className="url-item">
              <div className="url-info">
                <div className="url-short">
                  <a 
                    href={`/${url.shortCode}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    /{url.shortCode}
                    <ExternalLink size={14} style={{ marginLeft: '4px', display: 'inline' }} />
                  </a>
                </div>
                <div className="url-long">{truncateUrl(url.longUrl)}</div>
                <div className="url-meta">
                  {formatDate(url.createdAt)} • {url.clicks} clicks
                </div>
              </div>
              <button
                onClick={() => navigate(`/stats/${url.shortCode}`)}
                className="btn-small"
              >
                Stats
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentUrls;