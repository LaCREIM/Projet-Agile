import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: localStorage.getItem("username") || null,
    accessToken: localStorage.getItem("token") || null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { username, accessToken } = action.payload

            state.username = username
            state.accessToken = accessToken

            localStorage.setItem('username', username)
            localStorage.setItem('token', accessToken)
        },

        logout: (state) => {
            state.username = null
            state.accessToken = null

            localStorage.clear()
        }
    }
});

export default userSlice.reducer;
export const getToken = (state: any) => state.user.accessToken;
export const getUsername = (state: any) => state.user.username;

export const { setCredentials, logout } = userSlice.actions;