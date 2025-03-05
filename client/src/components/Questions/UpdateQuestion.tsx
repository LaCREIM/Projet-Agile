/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  updateQuestionAsync,
  fetchQuestionsAsync,
} from "../../features/QuestionSlice";
import { Qualificatif, Question } from "../../types/types";
import { toast } from "react-toastify";

interface UpdateQuestionProps {
  questionData: Question;
  qualificatifs: Qualificatif[];
}

const UpdateQuestion = ({
  questionData,
  qualificatifs,
}: UpdateQuestionProps) => {
  const dispatch = useAppDispatch();
  const [question, setQuestion] = useState<Question>({ ...questionData });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setQuestion((prev) => ({ ...prev, [name]: value }));
    console.log(question);
  };

  const handleSelectQualificatif = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedQualificatif = qualificatifs.find(
      (qual) => qual.id === Number(e.target.value)
    );

    if (selectedQualificatif) {
      setQuestion((prev) => ({
        ...prev,
        idQualificatif: selectedQualificatif, // On stocke l'objet complet
      }));
    }
  };

  const canSave =
    question.intitule.trim() !== "" && question.idQualificatif.id !== -1;

  const handleSubmit = async (e: React.FormEvent) => {
    if (canSave) {
      const res = await dispatch(
        updateQuestionAsync({ id: question.id, data: question })
      );
      console.log(res);
      
      if (res?.type === "questions/update/rejected") {
        toast.error(res.payload as string);
      } else if (res?.type === "questions/update/fulfilled") {
        toast.success(res.payload as string);
      }
      dispatch(fetchQuestionsAsync());
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[40%] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier la question</h3>
        <form className="flex flex-col gap-5">
          <label className="input input-bordered w-[85%] flex items-center gap-2">
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
                  {qual.minimal} - {qual.maximal}
                </option>
              ))}
            </select>
          </label>

          {/* Boutons d'action */}
          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button className="btn">Annuler</button>

              <button
                onClick={handleSubmit}
                disabled={!canSave}
                className="btn btn-neutral"
              >
                Mettre à jour
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateQuestion;
