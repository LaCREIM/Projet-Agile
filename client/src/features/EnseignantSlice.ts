/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../api/axiosConfig';
import { Enseignant } from "../types/types";
import { RootState } from "../api/store";

interface EnseignantResponse {
    enseignants: Enseignant[];
    totalPages: number;
}
export interface Domaine_Pays {
    rvLowValue: string;
    rvMeaning: string;
}
interface EnseignantState {
    enseignants: Enseignant[];
    allEnseignants: Enseignant[];
    pays: Domaine_Pays[];
    totalPages: number;
    loading: boolean;
    error: string | null;
}

const initialState: EnseignantState = {
    enseignants: [],
    allEnseignants: [],
    totalPages: 1,
    pays: [],
    loading: false,
    error: null,
};

// Actions asynchrones
export const getEnseignantAsync = createAsyncThunk<
    EnseignantResponse,
    { page: number; size: number },
    { rejectValue: string }
>(
    "enseignants/getEnseignantAsync",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EnseignantResponse>(`/enseignants/paged`, {
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
            const response = await axiosInstance.get<Enseignant[]>(`/enseignants`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching professors:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching professors.");
        }
    }
);


export const postEnseignantAsync = createAsyncThunk<
    void,
    Enseignant,
    { rejectValue: string }
>(
    "enseignants/createEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            //console.log("Envoi des données à l'API :", enseignant);
            const response = await axiosInstance.post('/enseignants', enseignant);
            //console.log("Réponse reçue :", response);
            return response.data;
        } catch (error: any) {
            console.error("Erreur de l'API :", error.response?.data);
            return rejectWithValue(error.response?.data || "Erreur inconnue lors de l'ajout.");
        }
    }
);

export const getDomainePaysAsync = createAsyncThunk<Domaine_Pays[], void, { rejectValue: string }>(
    "paysOrigine/getGroupeTPAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Domaine_Pays[]>(`/cgRefCodes/byDomain?domain=PAYS`);
            // console.log("from all", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching groupe tps:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching pays.");
        }
    }
);

export const editEnseignantAsync = createAsyncThunk<void, Enseignant, { rejectValue: string }>(
    "enseignants/editEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            // console.log("Updating enseignant:", enseignant);

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


export const deleteEnseignantAsync = createAsyncThunk<
    number, // Retourne l'ID supprimé
    Enseignant,
    { rejectValue: string }
>(
    "enseignants/deleteEnseignantAsync",
    async (enseignant, { rejectWithValue }) => {
        try {
            if (!enseignant.id) {
                throw new Error("L'enseignant n'a pas d'ID valide.");
            }
            await axiosInstance.delete(`/enseignants/${enseignant.id}`);
            return enseignant.id; // Retourner l'ID supprimé pour mise à jour du state
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la suppression.");

        }
    }
);


const enseignantSlice = createSlice({
    name: "enseignants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEnseignantAsync.fulfilled, (state, action: PayloadAction<EnseignantResponse>) => {
                state.loading = false;
                state.enseignants = action.payload.enseignants;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getAllEnseignantAsync.fulfilled, (state, action: PayloadAction<Enseignant[]>) => {
                state.loading = false;
                state.allEnseignants
                    = action.payload;
            })
            .addCase(deleteEnseignantAsync.fulfilled, (state, action: PayloadAction<number>) => {
                state.enseignants = state.enseignants.filter(ens => ens.id !== action.payload);
            })
            .addCase(getDomainePaysAsync.fulfilled, (state, action: PayloadAction<Domaine_Pays[]>) => {
                state.loading = false;
                state.pays = action.payload;
            });
    },
});


export const getEnseignants = (state: RootState) => state.enseignants.enseignants;
export const getTotalePages = (state: RootState) => state.enseignants.totalPages;
export const getAllEnseignant = (state: RootState) => state.enseignants.allEnseignants;
export const getPays = (state: { enseignants: EnseignantState }) => state.enseignants.pays;
export default enseignantSlice.reducer;

