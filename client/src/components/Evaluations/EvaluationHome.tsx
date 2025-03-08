import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddEvaluation from "./AddEvaluation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  fetchEvaluationAsync,
  // getQuestionPersoAsync,
} from "../../features/EvaluationSlice";
import { Enseignant, EvaluationDTO, Promotion } from "../../types/types";
import { ToastContainer } from "react-toastify";
import { RootState } from "../../api/store";
// import UpdateEvaluation from "./UpdateEvaluation";
import DeleteEvaluationConfirmation from "./DeleteEvaluationConfirmation";
import {
  getAllEnseignant,
  getAllEnseignantAsync,
} from "../../features/EnseignantSlice";
import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";
import { etatEvaluationMapper } from "../../mappers/mappers";
import { FaSearch } from "react-icons/fa";

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
  const [search, setSearch] = useState<string>("");
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    EvaluationDTO[]
  >([]);
  const [sortField, setSortField] = useState<string>("anneeUniversitaire");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const totalPages = Math.ceil(filteredEvaluations.length / evaluationPerPage);


  useEffect(() => {
    let filtered = evaluations.filter((evaluation) =>
      Object.values(evaluation).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredEvaluations(filtered);
  }, [evaluations, search, sortField, sortOrder]);

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

  const paginatedEvaluations = filteredEvaluations.slice(
    (currentPage - 1) * evaluationPerPage,
    currentPage * evaluationPerPage
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des evaluations</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-[90%] px-14">
          <div className="w-1/3 block hover:cursor-text">
            <label className="input input-bordered flex items-center gap-2 shadow-md">
              <input
                type="text"
                className="grow placeholder:font-medium"
                placeholder="Rechercher..."
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch />
            </label>
          </div>
          <div className="tooltip" data-tip="Ajouter une évaluation">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addEvaluation")}
            >
              +
            </button>
          </div>
        </div>

        <table className="table table-zebra w-[85%]">
          <thead>
            <tr>
              <th onClick={() => handleSortChange("anneeUniversitaire")}>
                Année universitaire{" "}
                {sortField === "anneeUniversitaire" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSortChange("nomFormation")}>
                Formation{" "}
                {sortField === "nomFormation" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSortChange("designation")}>
                Désignation{" "}
                {sortField === "designation" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSortChange("periode")}>
                Période{" "}
                {sortField === "periode" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSortChange("etat")}>
                État {sortField === "etat" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="uppercase tracking-widest text-center text-gray-500"
                >
                  Pas d'évaluations trouvées.
                </td>
              </tr>
            ) : (
              filteredEvaluations.map(
                (evaluation: EvaluationDTO, index: number) => (
                  <tr
                    key={index}
                    className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                  >
                    <td className="px-4 py-2">
                      {evaluation.anneeUniversitaire}
                    </td>
                    <td className="px-4 py-2">{evaluation.nomFormation}</td>
                    <td className="px-4 py-2">{evaluation.designation}</td>
                    <td className="px-4 py-2">{evaluation.periode}</td>
                    <td className="px-4 py-2">
                      {etatEvaluationMapper(evaluation.etat)}
                    </td>
                    <td className="flex gap-3 justify-center items-center">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClickUpdate(index);
                          openModal(
                            `updateEvaluation-${evaluation.idEvaluation}`
                          );
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={() => openModal(`delete-${evaluation.idEvaluation}`)}
                      />
                    </td>
                    <dialog
                      id={`delete-${evaluation.idEvaluation}`}
                      className="modal"
                    >
                      <DeleteEvaluationConfirmation
                        evaluation={evaluation}
                      />
                    </dialog>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>

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
