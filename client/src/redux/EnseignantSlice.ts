import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchEnseignants, addEnseignant, updateEnseignant, deleteEnseignant } from "../api/enseignantApi";

export interface Enseignant {
    noEnseignant: number;
    type: string;
    nom: string;
    prenom: string;
    sexe: string;
    adresse: string;
    email: string;
    cp: string;
    telPort: string;
    pays: string;
    encUboTel: number;
    encUboEmail: string;
    encPersoEmail: string;
    intFonction: string;
    intNoInsee: number;
    intSocNom: string;
}

// Définition de l'état global pour les enseignants
interface EnseignantState {
    enseignants: Enseignant[];
    loading: boolean;
    error: string | null;
}

const initialState: EnseignantState = {
    enseignants: [],
    loading: false,
    error: null,
};

// Actions asynchrones
export const getEnseignants = createAsyncThunk("enseignants/getEnseignants", async () => {
    return await fetchEnseignants();
});

export const createEnseignant = createAsyncThunk("enseignants/addEnseignant", async (enseignant: Enseignant) => {
    return await addEnseignant(enseignant);
});

export const editEnseignant = createAsyncThunk(
    "enseignants/updateEnseignant",
    async ({ id, enseignant }: { id: number; enseignant: Partial<Enseignant> }) => {
        return await updateEnseignant(id, enseignant);
    }
);

export const removeEnseignant = createAsyncThunk("enseignants/deleteEnseignant", async (id: number) => {
    await deleteEnseignant(id);
    return id; // On retourne l'ID pour pouvoir le supprimer du state Redux
});

const enseignantSlice = createSlice({
    name: "enseignants",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Récupérer les enseignants
            .addCase(getEnseignants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getEnseignants.fulfilled, (state, action: PayloadAction<Enseignant[]>) => {
                state.loading = false;
                state.enseignants = action.payload;
            })
            .addCase(getEnseignants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Erreur lors du chargement";
            })

            // Ajouter un enseignant
            .addCase(createEnseignant.fulfilled, (state, action: PayloadAction<Enseignant>) => {
                state.enseignants.push(action.payload);
            })

            // Modifier un enseignant
            .addCase(editEnseignant.fulfilled, (state, action: PayloadAction<Enseignant>) => {
                const index = state.enseignants.findIndex((ens) => ens.noEnseignant === action.payload.noEnseignant);
                if (index !== -1) {
                    state.enseignants[index] = action.payload;
                }
            })

            // Supprimer un enseignant
            .addCase(removeEnseignant.fulfilled, (state, action: PayloadAction<number>) => {
                state.enseignants = state.enseignants.filter((ens) => ens.noEnseignant !== action.payload);
            });
    },
});

export default enseignantSlice.reducer;
