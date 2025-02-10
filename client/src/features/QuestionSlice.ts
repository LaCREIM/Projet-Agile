/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Question } from "../types/types";

interface QuestionState {
  questions: Question[];
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  loading: false,
  error: null,
};

// **Thunk: Récupération de toutes les questions**
export const fetchQuestionsAsync = createAsyncThunk<Question[], void, { rejectValue: string }>(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/questionsStd");
      console.log("response.data", response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des questions");
    }
  }
);

// **Thunk: Création d'une question**
export const createQuestionAsync = createAsyncThunk<Question, Question, { rejectValue: string }>(
  "questions/create",
  async (question, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/questionsStd", question);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création de la question");
    }
  }
);

// **Thunk: Mise à jour d'une question**
export const updateQuestionAsync = createAsyncThunk<string, { id: number; data: Question }, { rejectValue: string }>(
  "questions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/questionsStd/${id}`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la question");
    }
  }
);

// **Thunk: Suppression d'une question**
export const deleteQuestionAsync = createAsyncThunk<string, number, { rejectValue: string }>(
  "questions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/questionsStd/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la suppression de la question");
    }
  }
);

const questionSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // **Récupérer toutes les questions**
    builder.addCase(fetchQuestionsAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchQuestionsAsync.fulfilled, (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchQuestionsAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // **Créer une question**
    builder.addCase(createQuestionAsync.fulfilled, (state, action: PayloadAction<Question>) => {
      state.questions.push(action.payload);
    });
    builder.addCase(createQuestionAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Mettre à jour une question**
    builder.addCase(updateQuestionAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Supprimer une question**
    builder.addCase(deleteQuestionAsync.fulfilled, (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter((q) => q.id !== parseInt(action.payload));
    });
    builder.addCase(deleteQuestionAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default questionSlice.reducer;
