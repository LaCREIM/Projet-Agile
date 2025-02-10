/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { RootState } from "../api/store";

export interface Promotion {
    anneePro: string;
    siglePro: string;
    nbEtuSouhaite: number;
    dateRentree: string;
    lieuRentree: string;
    nom: string;
    prenom: string;
    type: string;
    noEnseignant: string;
    nomFormation: string;
    codeFormation: string;
    diplome: string;
    etatPreselection: string;
}

export interface Formation {
    codeFormation: string;
    diplome: string;
    nomFormation: string;
}

interface PromotionState {
    formations: Formation[];
    promotions: Promotion[];
    loading: boolean;
    error: string | null;
}

const initialState: PromotionState = {
    promotions: [],
    formations: [],
    loading: false,
    error: null,
};

// Fetch promotions
export const getPromotionAsync = createAsyncThunk<Promotion[], void, { rejectValue: string }>(
    "promotions/getPromotionAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Promotion[]>(`/promotions`);


            return response.data;
        } catch (error: any) {
            console.error("Error fetching students:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching students.");
        }
    }
);

export const getFormationAsync = createAsyncThunk<Formation[], void, { rejectValue: string }>(
    "formations/getFormationAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Formation[]>(`/promotions/formations`);
            return response.data;
        } catch (error: any) {
            console.error("Error fetching formations:", error);
            return rejectWithValue(error.response?.data || "An error occurred while fetching formations.");
        }
    }
);

export const postPromotionsAsync = createAsyncThunk<Promotion, Promotion, { rejectValue: string }>(
    "promotions/postEtudiantAsync",
    async (promotion, { rejectWithValue }) => {
        try {
            console.log(promotion);

            const response = await axiosInstance.post(`/promotions`, promotion);
            console.log(response);
            return response.data;
        } catch (error: any) {
            console.error("Error posting promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while posting the promotion.");
        }
    }
);

export const updatePromotionAsync = createAsyncThunk<Promotion, Promotion, { rejectValue: string }>(
    "promotions/updateEtudiantAsync",
    async (promotion, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/promotions/${promotion.anneePro}`, promotion);
            console.log(response);

            return response.data;
        } catch (error: any) {
            console.error("Error updating promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while updating the promotion.");
        }
    }
);

export const deletePromotionAsync = createAsyncThunk<Promotion, string, { rejectValue: string }>(
    "promotions/deleteEtudiantAsync",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/promotions/${id}`);
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

    },
});

// Selectors
export const getFormations = (state: RootState) => state.promotions.formations;
export const getPromotions = (state: RootState) => state.promotions.promotions;

export default promotionSlice.reducer;
