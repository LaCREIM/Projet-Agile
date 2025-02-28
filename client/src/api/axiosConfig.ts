import axios from "axios";




const API_BASE_URL = "https://77bb-2a04-cec0-109e-ba57-6394-d38e-652c-e731.ngrok-free.app/api";
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
