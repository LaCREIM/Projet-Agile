import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from "../api/axiosConfig.ts";
import { UniteEnseignement } from '../types/types';

interface UniteEnseignementState {
    unitesEnseignement: UniteEnseignement[];
    loading: boolean;
    error: string | null;
}

const initialState: UniteEnseignementState = {
    unitesEnseignement: [],
    loading: false,
    error: null,
};

// Async thunk to fetch all UniteEnseignement
export const fetchAllUnitesEnseignementAsync = createAsyncThunk<UniteEnseignement[], void, { rejectValue: string }>(
    'unitesEnseignement/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<UniteEnseignement[]>('/unites-enseignement');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || 'Error fetching Unites Enseignement');
        }
    }
);

const uniteEnseignementSlice = createSlice({
    name: 'unitesEnseignement',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUnitesEnseignementAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUnitesEnseignementAsync.fulfilled, (state, action: PayloadAction<UniteEnseignement[]>) => {
                state.unitesEnseignement = action.payload;
                state.loading = false;
            })
            .addCase(fetchAllUnitesEnseignementAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default uniteEnseignementSlice.reducer;