/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Qualificatif } from "../types/types";

interface QualificatifState {
  qualificatifs: Qualificatif[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

interface QualificatifResponse {
    qualificatifs: Qualificatif[];
    totalPages: number;
}

const initialState: QualificatifState = {
  qualificatifs: [],
  loading: false,
  totalPages: 1,
  error: null,
};

// **Thunk: Récupération de tous les qualificatifs**
export const fetchQualificatifsAsync = createAsyncThunk<Qualificatif[], void, { rejectValue: string }>(
  "qualificatifs/fetchQualificatifsAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/qualificatifs");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des qualificatifs");
    }
  }
);

export const fetchQualificatifsPagedAsync = createAsyncThunk<QualificatifResponse, { page: number, size: number }, { rejectValue: string }>(
  "qualificatifs/fetchQualificatifsPagedAsync",
  async ({ page, size }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<QualificatifResponse>(`/qualificatifs/paged?page=${page}&size=${size}`);
      console.log(response);
      
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
   const qualificatifToSend = {
     maximal: qualificatif.maximal,

      minimal: qualificatif.minimal,
    };
    try {
      const response = await axiosInstance.post("/qualificatifs", qualificatifToSend);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création du qualificatif");
    }
  }
);

// **Thunk: Mise à jour d'un qualificatif**
export const updateQualificatifAsync = createAsyncThunk<string, Qualificatif, { rejectValue: string }>(
  "qualificatifs/update",
  async (data, { rejectWithValue }) => {
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
    builder.addCase(fetchQualificatifsPagedAsync.fulfilled, (state, action: PayloadAction<QualificatifResponse>) => {
      state.qualificatifs = action.payload.qualificatifs;
      state.totalPages = action.payload.totalPages;
      state.loading = false;
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
