/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosConfig';

export interface Enseignant {
    noEnseignant: number;
    type: string;
    nom: string;
    prenom: string;
    sexe: string;
    adresse: string;
    email: string;
    cp: string;
    telPort: string;
    pays: string;
    encUboTel: number;
    encUboEmail: string;
    encPersoEmail: string;
    intFonction: string;
    intNoInsee: number;
    intSocNom: string;
}

interface EnseignantState {
    enseignants: Enseignant[];
    loading: boolean;
    error: string | null;
}

const initialState: EnseignantState = {
    enseignants: [],
    loading: false,
    error: null,
};

// Actions asynchrones
export const getEnseignantAsync = createAsyncThunk<Enseignant[], void, { rejectValue: string }>(
    "enseignants/getEnseignantAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Enseignant[]>('/enseignants');
            return response.data;
        } catch (error: any) {
            console.error("Error fetching professors:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching professors.");
        }
    }
);

export const createEnseignantAsync = createAsyncThunk<Enseignant, Enseignant, { rejectValue: string }>(
    "enseignants/createEnseignantAsync",
    async (enseignant , { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/enseignants', enseignant);
            return response.data;
        } catch (error: any) {
            console.error("Error adding professor:", error);
            return rejectWithValue(error.response?.data || "An error occurred while adding the professor.");
        }
    }
);

export const editEnseignantAsync = createAsyncThunk<void, Enseignant , { rejectValue: string }>(
    "enseignants/editEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/enseignants/${enseignant.noEnseignant}`, enseignant);
            return response.data;
        } catch (error: any) {
            console.error("Error updating professor:", error);
            return rejectWithValue(error.response?.data || "An error occurred while updating the professor.");
        }
    }
);

export const deleteEnseignantAsync = createAsyncThunk<void, Enseignant, { rejectValue: string }>(
    "enseignants/deleteEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/enseignants/${enseignant.noEnseignant}`);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting enseignant:", error);
            return rejectWithValue(error.response?.data || "An error occurred d while deleting the enseignant.");
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
            
    },
});

export default enseignantSlice.reducer;

