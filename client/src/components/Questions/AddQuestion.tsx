import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  fetchQuestionsAsync,
  createQuestionAsync,
} from "../../features/QuestionSlice";
import { Question, Enseignant, Qualificatif } from "../../types/types";



interface AddQuestionProps {
  qualificatifs: Qualificatif[];
}

const AddQuestion = ({qualificatifs} : AddQuestionProps) => {
  const dispatch = useAppDispatch();

  // State for Question and related entities
  const [question, setQuestion] = useState<Question>({
    id: 0,
    type: "",
    noEnseignant: {} as Enseignant,
    idQualificatif: {} as Qualificatif,
    intitule: "",
  });


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  const handleSelectQualificatif = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedQualificatif = qualificatifs.find(
      (qual) => qual.id === Number(e.target.value)
    );
    setQuestion((prev) => ({
      ...prev,
      idQualificatif: selectedQualificatif || ({} as Qualificatif),
    }));
  };

  const canSave =
    question.intitule.trim() !== "" && question.idQualificatif.id !== -1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (canSave) {
      await dispatch(createQuestionAsync(question));
      setQuestion({
        id: 0,
        type: "",
        noEnseignant: {} as Enseignant,
        idQualificatif: {} as Qualificatif,
        intitule: "",
      });
    }
    
    dispatch(fetchQuestionsAsync());
  };


  


  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une Question</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">


              <label className="input input-bordered w-[85%] flex items-center gap-2">
                <span className="font-semibold">Intitulé</span>
                <input
                  required
                  type="text"
                  name="intitule"
                  value={question.intitule}
                  onChange={handleChange}
                  className="grow "
                  placeholder="Ex: Quelle est la capitale de la France ?"
                />
              </label>


            <label className="flex flex-row items-center ">
              <span className="font-semibold w-[15%]">Qualificatif</span>

              <select
                required
                onChange={handleSelectQualificatif}
                className="select select-bordered w-[70%] max-w-full  hover:cursor-pointer"
              >
                <option value={-1}>Sélectionnez un qualificatif</option>
                {qualificatifs.map((qual) => (
                  <option key={qual.id} value={qual.id}>
                    {qual.maximal} - {qual.minimal}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button className="btn">Annuler</button>
              <button
                className="btn btn-neutral disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!canSave}
              >
                Ajouter
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
