import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Etudiant } from "../types/types";
// Définition de l'interface Etudiant
// export interface Etudiant {
//     nom: string;
//     prenom: string;
//     sexe: string;
//     email: string;
//     telephone: string;
//     noEtudiantUbo: string;
//     noEtudiantNat: string;
//     dateNaissance: string;
//     lieuNaissance: string;
//     nationalite?: string;
//     universite: string;
//     anneePro: string;
//     permAdresse: string;
//     permVille: string;
//     permCp: string;
//     permPays: string;
//     dernierDiplome: string;
//     sigleEtu: string;
//     compteCri: string;
//     siglePro: string;
//     situation: string;
// }

export interface Domaine_Pays{
    rvLowValue: string;
    rvMeaning: string;
}

interface EtudiantState {
    etudiant: Etudiant | null;
    etudiants: Etudiant[];
    pays: Domaine_Pays[];
    loading: boolean;
    error: string | null;
}

const initialState: EtudiantState = {
    etudiant: null,
    etudiants: [],
    pays:[],
    loading: false,
    error: null,
};

export const getDomainePaysAsync = createAsyncThunk<Domaine_Pays[], void, { rejectValue: string }>(
    "paysOrigine/getGroupeTPAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Domaine_Pays[]>(`/cgRefCodes/byDomain?domain=PAYS`);
            console.log("from all", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching groupe tps:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching pays.");
        }
    }
);

export const getEtudiantAsync = createAsyncThunk<Etudiant[], void, { rejectValue: string }>(
    "etudiants/getEtudiantAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Etudiant[]>(`/etudiants?page=1&size=10`);
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
            const response = await axiosInstance.put(`/etudiants/${etudiant.noEtudiant}`, etudiant);
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
            .addCase(getDomainePaysAsync.fulfilled, (state, action: PayloadAction<Domaine_Pays[]>) => {
                state.loading = false;
                state.pays = action.payload;
            })
           
            .addCase(getEtudiantByPromotionAsync.fulfilled, (state, action: PayloadAction<Etudiant[]>) => {
                state.etudiants = action.payload;
            })

            .addCase(postEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant>) => {
                state.etudiants.push(action.payload);
            })

            .addCase(updateEtudiantAsync.fulfilled, (state, action: PayloadAction<Etudiant>) => {
                const index = state.etudiants.findIndex((e) => e.noEtudiant === action.payload.noEtudiant);
                if (index !== -1) {
                    state.etudiants[index] = action.payload;
                }
            })

            .addCase(deleteEtudiantAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.etudiants = state.etudiants.filter((e) => e.noEtudiant !== action.payload);
            })

    },
});

export const getEtudiants = (state: { etudiants: EtudiantState }) => state.etudiants.etudiants;

export const getPays = (state: { etudiants: EtudiantState }) => state.etudiants.pays;

export default etudiantSlice.reducer;
