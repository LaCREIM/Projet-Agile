import axios from "axios";


const API_BASE_URL = "https://e0c2-2a04-cec0-1029-cd2e-7849-e74f-d964-3d0.ngrok-free.app/api/"; 
//const API_BASE_URL = "http://localhost:8080/api/"; 


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
