import {EvaluationDTO} from "../../types/types";
import {useAppDispatch} from "../../hook/hooks";
import {toast} from "react-toastify";

import {deleteEvaluationAsync, fetchEvaluationAsync} from "../../features/EvaluationSlice";

interface DeleteProps {
  evaluation: EvaluationDTO;
}

const DeleteEvaluationConfirmation = ({ evaluation }: DeleteProps) => {
  const dispatch = useAppDispatch();
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await dispatch(deleteEvaluationAsync(evaluation.idEvaluation));

      if (response?.type === "evaluations/delete/rejected") {
        toast.error((response.payload as unknown as { message: string }).message);
      } else if (response?.type === "evaluations/delete/fulfilled") {
        toast.success("L'évaluation a été supprimée avec succès.");
        dispatch(fetchEvaluationAsync());
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression.");
    }
  };
  return (
    <>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Cette action est irréversible.</h3>
        <p className="py-4">
          Êtes-vous sûr de vouloir supprimer l'évaluation{" "}
          <b>{evaluation.designation}</b>?
        </p>
        <div className="modal-action">
          <form method="dialog" className=" space-x-4">
            <button className="btn btn-error text-white" onClick={handleDelete}>
              Supprimer
            </button>
            <button className="btn">Annuler</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteEvaluationConfirmation;
