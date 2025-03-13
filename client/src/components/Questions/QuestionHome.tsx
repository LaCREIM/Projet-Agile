/* eslint-disable prefer-const */
import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "../../hook/hooks";
import AddQuestion from "./AddQuestion";
import { getAllQuestionsPersoAsync} from "../../features/QuestionSlice";
import {Qualificatif, Question} from "../../types/types";
import {RootState} from "../../api/store";
import {fetchQualificatifsAsync} from "../../features/QualificatifSlice";
//import {typeQuestionMapper} from "../../mappers/mappers.ts";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPenToSquare, faTrash} from "@fortawesome/free-solid-svg-icons";
import UpdateQuestion from "./UpdateQuestion.tsx";
import DeleteQuestionConfirmation from "./DeleteQuestionConfirmation.tsx";
import {FaSearch} from "react-icons/fa";
import {MdClear} from "react-icons/md";

const QuestionHome = () => {
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('id');
  document.title = "UBO | Questions";
  const dispatch = useAppDispatch();
  const questions = useAppSelector(
      (state: RootState) => state.question.questions
  );

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const [search, setSearch] = useState<string>("");
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [sortField, setSortField] = useState<string>("intitule");
  const [sortOrder, setSortOrder] = useState<string>("asc");
  const [selectedType, setSelectedType] = useState<string>("");
  const totalPages = Math.ceil(filteredQuestions.length / questionsPerPage);

  const [qualificatifs, setQualificatifs] = useState<Qualificatif[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const qualificatifsData = await dispatch(fetchQualificatifsAsync());
      if (Array.isArray(qualificatifsData?.payload))
        setQualificatifs(qualificatifsData.payload);
    };

    fetchData();
  }, [dispatch]);
  
  useEffect(() => {
    const userId = localStorage.getItem('id');
    const id = role === "ADM" ? 0 : Number(userId);

    dispatch(getAllQuestionsPersoAsync({ idEnseignant: Number(id) }));
    
    //console.log("🔎 questions state:", questions); // Vérifie si l'état initial est bien peuplé
}, [dispatch, role, userId]);



  useEffect(() => {
    let filtered = questions.filter((question) => {
      // Filter by search
      const matchesSearch = Object.values(question).some((value) =>
          value?.toString().toLowerCase().includes(search.toLowerCase())
      );

      // Filter by type
      const matchesType = selectedType ? question.type === selectedType : true;

      return matchesSearch && matchesType;
    });

    // Sort questions
    if (sortField) {
      filtered.sort((a, b) => {
        if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredQuestions(filtered);
  }, [questions, search, sortField, sortOrder, selectedType]);

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
          `updateQuestion-${index}`
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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortChange = (field: string) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const paginatedQuestions = filteredQuestions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
);

  return (
      <>
        <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
          <h1 className="text-xl font-bold">Liste des questions</h1>
          <div className={`flex flex-row items-center justify-between gap-5 px-14 ${role == "ADM" ? "w-[55%]" : "w-[80%]"}`}>
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
              {role == "ENS" && <div className="flex items-center gap-3 w-1/2">
                <select
                    className="select select-bordered grow w-full max-w-xs shadow-md"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="">Tous les types</option>
                  <option value="QUP">Questions personnelles</option>
                  <option value="QUS">Questions standard</option>
                </select>
                <div className="tooltip" data-tip="Réinitialiser le filtre">
                  <button onClick={() => setSelectedType("")} disabled={selectedType === ""} className="flex justify-center items-center rounded-full disabled:cursor-not-allowed disabled:text-gray-400 w-8  hover:cursor-pointer">
                    <MdClear size={20} />
                  </button>
                </div>
              </div>}
            </div>
            <div className="tooltip" data-tip="Ajouter une question">
              <button
                  className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                  onClick={() => openModal("addQuestion")}
              >
                +
              </button>
            </div>
          </div>

          <div className="overflow-y-auto w-full">
            <table className={`table table-zebra  mx-auto ${role == "ADM" ? "w-[50%]" : "w-[80%]"}`}>
              <thead>
              <tr>
                <th  className={"w-1/3"} onClick={() => handleSortChange("intitule")}>
                  Intitulé{" "}
                  {sortField === "intitule" &&
                      (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th>
                  Qualificatifs{" "}
                </th>
                {role == "ENS" && <th>
                  Type
                </th>}
                <th className="text-center">Actions</th>
              </tr>
              </thead>
              <tbody>
              {paginatedQuestions.length === 0 ? (
                  <tr>
                    <td
                        colSpan={6}
                        className="uppercase tracking-widest text-center text-gray-500"
                    >
                      Pas de questions trouvées.
                    </td>
                  </tr>
              ) : (
                  paginatedQuestions.map((question: Question, index: number) => {
                    const isEnseneigentQuestionPerso = role == "ENS" && question.type === "QUS";
                    console.log("🔎 question", question);
                    return (
                        <tr
                            key={question.idQuestion}
                            className=" transition-all duration-75 "
                        >
                          <td className="px-4 py-2 w-[20%]">
                            {question.intitule || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {question?.maxQualificatif +
                                " - " +
                                question?.minQualificatif || "N/A"}
                          </td>
                          {
                              role == "ENS" && <td className="px-4 py-2 ">
                                {question.noEnseignant ? (
                                    <div className="badge badge-accent text-white">
                                      {"Question personnel"} 
                                    </div>
                                ) : (
                                    <div className="badge badge-success text-white">
                                       {"Question standard"} 
                                    </div>
                                )}
                              </td>
                          }

                          <td className="flex gap-3 justify-center items-center">
                            <div className="tooltip"
                                 data-tip={isEnseneigentQuestionPerso ? "Vous ne pouvez pas modifier une question standard" : "Modifier"}>
                              <FontAwesomeIcon
                                  icon={faPenToSquare}
                                  className={`text-black text-base cursor-pointer ${isEnseneigentQuestionPerso ? "text-gray-400 cursor-not-allowed" : ''}`}
                                  onClick={() => {
                                    if (!isEnseneigentQuestionPerso) {
                                      handleClickUpdate(index);
                                      openModal(`updateQuestion-${index}`);
                                    }
                                  }}
                              />
                            </div>
                            <div className="tooltip"
                                 data-tip={isEnseneigentQuestionPerso ? "Vous ne pouvez pas supprimer une question standard" : "Supprimer"}>
                              <FontAwesomeIcon
                                  icon={faTrash}
                                  className={`text-black text-base cursor-pointer ${isEnseneigentQuestionPerso ? "text-gray-400 cursor-not-allowed" : ''}`}
                                  onClick={() => {
                                    if (!isEnseneigentQuestionPerso) {
                                      openModal(`delete-${index}`);
                                    }
                                  }}
                              />
                            </div>
                          </td>

                          <dialog id={`updateQuestion-${index}`} className="modal">
                            <UpdateQuestion
                                questionData={question}
                                qualificatifs={qualificatifs}
                                onClose={() => closeModal(`updateQuestion-${index}`)}
                            />
                          </dialog>

                          <dialog id={`delete-${index}`} className="modal">
                            <DeleteQuestionConfirmation
                                idEns={Number(userId)}
                                question={question}
                                currentPage={currentPage}
                            />
                          </dialog>
                        </tr>
                    );
                  })
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

        <dialog id="addQuestion" className="modal">
          <AddQuestion
              qualificatifs={qualificatifs}
              onClose={() => closeModal(`addQuestion`)}
          />
        </dialog>
      </>
  );
};

export default QuestionHome;