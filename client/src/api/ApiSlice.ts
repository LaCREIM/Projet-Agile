import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({

    baseUrl: "https://f620-2a04-cec0-109e-8a43-dc30-8a93-e0a-5544.ngrok-free.app",
     //baseUrl: "http://localhost:8080",

});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
    
});
