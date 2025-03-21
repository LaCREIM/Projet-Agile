import {useAppDispatch} from "../../hook/hooks";
import {dispositionEvaluationAsync, fetchEvaluationAsync} from "../../features/EvaluationSlice";
import {toast} from "react-toastify";

interface DispositionProps {
    evaluationId: number;
    onClose: () => void;
}

const DispositionEvaluationConfirmation = ({evaluationId, onClose}: DispositionProps) => {
    const dispatch = useAppDispatch();

    const handleDisposition = async () => {
        const response = await dispatch(dispositionEvaluationAsync(evaluationId));
        if (response.type === "evaluations/dispositionEvaluationAsync/fulfilled") {
            toast.success("L'évaluation a été mise en disposition avec succès");
            await dispatch(fetchEvaluationAsync())
        } else {
            toast.error("Erreur lors de la mise en disposition de l'évaluation");
        }
        onClose();
    };

    return (
        <div className="modal-box">
            <h3 className="font-bold text-lg">Mettre en disposition l'évaluation</h3>
            <p className="py-4">Êtes-vous sûr de vouloir mettre à disposition cette évaluation ?</p>
            <div className="modal-action">
                <button className="btn btn-success text-white" onClick={handleDisposition}>
                    Mettre en disposition
                </button>
                <button className="btn" onClick={onClose}>
                    Annuler
                </button>
            </div>
        </div>
    );
};

export default DispositionEvaluationConfirmation;