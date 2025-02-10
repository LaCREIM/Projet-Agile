import { configureStore } from "@reduxjs/toolkit";
import enseignantReducer from "../features/EnseignantSlice";
import promotionReducer from "../features/PromotionSlice";
import etudiantReducer from "../features/EtudiantSlice";
import qualificatifReducer from "../features/QualificatifSlice";

const store = configureStore({
  reducer: {
    enseignants: enseignantReducer,
    etudiants:etudiantReducer,
    promotions:promotionReducer,
    qualificatif:qualificatifReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
