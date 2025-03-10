/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { Question } from "../types/types";
import { RootState } from "../api/store"; 

interface QuestionState {
  questions: Question[];
  questionsPerso: Question[]; // Ajout des questions perso
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  questions: [],
  questionsPerso: [], // Initialisation
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
    { content: Question[]; totalPages: number },  
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

export const getQuestionPersoAsync = createAsyncThunk<
  { content: Question[]; totalPages: number }, 
  { idEnseignant: number; page: number; size: number },
  { rejectValue: string }
>(
  "questions/getQuestionPersoAsync",
  async ({ idEnseignant, page, size }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get<{ content: Question[]; totalPages: number }>(
        `/questionsPrs/paged`,
        { params: { noEnseignant: idEnseignant, page, size } }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des questions perso.");
    }
  }
);




export const createQuestionAsync = createAsyncThunk<Question, Question, { rejectValue: string }>(
  "questions/create",
  async (question, { rejectWithValue }) => {
    try {
      const questionSTd = {
        idQualificatif: question.idQualificatif.id, 
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

export const createQuestionPersoAsync = createAsyncThunk<
  Question, 
  Question, 
  { rejectValue: string }
>(
  "questions/createQuestionPersoAsync",
  async (question, { rejectWithValue }) => {
    try {
      // Construction de l'objet questionPrs pour envoyer au backend
      const questionPrs = {
        type: question.type,
        noEnseignant: question.noEnseignant,
        idQualificatif: question.idQualificatif.id, 
        intitule: question.intitule,
      };

      // Envoi de la requête POST au backend
      const response = await axiosInstance.post("/questionsPrs", questionPrs);

      // Vérification de la réponse et retour des données
      console.log(response.data);  // Si vous souhaitez logger la réponse
      return response.data;  // Renvoie la donnée reçue du backend

    } catch (error: any) {
      // Gestion d'erreur, retour de message spécifique ou erreur générique
      return rejectWithValue(
        error.response?.data || "Erreur lors de la création de la question"
      );
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

export const updateQuestionPersoAsync = createAsyncThunk<
  Question,
  { id: number; data: Question },
  { rejectValue: string }
>(
  "questions/updateQuestionPersoAsync",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const questionPrs = {
        idQualificatif: data.idQualificatif.id, 
        intitule: data.intitule,
        idEnseignant: 1000
        // idEnseignant: data.noEnseignant.id

      };
      const response = await axiosInstance.put(`/questionsPrs/${id}`, questionPrs);
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

export const deleteQuestionPersoAsync = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>(
  "questions/deleteQuestionPersoAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(`/questionsPrs/${id}`);
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
    })
    builder.addCase(getQuestionPersoAsync.fulfilled, (state, action: PayloadAction<{ content: Question[]; totalPages: number }>) => {
      state.questionsPerso = action.payload.content;
    })    
    builder.addCase(getQuestionPersoAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default questionSlice.reducer;

export const selectAllQuestions = (state: RootState, role: string, id: number ) => {
  const allQuestions = role === "ENS" 
    ? [...state.question.questions, ...state.question.questionsPerso] 
    : state.question.questions;

  return Array.from(new Set(allQuestions.map(q => q.id)))
              .map(id => allQuestions.find(q => q.id === id));
};
