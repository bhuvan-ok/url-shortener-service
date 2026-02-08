import React from 'react';
import { Clock, XCircle } from 'lucide-react';

const ActivityLog = ({ logs, onClear }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'info':
      default:
        return 'ℹ️';
    }
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>
          <Clock size={20} style={{ display: 'inline', marginRight: '8px' }} />
          Activity Log
        </h3>
        {logs.length > 0 && (
          <button 
            onClick={onClear} 
            className="btn-small btn-clear"
            title="Clear activity log"
          >
            <XCircle size={16} />
            Clear
          </button>
        )}
      </div>
      
      <div className="activity-log">
        {logs.length === 0 ? (
          <p className="info-text">Activity will appear here when you shorten URLs</p>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={`activity-item activity-${log.type}`}>
              <span className="activity-icon">{getLogIcon(log.type)}</span>
              <span className="activity-time">{formatTime(log.timestamp)}</span>
              <span className="activity-message">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;