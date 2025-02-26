import { configureStore } from "@reduxjs/toolkit";
import enseignantReducer from "../features/EnseignantSlice";
import promotionReducer from "../features/PromotionSlice";
import etudiantReducer from "../features/EtudiantSlice";
import qualificatifReducer from "../features/QualificatifSlice";
import questionReducer from "../features/QuestionSlice";
import rubriqueReducer from "../features/RubriqueSlice";
import { apiSlice } from "./ApiSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    enseignants: enseignantReducer,
    etudiants:etudiantReducer,
    promotions:promotionReducer,
    qualificatif:qualificatifReducer,
    question:questionReducer,
    rubriques:rubriqueReducer
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true

});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
