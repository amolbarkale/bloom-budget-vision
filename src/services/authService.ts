
import api, { mockApi } from './api';

// Use mockApi for development (replace with real API calls in production)
const USE_MOCK_API = true;

export const authService = {
  // User login
  login: async (email: string, password: string) => {
    if (USE_MOCK_API) {
      return mockApi.auth.login(email, password);
    }
    
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  // User registration
  register: async (email: string, password: string) => {
    if (USE_MOCK_API) {
      return mockApi.auth.register(email, password);
    }
    
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
  
  // Reset password
  resetPassword: async (email: string) => {
    if (USE_MOCK_API) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    }
    
    const response = await api.post('/auth/reset-password', { email });
    return response.data;
  },
};
