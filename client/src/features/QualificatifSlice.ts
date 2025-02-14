/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Qualificatif } from "../types/types";

interface QualificatifState {
  qualificatifs: Qualificatif[];
  loading: boolean;
  error: string | null;
}

const initialState: QualificatifState = {
  qualificatifs: [],
  loading: false,
  error: null,
};

// **Thunk: Récupération de tous les qualificatifs**
export const fetchQualificatifsAsync = createAsyncThunk<Qualificatif[], void, { rejectValue: string }>(
  "qualificatifs/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/qualificatifs");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des qualificatifs");
    }
  }
);

// **Thunk: Création d'un qualificatif**
export const createQualificatifAsync = createAsyncThunk<Qualificatif, Qualificatif, { rejectValue: string }>(
  "qualificatifs/create",
  async (qualificatif, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/qualificatifs", qualificatif);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création du qualificatif");
    }
  }
);

// **Thunk: Mise à jour d'un qualificatif**
export const updateQualificatifAsync = createAsyncThunk<string,  Qualificatif, { rejectValue: string }>(
  "qualificatifs/update",
  async (data , { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/qualificatifs/${data.id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour du qualificatif");
    }
  }
);

// **Thunk: Suppression d'un qualificatif**
export const deleteQualificatifAsync = createAsyncThunk<string, number, { rejectValue: string }>(
  "qualificatifs/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/qualificatifs/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la suppression du qualificatif");
    }
  }
);

const qualificatifSlice = createSlice({
  name: "qualificatifs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // **Récupérer tous les qualificatifs**
    builder.addCase(fetchQualificatifsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQualificatifsAsync.fulfilled, (state, action: PayloadAction<Qualificatif[]>) => {
      state.qualificatifs = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchQualificatifsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // **Créer un qualificatif**
    builder.addCase(createQualificatifAsync.fulfilled, (state, action: PayloadAction<Qualificatif>) => {
      state.qualificatifs.push(action.payload);
    });
    builder.addCase(createQualificatifAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Mettre à jour un qualificatif**
    builder.addCase(updateQualificatifAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Supprimer un qualificatif**
    builder.addCase(deleteQualificatifAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.qualificatifs = state.qualificatifs.filter((q) => q.id !== parseInt(action.payload));
    });
    builder.addCase(deleteQualificatifAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default qualificatifSlice.reducer;
