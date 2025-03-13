import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddEvaluation from "./AddEvaluation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCopy,
  faEye,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { MdClear } from "react-icons/md";
import {
  duplicateEvaluationAsync,
  fetchEvaluationAsync,
  fetchEvaluationByEtuAsync,
} from "../../features/EvaluationSlice";
import { GetEvaluationDTO } from "../../types/types";
import { RootState } from "../../api/store";
import DeleteEvaluationConfirmation from "./DeleteEvaluationConfirmation";
import DuplicateEvaluationConfirmation from "./DuplicateEvaluationConfirmation";

import { getAllEnseignantAsync } from "../../features/EnseignantSlice";
import {
  getPromotionByEnseignant,
  getPromotionByEnseignantAsync,
} from "../../features/PromotionSlice";
import { etatEvaluationMapper } from "../../mappers/mappers";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const EvaluationHome = () => {
  document.title = "UBO | Évaluations";
  const dispatch = useAppDispatch();
  const evaluations = useAppSelector(
    (state: RootState) => state.evaluations.evaluations
  );
  const enseignants = useAppSelector(
    (state: RootState) => state.enseignants.enseignants
  );
  const promotions = useAppSelector(getPromotionByEnseignant);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const evaluationPerPage = 10;
  const [search, setSearch] = useState<string>("");
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    GetEvaluationDTO[]
  >([]);
  const [sortField, setSortField] = useState<string>("anneeUniversitaire");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [filterEtat, setFilterEtat] = useState<string>("");
  const [filterType, setFilterType] = useState<string>("");
  const totalPages = Math.ceil(filteredEvaluations.length / evaluationPerPage);
  const role = localStorage.getItem("role");
  console.log(promotions);

  useEffect(() => {
    const filtered = evaluations.filter((evaluation) => {
      const matchesSearch = Object.values(evaluation).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      );
      const matchesEtat = filterEtat
        ? evaluation.evaluation.etat === filterEtat
        : true;
      const matchesType = filterType
        ? (filterType === "Personnelle" &&
            evaluation.evaluation.noEnseignant ===
              Number(localStorage.getItem("id"))) ||
          (filterType === "Partagée" &&
            evaluation.evaluation.noEnseignant !==
              Number(localStorage.getItem("id")))
        : true;
      return matchesSearch && matchesEtat && matchesType;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredEvaluations(filtered);
  }, [evaluations, search, sortField, sortOrder, filterEtat, filterType]);

  useEffect(() => {
    if (localStorage.getItem("role") == "ENS") {
      dispatch(fetchEvaluationAsync());
    } else {
      dispatch(fetchEvaluationByEtuAsync());
    }
    dispatch(getAllEnseignantAsync());
    dispatch(getPromotionByEnseignantAsync());
  }, [dispatch]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.close();
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

  const handleInspect = (evaluationId: number) => {
    navigate(`${evaluationId}`);
  };

  const handleDuplicate = (evaluationId: number) => {
    openModal(`duplicate-${evaluationId}`);
  };

  const confirmDuplicate = async (evaluationId: number) => {
    const response = await dispatch(duplicateEvaluationAsync(evaluationId));
    console.log(response);
    if (response.type === "evaluations/duplicateEvaluationAsync/fulfilled") {
      toast.success("L'évaluation a été dupliquée avec succès");
      await dispatch(fetchEvaluationAsync());
    } else {
      toast.error((response.payload as unknown as { message: string }).message);
    }
    closeModal(`duplicate-${evaluationId}`);
  };

  return (
    <>
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1 className="text-xl font-bold">Liste des évaluations</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-[90%] px-14">
          <div className="w-2/3 hover:cursor-text flex flex-row items-center gap-5">
            <label className="input input-bordered flex items-center gap-2 shadow-md w-1/3">
              <input
                type="text"
                className="grow placeholder:font-medium"
                placeholder="Rechercher..."
                value={search}
                onChange={handleSearchChange}
              />
              <FaSearch />
            </label>
            {localStorage.getItem("role") === "ENS" && (
              <>
                <div className="flex items-center gap-3 w-1/2">
                  <select
                    className="select select-bordered grow w-full max-w-xs shadow-md"
                    value={filterEtat}
                    onChange={(e) => setFilterEtat(e.target.value)}
                  >
                    <option value="">Tous les états</option>
                    <option value="ELA">En cours d'élaboration</option>
                    <option value="DIS">Mise en disposition</option>
                    <option value="CLO">Clôturée</option>
                  </select>
                  <div className="tooltip" data-tip="Réinitialiser le filtre">
                    <button
                      onClick={() => setFilterEtat("")}
                      disabled={filterEtat === ""}
                      className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8  hover:cursor-pointer"
                    >
                      <MdClear size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-1/2">
                  <select
                    className="select select-bordered grow w-full max-w-xs shadow-md"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="">Tous les types</option>
                    <option value="Personnelle">Personnelle</option>
                    <option value="Partagée">Partagée</option>
                  </select>
                  <div className="tooltip" data-tip="Réinitialiser le filtre">
                    <button
                      onClick={() => setFilterType("")}
                      disabled={filterType === ""}
                      className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8  hover:cursor-pointer"
                    >
                      <MdClear size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
          {localStorage.getItem("role") === "ENS" && (
            <div className="tooltip" data-tip="Ajouter une évaluation">
              <button
                className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                onClick={() => openModal("addEvaluation")}
              >
                +
              </button>
            </div>
          )}
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
              <th>Type</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvaluations.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="uppercase tracking-widest text-center text-gray-500"
                >
                  Pas d'évaluations trouvées.
                </td>
              </tr>
            ) : (
              paginatedEvaluations.map(
                (evaluation: GetEvaluationDTO, index: number) => (
                  <tr
                    key={index}
                    className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                  >
                    <td className="px-4 py-2">
                      {evaluation.evaluation.anneeUniversitaire}
                    </td>
                    <td className="px-4 py-2">
                      {evaluation.evaluation.nomFormation}
                    </td>
                    <td className="px-4 py-2">
                      {evaluation.evaluation.designation}
                    </td>
                    <td className="px-4 py-2">
                      {evaluation.evaluation.periode}
                    </td>
                    <td className="px-4 py-2">
                      {etatEvaluationMapper(evaluation.evaluation.etat)}
                    </td>
                    <td className="px-4 py-2">
                      {evaluation.evaluation.noEnseignant ===
                      Number(localStorage.getItem("id"))
                        ? "Personnelle"
                        : "Partagée"}
                    </td>
                    <td className="flex gap-3 justify-center items-center">
                      {/* Icône de duplication */}
                      {role == "ENS" && (
                        <>
                          <div
                            className={"tooltip"}
                            data-tip={`${
                              evaluation?.droit?.duplication === "O"
                                ? "Dupliquer l'évaluation"
                                : "Vous n'avez pas le droit de dupliquer cette évaluation"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              className={`text-black text-base cursor-pointer ${
                                evaluation?.droit?.duplication === "O"
                                  ? ""
                                  : "text-gray-400 hover:cursor-not-allowed"
                              }`}
                              onClick={() =>
                                evaluation?.droit?.duplication === "O" &&
                                handleDuplicate(
                                  evaluation.evaluation.idEvaluation
                                )
                              }
                            />
                          </div>
                          <FontAwesomeIcon
                            icon={faEye}
                            className="text-black text-base cursor-pointer"
                            onClick={() =>
                              handleInspect(evaluation.evaluation.idEvaluation)
                            }
                          />
                          <div
                            className={"tooltip"}
                            data-tip={`${
                              evaluation?.droit?.duplication === "O"
                                ? "Vous n'avez pas le droit de supprimer cette évaluation"
                                : evaluation.evaluation.etat === "CLO"
                                ? "Cette évaluation est clôturée et ne peut pas être supprimée"
                                : "Supprimer l'évaluation"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              className={`text-black text-base cursor-pointer ${
                                evaluation?.droit?.duplication === "O" ||
                                evaluation.evaluation.etat === "CLO"
                                  ? "text-gray-400 hover:cursor-not-allowed"
                                  : ""
                              }`}
                              onClick={() => {
                                if (
                                  evaluation?.evaluation.noEnseignant ===
                                    Number(localStorage.getItem("id")) &&
                                  evaluation.evaluation.etat !== "CLO"
                                ) {
                                  openModal(
                                    `delete-${evaluation.evaluation.idEvaluation}`
                                  );
                                }
                              }}
                            />
                          </div>
                        </>
                      )}

                      {/* Icône d'inspection */}

                      {role == "ETU" && (
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="text-black text-base cursor-pointer"
                          onClick={() =>
                            handleInspect(evaluation.evaluation.idEvaluation)
                          }
                        />
                      )}
                    </td>
                    <dialog
                      id={`delete-${evaluation.evaluation.idEvaluation}`}
                      className="modal"
                    >
                      <DeleteEvaluationConfirmation
                        evaluation={evaluation.evaluation}
                      />
                    </dialog>
                    <dialog
                      id={`duplicate-${evaluation.evaluation.idEvaluation}`}
                      className="modal"
                    >
                      <DuplicateEvaluationConfirmation
                        evaluation={evaluation.evaluation}
                        onClose={() =>
                          closeModal(
                            `duplicate-${evaluation.evaluation.idEvaluation}`
                          )
                        }
                        onConfirm={() =>
                          confirmDuplicate(evaluation.evaluation.idEvaluation)
                        }
                      />
                    </dialog>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>

        <div className="flex justify-center items-center gap-4 mt-4">
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
          onClose={() => closeModal("addEvaluation")}
        />
      </dialog>
    </>
  );
};

export default EvaluationHome;
