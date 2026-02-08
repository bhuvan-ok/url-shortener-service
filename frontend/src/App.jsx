import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { urlApi } from './services/api';
import { useActivityLog } from './hooks/useActivityLog';
import { usePolling, useVisibilityChange } from './hooks/usePolling';

import Header from './components/Header';
import ShortenForm from './components/ShortenForm';
import StatsCards from './components/Statscards';
import RecentUrls from './components/RecentUrls';
import TopUrls from './components/TopUrls';
import ActivityLog from './components/ActivityLog';
import UrlStats from './components/UrlStats';
import Toast from './components/Toast';

function Dashboard() {
  const [analytics, setAnalytics] = useState({
    totalUrls: 0,
    totalClicks: 0,
    topUrls: [],
  });
  const [recentUrls, setRecentUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const { logs, addLog, clearLogs } = useActivityLog();

  const loadAnalytics = useCallback(async () => {
    try {
      const data = await urlApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error loading analytics:', err);
    }
  }, []);

  const loadRecentUrls = useCallback(async () => {
    try {
      const data = await urlApi.getRecentUrls();
      setRecentUrls(data);
    } catch (err) {
      console.error('Error loading recent URLs:', err);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadAnalytics(), loadRecentUrls()]);
    setLoading(false);
  }, [loadAnalytics, loadRecentUrls]);

  useEffect(() => {
    loadDashboard();
    addLog('Dashboard loaded', 'info');
  }, []);

  usePolling(() => {
    loadAnalytics();
    loadRecentUrls();
  }, 3000, true);

  useVisibilityChange(loadDashboard);

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const closeToast = () => {
    setToast({ show: false, message: '' });
  };

  return (
    <>
      <Header />
      
      <ShortenForm
        onSuccess={loadDashboard}
        addLog={addLog}
        showToast={showToast}
      />

      <StatsCards
        totalUrls={analytics.totalUrls}
        totalClicks={analytics.totalClicks}
        loading={loading}
      />

      <RecentUrls urls={recentUrls} loading={loading} />

      <TopUrls urls={analytics.topUrls} loading={loading} />

      <ActivityLog logs={logs} onClear={clearLogs} />

      <Toast
        message={toast.message}
        show={toast.show}
        onClose={closeToast}
      />
    </>
  );
}

function App() {
  const { addLog } = useActivityLog();
  const [toast, setToast] = useState({ show: false, message: '' });

  const showToast = (message) => {
    setToast({ show: true, message });
  };

  const closeToast = () => {
    setToast({ show: false, message: '' });
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/stats/:code"
            element={<UrlStats showToast={showToast} addLog={addLog} />}
          />
        </Routes>
      </div>
      
      <Toast
        message={toast.message}
        show={toast.show}
        onClose={closeToast}
      />
    </Router>
  );
}

export default App;