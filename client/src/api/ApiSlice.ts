import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({

    baseUrl: "https://dc8a-2a04-cec0-1027-7f74-c1ca-8a7f-b1e5-6f85.ngrok-free.app",
     //baseUrl: "http://localhost:8080",

});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
    
});
