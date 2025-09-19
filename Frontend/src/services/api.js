import axios from "axios";

const server = import.meta.env.VITE_API_BASE_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${server}/api`, // Your Laravel backend
  // baseURL: "http://localhost:8000/api", // Your Laravel backend
  withCredentials: true, // Required for Sanctum cookies
});

// Request interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default api;
