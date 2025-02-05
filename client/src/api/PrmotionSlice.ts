import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

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

// 🎯 **Initial state**
interface PromotionState {
    promotions: Promotion[];
    loading: boolean;
    error: string | null;
}

const initialState: PromotionState = {
    promotions: [],
    loading: false,
    error: null,
};

// 🚀 **Actions asynchrones avec Axios**
export const getPromotionAsync = createAsyncThunk<Promotion[], void, { rejectValue: string }>(
    "promotions/getPromotionAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get<Promotion[]>(`${BASE_URL}/promotions`);
            return response.data;
        } catch (error: unknown) {
            console.error("Error fetching promotions:", error);
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue(error.response.data || "An error occurred while fetching promotions.");
            }
            return rejectWithValue("An error occurred while fetching promotions.");
        }
    }
);

// 🔹 Ajouter une promotion
export const createPromotionAsync = createAsyncThunk<Promotion, Promotion, { rejectValue: string }>(
    "promotions/createPromotionAsync",
    async (promotion, { rejectWithValue }) => {
        try {
            const response = await axios.post<Promotion>(`${BASE_URL}/promotions`, promotion);
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error adding promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while adding a promotion.");
        }
    }
);

// 🔹 Mettre à jour une promotion
export const editPromotionAsync = createAsyncThunk<
    Promotion,
    { id: string; promotion: Partial<Promotion> },
    { rejectValue: string }
>(
    "promotions/editPromotionAsync",
    async ({ id, promotion }, { rejectWithValue }) => {
        try {
            const response = await axios.put<Promotion>(`${BASE_URL}/promotions/${id}`, promotion);
            return response.data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error updating promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while updating the promotion.");
        }
    }
);

// 🔹 Supprimer une promotion
export const removePromotionAsync = createAsyncThunk<string, string, { rejectValue: string }>(
    "promotions/removePromotionAsync",
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${BASE_URL}/promotions/${id}`);
            return id; // Retourner l'ID de la promotion supprimée
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error deleting promotion:", error);
            return rejectWithValue(error.response?.data || "An error occurred while deleting the promotion.");
        }
    }
);

// 🎯 **Création du Slice Redux**
const promotionSlice = createSlice({
    name: "promotions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // 📌 Récupérer les promotions
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
                state.error = action.payload || "Erreur lors du chargement des promotions.";
            })

            // 📌 Ajouter une promotion
            .addCase(createPromotionAsync.fulfilled, (state, action: PayloadAction<Promotion>) => {
                state.promotions.push(action.payload);
            })

            // 📌 Mettre à jour une promotion
            .addCase(editPromotionAsync.fulfilled, (state, action: PayloadAction<Promotion>) => {
                const index = state.promotions.findIndex((p) => p.codeFormation === action.payload.codeFormation);
                if (index !== -1) {
                    state.promotions[index] = action.payload;
                }
            })

            // 📌 Supprimer une promotion
            .addCase(removePromotionAsync.fulfilled, (state, action: PayloadAction<string>) => {
                state.promotions = state.promotions.filter((p) => p.codeFormation !== action.payload);
            });
    },
});

export default promotionSlice.reducer;
