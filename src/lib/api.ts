import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "/api";

// Create axios instance
const api = axios.create({
  baseURL: baseURL,
  withCredentials: true, // CRITICAL: Sends HttpOnly Cookies with every request
  // REMOVED: headers: { "Content-Type": "application/json" } 
  // WHY? If we leave this, File Uploads (FormData) will fail. 
  // Axios automatically detects JSON vs Files if we leave it undefined.
});

// Request Interceptor: Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend says "401 Unauthorized" (Token expired/missing)
    if (error.response?.status === 401) {
      // Clear any local user data and token
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      
      // Redirect to login (unless already on login/register page)
      if (!['/login', '/register'].includes(window.location.pathname)) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;