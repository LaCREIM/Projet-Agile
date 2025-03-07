import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {API_BASE_URL} from "./baseUrl.ts";

const baseQuery = fetchBaseQuery({

    baseUrl: "https://9cea-2a04-cec0-1027-7f74-204e-7941-9765-612.ngrok-free.app",
    //baseUrl: "http://localhost:8080",

});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),

});
