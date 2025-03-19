


import type React from "react";

import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/hook/hooks.ts";

import AddEvaluation from "./AddEvaluation";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  faCopy,
  faEye,
  faLock,
  faPenToSquare,
  faShareNodes,
  faSquarePollVertical,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {MdClear} from "react-icons/md";
import {
  clouterEvaluationAsync,
  dispositionEvaluationAsync,
  duplicateEvaluationAsync,
  fetchEvaluationAsync,
  fetchEvaluationByEtuAsync,
} from "../../features/EvaluationSlice";

import type { GetEvaluationDTO } from "../../types/types";
import type { RootState } from "../../api/store";

import DeleteEvaluationConfirmation from "./DeleteEvaluationConfirmation";
import DuplicateEvaluationConfirmation from "./DuplicateEvaluationConfirmation";
import {getAllEnseignantAsync} from "../../features/EnseignantSlice";
import {getPromotionByEnseignant, getPromotionByEnseignantAsync,} from "../../features/PromotionSlice";
import {etatEvaluationMapper} from "../../mappers/mappers";
import {FaSearch} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import ClouterEvaluationConfirmation from "./ClouterEvaluationConfirmation";
import DispositionEvaluationConfirmation from "./DispositionEvaluationConfirmation.tsx";
import {LuArrowRight} from "react-icons/lu";

const EvaluationHome = () => {
  document.title = "UBO | Évaluations";
  const dispatch = useAppDispatch();
  const evaluations = useAppSelector<GetEvaluationDTO[]>(
    (state: RootState) => state.evaluations.evaluations
  );
  const enseignants = useAppSelector(
    (state: RootState) => state.enseignants.enseignants
  );
  const promotions = useAppSelector(getPromotionByEnseignant);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const evaluationPerPage = 7;
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
  const id = localStorage.getItem("id");
  
  const [newEvaluationId, setNewEvaluationId] = useState<number | null>(null);
  const prevEvaluationsLength = useRef(evaluations.length);

  // Add this function to handle the clouter action
  const handleClouter = async (evaluationId: number) => {
    openModal(`clouter-${evaluationId}`);
    await dispatch(clouterEvaluationAsync(evaluationId));
  };
  const handleDisposition = async (evaluationId: number) => {
    openModal(`disposition-${evaluationId}`);
    await dispatch(dispositionEvaluationAsync(evaluationId));
  };

  useEffect(() => {
    const filtered = evaluations.filter((evaluation) => {
      const matchesSearch = Object.values(evaluation.evaluation).some((value) =>
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
        const aValue = a.evaluation[sortField as keyof typeof a.evaluation];
        const bValue = b.evaluation[sortField as keyof typeof b.evaluation];
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
    setFilteredEvaluations(filtered);
  }, [evaluations, search, sortField, sortOrder, filterEtat, filterType]);

  // Check for new evaluations
  useEffect(() => {
    if (evaluations.length > prevEvaluationsLength.current) {
      // Find the new evaluation (assuming it's the last one added)
      const newEval = evaluations[evaluations.length - 1];
      setNewEvaluationId(newEval.evaluation.idEvaluation);

      // Reset the highlight after 3 seconds
      setTimeout(() => {
        setNewEvaluationId(null);
      }, 3000);
    }
    prevEvaluationsLength.current = evaluations.length;
  }, [evaluations]);

  useEffect(() => {
    if (localStorage.getItem("role") == "ENS") {
      dispatch(fetchEvaluationAsync());
    } else if (localStorage.getItem("role") == "ETU") {
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
    if (localStorage.getItem("role") === "ENS") navigate(`${evaluationId}`);
    else if (localStorage.getItem("role") === "ETU")
      navigate(`repondre/${evaluationId}`);
  };

  const handleDuplicate = (evaluationId: number) => {
    openModal(`duplicate-${evaluationId}`);
  };

  const confirmDuplicate = async (evaluationId: number) => {
    const response = await dispatch(duplicateEvaluationAsync(evaluationId));
    if (response.type === "evaluations/duplicateEvaluationAsync/fulfilled") {
      await dispatch(fetchEvaluationAsync());
      toast.success("L'évaluation a été dupliquée avec succès");
    } else if (
      response.type === "evaluations/duplicateEvaluationAsync/rejected"
    ) {
      toast.error(
        (response.payload as unknown as { message: string }).message,
        { autoClose: false }
      );
    }
    closeModal(`duplicate-${evaluationId}`);
  };

  return (
    <>
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen text-md overflow-y-auto">
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
                    <option value="DIS">Mise à disposition</option>
                    <option value="CLO">Clôturée</option>
                  </select>
                  <div className="tooltip" data-tip="Réinitialiser le filtre">
                    <button
                      onClick={() => setFilterEtat("")}
                      disabled={filterEtat === ""}
                      className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8 hover:cursor-pointer"
                    >
                      <MdClear size={20} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-1/2">
                  <form className="filter flex gap-2">
                    <input
                      className="btn btn-square rounded-full"
                      type="reset"
                      value="×"
                      onClick={() => setFilterType("")}
                      disabled={filterType === ""}
                    />

                    <input
                      className="btn rounded-full checked:bg-neutral-900 checked:text-white"
                      type="radio"
                      name="frameworks"
                      aria-label="Personnelle"
                      checked={filterType === "Personnelle"}
                      onChange={() => setFilterType("Personnelle")}
                    />
                    <input
                      className="btn rounded-full checked:bg-neutral-900 checked:text-white"
                      type="radio"
                      name="frameworks"
                      aria-label="Partagée"
                      checked={filterType === "Partagée"}
                      onChange={() => setFilterType("Partagée")}
                    />
                  </form>
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
              {localStorage.getItem("role") === "ETU" && (
                <>
                  <th onClick={() => handleSortChange("nomEnseignant")}>
                    Enseignant{" "}
                    {sortField === "nomEnseignant" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                </>
              )}
              <th onClick={() => handleSortChange("designation")}>
                Désignation{" "}
                {sortField === "designation" &&
                  (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSortChange("periode")}>
                Période{" "}
                {sortField === "periode" && (sortOrder === "asc" ? "↑" : "↓")}
              </th>
              {localStorage.getItem("role") === "ENS" ? (
                <>
                  <th onClick={() => handleSortChange("etat")}>
                    État{" "}
                    {sortField === "etat" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Type</th>
                </>
              ) : (
                <>
                  <th onClick={() => handleSortChange("debutReponse")}>
                    Date de début{" "}
                    {sortField === "debutReponse" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSortChange("finReponse")}>
                    Date de fin{" "}
                    {sortField === "finReponse" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                </>
              )}

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
                    className={
                      evaluation.evaluation.noEvaluation == 99
                        ? "bg-red-100!"
                        : ""
                    }
                  >
                    <td className="px-4 py-2">
                      {evaluation.evaluation.anneeUniversitaire}
                    </td>
                    {}

                    {localStorage.getItem("role") === "ETU" ? (
                      <>
                        <td className="px-4 py-2">
                          {evaluation.evaluation.codeFormation}
                        </td>
                        <td className="px-4 py-2">
                          {evaluation.evaluation.nomEnseignant}{" "}
                          {evaluation.evaluation.prenomEnseignant}
                        </td>
                      </>
                    ) : (
                      <td className="px-4 py-2">
                        {evaluation.evaluation.nomFormation}
                      </td>
                    )}
                    <td className="px-4 py-2">
                      {evaluation.evaluation.designation}
                    </td>
                    <td className="px-4 py-2">
                      {evaluation.evaluation.periode}
                    </td>
                    {localStorage.getItem("role") === "ENS" ? (
                      <>
                        <td className="px-4 py-2">
                          <span
                            className={`badge w-fit h-fit  text-white ${
                              evaluation.evaluation.etat === "DIS"
                                ? "badge-success"
                                : evaluation.evaluation.etat === "ELA"
                                ? "badge bg-blue-400"
                                : "badge bg-gray-400"
                            }`}
                          >
                            {etatEvaluationMapper(evaluation.evaluation.etat)}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {evaluation.evaluation.noEnseignant ===
                          Number(localStorage.getItem("id")) ? (
                            <div className="badge badge-success text-white">
                              {"Personnelle"}
                            </div>
                          ) : (
                            <div className="badge badge-warning text-white">
                              {"Partagée"}
                            </div>
                          )}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-2">
                          {evaluation.evaluation.debutReponse}
                        </td>
                        <td className="px-4 py-2">
                          {evaluation.evaluation.finReponse}
                        </td>
                      </>
                    )}

                    <td className="flex gap-3 justify-center items-center">
                      {role == "ENS" && (
                        <>
                          <div
                            className="tooltip"
                            data-tip="Consulter l'évaluation"
                            onClick={() =>
                              handleInspect(evaluation.evaluation.idEvaluation)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-black text-base cursor-pointer"
                            />
                          </div>
                          <div
                            className={"tooltip"}
                            data-tip={`${
                              evaluation?.evaluation.noEnseignant ===
                              Number(localStorage.getItem("id"))
                                ? "Dupliquer l'évaluation"
                                : evaluation?.droit?.duplication === "O"
                                ? "Dupliquer l'évaluation"
                                : "Vous n'avez pas le droit de dupliquer cette évaluation"
                            }`}
                          >
                            <FontAwesomeIcon
                              icon={faCopy}
                              className={`text-black text-base cursor-pointer ${
                                evaluation?.evaluation.noEnseignant ===
                                  Number(localStorage.getItem("id")) ||
                                evaluation?.droit?.duplication === "O"
                                  ? ""
                                  : "text-gray-400 hover:cursor-not-allowed"
                              }`}
                              onClick={() =>
                                (evaluation?.evaluation.noEnseignant ===
                                  Number(localStorage.getItem("id")) ||
                                  evaluation?.droit?.duplication === "O") &&
                                handleDuplicate(
                                  evaluation.evaluation.idEvaluation
                                )
                              }
                            />
                          </div>
                          <div
                            className="tooltip"
                            data-tip={
                              evaluation.evaluation.noEnseignant != Number(id)
                                ? "Vous n'avez pas le droit de consulter les réponses"
                                : evaluation.evaluation.etat == "ELA"
                                ? "L'évaluation est toujours en cours d'élaboration"
                                : "Consulter les réponses"
                            }
                            onClick={() =>
                              evaluation.evaluation.etat != "ELA" &&
                              navigate(
                                `reponses/${evaluation.evaluation.idEvaluation}`
                              )
                            }
                          >
                            <LuArrowRight
                              size={20}
                              className={`text-black text-base cursor-pointer ${
                                evaluation.evaluation.etat == "ELA"
                                  ? "text-gray-400 hover:cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>

                          <div
                            className="tooltip"
                            data-tip={
                              evaluation.evaluation.etat === "CLO"
                                ? "L'évaluation est déjà clôturée"
                                : evaluation.evaluation.etat === "DIS"
                                ? "L'évaluation est déjà mise à disposition"
                                : evaluation.evaluation.noEnseignant !=
                                  Number(id)
                                ? "Vous n'avez pas le droit de clôturée"
                                : "Cloîtrer l'évaluation"
                            }
                            onClick={() =>
                              evaluation.evaluation.noEnseignant ==
                                Number(id) &&
                              evaluation.evaluation.etat == "DIS" &&
                              handleClouter(evaluation.evaluation.idEvaluation)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faLock}
                              className={`text-black text-base cursor-pointer ${
                                evaluation.evaluation.noEnseignant !=
                                  Number(id) ||
                                evaluation.evaluation.etat != "DIS"
                                  ? "text-gray-400 hover:cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>

                          <div
                            className="tooltip"
                            data-tip={
                              evaluation.evaluation.etat === "CLO"
                                ? "L'évaluation est déjà clôturée"
                                : evaluation.evaluation.etat === "DIS"
                                ? "L'évaluation est déjà mise à disposition"
                                : evaluation.evaluation.noEnseignant !=
                                  Number(id)
                                ? "Vous n'avez pas le droit de mettre à disposition"
                                : "Mettre à disposition l'évaluation"
                            }
                            onClick={() =>
                              evaluation.evaluation.etat == "ELA" &&
                              handleDisposition(
                                evaluation.evaluation.idEvaluation
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faShareNodes}
                              className={`text-black text-base cursor-pointer ${
                                evaluation.evaluation.etat != "ELA" ||
                                evaluation.evaluation.noEnseignant != Number(id)
                                  ? "text-gray-400 hover:cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>
                          <div
                            className="tooltip"
                            data-tip="Consulter les statistiques"
                            onClick={() =>
                              evaluation.evaluation.etat != "ELA" &&
                              navigate(
                                `statistiques/${evaluation.evaluation.idEvaluation}`
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faSquarePollVertical}
                              className={`text-black text-base cursor-pointer ${
                                evaluation.evaluation.etat == "ELA"
                                  ? "text-gray-400 hover:cursor-not-allowed"
                                  : ""
                              }`}
                            />
                          </div>

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

                      {role == "ETU" && (
                        <>
                          <div
                            className="tooltip"
                            data-tip="Répondre à l'évaluation"
                            onClick={() =>
                              handleInspect(evaluation.evaluation.idEvaluation)
                            }
                          >
                            <FontAwesomeIcon
                              icon={faPenToSquare}
                              className="text-black text-base cursor-pointer"
                            />
                          </div>
                          <div
                            className="tooltip"
                            data-tip="Consulter l'évaluation"
                            onClick={() =>
                              navigate(
                                `reponses/etudiant/${evaluation.evaluation.idEvaluation}`
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faEye}
                              className="text-black text-base cursor-pointer"
                            />
                          </div>
                          <div
                            className="tooltip"
                            data-tip="Consulter les statistiques"
                            onClick={() =>
                              navigate(
                                `statistiques/${evaluation.evaluation.idEvaluation}`
                              )
                            }
                          >
                            <FontAwesomeIcon
                              icon={faSquarePollVertical}
                              className="text-black text-base cursor-pointer"
                            />
                          </div>
                        </>
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
                      id={`clouter-${evaluation.evaluation.idEvaluation}`}
                      className="modal"
                    >
                      <ClouterEvaluationConfirmation
                        evaluationId={evaluation.evaluation.idEvaluation}
                        onClose={() =>
                          closeModal(
                            `clouter-${evaluation.evaluation.idEvaluation}`
                          )
                        }
                      />
                    </dialog>
                    <dialog
                      id={`disposition-${evaluation.evaluation.idEvaluation}`}
                      className="modal"
                    >
                      <DispositionEvaluationConfirmation
                        evaluationId={evaluation.evaluation.idEvaluation}
                        onClose={() =>
                          closeModal(
                            `disposition-${evaluation.evaluation.idEvaluation}`
                          )
                        }
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
