import { Question } from "../../types/types";
import { useAppDispatch } from "../../hook/hooks";
import { toast } from "react-toastify";
import {
  deleteQuestionAsync,
  fetchQuestionsAsync,
} from "../../features/QuestionSlice";

interface DeleteProps {
  question: Question;
  currentPage: number;
}

const DeleteQuestionConfirmation = ({ question }: DeleteProps) => {
  const dispatch = useAppDispatch();
  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await dispatch(deleteQuestionAsync(question.id));

      if (response?.type === "questions/delete/rejected") {
        toast.error(response.payload as string);
      } else if (response?.type === "questions/delete/fulfilled") {
        toast.success("La question a été supprimée avec succès.");
        dispatch(fetchQuestionsAsync());
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
          Êtes-vous sûr de vouloir supprimer cette rubrique?
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

export default DeleteQuestionConfirmation;
