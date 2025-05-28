// Connecting to the backend API
import axios from 'axios';

// We'd change the api link of the backend here
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const testConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/test`);
    return response.data;
  } catch (error) {
    console.error('Error connecting to backend:', error);
    throw error;
  }
};

