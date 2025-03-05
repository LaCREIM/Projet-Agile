/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { updateQuestionAsync, fetchQuestionsAsync } from "../../features/QuestionSlice";
import { Qualificatif, Question } from "../../types/types";
import { toast } from "react-toastify";

interface UpdateQuestionProps {
  questionData: Question;
  qualificatifs: Qualificatif[];
}

const UpdateQuestion = ({ questionData, qualificatifs }: UpdateQuestionProps) => {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState<Question>({ ...questionData });

  // Gestion du changement des inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
    console.log(question);
  };

  // Gestion du changement du select Qualificatif
  const handleSelectQualificatif = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQualificatif = qualificatifs.find((qual) => qual.id === Number(e.target.value));
    if (selectedQualificatif) {
      setQuestion((prev) => ({
        ...prev,
        idQualificatif: selectedQualificatif, // On stocke l'objet complet
      }));
    }
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.type || !question.intitule) {
      toast.error("Tous les champs doivent être remplis.");
      return;
    }

    try {
      await dispatch(updateQuestionAsync({ id: question.id, data: question }));
      dispatch(fetchQuestionsAsync());
      toast.success("Question mise à jour avec succès !");
      
      // Fermer le modal après mise à jour
      const dialog = document.getElementById("updateQuestionModal") as HTMLDialogElement;
      if (dialog) dialog.close();
    } catch (error) {
      toast.error("Erreur lors de la mise à jour.");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[40%] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier une question</h3>
        
        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          {/* Intitulé */}
          <label className="input input-bordered w-[85%] flex items-center gap-2">
            <span className="font-semibold">Intitulé</span>
            <input
              required
              type="text"
              name="intitule"
              value={question.intitule}
              onChange={handleChange}
              className="grow"
              placeholder="Ex: Quelle est la capitale de la France ?"
            />
          </label>

          {/* Sélection du Qualificatif */}
          <label className="flex flex-row items-center">
            <span className="font-semibold w-[15%]">Qualificatif</span>
            <select
              required
              onChange={handleSelectQualificatif}
              value={question.idQualificatif?.id || ""}
              className="select select-bordered w-[70%] max-w-full hover:cursor-pointer"
            >
              <option value="">Sélectionnez un qualificatif</option>
              {qualificatifs.map((qual) => (
                <option key={qual.id} value={qual.id}>
                  {qual.maximal} - {qual.minimal}
                </option>
              ))}
            </select>
          </label>

          {/* Boutons d'action */}
          <div className="modal-action">
            <button type="button" className="btn">Annuler</button>
            <button type="submit" className="btn btn-neutral">Mettre à jour</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
