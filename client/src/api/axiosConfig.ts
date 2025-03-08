import axios from "axios";
import { API_BASE_URL } from "./baseUrl";





//  export const API_BASE_URL = "https://f620-2a04-cec0-109e-8a43-dc30-8a93-e0a-5544.ngrok-free.app/api";
//export const API_BASE_URL = "http://localhost:8080/api/";







const axiosInstance = axios.create({
    baseURL: API_BASE_URL + "/api",
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
});

export default axiosInstance;
