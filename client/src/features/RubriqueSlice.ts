/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Rubrique } from "../types/types";

interface RubriqueState {
  rubriques: Rubrique[];
  loading: boolean;
  error: string | null;
}

const initialState: RubriqueState = {
  rubriques: [],
  loading: false,
  error: null,
};

// **Thunk: Récupérer toutes les rubriques**
export const fetchRubriquesAsync = createAsyncThunk<Rubrique[], void, { rejectValue: string }>(
  "rubriques/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/rubriquesStd");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des rubriques");
    }
  }
);

// **Thunk: Créer une rubrique**
export const createRubriqueAsync = createAsyncThunk<Rubrique, { designation: string }, { rejectValue: string }>(
  "rubriques/create",
  async (rubriqueData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/rubriquesStd", rubriqueData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création de la rubrique");
    }
  }
);

// **Thunk: Mettre à jour une rubrique**
export const updateRubriqueAsync = createAsyncThunk<
  Rubrique,
  { id: number; designation: string },
  { rejectValue: string }
>(
  "rubriques/update",
  async ({ id, designation }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/rubriquesStd/${id}`, { designation });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la rubrique");
    }
  }
);

// **Thunk: Supprimer une rubrique**
export const deleteRubriqueAsync = createAsyncThunk<number, number, { rejectValue: string }>(
  "rubriques/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/rubriquesStd/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la suppression de la rubrique");
    }
  }
);

const rubriqueSlice = createSlice({
  name: "rubriques",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // **Récupérer toutes les rubriques**
    builder.addCase(fetchRubriquesAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchRubriquesAsync.fulfilled, (state, action: PayloadAction<Rubrique[]>) => {
      state.rubriques = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchRubriquesAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // **Créer une rubrique**
    builder.addCase(createRubriqueAsync.fulfilled, (state, action: PayloadAction<Rubrique>) => {
      state.rubriques.push(action.payload);
    });
    builder.addCase(createRubriqueAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Mettre à jour une rubrique**
    builder.addCase(updateRubriqueAsync.fulfilled, (state, action: PayloadAction<Rubrique>) => {
      const index = state.rubriques.findIndex((r) => r.id === action.payload.id);
      if (index !== -1) {
        state.rubriques[index] = action.payload;
      }
    });
    builder.addCase(updateRubriqueAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Supprimer une rubrique**
    builder.addCase(deleteRubriqueAsync.fulfilled, (state, action: PayloadAction<number>) => {
      state.rubriques = state.rubriques.filter((r) => r.id !== action.payload);
    });
    builder.addCase(deleteRubriqueAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default rubriqueSlice.reducer;