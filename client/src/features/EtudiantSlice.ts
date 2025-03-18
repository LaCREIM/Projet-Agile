/* eslint-disable @typescript-eslint/no-explicit-any */
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import {Etudiant, PromotionDetails} from "../types/types";
// import { RootState } from "../api/store";


export interface Domaine_Pays {
    rvLowValue: string;
    rvMeaning: string;
}

export interface Domaine_Universite {
    rvLowValue: string;
    rvMeaning: string;
}

interface EtudiantState {
    etudiant: Etudiant | null;
    etudiants: Etudiant[];
    totalPages: number;
    pays: Domaine_Pays[];
    universite: Domaine_Universite[];
    loading: boolean;
    error: string | null;
}

interface EtudiantResponse {
    etudiants: Etudiant[];
    totalPages: number;
}

const initialState: EtudiantState = {
    etudiant: null,
    etudiants: [],
    totalPages: 1,
    pays: [],
    universite: [],
    loading: false,
    error: null,
};

export const getDomainePaysAsync = createAsyncThunk<Domaine_Pays[], void, { rejectValue: string }>(
    "paysOrigine/getGroupeTPAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Domaine_Pays[]>(`/cgRefCodes/byDomain?domain=PAYS`);
            //console.log("from all", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching groupe tps:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching pays.");
        }
    }
);

export const getDomaineUnivAsync = createAsyncThunk<Domaine_Universite[], void, { rejectValue: string }>(
    "universiteOrigine/getDomaineUnivAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Domaine_Pays[]>(`/cgRefCodes/byDomain?domain=UNIVERSITE`);
            //console.log("from all", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching groupe tps:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching pays.");
        }
    }
);

export const getEtudiantAsync = createAsyncThunk<EtudiantResponse, { page: number; size: number }, {
    rejectValue: string
}>(
    "etudiants/getEtudiantAsync",
    async ({page, size}, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<EtudiantResponse>(`/etudiants/paged?page=${page}&size=${size}`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getEtudiantByIdAsync = createAsyncThunk<Etudiant, string, {
    rejectValue: string
}>(
    "etudiants/getEtudiantByIdAsync",
    async (id, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Etudiant>(`/etudiants/${id}`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const searchEtudiantsAsync = createAsyncThunk<EtudiantResponse, { page: number; size: number }, {
    rejectValue: string
}>(
    "etudiants/searchEtudiantsAsync",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EtudiantResponse>(`/etudiants/search?page=${page}&size=${size}`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);


export const getEtudiantByPromotionAsync = createAsyncThunk<Etudiant[], PromotionDetails, { rejectValue: string }>(
    "students/getEtudiantByPromotionAsync",
    async (promotionDetails, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Etudiant[]>(`/etudiants/promotion/${promotionDetails.anneeUniversitaire}/${promotionDetails.codeFormation}`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const postEtudiantAsync = createAsyncThunk<Etudiant, Etudiant, { rejectValue: string }>(
    "etudiants/postEtudiantAsync",
    async (etudiant, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(`/etudiants`, etudiant);
            console.log(response.data);
            
            return response.data;
        } catch (error: any) {
            console.error("Error posting student:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the student.");
        }
    }
);

export const updateEtudiantAsync = createAsyncThunk<Etudiant, Etudiant, { rejectValue: string }>(
    "etudiants/updateEtudiantAsync",
    async (etudiant, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.put(`/etudiants/${etudiant.noEtudiant}`, etudiant);
            console.log(response.data);

            return response.data;
        } catch (error: any) {
            console.error("Error posting student:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the student.");
        }
    }
);

export const deleteEtudiantAsync = createAsyncThunk<string, string, { rejectValue: string }>(
    "etudiants/deleteEtudiantAsync",
    async (id, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.delete(`/etudiants/${id}`);
            //console.log(response);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting student:", error);
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
            .addCase(getEtudiantAsync.fulfilled, (state, action: PayloadAction<EtudiantResponse>) => {
                state.loading = false;
                state.etudiants = action.payload.etudiants;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(getDomainePaysAsync.fulfilled, (state, action: PayloadAction<Domaine_Pays[]>) => {
                state.loading = false;
                state.pays = action.payload;
            })
            .addCase(getDomaineUnivAsync.fulfilled, (state, action: PayloadAction<Domaine_Pays[]>) => {
                state.loading = false;
                state.universite = action.payload;
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
            .addCase(getEtudiantByIdAsync.fulfilled, (state, action: PayloadAction<Etudiant> ) => {
                state.etudiant = action.payload;
            })

    },
});

export const getEtudiants = (state: { etudiants: EtudiantState }) => state.etudiants.etudiants;

export const getEtudiant = (state: { etudiants: EtudiantState }) => state.etudiants.etudiant;

export const getPays = (state: { etudiants: EtudiantState }) => state.etudiants.pays;

export const getUniversite = (state: { etudiants: EtudiantState }) => state.etudiants.universite;


export default etudiantSlice.reducer;
