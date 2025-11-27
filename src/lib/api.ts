import axios from "axios";

//create an instance
const api = axios.create({
  baseURL: "/api", // The proxy handles the rest
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Request Interceptor: Attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Handle Token Expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend says "401 Unauthorized" (Token expired/invalid)
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // Force redirect to login
    }
    return Promise.reject(error);
  }
);

export default api;
