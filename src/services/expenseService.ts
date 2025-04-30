
import api, { mockApi } from './api';

// Use mockApi for development (replace with real API calls in production)
const USE_MOCK_API = true;

export const expenseService = {
  // Get all expenses (with optional filters)
  getExpenses: async (filters = {}) => {
    if (USE_MOCK_API) {
      return mockApi.expenses.getAll();
    }
    
    const response = await api.get('/expenses', { params: filters });
    return response.data;
  },
  
  // Create a new expense
  createExpense: async (expense) => {
    if (USE_MOCK_API) {
      return mockApi.expenses.create(expense);
    }
    
    const response = await api.post('/expenses', expense);
    return response.data;
  },
  
  // Update an existing expense
  updateExpense: async (id, expenseData) => {
    if (USE_MOCK_API) {
      return mockApi.expenses.update(id, expenseData);
    }
    
    const response = await api.patch(`/expenses/${id}`, expenseData);
    return response.data;
  },
  
  // Delete an expense
  deleteExpense: async (id) => {
    if (USE_MOCK_API) {
      return mockApi.expenses.delete(id);
    }
    
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },
};
