import React from 'react';
import { Link2, MousePointerClick } from 'lucide-react';

const StatsCards = ({ totalUrls, totalClicks, loading }) => {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <Link2 size={32} color="#667eea" />
        </div>
        <div className="stat-value">
          {loading ? '...' : totalUrls || 0}
        </div>
        <div className="stat-label">Total URLs</div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon">
          <MousePointerClick size={32} color="#764ba2" />
        </div>
        <div className="stat-value">
          {loading ? '...' : totalClicks || 0}
        </div>
        <div className="stat-label">Total Clicks</div>
      </div>
    </div>
  );
};

export default StatsCards;