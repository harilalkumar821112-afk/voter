import axios from "axios";

// Use relative path for API calls - works in both development and production
const API_BASE_URL = process.env.REACT_APP_API_URL || "/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
