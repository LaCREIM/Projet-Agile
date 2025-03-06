import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddQuestion from "./AddQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import {
  fetchQuestionsAsync,
  // getQuestionPersoAsync,
} from "../../features/QuestionSlice";
import { Qualificatif, Question } from "../../types/types";
import { ToastContainer } from "react-toastify";
import { RootState } from "../../api/store";
import UpdateQuestion from "./UpdateQuestion";
import { fetchQualificatifsAsync } from "../../features/QualificatifSlice";
import DeleteQuestionConfirmation from "./DeleteQuestionConfirmation";

const QuestionHome = () => {
  document.title = "UBO | Questions";
  const dispatch = useAppDispatch();
  const questions = useAppSelector(
    (state: RootState) => state.question.questions
  );
  

  
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;
  const totalPages = Math.ceil(questions.length / questionsPerPage);

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
    dispatch(fetchQuestionsAsync());
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

  const paginatedQuestions = questions.slice(
    (currentPage - 1) * questionsPerPage,
    currentPage * questionsPerPage
  );

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des questions</h1>
        <div className="flex flex-row items-center justify-end gap-5 w-[60%] px-14">
          <div className="tooltip" data-tip="Ajouter une question">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addQuestion")}
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-y-auto w-[60%]">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Intitulé</th>
                <th>Qualificatif</th>
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
                paginatedQuestions.map((question: Question, index: number) => (
                  <tr
                    key={question.id}
                    className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75"
                  >
                    <td className="px-4 py-2">{question.intitule || "N/A"}</td>
                    <td className="px-4 py-2">
                      {question?.idQualificatif?.maximal +
                        " - " +
                        question?.idQualificatif?.minimal || "N/A"}
                    </td>
                    <td className="flex gap-3 justify-center items-center">
                      <FontAwesomeIcon
                        icon={faPenToSquare}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClickUpdate(index);
                          openModal(`updateQuestion-${index}`);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={() => openModal(`delete-${index}`)}
                      />
                    </td>

                    {/* Modal pour la mise à jour de la question */}
                    <dialog id={`updateQuestion-${index}`} className="modal">
                      <UpdateQuestion
                        questionData={question}
                        qualificatifs={qualificatifs}
                        onClose={() => closeModal(`updateQuestion-${index}`)} // Fermer le modal
                      />
                    </dialog>

                    {/* Modal pour la suppression de la question */}
                    <dialog id={`delete-${index}`} className="modal">
                      <DeleteQuestionConfirmation
                        question={question}
                        currentPage={currentPage}
                      />
                    </dialog>
                  </tr>
                ))
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
