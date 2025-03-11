/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { EvaluationDTO } from "../types/types";

interface EvaluationState {
    evaluation: EvaluationDTO;
    evaluations: EvaluationDTO[];
    totalPages: number;
    loading: boolean;
    error: string | null;
}

const initialState: EvaluationState = {
    evaluation: {} as EvaluationDTO,
    evaluations: [],
    totalPages: 0,  // Ajout du total de pages
    loading: false,
    error: null,
};


export const fetchEvaluationAsync = createAsyncThunk<EvaluationDTO[], string, { rejectValue: string }>(
    "evaluations/fetchEvaluationAsync",
    async (enseignantId, { rejectWithValue }) => {
        try {
            // const response = await axiosInstance.get<EvaluationDTO[]>(`/evaluations/enseignant/${Number(enseignantId)}`);
            const response = await axiosInstance.get<EvaluationDTO[]>(`/evaluations/enseignant/${1}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
        }
    }
);

export const getEvaluationByIdAsync = createAsyncThunk<EvaluationDTO, number, { rejectValue: string }>(
    "evaluations/getEvaluationByIdAsync",
    async (evaluationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EvaluationDTO>(`/evaluations/enseignants/1/${evaluationId}`);
            console.log(response.data);
            
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
        }
    }
);

export const getEvaluationAsync = createAsyncThunk<
    { content: EvaluationDTO[]; totalPages: number },
    { page: number; size: number },
    { rejectValue: string }
>(
    "evaluations/getEvaluationAsync",
    async ({ page, size }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<{ content: EvaluationDTO[]; totalPages: number }>(
                `/evaluations/paged`,
                { params: { page, size } }
            );

            return response.data;
        } catch (error: any) {
            console.error("Erreur lors de la récupération des Evaluations:", error);
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations.");
        }
    }
);

// export const getEvaluationPersoAsync = createAsyncThunk<
//     { content: Evaluation[]; totalPages: number },
//     { idEnseignant: number, page: number; size: number },
//     { rejectValue: string }
// >(
//     "Evaluations/getEvaluationPersoAsync",
//     async ({ idEnseignant, page, size }, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.get<{ content: Evaluation[]; totalPages: number }>(
//                 `/EvaluationsPrs/paged?noEnseignant=${1000}&page=${page}&size=${size}`,
//                 { params: { page, size } }
//             );
//             console.log(response.data);

//             return response.data;
//         } catch (error: any) {
//             console.error("Erreur lors de la récupération des Evaluations:", error);
//             return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations perso.");
//         }
//     }
// );



export const createEvaluationAsync = createAsyncThunk<EvaluationDTO, EvaluationDTO, { rejectValue: string }>(
    "Evaluations/createEvaluationAsync",
    async (evaluation, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/evaluations", evaluation);
            console.log(response.data);

            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la création de la Evaluation");
        }
    }
);

// export const createEvaluationPersoAsync = createAsyncThunk<Evaluation, Evaluation, { rejectValue: string }>(
//     "Evaluations/createEvaluationPersoAsync",
//     async (Evaluation, { rejectWithValue }) => {
//         try {
//             const EvaluationPrs = {
//                 idQualificatif: Evaluation.idQualificatif.id,
//                 intitule: Evaluation.intitule,
//                 idEnseignant: 1000
//                 // idEnseignant: Evaluation.noEnseignant.id
//             };
//             const response = await axiosInstance.post("/EvaluationsPrs", EvaluationPrs);
//             console.log(response.data);

//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || "Erreur lors de la création de la Evaluation");
//         }
//     }
// );

// **Thunk: Mise à jour d'une Evaluation**
// export const updateEvaluationAsync = createAsyncThunk<
//     Evaluation,
//     { id: number; data: Evaluation },
//     { rejectValue: string }
// >(
//     "Evaluations/update",
//     async ({ id, data }, { rejectWithValue }) => {
//         try {
//             const EvaluationSTd = {
//                 idQualificatif: data.idQualificatif.id, // Assurez-vous qu'il est bien un Long
//                 intitule: data.intitule
//             };
//             const response = await axiosInstance.put(`/EvaluationsStd/${id}`, EvaluationSTd);
//             console.log("Payload envoyé:", EvaluationSTd);
//             console.log("Réponse API:", response.data);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la Evaluation");
//         }
//     }
// );

// export const updateEvaluationPersoAsync = createAsyncThunk<
//     Evaluation,
//     { id: number; data: Evaluation },
//     { rejectValue: string }
// >(
//     "Evaluations/updateEvaluationPersoAsync",
//     async ({ id, data }, { rejectWithValue }) => {
//         try {
//             const EvaluationPrs = {
//                 idQualificatif: data.idQualificatif.id,
//                 intitule: data.intitule,
//                 idEnseignant: 1000
//                 // idEnseignant: data.noEnseignant.id

//             };
//             const response = await axiosInstance.put(`/EvaluationsPrs/${id}`, EvaluationPrs);
//             return response.data;
//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || "Erreur lors de la mise à jour de la Evaluation");
//         }
//     }
// );

// **Thunk: Suppression d'une Evaluation**
export const deleteEvaluationAsync = createAsyncThunk<
    void,
    number,
    { rejectValue: string }
>(
    "evaluations/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/evaluations/${id}`);
            console.log(response);

        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la suppression de l'évaluation");
        }
    }
);

// export const deleteEvaluationPersoAsync = createAsyncThunk<
//     void,
//     number,
//     { rejectValue: string }
// >(
//     "Evaluations/deleteEvaluationPersoAsync",
//     async (id, { rejectWithValue }) => {
//         try {
//             const response = await axiosInstance.delete(`/EvaluationsPrs/${id}`);
//             console.log(response);

//         } catch (error: any) {
//             return rejectWithValue(error.response?.data || "Erreur lors de la suppression de la Evaluation");
//         }
//     }
// );

const EvaluationSlice = createSlice({
    name: "Evaluations",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // **Récupérer toutes les Evaluations (ancienne méthode sans pagination)**
        
        builder.addCase(fetchEvaluationAsync.fulfilled, (state, action: PayloadAction<EvaluationDTO[]>) => {
            state.evaluations = action.payload;
            state.loading = false;
        })
        .addCase(getEvaluationByIdAsync.fulfilled, (state, action: PayloadAction<EvaluationDTO>) => {
            state.evaluation = action.payload;
            state.loading = false;
        })
        .addCase(getEvaluationAsync.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(getEvaluationAsync.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        })
        .addCase(createEvaluationAsync.fulfilled, (state, action: PayloadAction<EvaluationDTO>) => {
            state.evaluations.push(action.payload);
        })
        .addCase(createEvaluationAsync.rejected, (state, action) => {
            state.error = action.payload as string;
        });

        
    },
});

export const getEvaluation = (state: { evaluations: EvaluationState }) => state.evaluations.evaluation;

export default EvaluationSlice.reducer;

