import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const baseQuery = fetchBaseQuery({
    baseUrl: "https://5513-2a04-cec0-108c-2f71-3a6-2dd6-7043-1ad9.ngrok-free.app",
});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),
    
});
