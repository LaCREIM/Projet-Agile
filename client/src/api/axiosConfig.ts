import axios from "axios";

const API_BASE_URL = "https://ac63-2a04-cec0-1038-2456-3100-210e-de98-1da0.ngrok-free.app/api/"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
