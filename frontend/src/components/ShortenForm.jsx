import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlApi } from '../services/api';
import { isValidUrl, copyToClipboard } from '../utils/helpers';
import { Copy, BarChart3 } from 'lucide-react';

const ShortenForm = ({ onSuccess, addLog, showToast }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      return;
    }

    setLoading(true);

    try {
      const data = await urlApi.shortenUrl(url);
      setResult(data);
      setUrl('');
      addLog(`Created short URL: /${data.shortCode}`, 'success');
      onSuccess();
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message || 'Failed to shorten URL';
      setError(errorMsg);
      addLog(`Error: ${errorMsg}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    
    const success = await copyToClipboard(result.shortUrl);
    if (success) {
      setCopySuccess(true);
      showToast('Link copied to clipboard!');
      addLog(`Copied link: ${result.shortUrl}`, 'info');
      setTimeout(() => setCopySuccess(false), 2000);
    } else {
      showToast('Failed to copy link');
    }
  };

  const handleViewStats = () => {
    if (result) {
      navigate(`/stats/${result.shortCode}`);
    }
  };

  return (
    <div className="card main-card">
      <h2>Shorten Your URL</h2>
      
      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very-long-url..."
          disabled={loading}
          autoFocus
        />
        <button 
          type="submit" 
          className="btn-primary"
          disabled={loading}
        >
          {loading ? '⏳ Shortening...' : 'Shorten'}
        </button>
      </form>

      {error && (
        <div className="error-result">
          <p>❌ {error}</p>
        </div>
      )}

      {result && (
        <div className="success-result">
          <p className="result-label">✅ Your shortened URL:</p>
          <div className="result-url">
            <a href={result.shortUrl} target="_blank" rel="noopener noreferrer">
              {result.shortUrl}
            </a>
          </div>
          <div className="result-actions">
            <button 
              onClick={handleCopy} 
              className="btn-primary"
              style={copySuccess ? { background: '#10b981' } : {}}
            >
              <Copy size={16} />
              {copySuccess ? 'Copied!' : 'Copy Link'}
            </button>
            <button onClick={handleViewStats} className="btn-secondary">
              <BarChart3 size={16} />
              View Stats
            </button>
          </div>
        </div>
      )}

      <div className="rate-limit-info">
        <small>⏱️ Rate Limit: 20 requests per minute</small>
      </div>
    </div>
  );
};

export default ShortenForm;