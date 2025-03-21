/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import {
  updateQuestionAsync,
  getAllQuestionsPersoAsync,
  estUtiliseeAsync,
} from "../../features/QuestionSlice";
import { Qualificatif, Question } from "../../types/types";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";
import { RootState } from "@/api/store";

interface UpdateQuestionProps {
  questionData: Question;
  qualificatifs: Qualificatif[];
  onClose: () => void; 
}

const UpdateQuestion = ({
  questionData,
  qualificatifs,
  onClose,
}: UpdateQuestionProps) => {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState<Question>({ ...questionData });
  const [error, setError] = useState<string | null>(null); 
  const estUtilisee = useAppSelector((state: RootState) => state.question.estUtilisee);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
    setError(null); 
  };

  useEffect(() => {
    dispatch(estUtiliseeAsync(question.idQuestion));
  }, [estUtilisee]);

  const handleSelectQualificatif = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedQualificatif = qualificatifs.find(
      (qual) => qual.id === Number(e.target.value)
    );

    if (selectedQualificatif) {
      setQuestion((prev) => ({
        ...prev,
        idQualificatif: selectedQualificatif.id, 
      }));
    }
  };

  const canSave =
    question.intitule.trim() !== "" && Number(question.idQualificatif) !== -1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        updateQuestionAsync({ id: question.idQualificatif, data: question })
      );

      if (res?.type === "questions/update/rejected") {
        setError(res.payload as string);
      } else if (res?.type === "questions/update/fulfilled") {
        toast.success("La question a été mise à jour avec succès!"); 
        const id = localStorage.getItem("id");
         dispatch(getAllQuestionsPersoAsync({ idEnseignant: Number(id) }));
        onClose(); 
      }
    } catch (error) {
      setError("Une erreur inattendue s'est produite.");
      toast.error("Une erreur inattendue s'est produite.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[40%] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier la question</h3>
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <label className="input input-bordered w-full flex items-center gap-2">
            <span className="font-semibold">Intitulé</span>
            <input
              required
              type="text"
              name="intitule"
              value={question.intitule}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: Contenu ?"
            />
          </label>

          {/* Sélection du Qualificatif */}
          <label className="grid grid-cols-10 items-center w-full">
            <span className="font-semibold w-[15%] col-span-2">Qualificatif</span>
            <select
              required
              onChange={handleSelectQualificatif}
              value={question.idQualificatif || ""}
              className="select select-bordered w-full max-w-full hover:cursor-pointer col-span-8"
            >
              <option value="">Sélectionnez un qualificatif</option>
              {qualificatifs.map((qual) => (
                <option key={qual.id} value={qual.id}>
                  {qual.minimal} - {qual.maximal}
                </option>
              ))}
            </select>
          </label>
          {error && <AlertError error={error} />}
          <div className="modal-action">
            <button
              type="button"
              onClick={() => {
                onClose(), setError(null);
              }}
              className="btn"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={estUtilisee || !canSave}
              className="btn btn-neutral"
            >
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
