import axios from "axios";

// Instance for apis that DONT needx /api prefix

const server = import.meta.env.VITE_API_URL;

const serv = axios.create({
  baseURL: `${server}`, // Your Laravel backend
  withCredentials: true, // Required for Sanctum cookies
});

// Request interceptor to handle errors globally
serv.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export default serv;
