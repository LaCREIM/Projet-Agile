import { configureStore } from "@reduxjs/toolkit";
import enseignantReducer from "../features/EnseignantSlice";
import etudiantReducer from "../features/EtudiantSlice";
import promotionReducer from "../features/PromotionSlice";

const store = configureStore({
  reducer: {
    enseignants: enseignantReducer,
    etudiants: etudiantReducer,
    promotions: promotionReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
