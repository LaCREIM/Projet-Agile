import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";
import { EvaluationDTO, GetEvaluationDTO } from "../types/types";

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
    totalPages: 0,
    loading: false,
    error: null,
};

export const fetchEvaluationAsync = createAsyncThunk<GetEvaluationDTO[], string, { rejectValue: string }>(
    "evaluations/fetchEvaluationAsync",
    async (enseignantId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<GetEvaluationDTO[]>(`/evaluations/evaluations-partage/${1}`);
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