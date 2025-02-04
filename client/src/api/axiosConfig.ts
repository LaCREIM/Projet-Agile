import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api"; // Change l'URL selon ton backend

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Si ton backend utilise des cookies
});

export default axiosInstance;
