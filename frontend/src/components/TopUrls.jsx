import React from 'react';
import { truncateUrl } from '../utils/helpers';
import { Trophy } from 'lucide-react';

const TopUrls = ({ urls, loading }) => {
  if (loading) {
    return (
      <div className="card">
        <h3>🏆 Top Performing URLs</h3>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="card">
      <h3>
        <Trophy size={20} style={{ display: 'inline', marginRight: '8px' }} />
        Top Performing URLs
      </h3>
      <div className="top-list">
        {urls.length === 0 ? (
          <p className="info-text">No URLs yet</p>
        ) : (
          urls.map((url, index) => (
            <div key={url._id} className="url-item">
              <div className="url-rank">#{index + 1}</div>
              <div className="url-info">
                <div className="url-short">/{url.shortCode}</div>
                <div className="url-long">{truncateUrl(url.longUrl)}</div>
              </div>
              <div className="url-clicks">{url.clicks} clicks</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopUrls;