import React, { useState, useEffect } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { fetchQuestionsAsync, createQuestionAsync } from "../../features/QuestionSlice";
import { Question, Enseignant, Qualificatif } from "../../types/types";
import { getEnseignantAsync } from "../../features/EnseignantSlice";
import { fetchQualificatifsAsync } from "../../features/QualificatifSlice";


const AddQuestion = () => {
  const dispatch = useAppDispatch();
  
  // State for Question and related entities
  const [question, setQuestion] = useState<Question>({
    id: 0,
    type: "",
    noEnseignant: {} as Enseignant,
    idQualificatif: {} as Qualificatif,
    intitule: "",
  });

  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [qualificatifs, setQualificatifs] = useState<Qualificatif[]>([]);

  useEffect(() => {
    // Fetch Enseignants and Qualificatifs from API when component mounts
    const fetchData = async () => {
      const enseignantsData = await dispatch(getEnseignantAsync({ page: 1,size: 10 }));
      const qualificatifsData = await dispatch(fetchQualificatifsAsync());
      
      if (Array.isArray(enseignantsData?.payload)) setEnseignants(enseignantsData.payload);
      if (Array.isArray(qualificatifsData?.payload)) setQualificatifs(qualificatifsData.payload);
    };
    
    fetchData();
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectEnseignant = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEnseignant = enseignants.find((ens) => ens.id === Number(e.target.value));
    setQuestion((prev) => ({
      ...prev,
      noEnseignant: selectedEnseignant || ({} as Enseignant),
    }));
  };

  const handleSelectQualificatif = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedQualificatif = qualificatifs.find((qual) => qual.id === Number(e.target.value));
    setQuestion((prev) => ({
      ...prev,
      idQualificatif: selectedQualificatif || ({} as Qualificatif),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.intitule || !question.idQualificatif) {
      console.error("All required fields must be filled.");
      return;
    }

    await dispatch(createQuestionAsync(question));
    
    dispatch(fetchQuestionsAsync());
  };

  const canSave = question.intitule.trim() && question.type && question.noEnseignant && question.idQualificatif;

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une Question</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Type</span>
              <input
                required
                type="text"
                name="type"
                value={question.type}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: QCM, Open Question"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
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

            <label className="flex items-center gap-2">
              <span className="font-semibold">Enseignant</span>
              <select
                required
                onChange={handleSelectEnseignant}
                className="select select-bordered w-full max-w-full"
              >
                <option value="">Sélectionnez un enseignant</option>
                {enseignants.map((ens) => (
                  <option key={ens.id} value={ens.id}>
                    {ens.nom} {ens.prenom}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-2">
              <span className="font-semibold">Qualificatif</span>
              <select
                required
                onChange={handleSelectQualificatif}
                className="select select-bordered w-full max-w-full"
              >
                <option value="">Sélectionnez un qualificatif</option>
                {qualificatifs.map((qual) => (
                  <option key={qual.id} value={qual.id}>
                    {qual.id} - {qual.maximal} - {qual.minimal}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="modal-action">
            <button className="btn">Annuler</button>
            <button
              type="submit"
              className="btn btn-neutral disabled:cursor-not-allowed"
              disabled={!canSave}
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestion;
