import axiosInstance from "./axiosConfig";
import { Enseignant } from "../features/EnseignantSlice";

export const fetchEnseignants = async (): Promise<Enseignant[]> => {
  const response = await axiosInstance.get("/enseignants");
  return response.data;
};

export const addEnseignant = async (enseignant: Enseignant): Promise<Enseignant> => {
  const response = await axiosInstance.post("/enseignants", enseignant);
  return response.data;
};

export const updateEnseignant = async (id: number, enseignant: Partial<Enseignant>): Promise<Enseignant> => {
  const response = await axiosInstance.put(`/enseignants/${id}`, enseignant);
  return response.data;
};

export const deleteEnseignant = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/enseignants/${id}`);
};
