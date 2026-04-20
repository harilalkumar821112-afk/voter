import axios from "axios";

// Use environment variable for API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

console.log("API_BASE_URL:", API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      console.error("Network error - Server may be down:", error.message);
      error.message = "Server not responding. Check your connection.";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
