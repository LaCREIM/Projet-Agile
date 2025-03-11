/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosConfig";

import { Droit, EvaluationDTO } from "../types/types";
import { RootState } from "../api/store";


interface DroitState {
    droit: Droit;
    droits: Droit[];
    loading: boolean;
    error: string | null;
}

const initialState: DroitState = {
    droit: {} as Droit,
    droits: [],
    loading: false,
    error: null,
};


export const fetchDroitsAsync = createAsyncThunk<Droit[], number, { rejectValue: string }>(
    "droits/fetchDroitsAsync",
    async (idEvaluation, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<Droit[]>(`/droits/evaluation/${idEvaluation}`);
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des droits");
        }
    }
);

export const getEvaluationByIdAsync = createAsyncThunk<EvaluationDTO, number, { rejectValue: string }>(
    "evaluations/getEvaluationByIdAsync",
    async (evaluationId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get<EvaluationDTO>(`/evaluations/enseignants/${localStorage.getItem("id")}/${evaluationId}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la récupération des Evaluations");
        }
    }
);

export const createDroitAsync = createAsyncThunk<Droit, Droit, { rejectValue: string }>(
    "droits/createDroitAsync",
    async (droit, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/droits", droit);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la création de la Evaluation");
        }
    }
);

export const updateDroitAsync = createAsyncThunk<Droit, Droit, { rejectValue: string }>(
    "droits/updateDroitAsync",
    async (droit, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/droits/${droit.idEvaluation}/${droit.idEnseignant}`, evaluation);
           console.log(response.data);
           
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data || "Erreur lors de la modification du droit");
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

const DroitSlice = createSlice({
    name: "droits",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDroitsAsync.fulfilled, (state, action: PayloadAction<Droit[]>) => {
                state.droits = action.payload;
                state.loading = false;
            })
            
    },
});

export const getDroits = (state: RootState) => state.droit.droits;

export default DroitSlice.reducer;

