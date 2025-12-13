// frontend/src/api/axios.js
import axios from "axios";
import { refreshToken } from "./auth";
import config from "../config";

const API = axios.create({
  baseURL: config.API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add token to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for expired tokens
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccess = await refreshToken();
        API.defaults.headers.common['Authorization'] = `Bearer ${newAccess}`;
        originalRequest.headers['Authorization'] = `Bearer ${newAccess}`;
        return API(originalRequest);
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;