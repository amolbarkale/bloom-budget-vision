
import axios from 'axios';

// Create a base API client with default config
const api = axios.create({
  // In a real app, this would point to your actual API
  baseURL: 'https://api.budgetbloom.com/v1', // This is just a placeholder URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor that adds the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('budgetbloom_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle 401 Unauthorized responses by logging out the user
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('budgetbloom_token');
      localStorage.removeItem('budgetbloom_user');
      window.location.href = '/login';
    }
    
    // Format error message for better UX
    const errorMessage = 
      (error.response && error.response.data && error.response.data.message) || 
      error.message || 
      'Something went wrong';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;

// Mock API for development (remove in production)
export const mockApi = {
  // User authentication endpoints
  auth: {
    login: (email: string, password: string) => {
      // In a real app, this would be a real API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: 'mock-jwt-token',
            user: {
              id: '123',
              email,
            },
          });
        }, 500);
      });
    },
    register: (email: string, password: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            token: 'mock-jwt-token',
            user: {
              id: '123',
              email,
            },
          });
        }, 500);
      });
    },
  },
  
  // Expenses endpoints
  expenses: {
    getAll: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              userId: '123',
              amount: 25.50,
              category: 'Food',
              note: 'Lunch at restaurant',
              date: '2025-05-12T12:00:00Z',
            },
            {
              id: '2',
              userId: '123',
              amount: 45.00,
              category: 'Transport',
              note: 'Uber ride',
              date: '2025-05-11T18:30:00Z',
            },
            {
              id: '3',
              userId: '123',
              amount: 120.75,
              category: 'Entertainment',
              note: 'Concert tickets',
              date: '2025-05-10T20:00:00Z',
            },
            {
              id: '4',
              userId: '123',
              amount: 78.30,
              category: 'Shopping',
              note: 'New shirt',
              date: '2025-05-09T15:45:00Z',
            },
          ]);
        }, 500);
      });
    },
    create: (expense: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            userId: '123',
            ...expense,
          });
        }, 500);
      });
    },
    update: (id: string, expense: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            userId: '123',
            ...expense,
          });
        }, 500);
      });
    },
    delete: (id: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    },
  },
  
  // Savings goals endpoints
  goals: {
    getAll: () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: '1',
              userId: '123',
              month: '2025-05',
              targetAmount: 1000,
            },
            {
              id: '2',
              userId: '123',
              month: '2025-06',
              targetAmount: 1200,
            },
          ]);
        }, 500);
      });
    },
    create: (goal: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            userId: '123',
            ...goal,
          });
        }, 500);
      });
    },
    update: (id: string, goal: any) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id,
            userId: '123',
            ...goal,
          });
        }, 500);
      });
    },
    delete: (id: string) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    },
  },
};
