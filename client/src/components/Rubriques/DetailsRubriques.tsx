import { useEffect, useState } from "react";
import { Rubrique } from "../../types/types";
import {
  RubriqueQuestion,
} from "../../features/RubriqueSlice";
import QuestionsList from "./QuestionsList";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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

  // État des questions triées
  const [questionsOrder, setQuestionsOrder] = useState<QuestionOrderDetails[]>(
    []
  );
  // État pour gérer l'édition
  const [isEditing, setIsEditing] = useState(false);
   const [rubriqueData, setRubrique] = useState({
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

  const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setRubrique({ ...rubriqueData, [name]: value });
    };

  return (
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
              value={rubrique.designation}
              onChange={handleChange}
              className="input input-bordered"
            />
          ) : (
            <span className="mt-1 text-gray-500">{rubrique.designation}</span>
          )}
        </div>

        <div className="text-base font-medium text-gray-900">
          <span className="font-semibold">Questions :</span>
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
              onClick={() => setIsEditing(!isEditing)}
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
  );
};

export default DetailsRubrique;
