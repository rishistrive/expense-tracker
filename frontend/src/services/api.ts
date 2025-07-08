import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// This sets the Authorization header for all requests automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;




