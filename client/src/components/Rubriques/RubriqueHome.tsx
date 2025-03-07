/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddRubrique from "./AddRubrique";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { getQuestionsRubrique, getQuestionsStandardAsync, getRubriques, RubriqueQuestion, searchRubriquesAsync, setQuestions } from "../../features/RubriqueSlice";
import { Rubrique } from "../../types/types";
import DetailsRubrique from "./DetailsRubriques";
import UpdateRubrique from "./UpdateRubrique";
import { RootState } from "../../api/store";
import { fetchQuestionsAsync } from "../../features/QuestionSlice";
import DeleteRubriqueConfirmation from "./DeleteRubriqueConfirmation";

const RubriqueHome = () => {
  document.title = "UBO | Rubriques";
  const dispatch = useAppDispatch();
  const rubriques = useAppSelector(getRubriques);
  const questions = useAppSelector(getQuestionsRubrique);
  const allQuestions = useAppSelector(
      (state: RootState) => state.question.questions
    );
  const [questionPass, setQuestionPass] = useState<RubriqueQuestion[]>([])
  const [modal, setModal] = useState<{ rubrique: Rubrique | null; index: number }>({
    rubrique: null,
    index: -1,
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; 
  
  const rubriqueDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dispatch(searchRubriquesAsync({ page, size: pageSize }))
    .unwrap()
    .then((data: { totalPages: React.SetStateAction<number>; }) => {
      setTotalPages(data.totalPages);
    })
    .catch(() => {
      setTotalPages(1);
    });
    dispatch(fetchQuestionsAsync());
  }, [dispatch, page]);

  
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

  return (
    <>
      {/* <ToastContainer theme="colored"/> */}
      <div className="flex flex-col  gap-5 items-center pt-32 mx-auto rounded-s-3xl bg-white w-full h-screen">
        <h1 className="text-xl font-bold">Liste des rubriques</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-[60%] ">
          <div></div>
          <div className="tooltip" data-tip="Ajouter une rubrique">
            <button
              className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
              onClick={() => openModal("addRubrique")}
            >
              +
            </button>
          </div>
        </div>

        <div className="overflow-y-auto w-[50%]">
          <table className="table table-zebra text-base">
            <thead className="text-base">
              <tr>
                <th>Désignantion</th>
                <th>Actions</th>

              </tr>
            </thead>
            <tbody>
              {rubriques.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="uppercase tracking-widest text-center text-gray-500"
                  >
                    Pas de rubriques trouvées.
                  </td>
                </tr>
              ) : (
                rubriques.map((rubrique: Rubrique, index: number) => (

                  <tr key={rubrique.id}>
                    <td className="px-4 py-2 ">{rubrique.designation}</td>
                    <td className="flex gap-3 items-center">

                      <FontAwesomeIcon
                        icon={faEye}
                        className="text-black text-base cursor-pointer"
                        onClick={() => {
                          handleClick(rubrique, index);
                          openModal(`inspect-${index}`);
                        }}
                      />

                      <FontAwesomeIcon
                        icon={faTrash}
                        className="text-black text-base cursor-pointer"
                        onClick={() => openModal(`delete-${index}`)}
                      />
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
                ))
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
