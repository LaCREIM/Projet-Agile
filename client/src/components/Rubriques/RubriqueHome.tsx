import React, { useEffect, useState, useRef } from "react";
import { IoMdAdd } from "react-icons/io";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import AddRubrique from "./AddRubrique";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteRubriqueAsync, getQuestionsRubrique, getQuestionsStandardAsync, getRubriquesAsync, RubriqueQuestion, setQuestions } from "../../features/RubriqueSlice";
import { Rubrique } from "../../types/types";
import { ToastContainer, toast } from "react-toastify";
import { RootState } from "../../api/store";
import DetailsRubrique from "./DetailsRubriques";
import UpdateRubrique from "./UpdateRubrique";

const RubriqueHome = () => {
  document.title = "UBO | Rubriques";
  const dispatch = useAppDispatch();
  const rubriques = useAppSelector((state: RootState) => state.rubriques.rubriques);
  const questions = useAppSelector(getQuestionsRubrique);
  const [questionPass, setQuestionPass] = useState<RubriqueQuestion[]>([])
  const [modal, setModal] = useState<{ rubrique: Rubrique | null; index: number }>({
    rubrique: null,
    index: -1,
  });

  const rubriqueDetailsModalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    dispatch(getRubriquesAsync());
  }, [dispatch]);

  useEffect(() => {
    if (modal.rubrique && rubriqueDetailsModalRef.current) {
      rubriqueDetailsModalRef.current.showModal();
    }

  }, [modal]);

  const openModal = (id: string) => {
    const dialog = document.getElementById(id) as HTMLDialogElement;
    if (dialog) dialog.showModal();
  };

  const handleClick = async (rubrique: Rubrique, index: number) => {
    setModal({ rubrique, index });

    dispatch(setQuestions([]));

    await dispatch(getQuestionsStandardAsync(rubrique.id));
  };

  useEffect(() => {
    console.log("DEBUG - Nouvelle valeur de questions :", questions);
    console.log("DEBUG - Modal rubrique sélectionnée :", modal.rubrique);

    if (modal.rubrique) {
      setQuestionPass(questions.length > 0 ? questions : []);
    }
  }, [questions, modal.rubrique]);


  const handleDelete = async (rubrique: Rubrique, e : React.MouseEvent) => {

    console.log(e);
    
    try {
      const response = await dispatch(deleteRubriqueAsync(rubrique.id));

      if (response?.type == "rubriques/delete/rejected") {
        toast.error(
          "Cette rubrique est déjà utilisée et ne peut pas être supprimée."
        );
      } else if (response?.type == "rubriques/delete/fulfilled") {
        toast.success("Rubrique supprimée avec succès.");
        await dispatch(getRubriquesAsync());
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
        <h1>Liste des rubriques</h1>
        <div className="flex flex-row items-center justify-between gap-5 w-full px-14">
          <button
            className="flex flex-row items-center justify-center gap-5 px-4 py-2 w-[17%] text-center rounded-md border border-black bg-white text-neutral-700 text-md hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
            onClick={() => openModal("addRubrique")}
          >
            <IoMdAdd className="text-black" /> Ajouter une rubrique
          </button>
        </div>

        <div className="overflow-y-auto w-[70%]">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Designantion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rubriques.length === 0 ? (
                <tr>
                  <td colSpan={3} className="uppercase tracking-widest text-center text-gray-500">
                    Pas de rubriques trouvées.
                  </td>
                </tr>
              ) : (
                rubriques.map((rubrique: Rubrique, index: number) => (
                  <tr key={rubrique.id} className="hover:cursor-pointer hover:bg-gray-50 transition-all duration-75">

                    <th className="px-4 py-2">{index + 1}</th>
                    <td className="px-4 py-2">{rubrique.designation}</td>
                    <td className="flex gap-3  items-center">
                      
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
                        onClick={(e) => handleDelete(rubrique, e)}
                      />
                    </td>

                    <dialog id={`updateRubrique-${index}`} className="modal">
                      <UpdateRubrique rubriqueData={rubrique} />
                    </dialog>

                    <dialog id={`inspect-${index}`} className="modal">
                      {modal.rubrique && <DetailsRubrique rubrique={modal.rubrique} questions={questionPass} />}
                    </dialog>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <dialog id="addRubrique" className="modal">
        <AddRubrique />
      </dialog>

    </>
  );
};

export default RubriqueHome;
