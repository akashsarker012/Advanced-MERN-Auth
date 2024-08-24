import axios from 'axios';
import create from 'zustand';

const API_URL = 'http://localhost:5000/api/v1';


export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  singup: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/singup`, { email, password, name });
      
      // Add a log to inspect the response structure
      console.log('Signup Response:', response);

      // Check if response and response.data exist before accessing user
      if (response && response.data && response.data.user) {
        set({ user: response.data.user, isAuthenticated: true, isLoading: false, error: null });
      } else {
        throw new Error('Unexpected API response structure');
      }
    } catch (error) {
      // Handle cases where error.response might be undefined
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      set({ error: errorMessage, isLoading: false });
      console.error(error);
      throw error; // Re-throw to handle in component
    }
  }
}));
