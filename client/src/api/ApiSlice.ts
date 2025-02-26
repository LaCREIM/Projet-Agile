import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
    //baseUrl: "http://localhost:8080",
    baseUrl: "https://652a-2a04-cec0-109b-4f22-4002-928b-2789-2c5f.ngrok-free.app",

});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
    
});
