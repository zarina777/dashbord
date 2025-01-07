import axios from "axios";
import { useNavigate } from "react-router-dom";

// Define the base URL
const API_BASE_URL = "https://server-inky-eight-70.vercel.app/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = JSON.parse(localStorage.getItem("info")).token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const navigate = useNavigate();
      localStorage.removeItem("info");
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

export default api;
