import React from "react";
import {useAppDispatch} from "../../hook/hooks";
import {clouterEvaluationAsync, fetchEvaluationAsync} from "../../features/EvaluationSlice";
import {toast} from "react-toastify";

interface ClouterProps {
    evaluationId: number;
    onClose: () => void;
}

const ClouterEvaluationConfirmation = ({evaluationId, onClose}: ClouterProps) => {
    const dispatch = useAppDispatch();

    const handleClouter = async () => {
        const response = await dispatch(clouterEvaluationAsync(evaluationId));
        if (response.type === "evaluations/clouterEvaluationAsync/fulfilled") {
            toast.success("L'évaluation a été clôturée avec succès");
            await dispatch(fetchEvaluationAsync())
        } else {
            toast.error("Erreur lors de la clôture de l'évaluation");
        }
        onClose();
    };

    return (
        <div className="modal-box">
            <h3 className="font-bold text-lg">Clôturer l'évaluation</h3>
            <p className="py-4">Êtes-vous sûr de vouloir clôturer cette évaluation ?</p>
            <div className="modal-action">
                <button className="btn btn-error text-white" onClick={handleClouter}>
                    Clôturer
                </button>
                <button className="btn" onClick={onClose}>
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default ClouterEvaluationConfirmation;