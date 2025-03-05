import { useEffect, useState } from "react";
import { Question, Rubrique } from "../../types/types";
import {
  deleteRubriqueQuestionsAsync,
  getRubriquesAsync,
  RubriqueQuestion,
  updateRubriqueAsync,
  updateRubriqueQuestionsAsync,
} from "../../features/RubriqueSlice";
import QuestionsList from "./QuestionsList";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useAppDispatch } from "../../hook/hooks";
import { toast, ToastContainer } from "react-toastify";

interface RubriqueDetailsProps {
  rubrique: Rubrique;
  questions: RubriqueQuestion[];
  allQuestions: Question[];
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

export interface RequestQuestionOrderDetails {
  idRubrique: number;
  designationRubrique: string;
  idQuestion: number;
  questionStdDTO: {
    idQualificatif: number;
    intitule: string;
    maxQualificatif: string;
    minQualificatif: string;
  };
  ordre: number;
}

const DetailsRubrique = ({
  rubrique,
  questions,
  allQuestions,
}: RubriqueDetailsProps) => {
  const dispatch = useAppDispatch();

  const [questionsOrder, setQuestionsOrder] = useState<QuestionOrderDetails[]>(
    []
  );
  const [newQuestionsOrder, setNewQuestionsOrder] = useState<
    RequestQuestionOrderDetails[]
  >([]);

  const [addQuestion, setAddQuestion] = useState<RequestQuestionOrderDetails[]>(
    []
  );

  const [isEditing, setIsEditing] = useState(false);
  const [rubriqueData, setRubriqueData] = useState({ ...rubrique });

  const [selectedQuestion, setSelectedQuestion] = useState(-1);

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

    const newFormattedQuestions = questions.map((q) => ({
      idRubrique: q.idRubrique,
      designationRubrique: rubrique.designation,
      idQuestion: q.idQuestion,
      questionStdDTO: {
        idQualificatif: q.questionStdDTO.idQualificatif,
        intitule: q.questionStdDTO.intitule,
        maxQualificatif: q.questionStdDTO.maxQualificatif,
        minQualificatif: q.questionStdDTO.minQualificatif,
      },
      ordre: q.ordre,
    }));

    setNewQuestionsOrder(newFormattedQuestions);
  }, [questions, rubrique.designation]);

  useEffect(() => {
    setRubriqueData({ ...rubrique });
  }, [rubrique]);

  const handleDragEnd = async (event: DragEndEvent) => {
    if (!isEditing) return;

    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQuestionsOrder((prev) => {
      const oldIndex = prev.findIndex(
        (q) => q.idQuestion === Number(active.id)
      );
      const newIndex = prev.findIndex((q) => q.idQuestion === Number(over.id));

      const updatedOrder = arrayMove(prev, oldIndex, newIndex);
      console.log("Updated order:", updatedOrder);

      return updatedOrder;
    });
  };

  useEffect(() => {
    const newQuestionsOrder: RequestQuestionOrderDetails[] = questionsOrder.map(
      (q, idx) => ({
        idRubrique: q.idRubrique,
        designationRubrique: "Rubrique par défaut",
        idQuestion: q.idQuestion,
        questionStdDTO: {
          idQualificatif: -1,
          intitule: q.intitule,
          maxQualificatif: "",
          minQualificatif: "",
        },
        ordre: idx + 1,
      })
    );
    setNewQuestionsOrder(newQuestionsOrder);
  }, [questionsOrder]);

  const handleEdit = async () => {
    if (isEditing) {
      console.log("newQuestionsOrder", newQuestionsOrder);

      const response = await dispatch(
        updateRubriqueQuestionsAsync(newQuestionsOrder)
      );

      const responseDesignation = await dispatch(
        updateRubriqueAsync({
          id: rubriqueData.id,
          designation: rubriqueData.designation,
        })
      );

      dispatch(getRubriquesAsync());

      if (
        response?.type === "rubriques-questions/update/fulfilled" ||
        responseDesignation?.type === "rubriques/update/fulfilled"
      ) {
        toast.success("Rubrique mise à jour avec succès.");
        setIsEditing(false);
      } else {
        console.error("Échec de la mise à jour de la rubrique");
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRubriqueData({ ...rubriqueData, [name]: value });
  };

  const handleAddQuestion = async () => {
    console.log("Selected question:", selectedQuestion);

    if (selectedQuestion === -1) return;

    const questionToAdd = unusedQuestions.find(
      (q) => q.id === Number(selectedQuestion)
    );

    if (!questionToAdd) return;

    const newQuestion: RequestQuestionOrderDetails = {
      idRubrique: rubrique.id,
      designationRubrique: rubrique.designation,
      idQuestion: questionToAdd.id,
      questionStdDTO: {
        idQualificatif: questionToAdd.idQualificatif.id,
        intitule: questionToAdd.intitule,
        maxQualificatif: questionToAdd.idQualificatif.maximal,
        minQualificatif: questionToAdd.idQualificatif.minimal,
      },
      ordre: questionsOrder.length + 1,
    };

    setUnusedQuestions(unusedQuestions.filter((q) => q.id !== questionToAdd.id));
    setAddQuestion((prev) => [...prev, newQuestion]);


    const res = await dispatch(updateRubriqueQuestionsAsync([newQuestion]));

    if (res?.type === "rubriques-questions/update/fulfilled") {
      setQuestionsOrder((prev) => [
        ...prev,
        {
          id: questionToAdd.id,
          idQuestion: questionToAdd.id,
          idRubrique: rubrique.id,
          ordre: prev.length + 1,
          intitule: questionToAdd.intitule,
          qualificatifMax: questionToAdd.idQualificatif.maximal,
          qualificatifMin: questionToAdd.idQualificatif.minimal,
        },
      ]);
    } else {
      toast.error("Erreur lors de l'ajout de la question.");
    }

    // Réinitialisation de la sélection
    setSelectedQuestion(-1);
  };

  const handleRemoveQuestion = async (
    idRubrique: number,
    idQuestion: number
  ) => {
    const response = await dispatch(
      deleteRubriqueQuestionsAsync({ idRubrique, idQuestion })
    );

    if (response?.type === "rubriques-questions/delete/fulfilled") {
      setQuestionsOrder((prev) => {
        const updatedOrder = prev
          .filter((q) => q.idQuestion !== idQuestion)
          .map((q, index) => ({ ...q, ordre: index + 1 }));

        return updatedOrder;
      });

      setNewQuestionsOrder((prev) => {
        const updatedNewOrder = prev
          .filter((q) => q.idQuestion !== idQuestion)
          .map((q, index) => ({ ...q, ordre: index + 1 }));

        return updatedNewOrder;
      });

      toast.success(response?.payload as string);
    } else if (response?.type === "rubriques-questions/delete/rejected") {
      toast.error(response?.payload as string);
    }
  };

  const [unusedQuestions, setUnusedQuestions] = useState(
    allQuestions.filter(
      (q) => !questions.some((usedQ) => usedQ.idQuestion === q.id)
    )
  );

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5 hover:cursor-default h-fit">
        <h3 className="font-bold text-center text-lg">
          Détails de la Rubrique
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
          <div className="flex flex-col gap-3">
            <span className="font-semibold">Questions :</span>
            {isEditing && (
              <div className="flex flex-row items-center justify-between gap-3">
                <select
                  value={selectedQuestion}
                  onChange={(e) => setSelectedQuestion(Number(e.target.value))}
                  className="select select-bordered"
                >
                  <option value={-1}>Sélectionner une question</option>
                  {unusedQuestions.map((q) => (
                    <option key={q.id} value={q.id}>
                      {q.intitule}
                    </option>
                  ))}
                </select>
                <div
                  className="tooltip tooltip-left"
                  data-tip="Associer la question"
                >
                  <button
                    disabled={selectedQuestion === -1}
                    className="disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200"
                    onClick={handleAddQuestion}
                  >
                    +
                  </button>
                </div>
              </div>
            )}
          </div>

          {questionsOrder.length > 0 ? (
            <DndContext
              onDragEnd={handleDragEnd}
              collisionDetection={closestCorners}
            >
              <QuestionsList
                questions={questionsOrder}
                isEditing={isEditing}
                handleDeleteQuestion={handleRemoveQuestion}
              />
            </DndContext>
          ) : (
            <span>Aucune question disponible.</span>
          )}
        </div>

        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button
              type="button"
              className="btn btn-neutral"
              onClick={handleEdit}
            >
              {isEditing ? "Enregistrer" : "Modifier"}
            </button>

            <button className="btn">Fermer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DetailsRubrique;
