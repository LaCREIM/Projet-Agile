import axios from "axios";




const API_BASE_URL = "https://24c9-2a04-cec0-109e-ba57-ca30-67a2-84a0-15a1.ngrok-free.app/api";
// const API_BASE_URL = "http://localhost:8080/api/";




const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
});

export default axiosInstance;
