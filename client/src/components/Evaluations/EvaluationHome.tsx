import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddEvaluation from "./AddEvaluation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { MdClear } from "react-icons/md";

import { fetchEvaluationAsync } from "../../features/EvaluationSlice";
import { Enseignant, EvaluationDTO, Promotion } from "../../types/types";
import { RootState } from "../../api/store";
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
import { useNavigate } from "react-router-dom";

const EvaluationHome = () => {
  document.title = "UBO | Évaluations";
  const dispatch = useAppDispatch();
  const evaluations = useAppSelector(
    (state: RootState) => state.evaluations.evaluations
  );
  const enseignants = useAppSelector<Enseignant[]>(getAllEnseignant);
  const promotions = useAppSelector<Promotion[]>(getPromotions);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const evaluationPerPage = 10;
  const [search, setSearch] = useState<string>("");
  const [filteredEvaluations, setFilteredEvaluations] = useState<
    EvaluationDTO[]
  >([]);
  const [sortField, setSortField] = useState<string>("anneeUniversitaire");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [filterEtat, setFilterEtat] = useState<string>("");
  const totalPages = Math.ceil(filteredEvaluations.length / evaluationPerPage);

  useEffect(() => {
    let filtered = evaluations.filter((evaluation) => {
      // Filtre par recherche
      const matchesSearch = Object.values(evaluation).some((value) =>
        value?.toString().toLowerCase().includes(search.toLowerCase())
      );

      // Filtre par état
      const matchesEtat = filterEtat ? evaluation.etat === filterEtat : true;

      return matchesSearch && matchesEtat;
    });

    // Tri des évaluations
    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredEvaluations(filtered);
  }, [evaluations, search, sortField, sortOrder, filterEtat]);

  useEffect(() => {
    dispatch(fetchEvaluationAsync(localStorage.getItem("id")));
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

  return (
    <>
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1 className="text-xl">Liste des évaluations</h1>
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
                <button onClick={() => setFilterEtat("")} disabled={filterEtat === ""} className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8  hover:cursor-pointer">
                  <MdClear size={20} />
                </button>

              </div>
            </div>
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
              paginatedEvaluations.map(
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
                        icon={faEye}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleInspect(evaluation.idEvaluation);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={() =>
                          openModal(`delete-${evaluation.idEvaluation}`)
                        }
                      />
                    </td>
                    <dialog
                      id={`delete-${evaluation.idEvaluation}`}
                      className="modal"
                    >
                      <DeleteEvaluationConfirmation evaluation={evaluation} />
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
          onClose={() => closeModal(`addEvaluation`)}
        />
      </dialog>
    </>
  );
};

export default EvaluationHome;
