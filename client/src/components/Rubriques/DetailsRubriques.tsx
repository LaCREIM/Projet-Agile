/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import { Question, Rubrique } from "../../types/types";
import {
  deleteRubriqueQuestionsAsync,
  estUtiliseeAsync,
  getEstUtilisee,
  RubriqueQuestion,
  searchRubriquesAsync,
  updateRubriqueAsync,
  updateRubriqueQuestionsAsync,
} from "../../features/RubriqueSlice";
import QuestionsList from "./QuestionsList";
import { closestCorners, DndContext, DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import { toast } from "react-toastify";
import AlertError from "../ui/alert-error";

interface RubriqueDetailsProps {
  rubrique: Rubrique;
  questions: RubriqueQuestion[];
  allQuestions: Question[];
  onClose: () => void;
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
  onClose,
}: RubriqueDetailsProps) => {
  const dispatch = useAppDispatch();

  const [questionsOrder, setQuestionsOrder] = useState<QuestionOrderDetails[]>(
    []
  );
  const [newQuestionsOrder, setNewQuestionsOrder] = useState<
    RequestQuestionOrderDetails[]
  >([]);

  const [unusedQuestions, setUnusedQuestions] = useState(
    allQuestions.filter(
      (q) => !questions.some((usedQ) => usedQ.idQuestion === q.idQuestion)
    )
  );

  const [isEditing, setIsEditing] = useState(false);
  const [rubriqueData, setRubriqueData] = useState({ ...rubrique });
  const [canSave, setCanSave] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedQuestion, setSelectedQuestion] = useState(-1);
  const [pendingQuestions, setPendingQuestions] = useState<
    QuestionOrderDetails[]
  >([]);
  const [removedQuestions, setRemovedQuestions] = useState<number[]>([]); // IDs des questions supprimées
  const estUtilisee = useAppSelector(getEstUtilisee);
  console.log(estUtilisee);

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
    setCanSave(rubriqueData?.designation?.trim() !== "");
    dispatch(estUtiliseeAsync(rubrique.id));
  }, [rubriqueData]);

  useEffect(() => {
    setRubriqueData({ ...rubrique });
  }, [rubrique]);

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

  useEffect(() => {
    const unused = allQuestions.filter(
      (q) => !questions.some((usedQ) => usedQ.idQuestion === q.idQuestion)
    );
    setUnusedQuestions(unused);
  }, [questions, allQuestions]);

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

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing) {
      try {
        let resultAdd = "";
        let resultRem = "";

        // 🛠️ Mettre à jour les questions
        const formattedQuestions = questionsOrder.map((q, idx) => ({
          idRubrique: rubrique.id,
          designationRubrique: rubrique.designation,
          idQuestion: q.idQuestion,
          questionStdDTO: {
            idQualificatif: -1, // Remplace par la vraie valeur si disponible
            intitule: q.intitule,
            maxQualificatif: q.qualificatifMax,
            minQualificatif: q.qualificatifMin,
          },
          ordre: idx + 1,
        }));

        const res = await dispatch(
          updateRubriqueQuestionsAsync(formattedQuestions)
        );
        if (res.type === "rubriques-questions/update/rejected") {
          resultAdd = res.payload as string;
        }

        // 🛠️ Suppression des questions
        if (removedQuestions.length > 0) {
          for (const idQuestion of removedQuestions) {
            const res = await dispatch(
              deleteRubriqueQuestionsAsync({
                idRubrique: rubrique.id,
                idQuestion,
              })
            );
            if (res.type === "rubriques-questions/delete/rejected") {
              resultRem = res.payload as string;
            }
          }
        }

        // 🛠️ Mise à jour de la rubrique
        const rubriqueUpdateRes = await dispatch(
          updateRubriqueAsync({
            id: rubriqueData.id,
            designation: rubriqueData.designation,
          })
        );
        if (rubriqueUpdateRes.type !== "rubriques/update/fulfilled") {
          setError(rubriqueUpdateRes.payload as string);
          return;
        }

        if (resultAdd || resultRem) {
          setError(resultAdd || resultRem);
          return;
        }

        toast.success("Rubrique mise à jour avec succès.", {
          autoClose: 10000,
        });

        // 🔄 Rafraîchir la liste des rubriques
        const idEns = localStorage.getItem("id");
        if (idEns) {
          await dispatch(
            searchRubriquesAsync({ enseignantId: idEns, page: 0, size: 10 })
          );
        }

        setIsEditing(false);
        setError(null);
        onClose();
      } catch (error) {
        setError("Erreur lors de la mise à jour de la rubrique.");
        toast.error("Erreur lors de la mise à jour de la rubrique.");
      }
    } else {
      setIsEditing(true);
      setError(null);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setRubriqueData({ ...rubriqueData, [name]: value });
  };

  const handleAddQuestion = () => {
    if (selectedQuestion === -1) return;

    const questionToAdd = unusedQuestions.find(
      (q) => q.id === Number(selectedQuestion)
    );

    if (!questionToAdd) return;

    const newQuestion: QuestionOrderDetails = {
      id: questionToAdd.id,
      idQuestion: questionToAdd.id,
      idRubrique: rubrique.id,
      ordre: questionsOrder.length + 1,
      intitule: questionToAdd.intitule,
      qualificatifMax: questionToAdd.idQualificatif.maximal,
      qualificatifMin: questionToAdd.idQualificatif.minimal,
    };

    setQuestionsOrder((prev) => [...prev, newQuestion]);
    setPendingQuestions((prev) => [...prev, newQuestion]);
    setUnusedQuestions((prev) => prev.filter((q) => q.id !== questionToAdd.id));
    setSelectedQuestion(-1);
  };

  const handleRemoveQuestion = (idQuestion: number) => {
    setRemovedQuestions((prev) => [...prev, idQuestion]);

    const removedQuestion = allQuestions.find(
      (q) => q.idQuestion === idQuestion
    );
    if (removedQuestion) {
      setUnusedQuestions((prev) => [...prev, removedQuestion]);
    }

    setQuestionsOrder((prev) =>
      prev.filter((q) => q.idQuestion !== idQuestion)
    );
    setNewQuestionsOrder((prev) =>
      prev.filter((q) => q.idQuestion !== idQuestion)
    );
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5 hover:cursor-default h-fit">
        <h3 className="font-bold text-center text-lg">
          Détails de la Rubrique
        </h3>

        <div className="text-base font-medium text-gray-900 space-x-1">
          <span className="font-semibold">
            Désignation {isEditing && <span className="text-red-500">*</span>}
          </span>
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
              <div className="flex flex-row items-center justify-between gap-5">
                <select
                  value={selectedQuestion}
                  name="selectedQuestion"
                  onChange={(e) => {
                    console.log("Selected question:", e.target.value);
                    setSelectedQuestion(Number(e.target.value));
                  }}
                  className="select select-bordered w-full"
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
                    className={`disabled:cursor-not-allowed flex flex-row hover:cursor-pointer items-center justify-center gap-5 px-4 py-2 text-center rounded-full border border-black bg-white text-neutral-700 text-lg hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)] transition duration-200 ${
                      selectedQuestion !== -1 ? "bg-green-500" : ""
                    }`}
                    onClick={handleAddQuestion}
                  >
                    {/* Icône de vérification (coche) */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
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
                removedQuestions={removedQuestions}
              />
            </DndContext>
          ) : (
            <span>Aucune question disponible.</span>
          )}
        </div>
        {error && <AlertError error={error} />}

        <div className="modal-action">
          {(localStorage.getItem("role") === "ADM" &&
            rubrique.type === "RBS") ||
          (localStorage.getItem("role") === "ENS" &&
            rubrique.type === "RBP") ? (
            <div
              className={` ${estUtilisee ? "tooltip tooltip-left" : ""}`}
              data-tip={`${
                estUtilisee
                  ? "La rubrique est utilisée dans une évaluation, vous ne pouvez pas la modifier."
                  : ""
              }`}
            >
              <button
                type="button"
                className="btn btn-neutral"
                onClick={handleEdit}
                disabled={estUtilisee || !canSave}
              >
                {isEditing ? "Enregistrer" : "Modifier"}
              </button>
            </div>
          ) : null}

          <button
            className="btn"
            onClick={() => {
              setIsEditing(false);
              setError(null);
              setPendingQuestions([]);
              setRemovedQuestions([]);
              onClose();
            }}
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsRubrique;
