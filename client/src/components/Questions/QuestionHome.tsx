/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddQuestion from "./AddQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  deleteQuestionAsync,
  fetchQuestionsAsync,
  getQuestionAsync
} from "../../features/QuestionSlice";
import { Qualificatif, Question } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import { RootState } from "../../api/store";
import DetailsQuestion from "./DetailsQuestion";
import UpdateQuestion from "./UpdateQuestion";
import { fetchQualificatifsAsync } from "../../features/QualificatifSlice";

const QuestionHome = () => {
  document.title = "UBO | Questions";
  const dispatch = useAppDispatch();
  const questions = useAppSelector(
    (state: RootState) => state.question.questions
  );
  const [modal, setModal] = useState<{
    question: Question | null;
    index: number;
  }>({
    question: null,
    index: -1,
  });
  const [modalUpdate, setModalUpdate] = useState<{
    question: Question | null;
    index: number;
  }>({
    question: null,
    index: -1,
  });
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

  const updateQuestionModalRef = useRef<HTMLDialogElement | null>(null);
  const questionDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dispatch(fetchQuestionsAsync());
  }, [dispatch]);

  useEffect(() => {
    if (modal.question && questionDetailsModalRef.current) {
      questionDetailsModalRef.current.showModal();
    }

    if (modalUpdate.question && updateQuestionModalRef.current) {
      updateQuestionModalRef.current.showModal();
    }
  }, [modal, modalUpdate]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };
  const closeModal = (id: string) => {
  const dialog = document.getElementById(id) as HTMLDialogElement;
  if (dialog) dialog.close();
};


  const handleClick = (question: Question, index: number) => {
    setModal({ question, index });
  };

  const handleClickUpdate = (question: Question, index: number) => {
    setModalUpdate({ question, index });
  
    // Assure-toi que le modal prend en compte le nouvel état avant de s'afficher
    setTimeout(() => {
      const dialog = document.getElementById("updateQuestionModal") as HTMLDialogElement;
      if (dialog) dialog.showModal();
    }, 100);
  };
  
  
  
  const handleDelete = async (question: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await dispatch(deleteQuestionAsync(question.id));

      console.log(response);

      if (response?.payload === "La question est déjà utilisée.") {
        toast.error(
          "Cette question est déjà utilisée et ne peut pas être supprimée."
        );
      } else {
        toast.success("Question supprimée avec succès.");
        dispatch(fetchQuestionsAsync());
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression.");
    }
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
                          handleClickUpdate(question, index);
                          openModal(`updateQuestion-${index}`);
                        }}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={(e) => handleDelete(question, e)}
                      />
                    </td>
                    
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
      <dialog id="updateQuestionModal" className="modal" ref={updateQuestionModalRef}>
          {modalUpdate.question ? (
            <UpdateQuestion
              key={modalUpdate.question.id} // Clé unique pour forcer le re-render
              questionData={modalUpdate.question}
              qualificatifs={qualificatifs}
            />
          ) : null}
        </dialog>


      <dialog id="addQuestion" className="modal">
        <AddQuestion qualificatifs={qualificatifs} />
      </dialog>
    </>
  );
};


export default QuestionHome;
