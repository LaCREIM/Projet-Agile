import React, { useEffect } from "react";
import StepperWithContent from "./stepper";
import { Rubrique } from "@/types/types";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { getEvaluation, getEvaluationByIdAsync } from "@/features/EvaluationSlice";

export const rubriques: Rubrique[] = [
  {
    id: 1,
    type: "Évaluation",
    noEnseignant: 101,
    designation: "Qualité de l'enseignement",
    ordre: 1,
    questions: [
      {
        id: 1,
        idQuestion: 101,
        type: "Choix multiple",
        noEnseignant: 101,
        idQualificatif: { id: 1, maximal: "Très bien", minimal: "Insuffisant" },
        maxQualificatif: "Très bien",
        minQualificatif: "Insuffisant",
        positionement: -1,
        intitule: "Le professeur explique-t-il clairement les concepts ?",
      },
      {
        id: 2,
        idQuestion: 102,
        type: "Oui/Non",
        noEnseignant: 101,
        idQualificatif: { id: 2, maximal: "Oui", minimal: "Non" },
        maxQualificatif: "Oui",
        minQualificatif: "Non",
        positionement: -1,
        intitule: "Le cours commence-t-il à l'heure ?",
      },
    ],
  },
  {
    id: 2,
    type: "Évaluation",
    noEnseignant: 102,
    designation: "Matériel et ressources",
    ordre: 2,
    questions: [
      {
        id: 3,
        idQuestion: 103,
        type: "Échelle de 1 à 5",
        noEnseignant: 102,
        idQualificatif: { id: 3, maximal: "Excellent", minimal: "Mauvais" },
        maxQualificatif: "Excellent",
        minQualificatif: "Mauvais",
        positionement: -1,
        intitule: "Les supports de cours sont-ils adéquats ?",
      },
    ],
  },
  {
    id: 3,
    type: "Satisfaction",
    noEnseignant: 103,
    designation: "Interactivité",
    ordre: 3,
    questions: [
      {
        id: 4,
        idQuestion: 104,
        type: "Ouvert",
        noEnseignant: 103,
        idQualificatif: {
          id: 4,
          maximal: "Très interactif",
          minimal: "Pas du tout",
        },
        maxQualificatif: "Très interactif",
        minQualificatif: "Pas du tout",
        positionement: -1,
        intitule: "Comment évaluez-vous l'interaction avec l'enseignant ?",
      },
    ],
  },
  {
    id: 4,
    type: "Satisfaction",
    noEnseignant: 104,
    designation: "Environnement de travail",
    ordre: 4,
    questions: [
      {
        id: 5,
        idQuestion: 105,
        type: "Échelle de 1 à 10",
        noEnseignant: 104,
        idQualificatif: { id: 5, maximal: "10", minimal: "1" },
        positionement: -1,
        maxQualificatif: "10",
        minQualificatif: "1",
        intitule: "Comment notez-vous l'ambiance générale en classe ?",
      },
    ],
  },
];

const RepondreEvaluation = () => {
      const evaluationId = useParams().evaluationId;

    const dispatch = useAppDispatch();
    const evaluation = useAppSelector(getEvaluation)
    useEffect(() => {
      dispatch(getEvaluationByIdAsync(Number(evaluationId)));
    }, [dispatch, evaluationId]);
    console.log(evaluationId);

  return (
    <>
      <div className="w-[80%] mx-auto mt-[10%] ">
        <div className="text-center font-bold text-xl my-[3%]">
          Répondre à l'évaluation {evaluation.designation}{" "}
        </div>
        <StepperWithContent rubriques={rubriques} />
      </div>
    </>
  );
};

export default RepondreEvaluation;
