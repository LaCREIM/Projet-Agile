import { apiSlice } from "../api/ApiSlice"


export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation({
            query: credentials => ({
                url: '/api/auth/login',
                method: 'POST',
                body: credentials
            })
        })
    })
})

export const {
    useLoginMutation
} = authApiSlice