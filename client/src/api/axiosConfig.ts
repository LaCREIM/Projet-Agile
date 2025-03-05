import axios from "axios";




export const API_BASE_URL = "https://5513-2a04-cec0-108c-2f71-3a6-2dd6-7043-1ad9.ngrok-free.app/api";
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
