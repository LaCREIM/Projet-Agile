import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
    //baseUrl: "http://localhost:8080",
    baseUrl: "https://7269-2a04-cec0-109e-ba57-3106-e42e-ffe3-cd4c.ngrok-free.app",

});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
    
});
