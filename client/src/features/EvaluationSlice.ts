/* eslint-disable @typescript-eslint/no-explicit-any */
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";

import {EvaluationDTO, GetEvaluationDTO} from "../types/types";


interface EvaluationState {
    evaluation: EvaluationDTO;
    evaluations: GetEvaluationDTO[];
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


export const fetchEvaluationAsync = createAsyncThunk<GetEvaluationDTO[], void, { rejectValue: string }>(
    "evaluations/fetchEvaluationAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<GetEvaluationDTO[]>(`/evaluations/evaluations-partage/${localStorage.getItem("id") }`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
        }
    }
);

export const fetchEvaluationByEtuAsync = createAsyncThunk<GetEvaluationDTO[], void, { rejectValue: string }>(
    "evaluations/fetchEvaluationByEtuAsync",
    async (_, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.get<GetEvaluationDTO[]>(`/evaluations/etudiants/${localStorage.getItem("id") }`);
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
            const response = await axiosInstance.get<EvaluationDTO>(`/evaluations/${evaluationId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
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


export const duplicateEvaluationAsync = createAsyncThunk<GetEvaluationDTO[], number, { rejectValue: string }>(
    "evaluations/duplicateEvaluationAsync",
    async (idEvaluation, {rejectWithValue}) => {
        try {
            const response = await axiosInstance.post(`/evaluations/dupliquer/${idEvaluation}/${localStorage.getItem("id")}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la duplication de l'évaluation");
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
            .addCase(getEvaluationByIdAsync.fulfilled, (state, action: PayloadAction<EvaluationDTO>) => {
                state.evaluation = action.payload;
                state.loading = false;
            })
            .addCase(createEvaluationAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            })
            .addCase(duplicateEvaluationAsync.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(duplicateEvaluationAsync.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export const getEvaluation = (state: { evaluations: EvaluationState }) => state.evaluations.evaluation;

export default EvaluationSlice.reducer;

