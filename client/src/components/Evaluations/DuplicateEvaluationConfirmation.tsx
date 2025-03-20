import React, { useState } from 'react';
import { GetEvaluationDTO, Promotion } from '../../types/types';
import {useSelector} from "react-redux";
import {RootState} from "@/api/store.ts";


interface DuplicateEvaluationConfirmationProps {
    evaluation: GetEvaluationDTO['evaluation'];
    promotions: Promotion[];
    onClose: () => void;
    onConfirm: (updatedEvaluation: GetEvaluationDTO['evaluation']) => void;
}

const DuplicateEvaluationConfirmation: React.FC<DuplicateEvaluationConfirmationProps> = ({ evaluation, promotions, onClose, onConfirm }) => {
    const [updatedEvaluation, setUpdatedEvaluation] = useState(evaluation);
    const unitesEnseignement = useSelector(
        (state: RootState) =>
            state.unitesEnseignement.unitesEnseignementByEnseignant
    );


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedEvaluation((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm(updatedEvaluation);
        updatedEvaluation.noEvaluation = 0;
        onClose();
    };

    return (
        <div className="modal-box">
            <h3 className="font-bold text-lg">Confirmer la duplication</h3>
            <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <label className="input input-bordered flex items-center gap-2 w-full mt-4">
                        <span className="font-semibold">Désignation<span className="text-red-500"> *</span></span>
                        <input
                            required
                            type="text"
                            name="designation"
                            value={updatedEvaluation.designation}
                            onChange={handleChange}
                            className="grow"
                            placeholder="Ex: Examen final"
                            maxLength={16}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <span className="font-semibold">No Evaluation<span className="text-red-500"> *</span></span>
                        <input
                            required
                            type="number"
                            name="noEvaluation"
                            onChange={handleChange}
                            className="grow"
                            min="1"
                            max="99"
                            placeholder="1-99"
                        />
                    </label>
                    <label className="flex flex-row items-center col-span-2 gap-2">
                        <select
                            required
                            className="select w-full"
                            name="promotion"
                            value={
                                updatedEvaluation.anneeUniversitaire && updatedEvaluation.codeFormation
                                    ? `${updatedEvaluation.anneeUniversitaire}-${updatedEvaluation.codeFormation}`
                                    : ""
                            }
                            onChange={(e) => {
                                const selectedPromotion = promotions.find(
                                    (p) =>
                                        `${p.anneeUniversitaire}-${p.codeFormation}` === e.target.value
                                );
                                if (selectedPromotion) {
                                    setUpdatedEvaluation((prev) => ({
                                        ...prev,
                                        anneeUniversitaire: selectedPromotion.anneeUniversitaire,
                                        codeFormation: selectedPromotion.codeFormation,
                                    }));
                                }
                            }}
                        >
                            <option value="" disabled>
                                Sélectionner une promotion <span className="text-red-500"> *</span>
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
                            disabled={updatedEvaluation.codeFormation === "" && updatedEvaluation.anneeUniversitaire === ""}
                            name="codeUE"
                            value={updatedEvaluation.codeUE}
                            onChange={(e) => {
                                const selectedUnite = unitesEnseignement.find(
                                    (ue) => ue.codeUE === e.target.value
                                );
                                if (selectedUnite) {
                                    setUpdatedEvaluation((prev) => ({
                                        ...prev,
                                        codeUE: selectedUnite.codeUE,
                                    }));
                                }
                            }}
                        >
                            <option value="" disabled>
                                Sélectionner une unité d'enseignement <span className="text-red-500"> *</span>
                            </option>
                            {unitesEnseignement.map((unite, idx) => (
                                <option key={idx} value={unite.codeUE}>
                                    {unite.designationUE}
                                </option>
                            ))}
                        </select>
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <span className="font-semibold">Période<span className="text-red-500"> *</span></span>
                        <input
                            required
                            type="text"
                            name="periode"
                            value={updatedEvaluation.periode}
                            onChange={handleChange}
                            className="grow"
                            placeholder="Ex: Du 22 septembre au 24 octobre"
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <span className="font-semibold">Date début<span className="text-red-500"> *</span></span>
                        <input
                            required
                            type="date"
                            name="debutReponse"
                            value={updatedEvaluation.debutReponse}
                            onChange={handleChange}
                            className="grow"
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 w-full">
                        <span className="font-semibold">Date fin<span className="text-red-500"> *</span></span>
                        <input
                            required
                            type="date"
                            name="finReponse"
                            value={updatedEvaluation.finReponse}
                            onChange={handleChange}
                            className="grow"
                        />
                    </label>
                </div>
                <h1 className="text-sm text-red-500 mt-2">* Veuillez bien vérifier les informations ci-dessus!</h1>
                <div className="modal-action">
                    <button className="btn" type={"button"} onClick={onClose}>Annuler</button>
                    <button className="btn btn-neutral" type="submit">Dupliquer</button>
                </div>
            </form>
        </div>
    );
};

export default DuplicateEvaluationConfirmation;