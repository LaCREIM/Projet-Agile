import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username: localStorage.getItem("username") || null,
    role: localStorage.getItem("role") || null,
    accessToken: localStorage.getItem("token") || null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { username, accessToken, role } = action.payload

            state.username = username
            state.accessToken = accessToken
            state.role = role

            localStorage.setItem('username', username)
            localStorage.setItem('token', accessToken)
            localStorage.setItem('role', role)
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
export const getRole = (state: any) => state.user.role;


export const { setCredentials, logout } = userSlice.actions;