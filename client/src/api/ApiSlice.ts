import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {API_BASE_URL} from "./baseUrl.ts";

const baseQuery = fetchBaseQuery({

    baseUrl: API_BASE_URL,
    //baseUrl: "http://localhost:8080",

});
export const apiSlice = createApi({
    baseQuery: baseQuery,
    endpoints: () => ({}),

});
