/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getPromotionAsync } from "./PromotionSlice"; 

const BASE_URL = "http://localhost:8080/api";

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

interface Formation {
    codeFormation: string;
    diplome: string;
    nomFormation: string;
}

export const getFormationAsync = createAsyncThunk<Formation[], void, { rejectValue: string }>(
    "formations/getFormationAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Formation[]>(`${BASE_URL}/promotions/formations`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching formations:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching formations.");
        }
    }
);

// ✅ Récupérer tous les étudiants
export const getEtudiantAsync = createAsyncThunk<Etudiant[], void, { rejectValue: string }>(
    "etudiants/getEtudiantAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Etudiant[]>(`${BASE_URL}/etudiants`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des étudiants.");
        }
    }
);

// ✅ Récupérer les étudiants par promotion
export const getEtudiantByPromotionAsync = createAsyncThunk<Etudiant[], string, { rejectValue: string }>(
    "etudiants/getEtudiantByPromotionAsync",
    async (anneePro, { rejectWithValue }) => {
        try {
            const response = await axios.get<Etudiant[]>(`${BASE_URL}/promotions/students/${anneePro}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des étudiants par promotion.");
        }
    }
);

// ✅ Ajouter un étudiant
export const postEtudiantAsync = createAsyncThunk<Etudiant, Etudiant, { rejectValue: string }>(
    "etudiants/postEtudiantAsync",
    async (etudiant, { rejectWithValue }) => {
        try {
            const response = await axios.post(`${BASE_URL}/etudiants`, etudiant);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de l'ajout de l'étudiant.");
        }
    }
);

// ✅ Modifier un étudiant
export const updateEtudiantAsync = createAsyncThunk<Etudiant, Etudiant, { rejectValue: string }>(
    "etudiants/updateEtudiantAsync",
    async (etudiant, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${BASE_URL}/etudiants/${etudiant.noEtudiantNat}`, etudiant);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la modification de l'étudiant.");
        }
    }
);

// ✅ Supprimer un étudiant
export const deleteEtudiantAsync = createAsyncThunk<string, string, { rejectValue: string }>(
    "etudiants/deleteEtudiantAsync",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/etudiants/${id}`);
            return id; // Retourner l'ID pour mise à jour du state
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la suppression de l'étudiant.");
        }
    }
);

const etudiantSlice = createSlice({
    name: "etudiants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // ✅ Récupération des étudiants
            .addCase(getEtudiantAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant[]>) => {
                state.loading = false;
                state.etudiants = action.payload;
            })
            .addCase(getEtudiantAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Erreur inconnue.";
            })

            // ✅ Récupération des étudiants par promotion
            .addCase(getEtudiantByPromotionAsync.fulfilled, (state, action: PayloadAction<Etudiant[]>) => {
                state.etudiants = action.payload;
            })

            // ✅ Ajout d'un étudiant
            .addCase(postEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant>) => {
                state.etudiants.push(action.payload);
            })

            // ✅ Mise à jour d'un étudiant
            .addCase(updateEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant>) => {
                const index = state.etudiants.findIndex((e) => e.noEtudiantNat === action.payload.noEtudiantNat);
                if (index !== -1) {
                    state.etudiants[index] = action.payload;
                }
            })

            // ✅ Suppression d'un étudiant
            .addCase(deleteEtudiantAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.etudiants = state.etudiants.filter((e) => e.noEtudiantNat !== action.payload);
            })

            // ✅ Gestion des promotions et formations
            .addCase(getPromotionAsync.fulfilled, (_state, action) => {
                console.log("Promotions fetched:", action.payload);
            })
            .addCase(getFormationAsync.fulfilled, (_state, action) => {
                console.log("Formations fetched:", action.payload);
            });
    },
});

export default etudiantSlice.reducer;
