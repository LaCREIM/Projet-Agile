import React, {useState} from "react";
import {useAppDispatch} from "../../hook/hooks";
import {
  createQuestionAsync,
  createQuestionPersoAsync,
  getAllQuestionsPersoAsync,
  Question,
} from "../../features/QuestionSlice";
import {Qualificatif, QuestionP} from "../../types/types";
import {toast} from "react-toastify";
import AlertError from "../ui/alert-error";

interface AddQuestionProps {
  qualificatifs: Qualificatif[];
  onClose: () => void;
}

const AddQuestion = ({ qualificatifs, onClose }: AddQuestionProps) => {
  const dispatch = useAppDispatch();

  const [question, setQuestion] = useState<Question>({
    idQuestion: 0,
    type: "",
    noEnseignant: 0,
    idQualificatif: -1,
    maxQualificatif: "",
    minQualificatif: "",
    intitule: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [questionToSend, setQuestionToSend] = useState<QuestionP>(
    {} as QuestionP
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setQuestion((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handleSelectQualificatif = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedQualificatif = qualificatifs.find(
      (qual) => qual.id === Number(e.target.value)
    );
    const userId = localStorage.getItem("id");

    setQuestion((prev) => ({
      ...prev,
      idQuestion: prev.idQuestion || -1,
      idQualificatif: selectedQualificatif?.id || -1,
      maxQualificatif: selectedQualificatif?.maximal || "",
      minQualificatif: selectedQualificatif?.minimal || "",
      intitule: prev.intitule,
      type: prev.type,
      noEnseignant: Number(userId),
    }));
  };

  const canSave =
    question.intitule.trim() !== "" && question.idQualificatif !== -1;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSave) return;

    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("id");
    console.log("role", role);
    console.log("userId", userId);
    if (!userId) {
      toast.error("Utilisateur non identifié !");
      setError("Impossible de récupérer l'identifiant de l'utilisateur.");
      return;
    }

    const isEnseignant = role === "ENS";
    setQuestionToSend((prev) => ({
      ...prev,
      idQualificatif: question.idQualificatif,
      maxQualificatif: question.maxQualificatif ?? "",
      minQualificatif: question.minQualificatif ?? "",
      intitule: prev.intitule,
      noEnseignant: Number(userId),
    }));
    console.log("questionToSend", questionToSend);
    questionToSend.noEnseignant = Number(userId);
    const action = isEnseignant
      ? createQuestionPersoAsync(question)
      : createQuestionAsync(question);

    try {
      const res = await dispatch(action);

      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Question ajoutée avec succès !");
        if (role === "ADM") {
          dispatch(getAllQuestionsPersoAsync({ idEnseignant: 0 }));
        } else {
          dispatch(getAllQuestionsPersoAsync({ idEnseignant: Number(userId) }));
        }
        handleReset();
      } else {
        console.error("Erreur lors de l'ajout :", res.payload);
        setError(res.payload as string);
      }
    } catch (err) {
      console.error("Exception lors de l'ajout de la question :", err);
      toast.error("Une erreur est survenue.");
    }
  };

  const handleReset = () => {
    setQuestion({
      idQuestion: 0,
      type: "",
      noEnseignant: 0,
      idQualificatif: -1,
      maxQualificatif: "",
      minQualificatif: "",
      intitule: "",
    });
    setError(null);
    onClose();
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
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
                className="grow"
                placeholder="Ex: Contenu ?"
              />
            </label>

            <label className="flex flex-row items-center ">
              <span className="font-semibold w-[15%]">Qualificatif</span>

              <select
                required
                onChange={handleSelectQualificatif}
                value={question.idQualificatif} // Lier la valeur à question.idQualificatif.id
                className="select select-bordered w-[70%] max-w-full  hover:cursor-pointer"
              >
                <option value={-1}>Sélectionnez un qualificatif</option>
                {qualificatifs.map((qual) => (
                  <option key={qual.id} value={qual.id}>
                    {qual.minimal} - {qual.maximal}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {error && <div className={"mt-4"}><AlertError error={error}/></div>}

          <div className="modal-action">
            <button className="btn" type="button" onClick={handleReset}>
              Annuler
            </button>
            <button
              className="btn btn-neutral disabled:cursor-not-allowed"
              type="submit"
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
