import { useEffect, useState, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddQuestion from "./AddQuestion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteQuestionAsync, fetchQuestionsAsync } from "../../features/QuestionSlice";
import { Question } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import { RootState } from "../../api/store";
import DetailsQuestion from "./DetailsQuestion";
import UpdateQuestion from "./UpdateQuestion";

const QuestionHome = () => {
  document.title = "UBO | Questions";
  const dispatch = useAppDispatch();
  const questions = useAppSelector((state: RootState) => state.question.questions);
  const [modal, setModal] = useState<{ question: Question | null; index: number }>({
    question: null,
    index: -1,
  });

  const [modalUpdate, setModalUpdate] = useState<{ question: Question | null; index: number }>({
    question: null,
    index: -1,
  });

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

  const handleClick = (question: Question, index: number) => {
    setModal({ question, index });
  };

  const handleClickUpdate = (question: Question, index: number) => {
    setModalUpdate({ question, index });
  };

  const handleDelete = async (question: Question, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await dispatch(deleteQuestionAsync(question.id));
  
      if (response?.payload === "La question est deja utilisée.") {
        toast.error("Cette question est déjà utilisée et ne peut pas être supprimée.");
      } else if (response?.payload === "La question a été supprimée avec succès.") {
        toast.success("Question supprimée avec succès.");
  
        // Rafraîchir la liste des questions
        const refreshResponse = await dispatch(fetchQuestionsAsync());
        if (refreshResponse?.payload) {
          console.log("Liste des questions rafraîchie :", refreshResponse.payload);
        } else {
          console.warn("Échec du rafraîchissement.");
        }
      }
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      toast.error("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <>
      <ToastContainer theme="colored" />
      <div className="flex flex-col gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1>Liste des questions</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-full px-14">
          <button
            className="flex flex-row items-center justify-center gap-5 px-4 py-2 w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={() => openModal("addQuestion")}
          >
            <IoMdAdd className="text-black" /> Ajouter une question
          </button>
        </div>

        <div className="overflow-y-auto w-[90%]">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Type</th>
                <th>Intitulé</th>
                <th>Qualificatif</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="uppercase tracking-widest text-center text-gray-500">
                    Pas de questions trouvées.
                  </td>
                </tr>
              ) : (
                questions.map((question: Question, index: number) => (
                  <tr key={question.id} className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75">
                    <td className="px-4 py-2">{question.type || "N/A"}</td>
                    <td className="px-4 py-2">{question.intitule || "N/A"}</td>
                    <td className="px-4 py-2">
                      {question.idQualificatif?.maximal + " - "+ question.idQualificatif.minimal|| "N/A"}
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
                        icon={faEye}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClick(question, index);
                          openModal(`inspect-${index}`);
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={(e) => handleDelete(question, e)}
                      />
                    </td>

                    {/* Modal de mise à jour */}
                    <dialog id={`updateQuestion-${index}`} className="modal">
                       <UpdateQuestion questionData={question} /> 
                    </dialog>

                    <dialog id={`inspect-${index}`} className="modal">
                {modal.question && <DetailsQuestion question={modal.question} />}
              </dialog>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="addQuestion" className="modal">
        <AddQuestion />
      </dialog>
    </>
  );
};

export default QuestionHome;
