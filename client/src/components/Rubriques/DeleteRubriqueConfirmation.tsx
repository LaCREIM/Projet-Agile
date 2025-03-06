import { Rubrique } from "../../types/types";
import { useAppDispatch } from "../../hook/hooks";
import { toast } from "react-toastify";
import { deleteRubriqueAsync, getRubriquesAsync } from "../../features/RubriqueSlice";

interface DeleteProps {
  rubrique: Rubrique;
  // currentPage: number;
}

const DeleteRubriqueConfirmation = ({
  rubrique,
//   currentPage,
}: DeleteProps) => {
  const dispatch = useAppDispatch();
  const handleDelete = async ( e : React.MouseEvent) => {
      console.log(e);
      try {
        const response = await dispatch(deleteRubriqueAsync(rubrique.id));
  
        if (response?.type == "rubriques/delete/rejected") {
          toast.error(
            response.payload as string
          );
        } else if (response?.type == "rubriques/delete/fulfilled") {
          toast.success(response.payload as string);
          await dispatch(getRubriquesAsync());
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
        <p className="py-4">Êtes-vous sûr de vouloir supprimer cette rubrique?</p>
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

export default DeleteRubriqueConfirmation;
