import React, { useState } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { createEvaluationAsync } from "../../features/EvaluationSlice";
import {
  Evaluation,
  Enseignant,
  ElementConstitutif,
  Promotion,
} from "../../types/types";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";

interface AddEvaluationProps {
  promotions: Promotion[];
  enseignants: Enseignant[];
  onClose: () => void;
}

const AddEvaluation = ({
  promotions,
  enseignants,
  onClose,
}: AddEvaluationProps) => {
  const dispatch = useAppDispatch();
  const [errors, setErrors] = useState({
    designationError: null as string | null,
    debutReponseError: null as string | null,
    finReponseError: null as string | null,
  });
  const [error, setError] = useState<string | null>(null);

  const [evaluation, setEvaluation] = useState<Evaluation>({
    id: 0,
    noEnseignant: {} as Enseignant,
    elementConstitutif: {} as ElementConstitutif,
    promotion: {} as Promotion,
    noEvaluation: 0,
    designation: "",
    etat: "",
    periode: "",
    debutReponse: new Date(),
    finReponse: new Date(),
  });

  const validateDates = (debut: Date | null, fin: Date | null) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignorer l'heure pour la comparaison
    if (!debut || !fin) return;

    if (debut < today) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        debutReponseError:
          "La date de début doit être supérieure ou égale à aujourd'hui.",
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        debutReponseError: null,
      }));
    }

    if (fin < debut) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        finReponseError:
          "La date de fin doit être supérieure ou égale à la date de début.",
      }));
      return false;
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        finReponseError: null,
      }));
    }

    return true;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "designation" && value.trim() === "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        designationError: "La désignation ne peut pas être vide.",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        designationError: null,
      }));
    }

    if (name === "debutReponse" || name === "finReponse") {
      const newDate = new Date(value);
      const otherDate =
        name === "debutReponse"
          ? evaluation.finReponse
          : evaluation.debutReponse;

      if (
        !validateDates(
          name === "debutReponse" ? newDate : otherDate,
          name === "finReponse" ? newDate : otherDate
        )
      ) {
        return; // Ne pas mettre à jour l'état si la validation échoue
      }
    }

    setEvaluation((prevEvaluation) => ({
      ...prevEvaluation,
      [name]:
        name === "debutReponse" || name === "finReponse"
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async () => {
    if (canSave) {
      const res = await dispatch(createEvaluationAsync(evaluation));
      if (res?.type === "evaluations/createEvaluationAsync/rejected") {
        setError(res.payload as string);
      } else if (res?.type === "evaluations/createEvaluationAsync/fulfilled") {
        toast.success(res.payload as string);
        resetEvaluation();
      }
    }
  };

  const resetEvaluation = () => {
    setEvaluation({
      id: 0,
      noEnseignant: {} as Enseignant,
      elementConstitutif: {} as ElementConstitutif,
      promotion: {} as Promotion,
      noEvaluation: 0,
      designation: "",
      etat: "",
      periode: "",
      debutReponse: new Date(),
      finReponse: new Date(),
    });
    setErrors({
      designationError: null,
      debutReponseError: null,
      finReponseError: null,
    });
    setError(null);
    onClose();
  };

  const formatDate = (date: string | Date | null) => {
    if (date === null) return "";
    return date instanceof Date ? date.toISOString().split("T")[0] : date;
  };

  const canSave =
    evaluation.designation.trim() !== "" &&
    evaluation.noEnseignant.id !== -1 &&
    evaluation.debutReponse !== null &&
    evaluation.finReponse !== null &&
    errors.debutReponseError === null &&
    errors.finReponseError === null &&
    evaluation.promotion.codeFormation !== "" &&
    evaluation.promotion.anneeUniversitaire !== "";

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une évaluation</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Désignation<span className="text-red-500"> *</span>
              </span>
              <input
                required
                type="text"
                name="designation"
                value={evaluation.designation}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Examen final"
              />
            </label>

            <label className="flex flex-row items-center gap-2">
              <select
                required
                className="select"
                name="noEnseignant"
                value={evaluation.noEnseignant?.id || ""}
                onChange={(e) => {
                  const selectedEnseignant = enseignants.find(
                    (enseignant) => enseignant.id === parseInt(e.target.value)
                  );
                  if (selectedEnseignant) {
                    setEvaluation((prevEvaluation) => ({
                      ...prevEvaluation,
                      noEnseignant: selectedEnseignant,
                    }));
                  }
                }}
              >
                <option value="" disabled>
                  Sélectionnez un enseignant{" "}
                  <span className="text-red-500"> *</span>
                </option>
                {enseignants.map((enseignant, idx) => (
                  <option key={idx} value={enseignant.id}>
                    {enseignant.nom} {enseignant.prenom}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-row items-center gap-2">
              <select
                required
                className="select"
                name="promotion"
                value={
                  evaluation.promotion.anneeUniversitaire &&
                  evaluation.promotion.codeFormation
                    ? `${evaluation.promotion.anneeUniversitaire}-${evaluation.promotion.codeFormation}`
                    : ""
                }
                onChange={(e) => {
                  const selectedPromotion = promotions.find(
                    (p) =>
                      `${p.anneeUniversitaire}-${p.codeFormation}` ===
                      e.target.value
                  );
                  if (selectedPromotion) {
                    setEvaluation((prevEvaluation) => ({
                      ...prevEvaluation,
                      promotion: selectedPromotion,
                    }));
                  }
                }}
              >
                <option value="" disabled>
                  Sélectionner une promotion{" "}
                  <span className="text-red-500"> *</span>
                </option>
                {promotions.map((promotion, idx) => (
                  <option
                    key={idx}
                    value={`${promotion.anneeUniversitaire}-${promotion.codeFormation}`}
                  >
                    {promotion.nomFormation} - {promotion.anneeUniversitaire}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex flex-col col-span-2 gap-3 w-full">
              <span className="font-semibold">Période de Reponse</span>
              <div className="grid grid-cols-2 gap-5 w-full">
                <div className="flex flex-col gap-1">
                  <label className="input input-bordered flex items-center gap-2">
                    <span className="font-semibold">
                      Date début<span className="text-red-500"> *</span>
                    </span>
                    <input
                      type="date"
                      name="debutReponse"
                      value={formatDate(evaluation.debutReponse)}
                      onChange={handleChange}
                      className="grow"
                    />
                  </label>
                  {errors.debutReponseError && (
                    <p className="text-red-500 text-sm">
                      {errors.debutReponseError}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="input input-bordered flex items-center gap-2">
                    <span className="font-semibold">
                      Date fin<span className="text-red-500"> *</span>
                    </span>
                    <input
                      type="date"
                      name="finReponse"
                      value={formatDate(evaluation.finReponse)}
                      onChange={handleChange}
                      className="grow"
                    />
                  </label>
                  {errors.finReponseError && (
                    <p className="text-red-500 text-sm">
                      {errors.finReponseError}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </form>
        {error && <AlertError error={error} />}

        <div className="modal-action">
          <button className="btn" onClick={resetEvaluation}>
            Annuler
          </button>
          <button
            className="btn btn-neutral hover:cursor-pointer"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEvaluation;
