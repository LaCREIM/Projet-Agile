/* eslint-disable @typescript-eslint/no-explicit-any */
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import {RootState} from "../api/store";
import {Formation, Promotion, PromotionCreate, PromotionId} from "../types/types";

// export interface Promotion {
//     anneePro: string;
//     siglePro: string;
//     nbEtuSouhaite: number;
//     dateRentree: string;
//     lieuRentree: string;
//     nom: string;
//     prenom: string;
//     type: string;
//     noEnseignant: string;
//     nomFormation: string;
//     codeFormation: string;
//     diplome: string;
//     etatPreselection: string;
// }

// export interface Formation {
//     codeFormation: string;
//     diplome: string;
//     nomFormation: string;
// }

// sorry future me for this
export const anneesUniv = [
    "2024-2025",
    "2025-2026",
];

export interface Domaine {
    rvLowValue: string;
    rvMeaning: string;
}


interface PromotionState {
    formations: Formation[];
    promotionsByEnseignant: Promotion[];
    promotions: Promotion[];
    salle: Domaine[];
    diplome: Domaine[];
    processsusStage: Domaine[];
    loading: boolean;
    error: string | null;
}

const initialState: PromotionState = {
    promotions: [],
    promotionsByEnseignant: [],
    formations: [],
    salle: [],
    diplome: [],
    processsusStage: [],
    loading: false,
    error: null,
};

// Fetch promotions
export const getDomaineLieuEntreeAsync = createAsyncThunk<Domaine[], void, { rejectValue: string }>(
    "salle/getDomaineLieuEntreeAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Domaine[]>(`/cgRefCodes/SALLE?domain=SALLE`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getDomaineProcessusStageAsync = createAsyncThunk<Domaine[], void, { rejectValue: string }>(
    "processus_stage/getDomaineProcessusStageAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Domaine[]>(`/cgRefCodes/byDomain?domain=PROCESSUS_STAGE`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getDomaineDiplomeAsync = createAsyncThunk<Domaine[], void, { rejectValue: string }>(
    "diplome/getDomaineDiplomeAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Domaine[]>(`/cgRefCodes/byDomain?domain=DIPLOME`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getPromotionAsync = createAsyncThunk<Promotion[], void, { rejectValue: string }>(
    "promotions/getPromotionAsync",
    async (_, {rejectWithValue}) => {
        try {

            const response = await axiosInstance.get<Promotion[]>(`/promotions`);            
            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getPromotionByEnseignantAsync = createAsyncThunk<Promotion[], void, { rejectValue: string }>(
    "promotions/getPromotionByEnseignantAsync",
    async (_, {rejectWithValue}) => {
        try {

            const response = await axiosInstance.get<Promotion[]>(`/promotions/enseignant/${localStorage.getItem("id")}`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching promotions by enseignant:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching promotions by enseignant.");
        }
    }
);

export const getFormationAsync = createAsyncThunk<Formation[], void, { rejectValue: string }>(
    "formations/getFormationAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<Formation[]>(`/formations`);
            // console.log("from all", response.data);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching formations:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching formations.");
        }
    }
);

export const postPromotionsAsync = createAsyncThunk<Promotion, PromotionCreate, { rejectValue: string }>(
    "promotions/postEtudiantAsync",
    async (promotion, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(`/promotions`, promotion);
            console.log(response);

            return response.data;
        } catch (error: any) {
            console.error("Error posting promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the promotion.");
        }
    }
);

export const updatePromotionAsync = createAsyncThunk<Promotion, PromotionCreate, { rejectValue: string }>(
    "promotions/updateEtudiantAsync",
    async (promotion, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.put(`/promotions/${promotion.anneeUniversitaire}/${promotion.codeFormation}`, promotion);
            console.log(response);
            return response.data;
        } catch (error: any) {
            console.error("Error updating promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while updating the promotion.");
        }
    }
);

export const deletePromotionAsync = createAsyncThunk<Promotion, PromotionId, { rejectValue: string }>(
    "promotions/deleteEtudiantAsync",
    async (id, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.delete(`/promotions/${id.anneeUniversitaire}/${id.codeFormation}`);
            console.log(response);
            return response.data;
        } catch (error: any) {
            console.error("Error deleting student:", error);
            return rejectWithValue(error.response?.data || "An error occurred while deleting the student.");
        }
    }
);

// Redux slice
const promotionSlice = createSlice({
    name: "promotions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch promotions
            .addCase(getPromotionAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getPromotionAsync.fulfilled, (state, action: PayloadAction<Promotion[]>) => {
                state.loading = false;
                state.promotions = action.payload;
            })
            .addCase(getPromotionAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch promotions.";
            })
            .addCase(getPromotionByEnseignantAsync.fulfilled, (state, action: PayloadAction<Promotion[]>) => {
                state.loading = false;
                state.promotionsByEnseignant = action.payload;
            })
            .addCase(getPromotionByEnseignantAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch promotions.";
            })
            // Fetch formations
            .addCase(getFormationAsync.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFormationAsync.fulfilled, (state, action: PayloadAction<Formation[]>) => {
                state.loading = false;
                state.formations = action.payload;
            })
            .addCase(getFormationAsync.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to fetch formations.";
            })
            .addCase(getDomaineLieuEntreeAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.salle = action.payload || "Failed to fetch formations.";
            })
            .addCase(getDomaineProcessusStageAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.processsusStage = action.payload || "Failed to fetch formations.";
            })
            .addCase(getDomaineDiplomeAsync.fulfilled, (state, action) => {
                state.loading = false;
                state.diplome = action.payload || "Failed to fetch formations.";
            })


    },
});

// Selectors
export const getFormations = (state: RootState) => state.promotions.formations;
export const getPromotions = (state: RootState) => state.promotions.promotions;
export const getSalles = (state: RootState) => state.promotions.salle;
export const getProcessusStages = (state: RootState) => state.promotions.processsusStage;
export const getDiplomes = (state: RootState) => state.promotions.diplome;
export const getPromotionByEnseignant = (state: RootState) => state.promotions.promotionsByEnseignant;


export default promotionSlice.reducer;
