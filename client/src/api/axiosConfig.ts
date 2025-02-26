import axios from "axios";


const API_BASE_URL = "https://652a-2a04-cec0-109b-4f22-4002-928b-2789-2c5f.ngrok-free.app/api";
// const API_BASE_URL = "http://localhost:8080/api/";


const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});

export default axiosInstance;
