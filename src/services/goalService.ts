
import api, { mockApi } from './api';

// Use mockApi for development (replace with real API calls in production)
const USE_MOCK_API = true;

export const goalService = {
  // Get all savings goals
  getGoals: async () => {
    if (USE_MOCK_API) {
      return mockApi.goals.getAll();
    }
    
    const response = await api.get('/goals');
    return response.data;
  },
  
  // Create a new savings goal
  createGoal: async (goal) => {
    if (USE_MOCK_API) {
      return mockApi.goals.create(goal);
    }
    
    const response = await api.post('/goals', goal);
    return response.data;
  },
  
  // Update an existing savings goal
  updateGoal: async (id, goalData) => {
    if (USE_MOCK_API) {
      return mockApi.goals.update(id, goalData);
    }
    
    const response = await api.patch(`/goals/${id}`, goalData);
    return response.data;
  },
  
  // Delete a savings goal
  deleteGoal: async (id) => {
    if (USE_MOCK_API) {
      return mockApi.goals.delete(id);
    }
    
    const response = await api.delete(`/goals/${id}`);
    return response.data;
  },
};
