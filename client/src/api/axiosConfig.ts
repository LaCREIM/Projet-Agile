import axios from "axios";

const API_BASE_URL = "https://5457-46-193-1-54.ngrok-free.app/api/"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
