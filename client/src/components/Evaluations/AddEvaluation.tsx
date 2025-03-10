import React, {useState} from "react";
import {useAppDispatch} from "../../hooks/hooks";
import {createEvaluationAsync} from "../../features/EvaluationSlice";
import {
    EvaluationDTO,
    Enseignant,
    ElementConstitutif,
    Promotion,
} from "../../types/types";
import {toast} from "react-toastify";
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

    const [evaluation, setEvaluation] = useState<EvaluationDTO>({
        idEvaluation: 0,
        noEnseignant: -1,
        elementConstitutif: {} as ElementConstitutif,
        anneeUniversitaire: "",
        codeFormation: "",
        nomFormation: "",
        designation: "",
        etat: "",
        periode: "",
        debutReponse: null,
        finReponse: null,
    });

    const validateDates = (debut: Date | null, fin: Date | null) => {
        if (!debut || !fin) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today’s date for comparison

        let newErrors = { ...errors };

        if (debut < today) {
            newErrors.debutReponseError = "La date de début doit être aujourd'hui ou plus tard.";
        } else {
            newErrors.debutReponseError = null;
        }

        if (fin < debut) {
            newErrors.finReponseError = "La date de fin doit être postérieure ou égale à la date de début.";
        } else {
            newErrors.finReponseError = null;
        }

        setErrors(newErrors);

        return !newErrors.debutReponseError && !newErrors.finReponseError;
    };
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const {name, value} = e.target;

        setEvaluation((prevEvaluation) => ({
            ...prevEvaluation,
            [name]:
                name === "debutReponse" || name === "finReponse"
                    ? new Date(value)
                    : value,
        }));

        if (name === "debutReponse" || name === "finReponse") {
            const debut = name === "debutReponse" ? new Date(value) : evaluation.debutReponse;
            const fin = name === "finReponse" ? new Date(value) : evaluation.finReponse;
            validateDates(debut, fin);
        }

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
            idEvaluation: 0,
            noEnseignant: -1,
            elementConstitutif: {} as ElementConstitutif,
            anneeUniversitaire: "",
            codeFormation: "",
            nomFormation: "",
            designation: "",
            etat: "",
            periode: "",
            debutReponse: null,
            finReponse: null,
        });
        setErrors({
            designationError: null,
            debutReponseError: null,
            finReponseError: null,
        });
        setError(null);
        onClose();
    };

    // const formatDate = (date: string | Date | null) => {
    //   if (date === null) return "";
    //   return date instanceof Date ? date.toISOString().split("T")[0] : date;
    // };

    const canSave =
        evaluation.designation.trim() !== "" &&
        evaluation.debutReponse !== null &&
        evaluation.finReponse !== null &&
        errors.debutReponseError === null &&
        errors.finReponseError === null &&
        evaluation.anneeUniversitaire !== "" &&
        evaluation.codeFormation !== "";

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div className="modal-box w-[50em] max-w-5xl">
                <h3 className="font-bold text-lg my-4">Ajouter une évaluation</h3>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 space-y-4">
                        <label className="input input-bordered col-span-2  w-[93%] flex items-center gap-2">
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
                                className="select  w-[93%] "
                                name="promotion"
                                value={
                                    evaluation.anneeUniversitaire && evaluation.codeFormation
                                        ? `${evaluation.anneeUniversitaire}-${evaluation.codeFormation}`
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
                                            anneeUniversitaire: selectedPromotion.anneeUniversitaire,
                                            codeFormation: selectedPromotion.codeFormation,
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

                        <div className="flex flex-col col-span-2 gap-3 w-[93%]">
                            <span className="font-semibold">Période de Reponse</span>
                            <div className="flex flex-row justify-between ">
                                <div className="flex flex-col gap-1 w-[45%]">
                                    <label className="input input-bordered flex items-center gap-2">
                    <span className="font-semibold">
                      Date début<span className="text-red-500"> *</span>
                    </span>
                                        <input
                                            type="date"
                                            name="debutReponse"
                                            value={evaluation.debutReponse}
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
                                <div className="flex flex-col gap-1 w-[45%]">
                                    <label className="input input-bordered flex items-center gap-2">
                    <span className="font-semibold">
                      Date fin<span className="text-red-500"> *</span>
                    </span>
                                        <input
                                            type="date"
                                            name="finReponse"
                                            value={evaluation.finReponse}
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
                {error && <AlertError error={error}/>}

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
