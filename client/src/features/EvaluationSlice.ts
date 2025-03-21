import { ReponseEvaluationDTO, StatistiquesDTO } from './../types/types.d';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";

import { EvaluationDTO, GetEvaluationDTO, GetReponseEvaluation } from "@/types/types";
import { ReponseEvaluation } from '@/components/Evaluations/stepper';


interface EvaluationState {
    evaluation: EvaluationDTO;
    evaluations: GetEvaluationDTO[];
    reponsesEvaluation: GetReponseEvaluation[];
    reponseEvaluation: ReponseEvaluation;
    reponseEvaluationETD: ReponseEvaluationDTO | null;
    statistiques: StatistiquesDTO[];
    totalPages: number;
    loading: boolean;
    error: string | null;
}

const initialState: EvaluationState = {
    evaluation: {} as EvaluationDTO,
    statistiques: [] as StatistiquesDTO[],
    evaluations: [],
    reponsesEvaluation: [],
    reponseEvaluation: {} as ReponseEvaluation,
    totalPages: 0,
    loading: false,
    error: null,
    reponseEvaluationETD: null
};


export const fetchEvaluationAsync = createAsyncThunk<GetEvaluationDTO[], void, { rejectValue: string }>(
    "evaluations/fetchEvaluationAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<GetEvaluationDTO[]>(`/evaluations/evaluations-partage/${localStorage.getItem("id")}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
        }
    }
);

export const fetchEvaluationByEtuAsync = createAsyncThunk<GetEvaluationDTO[], void, { rejectValue: string }>(
    "evaluations/fetchEvaluationByEtuAsync",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EvaluationDTO[]>(`/evaluations/etudiant/${localStorage.getItem("id")}`);

            // Transformer les données en GetEvaluationDTO
            const evaluationsWithDroit: GetEvaluationDTO[] = response.data.map((evaluation) => ({
                evaluation,
                droit: {
                    idEvaluation: -1,
                    idEnseignant: -1,
                    nom: "",
                    prenom: "",
                    consultation: "O", // Par défaut, l'étudiant a le droit de consultation
                    duplication: "N", // Par défaut, l'étudiant n'a pas le droit de duplication
                },
            }));

            return evaluationsWithDroit;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des évaluations");
        }
    }
);

export const getEvaluationByIdAsync = createAsyncThunk<EvaluationDTO, number, { rejectValue: string }>(
    "evaluations/getEvaluationByIdAsync",
    async (evaluationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EvaluationDTO>(`/evaluations/${evaluationId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
        }
    }
);

export const fetchReponseEvaluationAsync = createAsyncThunk<ReponseEvaluation, { idEvaluation: number; idEtudiant: string }, { rejectValue: string }>(
    "evaluations/fetchReponseEvaluationAsync",
    async ({ idEvaluation, idEtudiant }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<ReponseEvaluation>(
                `/reponse-evaluation/${idEvaluation}/${idEtudiant}`
            );
            console.log("response", response.data);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des réponses.");
        }
    }
);
export const fetchReponseEvaluationAsyncETD = createAsyncThunk<ReponseEvaluationDTO, { idEvaluation: number; idEtudiant: string }, { rejectValue: string }>(
    "evaluations/fetchReponseEvaluationAsyncETD",
    async ({ idEvaluation, idEtudiant }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<ReponseEvaluationDTO>(
                `/reponse-evaluation/${idEvaluation}/${idEtudiant}`
            );
            console.log("response", response.data);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des réponses.");
        }
    }
);
export const fetchHashedReponseEvaluationAsyncETD = createAsyncThunk<ReponseEvaluationDTO, { idEvaluation: number; idEtudiant: string }, { rejectValue: string }>(
    "evaluations/fetchHashedReponseEvaluationAsyncETD",
    async ({ idEvaluation, idEtudiant }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<ReponseEvaluationDTO>(
                `/reponse-evaluation-hashed/${idEvaluation}/${idEtudiant}`
            );
            console.log("response", response.data);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des réponses.");
        }
    }
);

export const createEvaluationAsync = createAsyncThunk<EvaluationDTO, EvaluationDTO, { rejectValue: string }>(
    "evaluations/createEvaluationAsync",
    async (evaluation, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/evaluations", evaluation);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la création de la Evaluation");
        }
    }
);

export const updateEvaluationAsync = createAsyncThunk<EvaluationDTO, EvaluationDTO, { rejectValue: string }>(
    "evaluations/updateEvaluationAsync",
    async (evaluation, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/evaluations/${evaluation.idEvaluation}`, evaluation);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la modification de la Evaluation");
        }
    }
);

export const deleteEvaluationAsync = createAsyncThunk<void, number, { rejectValue: string }>(
    "evaluations/delete",
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/evaluations/${id}`);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la suppression de l'évaluation");
        }
    }
);


export const duplicateEvaluationAsync = createAsyncThunk<GetEvaluationDTO[], GetEvaluationDTO["evaluation"], {
    rejectValue: string
}>(
    "evaluations/duplicateEvaluationAsync",
    async (evaluation, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`/evaluations/dupliquer/${evaluation.idEvaluation}/${localStorage.getItem("id")}`, evaluation);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la duplication de l'évaluation");
        }
    }
);
export const clouterEvaluationAsync = createAsyncThunk<void, number, { rejectValue: string }>(
    "evaluations/clouterEvaluationAsync",
    async (idEvaluation, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/evaluations/clouter/${idEvaluation}`);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la clôture de l'évaluation");
        }
    }
);

export const dispositionEvaluationAsync = createAsyncThunk<void, number, { rejectValue: string }>(
    "evaluations/dispositionEvaluationAsync",
    async (idEvaluation, { rejectWithValue }) => {
        try {
            await axiosInstance.put(`/evaluations/disposition/${idEvaluation}`);
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la disposition de l'évaluation");
        }
    }
);


export const getAllReponsesEvaluationAsync = createAsyncThunk<GetReponseEvaluation[], number, { rejectValue: string }>(
    "evaluations/getAllReponsesEvaluationAsync",
    async (idEvaluation, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<GetReponseEvaluation[]>(`/reponse-evaluation/${idEvaluation}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récuperation des résulats de l'évaluation");
        }
    }
);

export const envoyerReponseEvaluationAsync = createAsyncThunk<ReponseEvaluation, ReponseEvaluation, { rejectValue: string }>(
    "evaluations/envoyerReponseEvaluationAsync",
    async (reponse, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put<ReponseEvaluation>(`/reponse-evaluation/${Number(reponse.idEvaluation)}/${localStorage.getItem("id")}`, reponse);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de l'envoie du réponse de l'évaluation");
        }
    }
);

const EvaluationSlice = createSlice({
    name: "evaluations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEvaluationAsync.fulfilled, (state, action: PayloadAction<GetEvaluationDTO[]>) => {
                state.evaluations = action.payload;
                state.loading = false;
            })
            .addCase(fetchEvaluationByEtuAsync.fulfilled, (state, action: PayloadAction<GetEvaluationDTO[]>) => {
                console.log("action.payload", action.payload);

                state.evaluations = action.payload;
                state.loading = false;
            })
            .addCase(getEvaluationByIdAsync.fulfilled, (state, action: PayloadAction<EvaluationDTO>) => {
                state.evaluation = action.payload;
                state.loading = false;
            })
            .addCase(createEvaluationAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(duplicateEvaluationAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
        builder
            .addCase(fetchReponseEvaluationAsyncETD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReponseEvaluationAsyncETD.fulfilled, (state, action) => {
                state.loading = false;
                state.reponseEvaluationETD = action.payload;  // ✅ Stocker les données récupérées ici
            })
            .addCase(fetchReponseEvaluationAsyncETD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;  // ✅ Stocker l'erreur ici
            })
            .addCase(getAllReponsesEvaluationAsync.fulfilled, (state, action: PayloadAction<GetReponseEvaluation[]>) => {
                state.reponsesEvaluation = action.payload;
                state.loading = false;
            })
            .addCase(fetchReponseEvaluationAsync.fulfilled, (state, action: PayloadAction<ReponseEvaluation>) => {
                state.reponseEvaluation = action.payload;
                state.loading = false;
            })
            .addCase(fetchHashedReponseEvaluationAsyncETD.fulfilled, (state, action: PayloadAction<ReponseEvaluationDTO>) => {
                state.reponseEvaluationETD = action.payload;
                state.loading = false;
            })

            .addCase(fetchStatistiquesAsync.fulfilled, (state, action: PayloadAction<StatistiquesDTO[]>) => {
                state.statistiques = action.payload;
                state.loading = false;
            })
            .addCase(fetchStatistiquesAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })

    },
});

export const fetchStatistiquesAsync = createAsyncThunk<StatistiquesDTO[], number, { rejectValue: string }>(
    "evaluations/fetchStatistiquesAsync",
    async (evaluationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<StatistiquesDTO[]>(`/evaluations/statistiques/${evaluationId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des statistiques");
        }
    }
);



export const getEvaluation = (state: { evaluations: EvaluationState }) => state.evaluations.evaluation;

export const getReponseEvaluation = (state: { evaluations: EvaluationState }) => state.evaluations.reponseEvaluation;

export const getReponseEvaluationETD = (state: { evaluations: EvaluationState }) => state.evaluations.reponseEvaluationETD;

export const getReponsesEvaluation = (state: { evaluations: EvaluationState }) => state.evaluations.reponsesEvaluation;

export const getEvaluationResponse = (state: { evaluations: EvaluationState }) => state.evaluations.reponseEvaluation;

export default EvaluationSlice.reducer;

