/* eslint-disable @typescript-eslint/no-unused-expressions */

import {useEffect, useRef, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hook/hooks";
import AddRubrique from "./AddRubrique";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faTrash} from "@fortawesome/free-solid-svg-icons";
import {
  getQuestionsRubrique,
  getQuestionsStandardAsync,
  getRubriques,
  RubriqueQuestion,
  searchRubriquesAsync,
  setQuestions,
} from "../../features/RubriqueSlice";
import {Rubrique} from "../../types/types";
import DetailsRubrique from "./DetailsRubriques";
import UpdateRubrique from "./UpdateRubrique";
import {RootState} from "../../api/store";
import {fetchQuestionsAsync} from "../../features/QuestionSlice";
import DeleteRubriqueConfirmation from "./DeleteRubriqueConfirmation";
import {MdClear} from "react-icons/md";
import {typeRubriqueMapper} from "../../mappers/mappers.ts";
import {useSelector} from "react-redux";
import {FaSearch} from "react-icons/fa";

const RubriqueHome = () => {
  document.title = "UBO | Rubriques";
  const dispatch = useAppDispatch();
  const rubriques = useSelector(getRubriques);
  const questions = useAppSelector(getQuestionsRubrique);
  const allQuestions = useAppSelector(
    (state: RootState) => state.question.questions
  );
  const [questionPass, setQuestionPass] = useState<RubriqueQuestion[]>([]);
  const [modal, setModal] = useState<{
    rubrique: Rubrique | null;
    index: number;
  }>({
    rubrique: null,
    index: -1,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const [search, setSearch] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Rubrique>("designation");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedType, setSelectedType] = useState<string>("");
  const [filteredRubriques, setFilteredRubriques] = useState<Rubrique[]>([]);
  const role = localStorage.getItem("role");
  const rubriqueDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    const id = localStorage.getItem("id");
    let idEns = "";
    role === "ENS" && id ? (idEns = id) : (idEns = "0");
    if (id != "0" ) {
      dispatch(
        searchRubriquesAsync({ enseignantId: idEns, page: 0, size: pageSize })
      )
        .unwrap()
        .then((data: Rubrique[]) => {
          setTotalPages(Math.ceil(data.length / pageSize));
        })
        .catch(() => {
          setTotalPages(1);
        });
    } else {
      setTotalPages(1);
    }

    dispatch(fetchQuestionsAsync());
  }, [dispatch, pageSize]);

  useEffect(() => {
    if (modal.rubrique && rubriqueDetailsModalRef.current) {
      rubriqueDetailsModalRef.current.showModal();
    }
  }, [modal]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const closeModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.close();
  };

  const handleClick = async (rubrique: Rubrique, index: number) => {
    setModal({ rubrique, index });

    dispatch(setQuestions([]));

    await dispatch(getQuestionsStandardAsync(rubrique.id));
  };

  useEffect(() => {
    if (modal.rubrique) {
      setQuestionPass(questions.length > 0 ? questions : []);
    }
  }, [questions, modal.rubrique]);
  useEffect(() => {
    if (!rubriques) return; // Si rubriques est undefined, ne rien faire
  
    // Appliquer le filtre
    const filtered = rubriques.filter((rubrique) => {
      const matchesSearch = rubrique.designation
        ?.toLowerCase()
        ?.includes(search.toLowerCase());
  
      const matchesType = selectedType ? rubrique.type === selectedType : true;
  
      return matchesSearch && matchesType;
    });
  
    // Trier les rubriques
    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }
  
    // Mettre à jour le nombre total de pages
    setTotalPages(Math.ceil(filtered.length / pageSize));
  
    // Sélectionner uniquement les rubriques de la page actuelle
    const paginatedRubriques = filtered.slice((page - 1) * pageSize, page * pageSize);
  
    setFilteredRubriques(paginatedRubriques);
  }, [rubriques, search, sortField, sortOrder, selectedType, page, pageSize]);
  

  function handleSortChange(field: string) {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  }

  return (
    <>
      <div className="flex flex-col  gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1 className="text-xl font-bold">Liste des rubriques</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-[75%] ">
          <div className="w-2/3 hover:cursor-text flex flex-row items-center gap-5">
            <label className="input input-bordered flex items-center gap-2 shadow-md w-1/3">
              <input
                type="text"
                className="grow placeholder:font-medium"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => {setPage(1);
                  setSearch(e.target.value)}}
              />
              <FaSearch />
            </label>

            {
              role == "ENS" ? (
                  <>
                    <select
                        className="select select-bordered grow w-full max-w-xs shadow-md"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                    >
                      <option value="">Tous les types</option>
                      <option value="RBS">Rubriques standard</option>
                      <option value="RBP">Rubrique personnelle</option>
                    </select>

            <div className="tooltip" data-tip="Réinitialiser le filtre">
              <button
                onClick={() =>{ setSelectedType(""); setSearch("");}}
                disabled={selectedType === ""}
                className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8  hover:cursor-pointer"
              >
                <MdClear size={20} />
              </button>
            </div>
                  </>
              ) : null
            }
          </div>
          <div className="tooltip" data-tip="Ajouter une rubrique">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addRubrique")}
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-y-auto w-[75%]">
          <table className="table table-zebra text-base">
            <thead className="text-base">
              <tr>
                <th onClick={() => handleSortChange("designation")}>
                  Désignation{" "}
                  {sortField === "designation" &&
                    (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                {role == "ENS" ? (
                  <th onClick={() => handleSortChange("type")}>
                    Type{" "}
                    {sortField === "type" && (sortOrder === "asc" ? "↑" : "↓")}
                  </th>
                ) : null}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRubriques.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas de rubriques trouvées.
                  </td>
                </tr>
              ) : (
                filteredRubriques.map((rubrique: Rubrique, index: number) => {
                  return (
                    <tr key={rubrique.id}>
                      <td className="px-4 py-2 w-[30%]">{rubrique.designation}</td>

                      {role == "ENS" && (
                        <td className="px-4 py-2 ">
                          {rubrique.type === "RBS" ? (
                            <div className="badge badge-success text-white">
                              {typeRubriqueMapper(rubrique.type)}
                            </div>
                          ) : (
                            <div className="badge badge-accent text-white">
                              {typeRubriqueMapper(rubrique.type)}
                            </div>
                          )}
                        </td>
                      )}
                      <td className="flex gap-3 items-center">
                        <div className={"tooltip"} data-tip={"Afficher les détails"}>
                        <FontAwesomeIcon
                          icon={faEye}
                          className="text-black text-base cursor-pointer"
                          onClick={() => {
                            handleClick(rubrique, index);
                            openModal(`inspect-${index}`);
                          }}
                        />
                        </div>
                        <div
                          className="tooltip"
                          data-tip={
                            localStorage.getItem("role") === "ENS" &&
                            rubrique.type === "RBS"
                              ? "Vous n'avez pas le droit de supprimer cette rubrique!"
                              : "Supprimer"
                          }
                        >
                          <FontAwesomeIcon
                            icon={faTrash}
                            className={`text-black text-base cursor-pointer ${
                              localStorage.getItem("role") === "ENS" &&
                              rubrique.type === "RBS"
                                ? "text-gray-400 hover:cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => {
                              if (
                                !(
                                  localStorage.getItem("role") === "ENS" &&
                                  rubrique.type === "RBS"
                                )
                              ) {
                                openModal(`delete-${index}`);
                              }
                            }}
                          />
                        </div>
                      </td>
                      <dialog id={`updateRubrique-${index}`} className="modal">
                        <UpdateRubrique rubriqueData={rubrique} />
                      </dialog>
                      <dialog id={`delete-${index}`} className="modal">
                        <DeleteRubriqueConfirmation rubrique={rubrique} />
                      </dialog>
                      <dialog id={`inspect-${index}`} className="modal">
                        {modal.rubrique && (
                          <DetailsRubrique
                            rubrique={modal.rubrique}
                            questions={questionPass}
                            allQuestions={allQuestions}
                            onClose={() => closeModal(`inspect-${index}`)}
                          />
                        )}
                      </dialog>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="flex justify-center items-center gap-4 mt-4">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Précédent
              </button>
              <span>
                Page {page} sur {totalPages}
              </span>
              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Suivant
              </button>
            </div>

        </div>
      </div>

      <dialog id="addRubrique" className="modal">
        <AddRubrique onClose={() => closeModal("addRubrique")} />
      </dialog>
    </>
  );
};

export default RubriqueHome;
