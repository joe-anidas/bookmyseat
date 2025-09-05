// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API_VERSION = import.meta.env.VITE_API_VERSION || 'v1';

// API Endpoints
export const API_ENDPOINTS = {
  BASE: API_BASE_URL,
  BOOKINGS: `${API_BASE_URL}/api/bookings`,
  BOOKED_SEATS: `${API_BASE_URL}/api/booked-seats`,
};

// Environment Configuration
export const ENV_CONFIG = {
  API_BASE_URL,
  API_VERSION,
  NODE_ENV: import.meta.env.VITE_NODE_ENV || 'development',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Bus Ticket Booking System',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// API Helper Functions
export const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export default API_ENDPOINTS;
