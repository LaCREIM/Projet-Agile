import axios from "axios";

const API_BASE_URL = "https://dea2-193-54-246-73.ngrok-free.app/api/"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
