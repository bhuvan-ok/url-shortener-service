import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { urlApi } from '../services/api';
import { formatDate, formatDateShort, copyToClipboard, getBaseUrl } from '../utils/helpers';
import { usePolling } from '../hooks/usePolling';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowLeft, Copy, ExternalLink } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const UrlStats = ({ showToast, addLog }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadStats = async () => {
    try {
      const data = await urlApi.getUrlStats(code);
      setStats(data);
      setError('');
    } catch (err) {
      setError('URL not found');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, [code]);

  usePolling(loadStats, 2000, !loading && !error);

  const handleCopy = async () => {
    const url = `${getBaseUrl()}/${code}`;
    const success = await copyToClipboard(url);
    if (success) {
      showToast('URL copied to clipboard!');
      addLog(`Copied link: ${url}`, 'info');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">Loading stats...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <div className="error-result">
            <p>❌ {error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const dailyClicksEntries = Object.entries(stats.dailyClicks || {}).sort();
  const chartData = {
    labels: dailyClicksEntries.map(([date]) => formatDateShort(date)),
    datasets: [
      {
        label: 'Clicks per day',
        data: dailyClicksEntries.map(([, clicks]) => clicks),
        backgroundColor: '#667eea',
        borderColor: '#5563d6',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 },
      },
    },
  };

  const shortUrl = `${getBaseUrl()}/${code}`;

  return (
    <div className="container">
      <div className="card">
        <h2>📊 Link Analytics</h2>

        <div className="stats-detail">
          <div className="stat-row">
            <strong>Short URL:</strong>
            <span className="url-text">
              <a href={shortUrl} target="_blank" rel="noopener noreferrer">
                {shortUrl}
                <ExternalLink size={14} style={{ marginLeft: '4px', display: 'inline' }} />
              </a>
            </span>
            <button onClick={handleCopy} className="btn-small">
              <Copy size={14} />
              Copy
            </button>
          </div>
          
          <div className="stat-row">
            <strong>Original URL:</strong>
            <span className="url-text">
              <a href={stats.longUrl} target="_blank" rel="noopener noreferrer">
                {stats.longUrl}
                <ExternalLink size={14} style={{ marginLeft: '4px', display: 'inline' }} />
              </a>
            </span>
          </div>
          
          <div className="stat-row">
            <strong>Total Clicks:</strong>
            <span className="highlight">{stats.clicks}</span>
          </div>
          
          <div className="stat-row">
            <strong>Created:</strong>
            <span>{formatDate(stats.createdAt)}</span>
          </div>
        </div>

        {dailyClicksEntries.length > 0 && (
          <div className="chart-container">
            <h3>Daily Click Analytics</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        )}

        <br />
        <button onClick={() => navigate('/')} className="btn-secondary">
          <ArrowLeft size={16} />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default UrlStats;