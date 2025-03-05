/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Question } from "../types/types";

interface QuestionState {
  questions: Question[];
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  totalPages: 0,  // Ajout du total de pages
  loading: false,
  error: null,
};


export const fetchQuestionsAsync = createAsyncThunk<Question[], void, { rejectValue: string }>(
  "questions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/questionsStd");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des questions");
    }
  }
);
export const getQuestionAsync = createAsyncThunk<
    { content: Question[]; totalPages: number },  // Type correct de retour
    { page: number; size: number },
    { rejectValue: string }
>(
    "questions/getQuestionAsync",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ content: Question[]; totalPages: number }>(
                `/questions/paged`,
                { params: { page, size } }
            );
            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la récupération des questions:", error);
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des questions.");
        }
    }
);



export const createQuestionAsync = createAsyncThunk<Question, Question, { rejectValue: string }>(
  "questions/create",
  async (question, { rejectWithValue }) => {
    try {
      const questionSTd = {
        idQualificatif: question.idQualificatif.id, // Assurez-vous qu'il est bien un Long
        intitule: question.intitule
      };
      const response = await axiosInstance.post("/questionsStd", questionSTd);
      console.log(response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création de la question");
    }
  }
);

// **Thunk: Mise à jour d'une question**
export const updateQuestionAsync = createAsyncThunk<
  Question,
  { id: number; data: Question },
  { rejectValue: string }
>(
  "questions/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const questionSTd = {
        idQualificatif: data.idQualificatif.id, // Assurez-vous qu'il est bien un Long
        intitule: data.intitule
      };
      const response = await axiosInstance.put(`/questionsStd/${id}`, questionSTd);
      console.log("Payload envoyé:", questionSTd);
      console.log("Réponse API:", response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la question");
    }
  }
);

// **Thunk: Suppression d'une question**
export const deleteQuestionAsync = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(
  "questions/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/questionsStd/${id}`);
      console.log(response);

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
    // **Récupérer toutes les questions (ancienne méthode sans pagination)**
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

    // **Récupérer les questions paginées**
    builder.addCase(getQuestionAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getQuestionAsync.fulfilled, (state, action: PayloadAction<{ content: Question[]; totalPages: number }>) => {
      state.questions = action.payload.content; // Mise à jour de la liste des questions
      state.totalPages = action.payload.totalPages; // Mise à jour du total de pages
      state.loading = false;
    });
    builder.addCase(getQuestionAsync.rejected, (state, action) => {
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
    builder.addCase(updateQuestionAsync.fulfilled, (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex((q) => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
    });
    builder.addCase(updateQuestionAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });

    // **Supprimer une question**
    builder.addCase(deleteQuestionAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default questionSlice.reducer;

