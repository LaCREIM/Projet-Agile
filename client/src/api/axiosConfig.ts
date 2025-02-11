import axios from "axios";

const API_BASE_URL = "https://2451-2a04-cec0-1034-72d-df7e-804c-c441-680a.ngrok-free.app/api/"; 

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
