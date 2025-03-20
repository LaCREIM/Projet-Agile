import {toast} from "react-toastify";
import {deleteEtudiantAsync} from "../../features/EtudiantSlice";
import {Etudiant, PromotionDetails} from "../../types/types";
import {useAppDispatch} from "../../hook/hooks";

interface DeleteProps {
  etudiant: Etudiant;
  handleFetchByPage: (page: number) => void;
  currentPage: number;
  promotionDetails: PromotionDetails;
  pro: PromotionDetails;
  setPro: (pro: PromotionDetails) => void;
}

const DeleteEtudiantConfirmation = ({
  etudiant,
  handleFetchByPage,
  currentPage,
                                      pro,
                                      setPro,
                                      promotionDetails,
}: DeleteProps) => {
  const dispatch = useAppDispatch();
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      const response = await dispatch(deleteEtudiantAsync(etudiant.noEtudiant));
      console.log(response);

      console.log(e);
      if (response?.type === "etudiants/deleteEtudiantAsync/rejected") {
        toast.error("Cet étudiant ne peux pas être supprimé , car il a déjà rempli une évaluation!");
      } else if (response?.type === "etudiants/deleteEtudiantAsync/fulfilled") {
        toast.success(response.payload);
        setPro({anneeUniversitaire: "-1", specialite: "-1"});
     ;
        //
        // if (pro.anneeUniversitaire === "-1") {
        //   await dispatch(getAllEtudiantsAsync());
        // } else {
        //   await dispatch(getEtudiantByPromotionAsync(pro));
        // }
        //
        // if (promotionDetails.anneeUniversitaire === "-1") {
        //   await dispatch(getAllEtudiantsAsync());
        // } else {
        //   await dispatch(getEtudiantByPromotionAsync(promotionDetails));
        // }

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
        <p className="py-4">Êtes-vous sûr de vouloir supprimer l'étudiant : <b>{etudiant.prenom} {etudiant.nom}</b> ?</p>
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

export default DeleteEtudiantConfirmation;
