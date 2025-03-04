import { toast } from "react-toastify";
import { deleteEtudiantAsync } from "../../features/EtudiantSlice";
import { Etudiant } from "../../types/types";
import { useAppDispatch } from "../../hook/hooks";

interface DeleteProps {
  etudiant: Etudiant;
  handleFetchByPage: (page: number) => void;
  currentPage: number;
}

const DeleteEtudiantConfirmation = ({
  etudiant,
  handleFetchByPage,
  currentPage,
}: DeleteProps) => {
  const dispatch = useAppDispatch();
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await dispatch(deleteEtudiantAsync(etudiant.noEtudiant));
      console.log(response);

      console.log(e);
      handleFetchByPage(currentPage);
      if (response?.type === "etudiants/deleteEtudiantAsync/rejected") {
        toast.error(response.payload);
      } else if (response?.type === "etudiants/deleteEtudiantAsync/fulfilled") {
        toast.success(response.payload);
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la suppression.");
      console.error("Erreur lors de la suppression :", error);
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

export default DeleteEtudiantConfirmation;
