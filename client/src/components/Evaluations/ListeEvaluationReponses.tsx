import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import {
  getAllReponsesEvaluationAsync, getEvaluation, getEvaluationByIdAsync,
  getReponsesEvaluation,
} from "../../features/EvaluationSlice";
import { FaSearch } from "react-icons/fa";

const ListeEvaluationReponses = () => {
  document.title = "UBO | Réponses des étudiants";
  const { evaluationId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const reponses = useAppSelector(getReponsesEvaluation);
  const evaluation = useAppSelector(getEvaluation);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const reponsesPerPage = 10;

  useEffect(() => {
    dispatch(getAllReponsesEvaluationAsync(Number(evaluationId)));
    dispatch(getEvaluationByIdAsync(Number(evaluationId)));
  }, [dispatch, evaluationId]);

  // Filtrer les réponses en fonction de la recherche
  const filteredReponses = reponses.filter((reponse) => {
    return (
      reponse.idEtudiant.toLowerCase().includes(search.toLowerCase()) ||
      reponse.nomFormation.toLowerCase().includes(search.toLowerCase()) ||
      reponse.promotion.toLowerCase().includes(search.toLowerCase()) ||
      reponse.commentaire.toLowerCase().includes(search.toLowerCase())
    );
  });

  // Trier les réponses en fonction de la colonne sélectionnée
  const sortedReponses = [...filteredReponses].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedReponses.length / reponsesPerPage);

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const paginatedReponses = sortedReponses.slice(
    (currentPage - 1) * reponsesPerPage,
    currentPage * reponsesPerPage
  );

  const handleViewDetails = (reponseId: number) => {
    navigate(`/user/home/evaluations/reponses/etudiant/${reponseId}`); 
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen text-md">
      <h1 className="text-xl font-bold">
        Réponses pour "{evaluation.designation} - {evaluation.codeFormation} : {evaluation.anneeUniversitaire}"
      </h1>

      <div className="flex flex-row w-[85%] gap-5 items-center mx-auto rounded-s-3xl bg-white text-md">
        <div
          className="flex items-center w-[85%] text-left gap-2 px-4 py-2 hover:cursor-pointer"
          onClick={() => navigate("/user/home/evaluations")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Retournez à la liste des évaluations
        </div>

        {/* Barre de recherche */}
        <div className="w-[85%] flex justify-between items-center mb-4">
          <label className="input input-bordered flex items-center gap-2 shadow-md w-1/3">
            <input
              type="text"
              className="grow placeholder:font-medium"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch />
          </label>
        </div>
      </div>
      {/* Bouton "Retournez à la liste des évaluations" */}

      {/* Tableau des réponses */}
      <table className="table table-zebra w-[85%]">
        <thead>
          <tr>
            <th onClick={() => handleSort("idEtudiant")}>
              ID Étudiant{" "}
              {sortField === "idEtudiant" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("nomFormation")}>
              Formation{" "}
              {sortField === "nomFormation" &&
                (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("promotion")}>
              Année universitaire{" "}
              {sortField === "promotion" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th onClick={() => handleSort("commentaire")}>
              Commentaire{" "}
              {sortField === "commentaire" && (sortOrder === "asc" ? "↑" : "↓")}
            </th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedReponses.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="uppercase tracking-widest text-center text-gray-500"
              >
                Aucune réponse trouvée.
              </td>
            </tr>
          ) : (
            paginatedReponses.map((reponse, idx) => (
              <tr key={idx}>
                <td>{reponse.idEtudiant}</td>
                <td>{reponse.nomFormation}</td>
                <td>{reponse.promotion}</td>
                <td>{reponse.commentaire}</td>
                <td className="flex gap-3 justify-center items-center">
                  <div
                    className="tooltip"
                    data-tip="Consulter la réponse"
                    onClick={() =>
                      handleViewDetails(reponse.idReponseEvaluation)
                    }
                  >
                    <FontAwesomeIcon
                      icon={faEye}
                      className="text-black text-base cursor-pointer"
                    />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
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
  );
};

export default ListeEvaluationReponses;
