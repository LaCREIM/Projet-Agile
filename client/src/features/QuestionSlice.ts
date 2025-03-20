/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
//import { Enseignant } from "../types/types";
import { RootState } from "../api/store"; 

interface QuestionState {
  estUtilisee: boolean;
  questions: Question[];
  questionsPerso: Question[]; // Ajout des questions perso
  totalPages: number;
  loading: boolean;
  error: string | null;
}

const initialState: QuestionState = {
  estUtilisee: false,
  questions: [],
  questionsPerso: [], // Initialisation
  totalPages: 0,  // Ajout du total de pages
  loading: false,
  error: null,
};
export interface QuestionP {
    //id: number;4    noEnseignant: Enseignant;
    noEnseignant: number;
    type: string;
    intitule: string;
    idQualificatif: number;
    maxQualificatif: string;
    minQualificatif: string;
}
export interface Question {

    idQuestion: number;
    type: string;
    noEnseignant: number;
    idQualificatif: number;
    maxQualificatif: string;
    minQualificatif: string;
    intitule: string;
}


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

export const getAllQuestionsPersoAsync = createAsyncThunk<
  Question[],  // Le type de retour sera un tableau de questions
  { idEnseignant: number },  // Paramètre d'entrée contenant l'id de l'enseignant
  { rejectValue: string }
>(
  "questions/getAllQuestionsPersoAsync",  // Nom de l'action
  async ({ idEnseignant }, { rejectWithValue }) => {
    try {
      const id = Number(idEnseignant);
      console.log("ID enseignant:", idEnseignant, "ID converti:", id);
      
      const response = await axiosInstance.get(`/questions/std-prs/${idEnseignant}`);
      console.log(`URL appelée : /questionsPrs/std-prs/${id}`);
      console.log("Données reçues :", response.data);
  
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la récupération des questions perso :", error);
      return rejectWithValue(error.response?.data || "Erreur lors de la récupération des questions perso.");
    }
  }  
);



export const createQuestionAsync = createAsyncThunk<Question, Question, { rejectValue: string }>(
  "questions/create",
  async (question, { rejectWithValue }) => {
    try {
      const questionSTd = {
        idQualificatif: question.idQualificatif, 
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
      const questionPrs: QuestionP = {
        noEnseignant: question.noEnseignant,
        intitule: question.intitule.trim(),
        //id: Number(question.id),  // ➡️ Ajout du champ `idQuestion`
        idQualificatif: Number(question.idQualificatif),
        maxQualificatif: String(question.maxQualificatif), // ➡️ Conversion en string
        minQualificatif: String(question.minQualificatif),
        type: "QUP"
      };
 
      console.log("Données envoyées :", questionPrs);

      const response = await axiosInstance.post(
        "/questionsPrs",
        questionPrs,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Réponse reçue :", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la création de la question :", error);
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
    const role = localStorage.getItem("role");
    const type = role == "ENS" ? "QUP" : "QUS";
    try {
      const questions :Question = {
        idQualificatif: Number(id), // Assurez-vous qu'il est bien un Long
        intitule: data.intitule,
        maxQualificatif: data.maxQualificatif,
        minQualificatif: data.minQualificatif,
        noEnseignant: data.noEnseignant,
        type: type,
        idQuestion: data.idQuestion
      };
      const response = await axiosInstance.put(`/questions/${questions.idQuestion}`, questions);
      console.log("Payload envoyé:", questions);
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
        idQualificatif: data.idQualificatif, 
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
      const response = await axiosInstance.delete(`/questionsPrs/${id}`);
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

export const estUtiliseeAsync = createAsyncThunk<boolean, number, { rejectValue: string }>(
  "rubriques/estUtiliseeAsync",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/questionsPrs/estUtilisee/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Erreur lors de la vérification de l'utilisation de la rubrique");
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

    builder.addCase(getQuestionAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getQuestionAsync.fulfilled, (state, action: PayloadAction<{ content: Question[]; totalPages: number }>) => {
      state.questions = action.payload.content; 
      state.totalPages = action.payload.totalPages; 
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
    builder.addCase(getAllQuestionsPersoAsync.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllQuestionsPersoAsync.fulfilled, (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.loading = false;
    });
    
    builder.addCase(getAllQuestionsPersoAsync.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    
    // **Mettre à jour une question**
    builder.addCase(updateQuestionAsync.fulfilled, (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex((q) => q.idQuestion === action.payload.idQuestion);
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
    builder.addCase(estUtiliseeAsync.fulfilled, (state, action: PayloadAction<boolean>) => {
      state.estUtilisee = action.payload;
    })
    builder.addCase(getQuestionPersoAsync.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export default questionSlice.reducer;

export const selectAllQuestions = (state: RootState, role: string) => {
  const allQuestions = role === "ENS" 
    ? state.question.questionsPerso
    : state.question.questions;

  return Array.from(new Set(allQuestions.map(q => q.idQuestion)))
              .map(id => allQuestions.find(q => q.idQuestion === id));
};










