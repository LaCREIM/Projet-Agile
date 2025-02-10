/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";

// Définition de l'interface Etudiant
export interface Etudiant {
    nom: string;
    prenom: string;
    sexe: string;
    email: string;
    telephone: string;
    noEtudiantUbo: string;
    noEtudiantNat: string;
    dateNaissance: string;
    lieuNaissance: string;
    nationalite?: string;
    universite: string;
    anneePro: string;
    permAdresse: string;
    permVille: string;
    permCp: string;
    permPays: string;
    dernierDiplome: string;
    sigleEtu: string;
    compteCri: string;
    siglePro: string;
    situation: string;
}

// Définition de l'état global
interface EtudiantState {
    etudiant: Etudiant | null;
    etudiants: Etudiant[];
    loading: boolean;
    error: string | null;
}

const initialState: EtudiantState = {
    etudiant: null,
    etudiants: [],
    loading: false,
    error: null,
};

export const getEtudiantAsync = createAsyncThunk<Etudiant[], void, { rejectValue: string }>(
    "etudiants/getEtudiantAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Etudiant[]>(`/etudiants`);
            console.log("from all", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getEtudiantByPromotionAsync = createAsyncThunk<Etudiant[], string, { rejectValue: string }>(
    "students/getEtudiantByPromotionAsync",
    async (anneePro, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Etudiant[]>(`/promotions/students/${anneePro}`);
            console.log("from by", { anneePro, "re": response.data });
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const postEtudiantAsync = createAsyncThunk<Etudiant, Etudiant, { rejectValue: string }>(
    "etudiants/postEtudiantAsync",
    async (etudiant, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/etudiants`, etudiant);
            console.log(response);
            return response.data;
        } catch (error: any) {
            console.error("Error posting student:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the student.");
        }
    }
);

export const updateEtudiantAsync = createAsyncThunk<Etudiant, Etudiant, { rejectValue: string }>(
    "etudiants/updateEtudiantAsync",
    async (etudiant, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/etudiants/${etudiant.noEtudiantNat}`, etudiant);
            return response.data;
        } catch (error: any) {
            console.error("Error posting student:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the student.");
        }
    }
);

export const deleteEtudiantAsync = createAsyncThunk<string, string, { rejectValue: string }>(
    "etudiants/deleteEtudiantAsync",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/etudiants/${id}`);
            console.log(response);

            return response.data;
        } catch (error: any) {
            console.error("Error posting student:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the student.");
        }
    }
);

const etudiantSlice = createSlice({
    name: "etudiants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant[]>) => {
                state.loading = false;
                state.etudiants = action.payload;
            })
           
            .addCase(getEtudiantByPromotionAsync.fulfilled, (state, action: PayloadAction<Etudiant[]>) => {
                state.etudiants = action.payload;
            })

            .addCase(postEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant>) => {
                state.etudiants.push(action.payload);
            })

            .addCase(updateEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant>) => {
                const index = state.etudiants.findIndex((e) => e.noEtudiantNat === action.payload.noEtudiantNat);
                if (index !== -1) {
                    state.etudiants[index] = action.payload;
                }
            })

            .addCase(deleteEtudiantAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.etudiants = state.etudiants.filter((e) => e.noEtudiantNat !== action.payload);
            })

    },
});

export const getEtudiants = (state: { etudiants: EtudiantState }) => state.etudiants.etudiants;

export default etudiantSlice.reducer;
