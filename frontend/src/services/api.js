import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      return Promise.reject({
        message: 'Rate limit exceeded. Please wait a moment.',
        ...error.response.data
      });
    }
    return Promise.reject(error);
  }
);

export const urlApi = {
  shortenUrl: async (longUrl) => {
    const response = await api.post('/shorten', { longUrl });
    return response.data;
  },

  getRecentUrls: async () => {
    const response = await api.get('/recent');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },

  getUrlStats: async (code) => {
    const response = await api.get(`/stats/${code}`);
    return response.data;
  }
};

export default api;