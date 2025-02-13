import axios from "axios";

const API_BASE_URL = "https://dabd-2a04-cec0-1029-cd2e-ea93-eda1-9f46-e74c.ngrok-free.app/api/"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
