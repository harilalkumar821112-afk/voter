import axios from "axios";

// Use relative path for API calls - works in both development and production
const API_BASE_URL = "https://voter-tawny.vercel.app/";

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
