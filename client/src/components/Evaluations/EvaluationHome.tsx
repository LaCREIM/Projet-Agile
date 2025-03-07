import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddEvaluation from "./AddEvaluation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  fetchEvaluationAsync,
  // getQuestionPersoAsync,
} from "../../features/EvaluationSlice";
import { Enseignant, Evaluation, Promotion } from "../../types/types";
import { ToastContainer } from "react-toastify";
import { RootState } from "../../api/store";
import UpdateEvaluation from "./UpdateEvaluation";
import DeleteEvaluationConfirmation from "./DeleteEvaluationConfirmation";
import {
  getAllEnseignant,
  getAllEnseignantAsync,
} from "../../features/EnseignantSlice";
import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";

const EvaluationHome = () => {
  document.title = "UBO | evaluations";
  const dispatch = useAppDispatch();
  const evaluations = useAppSelector(
    (state: RootState) => state.evaluations.evaluations
  );
  const enseignants = useAppSelector<Enseignant[]>(getAllEnseignant);
  const promotions = useAppSelector<Promotion[]>(getPromotions);

  const [currentPage, setCurrentPage] = useState(1);
  const evaluationPerPage = 10;
  const totalPages = Math.ceil(evaluations.length / evaluationPerPage);

  useEffect(() => {
    dispatch(fetchEvaluationAsync());
    dispatch(getAllEnseignantAsync());
    dispatch(getPromotionAsync());
  }, [dispatch]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.close();
  };

  const handleClickUpdate = (index: number) => {
    setTimeout(() => {
      const dialog = document.getElementById(
        `updateEvaluation-${index}`
      ) as HTMLDialogElement;
      if (dialog) dialog.showModal();
    }, 100);
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const paginatedEvaluations = evaluations.slice(
    (currentPage - 1) * evaluationPerPage,
    currentPage * evaluationPerPage
  );

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des evaluations</h1>
        <div className="flex flex-row items-center justify-end gap-5 w-[60%] px-14">
          <div className="tooltip" data-tip="Ajouter une évaluation">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addEvaluation")}
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-y-auto w-[60%]">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Année universitaire</th>
                <th>Formation</th>
                <th>Désignation</th>
                <th>Période</th>
                <th>État</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEvaluations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas d'évaluations trouvées.
                  </td>
                </tr>
              ) : (
                paginatedEvaluations.map(
                  (evaluation: Evaluation, index: number) => (
                    <tr
                      key={evaluation.id}
                      className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                    >
                      <td className="px-4 py-2">
                        {evaluation.promotion.anneeUniversitaire || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {evaluation.promotion.nomFormation || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {evaluation.designation || "N/A"}
                      </td>
                      <td className="px-4 py-2">
                        {evaluation?.periode || "N/A"}
                      </td>
                      <td className="px-4 py-2">{evaluation?.etat || "N/A"}</td>
                      <td className="flex gap-3 justify-center items-center">
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          className="text-black text-base cursor-pointer"
                          onClick={() => {
                            handleClickUpdate(index);
                            openModal(`updateEvaluation-${index}`);
                          }}
                        />
                        <FontAwesomeIcon
                          icon={faTrash}
                          className="text-black text-base cursor-pointer"
                          onClick={() => openModal(`delete-${index}`)}
                        />
                      </td>

                      {/* Modal pour la mise à jour de la question */}
                      <dialog
                        id={`updateEvaluation-${index}`}
                        className="modal"
                      >
                        <UpdateEvaluation
                          evaluationData={evaluation}
                          onClose={() =>
                            closeModal(`updateEvaluation-${index}`)
                          } // Fermer le modal
                          promotions={promotions}
                          enseignants={enseignants}
                        />
                      </dialog>

                      {/* Modal pour la suppression de la question */}
                      <dialog id={`delete-${index}`} className="modal">
                        <DeleteEvaluationConfirmation
                          evaluation={evaluation}
                          currentPage={currentPage}
                        />
                      </dialog>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="btn"
          >
            Précédent
          </button>
          <span>
            Page {currentPage} sur {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="btn"
          >
            Suivant
          </button>
        </div>
      </div>

      <dialog id="addEvaluation" className="modal">
        <AddEvaluation
          promotions={promotions}
          enseignants={enseignants}
          onClose={() => closeModal(`addEvaluation`)}
        />
      </dialog>
    </>
  );
};

export default EvaluationHome;
