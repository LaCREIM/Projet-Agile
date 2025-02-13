/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosConfig';
import { Enseignant } from "../types/types";
import { RootState } from "../api/store";



interface EnseignantState {
    enseignants: Enseignant[];
    allEnseignants: Enseignant[];

    loading: boolean;
    error: string | null;
}

const initialState: EnseignantState = {
    enseignants: [],
    allEnseignants: [],
    loading: false,
    error: null,
};

// Actions asynchrones
export const getEnseignantAsync = createAsyncThunk<
    Enseignant[],
    { page: number; size: number },
    { rejectValue: string }
>(
    "enseignants/getEnseignantAsync",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Enseignant[]>(`/enseignants`, {
                params: { page, size },
            });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching professors:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching professors.");
        }
    }
);

export const getAllEnseignantAsync = createAsyncThunk<
    Enseignant[], void,
    { rejectValue: string }
>(
    "enseignants/getAllEnseignantAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Enseignant[]>(`/enseignants/paged`);
            console.log(response.data);
             
            return response.data;
        } catch (error: any) {
            console.error("Error fetching professors:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching professors.");
        }
    }
);


export const postEnseignantAsync = createAsyncThunk<Enseignant, Enseignant, { rejectValue: string }>(
    "enseignants/createEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/enseignants', enseignant);
            return response.data;
        } catch (error: any) {
            console.error("Error adding professor:", error);
            return rejectWithValue(error.response?.data || "An error occurred while adding the professor.");
        }
    }
);

export const editEnseignantAsync = createAsyncThunk<void, Enseignant, { rejectValue: string }>(
    "enseignants/editEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            console.log("Updating enseignant:", enseignant);

            if (!enseignant.id) {
                throw new Error("L'enseignant n'a pas d'ID valide.");
            }

            const response = await axiosInstance.put(`/enseignants/${enseignant.id}`, enseignant);
            return response.data;
        } catch (error: any) {
            console.error("Error updating enseignant:", error);
            return rejectWithValue(error.response?.data || "An error occurred while updating the professor.");
        }
    }
);


export const deleteEnseignantAsync = createAsyncThunk<void, Enseignant, { rejectValue: string }>(
    "enseignants/deleteEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            console.log("Deleting enseignant:", enseignant);
            if (!enseignant.id) {
                throw new Error("L'enseignant n'a pas d'ID valide.");
            }
            const response = await axiosInstance.delete(`/enseignants/${enseignant.id}`);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting enseignant:", error);
            return rejectWithValue(error.response?.data || "An error occurred while deleting the enseignant.");
        }
    }
);



const enseignantSlice = createSlice({
    name: "enseignants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEnseignantAsync.fulfilled, (state, action: PayloadAction<Enseignant[]>) => {
                state.loading = false;
                state.enseignants = action.payload;
            })
            .addCase(getAllEnseignantAsync.fulfilled, (state, action: PayloadAction<Enseignant[]>) => {
                state.loading = false;
                state.allEnseignants = action.payload;
            })

    },
});

export const getEnseignants = (state: RootState) => state.enseignants.enseignants;
export const getAllEnseignant = (state: RootState) => state.enseignants.allEnseignants;

export default enseignantSlice.reducer;

