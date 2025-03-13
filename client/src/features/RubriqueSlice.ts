/* eslint-disable @typescript-eslint/no-unused-vars */
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
  totalPages: number, // Pour stocker le nombre total de pages de la recherche paginée
}

const initialState: RubriqueState = {
  rubriques: [],
  questions: [],
  rubriqueQuestions: [],
  loading: false,
  error: null,
  totalPages: 1
};

export const getRubriquesAsync = createAsyncThunk<Rubrique[], void, { rejectValue: string }>(
  "rubriques/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/rubriquesStd");
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des rubriques");
    }
  }
);

export const getAllRubriquesPersoAsync = createAsyncThunk<
  Rubrique[],
  { idEnseignant: number },
  { rejectValue: string }
>(
  "rubriques/getAllRubriquesPersoAsync",
  async ({ idEnseignant }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/rubriquesPrs/std-prs/${idEnseignant}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération de toutes les rubriques personnelles.");
    }
  }
);

export const getAllRubriquesPrsStdPagedAsync = createAsyncThunk<
  { rubriques: Rubrique[]; currentPage: number; size: number; totalPages: number },
  { idEnseignant: number; page: number; size: number },
  { rejectValue: string }
>(
  "rubriques/getAllRubriquesPrsStdPagedAsync",
  async ({ idEnseignant, page, size }, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get<{
        rubriques: Rubrique[];
        currentPage: number;
        size: number;
        totalPages: number;
      }>("/rubriquesPrs/std-prs/paged", {
        params: { noEnseignant: idEnseignant, page, size },
      });

      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de la récupération des rubriques.";

      return rejectWithValue(errorMessage);
    }
  }
);



export const createRubriquePersoAsync = createAsyncThunk<
  Rubrique,
  { designation: string; noEnseignant: number },
  { rejectValue: string }
>(
  "rubriques/createRubriquePersoAsync",
  async (rubriqueData, { rejectWithValue }) => {

    try {
      const response = await axiosInstance.post("/rubriquesPrs", rubriqueData, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la création de la rubrique personnelle.");
    }
  }
);
//

export const searchRubriquesAsync = createAsyncThunk<
  { rubriques: Rubrique[]; totalPages: number },
  { enseignantId: string; page: number; size: number },
  { rejectValue: string }
>(
  "rubriques/search",
  async ({ enseignantId, page, size }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/rubrique/paged/enseignants/${enseignantId}`, {
        params: { page, size },
      });
      console.log(response.data);
      return response.data; // L'API renvoie un objet contenant rubriques et totalPages
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la recherche des rubriques");
    }
  }
);

export const getQuestionsStandardAsync = createAsyncThunk<RubriqueQuestion[], number, { rejectValue: any }>(
  "standard/getQuestionsStandardAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/rubrique-questions/standard/${id}`);
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
      const response = await axiosInstance.post(`/rubrique-questions/standard/save-update`, dataTable);      
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
       return response.data;
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
    })
        // **Recherche des rubriques avec pagination**
    builder.addCase(searchRubriquesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
    });
    builder.addCase(
          searchRubriquesAsync.fulfilled,
          (state, action: PayloadAction<{ rubriques: Rubrique[]; totalPages: number }>) => {
            state.rubriques = action.payload.rubriques;
            state.totalPages = action.payload.totalPages;
            state.loading = false;
          }
        );
        builder.addCase(searchRubriquesAsync.rejected, (state, action) => {
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
    builder 
    .addCase(getAllRubriquesPrsStdPagedAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(getAllRubriquesPrsStdPagedAsync.fulfilled, (state, action) => {
      state.loading = false;
      state.rubriques = action.payload.rubriques;
      state.totalPages = action.payload.totalPages;
    })
    .addCase(getAllRubriquesPrsStdPagedAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Une erreur est survenue.";
    });
  },
});

export const getRubriques = (state : RootState) => state.rubriques.rubriques;
export const getQuestionsRubrique = (state : RootState) => state.rubriques.rubriqueQuestions;
export const { setQuestions } = rubriqueSlice.actions;

export default rubriqueSlice.reducer;