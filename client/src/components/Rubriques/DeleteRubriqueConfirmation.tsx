import { Rubrique } from "../../types/types";
import { useAppDispatch } from "../../hook/hooks";
import { toast } from "react-toastify";
import { deleteRubriqueAsync, searchRubriquesAsync } from "../../features/RubriqueSlice";

interface DeleteProps {
  rubrique: Rubrique;
  // currentPage: number;
}

const DeleteRubriqueConfirmation = ({
  rubrique,
//   currentPage,
}: DeleteProps) => {
  const idEns = localStorage.getItem("id");
  const role = localStorage.getItem("role");
  const dispatch = useAppDispatch();
  const handleDelete = async (e: React.MouseEvent) => {
    console.log(e);
  
    // Vérification des autorisations avant la suppression
    if (role === "ENS" && rubrique.noEnseignant !== Number(idEns)) {
      toast.error("Vous n'avez pas l'autorisation de supprimer cette rubrique.");
      return;
    }
  
    try {
      const response = await dispatch(deleteRubriqueAsync(rubrique.id));
  
      if (response?.type === "rubriques/delete/rejected") {
        toast.error(response.payload as string);
      } else if (response?.type === "rubriques/delete/fulfilled") {
        toast.success("Rubrique supprimée avec succès.");
  
        if (idEns) {
          await dispatch(searchRubriquesAsync({ enseignantId: idEns, page: 0, size: 10 }));
        } else {
          toast.error("ID de l'enseignant non trouvé.");
        }
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
        <p className="py-4 text-base">
          Êtes-vous sûr de vouloir supprimer la rubrique :{" "}
          <b> {rubrique.designation}</b>?
        </p>
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
