import { configureStore } from "@reduxjs/toolkit";
import enseignantReducer from "../features/EnseignantSlice";

const store = configureStore({
  reducer: {
    enseignants: enseignantReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
