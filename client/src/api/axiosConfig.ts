import axios from "axios";





export const API_BASE_URL = "https://dc8a-2a04-cec0-1027-7f74-c1ca-8a7f-b1e5-6f85.ngrok-free.app/api";
//  export const API_BASE_URL = "http://localhost:8080/api/";







const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
    },
    withCredentials: true,
});

export default axiosInstance;
