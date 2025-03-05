import { Qualificatif } from "../../types/types";
import {
  deleteQualificatifAsync,
  fetchQualificatifsPagedAsync,
} from "../../features/QualificatifSlice";
import { useAppDispatch } from "../../hook/hooks";
import { toast } from "react-toastify";

interface DeleteProps {
  qualificatif: Qualificatif;
  currentPage: number;
}

const DeleteQualificatifConfirmation = ({
  qualificatif,
  currentPage,
}: DeleteProps) => {
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    try {
      const response = await dispatch(deleteQualificatifAsync(qualificatif.id));

      console.log(response);

      if ((response?.type as string) === "qualificatifs/delete/rejected") {
        toast.error(response.payload);
      } else if ((response?.type as string) === "qualificatifs/delete/fulfilled") {
        dispatch(fetchQualificatifsPagedAsync({ page: currentPage, size: 5 }));
        toast.success(response.payload);
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
        <p className="py-4">Êtes-vous sûr de vouloir supprimer cet étudiant?</p>
        <div className="modal-action">
          <form method="dialog" className=" space-x-4">
            <button className="btn btn-error" onClick={handleDelete}>
              Supprimer
            </button>
            <button className="btn">Annuler</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default DeleteQualificatifConfirmation;
