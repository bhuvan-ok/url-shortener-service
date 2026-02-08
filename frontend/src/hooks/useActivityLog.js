import { useState, useEffect } from 'react';

const STORAGE_KEY = 'url_shortener_activity_log';
const MAX_LOG_ENTRIES = 20;

export const useActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLogs(parsed);
      } catch (e) {
        console.error('Failed to parse activity log:', e);
        setLogs([]);
      }
    }
  }, []);

  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    }
  }, [logs]);

  const addLog = (message, type = 'info') => {
    const newLog = {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString(),
    };

    setLogs((prevLogs) => {
      const updated = [newLog, ...prevLogs];
      return updated.slice(0, MAX_LOG_ENTRIES);
    });
  };

  const clearLogs = () => {
    setLogs([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { logs, addLog, clearLogs };
};