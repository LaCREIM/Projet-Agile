/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Question, Rubrique } from "../types/types";
import { RootState } from "../api/store";
import { RequestQuestionOrderDetails } from "../components/Rubriques/DetailsRubriques";

export interface QuestionStdDTO {
  idQualificatif: number;
  intitule: string;
  maxQualificatif: string;
  minQualificatif: string;
}

export interface RubriqueQuestion {
  id: number;
  idRubrique: number;
  designationRubrique: string;
  idQuestion: number;
  questionStdDTO: QuestionStdDTO;
  ordre: number;
}

interface RubriqueState {
  rubriques: Rubrique[];
  questions: Question[];
  rubriqueQuestions: RubriqueQuestion[];
  loading: boolean;
  error: string | null;
}

const initialState: RubriqueState = {
  rubriques: [],
  questions: [],
  rubriqueQuestions: [],
  loading: false,
  error: null,
};

export const getRubriquesAsync = createAsyncThunk<Rubrique[], void, { rejectValue: string }>(
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

export const getQuestionsStandardAsync = createAsyncThunk<RubriqueQuestion[], number, { rejectValue: any }>(
  "standard/getQuestionsStandardAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/rubrique-questions/standard/${id}`);
      console.log(response);
      if(response.data.length > 0) return response.data;
      return []
    } catch (error: any) {
      // return rejectWithValue(error.response?.data || "Erreur lors de la récupération des questions de la rubrique"+id);
      return rejectWithValue([] as RubriqueQuestion[]);
    }
  }
);

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

export const updateRubriqueQuestionsAsync = createAsyncThunk<
  any,
  RequestQuestionOrderDetails[],
  { rejectValue: string }
>(
  "rubriques-questions/update",
  async (dataTable, { rejectWithValue }) => {
    try {
      console.log("from slice",dataTable);
      
      const response = await axiosInstance.post(`/rubrique-questions/standard/save-update`, dataTable);
      console.log(response);
      
      return response.data;
    } catch (error: any) {  
      return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la rubrique");
    }
  }
);

export const deleteRubriqueQuestionsAsync = createAsyncThunk<
  any,
  { idRubrique: number, idQuestion: number },
  { rejectValue: string }
>(
  "rubriques-questions/delete",
  async ({idQuestion, idRubrique}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/rubrique-questions/standard/${idRubrique}/${idQuestion}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la rubrique");
    }
  }
);

export const deleteRubriqueAsync = createAsyncThunk<number, number, { rejectValue: string }>(
  "rubriques/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response =await axiosInstance.delete(`/rubriquesStd/${id}`);
       console.log(response.data);
       return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la suppression de la rubrique");
    }
  }
);

const rubriqueSlice = createSlice({
  name: "rubriques",
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload; // Met à jour directement la liste des questions
    },
  },
  extraReducers: (builder) => {
    // **Récupérer toutes les rubriques**
    builder.addCase(getRubriquesAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getRubriquesAsync.fulfilled, (state, action: PayloadAction<Rubrique[]>) => {
      state.rubriques = action.payload;
      state.loading = false;
    });
    builder.addCase(getRubriquesAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getQuestionsStandardAsync.fulfilled, (state, action: PayloadAction<RubriqueQuestion[]>) => {
      state.rubriqueQuestions = action.payload;
    })
    .addCase(getQuestionsStandardAsync.rejected, (state) => {
      state.questions = []; // Vide les questions en cas d'échec
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

export const getRubriques = (state : RootState) => state.rubriques.rubriques;
export const getQuestionsRubrique = (state : RootState) => state.rubriques.rubriqueQuestions;
export const { setQuestions } = rubriqueSlice.actions;

export default rubriqueSlice.reducer;