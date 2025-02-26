import { useEffect, useState } from "react";
import { Rubrique } from "../../types/types";
import {
  getRubriquesAsync,
  RubriqueQuestion,
  updateRubriqueAsync,
} from "../../features/RubriqueSlice";
import QuestionsList from "./QuestionsList";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useAppDispatch } from "../../hook/hooks";
import { toast, ToastContainer } from "react-toastify";

interface RubriqueDetailsProps {
  rubrique: Rubrique;
  questions: RubriqueQuestion[];
}

export interface QuestionOrderDetails {
  id: number;
  idQuestion: number;
  idRubrique: number;
  ordre: number;
  intitule: string;
  qualificatifMax: string;
  qualificatifMin: string;
}

const DetailsRubrique = ({ rubrique, questions }: RubriqueDetailsProps) => {
  const dispatch = useAppDispatch();
  // État des questions triées
  const [questionsOrder, setQuestionsOrder] = useState<QuestionOrderDetails[]>(
    []
  );
  // État pour gérer l'édition
  const [isEditing, setIsEditing] = useState(false);
  const [rubriqueData, setRubriqueData] = useState({
    ...rubrique,
  });

  useEffect(() => {
    const formattedQuestions = questions.map((q) => ({
      id: q.id,
      idQuestion: q.idQuestion,
      idRubrique: q.idRubrique,
      ordre: q.ordre,
      intitule: q.questionStdDTO.intitule,
      qualificatifMax: q.questionStdDTO.maxQualificatif,
      qualificatifMin: q.questionStdDTO.minQualificatif,
    }));

    setQuestionsOrder(formattedQuestions);
  }, [questions]);

  useEffect(() => {
    setRubriqueData({ ...rubrique });
  }, [rubrique]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isEditing) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQuestionsOrder((prev) => {
      const oldIndex = prev.findIndex(
        (q) => q.idQuestion === Number(active.id)
      );
      const newIndex = prev.findIndex((q) => q.idQuestion === Number(over.id));
      console.log(arrayMove(prev, oldIndex, newIndex));

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handeEdit = async () => {
    if (isEditing === true) {
      const response = await dispatch(
        updateRubriqueAsync({
          id: rubriqueData.id,
          designation: rubriqueData.designation,
        })
      );
      
      if (response.type === "rubriques/update/fulfilled") {
        dispatch(getRubriquesAsync());
        toast.success("Rubrique mise à jour avec succès!");
        setIsEditing(false);
      } else {
        console.error("Échec de la mise à jour de la rubrique");
      }
      setIsEditing(false);
    }else{
      setIsEditing(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRubriqueData({ ...rubriqueData, [name]: value });
  };

  return (
    <>
      <ToastContainer theme="colored" />
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5 hover:cursor-default h-fit">
        <h3 className="font-bold text-center text-lg">
          Détails de la Rubrique {rubrique.designation}
        </h3>

        <div className="text-base font-medium text-gray-900 space-x-1">
          <span className="font-semibold">Désignation :</span>
          {isEditing ? (
            <input
              type="text"
              name="designation"
              value={rubriqueData.designation}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            <span className="mt-1 text-gray-500">
              {rubriqueData.designation}
            </span>
          )}
        </div>

        <div className="text-base font-medium text-gray-900 flex flex-col gap-5">
          <div className="flex flex-row justify-between items-center">
            <span className="font-semibold">Questions :</span>
            {isEditing && (
              <button className="flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200">
                +
              </button>
            )}
          </div>
          {questionsOrder.length > 0 ? (
            <DndContext
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              <QuestionsList questions={questionsOrder} isEditing={isEditing} />
            </DndContext>
          ) : (
            <span>Aucune question disponible.</span>
          )}
        </div>

        {rubrique.noEnseignant && (
          <div className="text-base font-medium text-gray-900">
            <span className="font-semibold">Enseignant :</span>
            <span className="mt-1 text-gray-500">
              {rubrique.noEnseignant.nom} {rubrique.noEnseignant.prenom}
            </span>
          </div>
        )}

        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button
              type="button"
              className="btn btn-neutral"
              onClick={handeEdit}
            >
              {isEditing ? "Enregistrer" : "Modifier"}
            </button>

            <button className="btn" onClick={() => setIsEditing(false)}>
              Fermer
            </button>
          </form>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default DetailsRubrique;
