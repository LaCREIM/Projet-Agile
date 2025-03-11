import React, {useEffect, useState} from "react";
import {useAppDispatch} from "../../hooks/hooks";
import {createEvaluationAsync} from "../../features/EvaluationSlice";
import {Enseignant, EvaluationDTO, Promotion} from "../../types/types";
import {toast} from "react-toastify";
import AlertError from "../ui/alert-error";
import {fetchAllUnitesEnseignementAsync} from "../../features/uniteEnseignementSlice.ts";
import {useSelector} from "react-redux";
import {RootState} from "../../api/store.ts";

interface AddEvaluationProps {
    promotions: Promotion[];
    enseignants: Enseignant[];
    onClose: () => void;
}

const AddEvaluation = ({
                           promotions,
                           onClose,
                       }: AddEvaluationProps) => {
    const dispatch = useAppDispatch();
    const [errors, setErrors] = useState({
        designationError: null as string | null,
        debutReponseError: null as string | null,
        finReponseError: null as string | null,
        noEvaluationError: null as string | null,
    });
    const [error, setError] = useState<string | null>(null);
    const unitesEnseignement = useSelector((state: RootState) => state.unitesEnseignement.unitesEnseignement);

    const initEvaluation = {
        idEvaluation: 0,
        noEnseignant: localStorage.getItem("id") ? parseInt(localStorage.getItem("id") as string) : -1,
        codeUE: "",
        designationEC: "",
        designationUE: "",
        anneeUniversitaire: "",
        codeFormation: "",
        nomFormation: "",
        designation: "",
        etat: "",
        periode: "", // Added field
        debutReponse: "",
        finReponse: "",
        noEvaluation: 1
    }

    const [evaluation, setEvaluation] = useState<EvaluationDTO>(initEvaluation);

    useEffect(() => {
        dispatch(fetchAllUnitesEnseignementAsync())
    }, [dispatch]);

    const validateDates = (debut: string | null, fin: string | null) => {
        if (!debut || !fin) return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today’s date for comparison

        const newErrors = {...errors};

        if (new Date(debut) < new Date(today)) {
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
            [name]: value
        }));

        if (name === "debutReponse" || name === "finReponse") {
            const debut = name === "debutReponse" ? value : evaluation.debutReponse;
            const fin = name === "finReponse" ? value : evaluation.finReponse;
            validateDates(debut, fin);
        }
        if (name === "noEvaluation") {
            if (parseInt(value) < 1 || parseInt(value) > 99) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    noEvaluationError: "Le numéro de l'évaluation doit être compris entre 1 et 99.",
                }))
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    noEvaluationError: null,
                }));
            }
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
            console.log(evaluation)
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
        setEvaluation(initEvaluation);
        setErrors({
            noEvaluationError: null,
            designationError: null,
            debutReponseError: null,
            finReponseError: null
        });
        setError(null);
        onClose();
    };


    const canSave =
        evaluation.designation.trim() !== "" &&
        evaluation.debutReponse !== "" &&
        evaluation.finReponse !== "" &&
        errors.debutReponseError === null &&
        errors.finReponseError === null &&
        evaluation.anneeUniversitaire !== "" &&
        evaluation.codeFormation !== "" &&
        evaluation.noEvaluation >= 1 &&
        evaluation.noEvaluation <= 99;

    return (
        <div className="flex justify-center items-center w-full h-screen">
            <div className="modal-box w-[50em] max-w-5xl">
                <h3 className="font-bold text-lg my-4">Ajouter une évaluation</h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <label className="input input-bordered flex items-center gap-2 w-full">
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
                                maxLength={16}
                            />
                        </label>

                        <label className="input input-bordered flex items-center gap-2 w-full">
                            <span className="font-semibold">
                                No Evaluation<span className="text-red-500"> *</span>
                            </span>
                            <input
                                required
                                type="number"
                                name="noEvaluation"
                                value={evaluation.noEvaluation}
                                onChange={handleChange}
                                className="grow"
                                min="1"
                                max="99"
                                placeholder="1-99"
                            />
                        </label>
                        {errors.noEvaluationError && (
                            <p className="text-red-500 text-sm">{errors.noEvaluationError}</p>
                        )}



                        <label className="flex flex-row items-center col-span-2 gap-2 ">
                            <select
                                required
                                className="select w-full"
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

                        <label className="flex flex-row items-center gap-2">
                            <select
                                required
                                className="select w-full"
                                name="codeUE"
                                value={evaluation.codeUE}
                                onChange={(e) => {
                                    const selectedUnite = unitesEnseignement.find(
                                        (ue) => ue.codeUE === e.target.value
                                    );
                                    if (selectedUnite) {
                                        setEvaluation((prevEvaluation) => ({
                                            ...prevEvaluation,
                                            codeUE: selectedUnite.codeUE,
                                        }));
                                    }
                                }}
                            >
                                <option value="" disabled>
                                    Sélectionner une unité d'enseignement{" "}
                                    <span className="text-red-500"> *</span>
                                </option>
                                {unitesEnseignement.map((unite, idx) => (
                                    <option
                                        key={idx}
                                        value={unite.codeUE}
                                    >
                                        {unite.designationUE}
                                    </option>
                                ))}
                            </select>
                        </label>



                        <div className="flex flex-col col-span-2 gap-3 w-[93%]">
                            <span className="font-semibold">Période de Reponse</span>
                            <label className="input input-bordered flex items-center gap-2 w-full">
                            <span className="font-semibold">
                                Période<span className="text-red-500"> *</span>
                            </span>
                                <input
                                    required
                                    type="text"
                                    name="periode"
                                    value={evaluation.periode}
                                    onChange={handleChange}
                                    className="grow"
                                    placeholder="Ex: Du 22 septembre au 24 octobre	"
                                />
                            </label>
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