/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { updateQuestionAsync, fetchQuestionsAsync } from "../../features/QuestionSlice";
import { Question } from "../../types/types";
import { toast } from "react-toastify";


interface UpdateQuestionProps {
  questionData: Question;
}

const UpdateQuestion = ({ questionData }: UpdateQuestionProps) => {
  const dispatch = useAppDispatch();

  const [question, setQuestion] = useState<Question>({
    ...questionData,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value });
  };

  const handleSubmit = async () => {
    if (question.type && question.intitule) {
      try {
        await dispatch(updateQuestionAsync({ id: question.id, data: question }));
        dispatch(fetchQuestionsAsync());
        toast.success("Question mise à jour avec succès !");
      } catch (error) {
        toast.error("Erreur lors de la mise à jour.");
      }
    } else {
      toast.error("Tous les champs doivent être remplis.");
    }
  };

  const canSave = question.type && question.intitule;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[30em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier une question</h3>
        <form className="flex flex-col gap-5">
          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Type</span>
            <input
              type="text"
              name="type"
              value={question.type}
              onChange={handleChange}
              className="grow"
              placeholder="Type de la question"
            />
          </label>

          <label className="input input-bordered flex items-center gap-2">
            <span className="font-semibold">Intitulé</span>
            <input
              type="text"
              name="intitule"
              value={question.intitule}
              onChange={handleChange}
              className="grow"
              placeholder="Intitulé de la question"
            />
          </label>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button type="button" className="btn">
                Annuler
              </button>
              <button onClick={handleSubmit} className="btn btn-neutral" disabled={!canSave}>
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
