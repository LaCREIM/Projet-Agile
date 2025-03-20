import React, { useEffect, useState } from "react";
import {
  Stepper,
  Step,
  Button,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import Positionement from "./Positionement";
import { useAppDispatch, useAppSelector } from "@/hook/hooks";
import {
  envoyerReponseEvaluationAsync,
  fetchReponseEvaluationAsync,
} from "@/features/EvaluationSlice";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "@/api/store";
import { toast } from "react-toastify";
import { FaCircle, FaRegCircle } from "react-icons/fa6";

interface Qualificatif {
  maximal: string;
  minimal: string;
}

interface QuestionReponse {
  idQuestion: number;
  positionnement: number;
  intitule: string;
  qualificatif: Qualificatif;
}

interface RubriqueReponse {
  idRubriqueEvaluation: number;
  idRubrique: number;
  designation: string;
  questions: QuestionReponse[];
}

export interface ReponseEvaluation {
  idReponseEvaluation: number;
  idEvaluation: number;
  idEtudiant: string;
  commentaire: string;
  noEnseignant: number;
  nomEnseignant: string;
  prenomEnseignant: string;
  codeFormation: string;
  anneeUniversitaire: string;
  codeUE: string;
  designationUE: string;
  nomFormation: string;
  noEvaluation: number;
  designation: string;
  etat: string;
  periode: string;
  debutReponse: string;
  finReponse: string;
  rubriques: RubriqueReponse[];
}

interface StepperProp {
  rubriques: RubriqueReponse[];
}

const StepperWithContent = ({ rubriques }: StepperProp) => {
  const evaluation = useAppSelector(
    (state: RootState) => state.evaluations.reponseEvaluation
  );
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});
  const [hover, setHover] = useState<{ [key: string]: number }>({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [comment, setComment] = useState("");
  const [stepsData, setStepsData] = useState<RubriqueReponse[]>([]);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("evaluationId", evaluationId);
    if (!evaluationId) {
      return;
    }
    dispatch(
      fetchReponseEvaluationAsync({
        idEvaluation: Number(evaluationId),
        idEtudiant: localStorage.getItem("id") || "",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    setStepsData([
      ...(evaluation?.rubriques || []),
      {
        idRubriqueEvaluation: -1,
        idRubrique: -1,
        designation: "Commentaire",
        questions: [],
      } as RubriqueReponse,
      {
        idRubriqueEvaluation: -1,
        idRubrique: -1,
        designation: "Récapitulatif",
        questions: [],
      } as RubriqueReponse,
    ]);
    console.log("stepsData", evaluation);


    if (evaluation && evaluation.rubriques) {
      const initialRatings: { [key: string]: number } = {};
      evaluation.rubriques.forEach((rubrique) => {
        rubrique.questions.forEach((question) => {
          const compositeKey = `${rubrique.idRubrique}-${question.idQuestion}`;
          initialRatings[compositeKey] = question.positionnement;
        });
      });
      setRatings(initialRatings);

      // Initialize comment with existing comment
      if (evaluation.commentaire) {
        setComment(evaluation.commentaire);
      }
    }
  }, [evaluation]);

  if (!rubriques || rubriques.length === 0) {
    return <div>No rubriques available</div>;
  }

  const handleNext = () => {
    if (!isLastStep) {
      setActiveStep((cur) => cur + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setActiveStep((cur) => cur - 1);
    }
  };

  const handleRatingChange = (
    rubriqueId: number,
    questionId: number,
    rating: number
  ) => {
    const compositeKey = `${rubriqueId}-${questionId}`;
    setRatings((prevRatings) => ({
      ...prevRatings,
      [compositeKey]: rating,
    }));
  };

  const handleHoverChange = (
    rubriqueId: number,
    questionId: number,
    hoverValue: number
  ) => {
    const compositeKey = `${rubriqueId}-${questionId}`;
    setHover((prevHover) => ({
      ...prevHover,
      [compositeKey]: hoverValue,
    }));
  };

  const getStars = (positionnement: number) => {
    const totalStars = 5;
    return (
      <span className="flex space-x-1 text-black-500">
        {[...Array(totalStars)].map((_, index) =>
          index < positionnement ? (
            <FaCircle key={index} size={20} />
          ) : (
            <FaRegCircle key={index} size={20} />
          )
        )}
      </span>
    );
  };

  const handleSubmit = async () => {
    const reponseEvaluation: ReponseEvaluation = {
      idReponseEvaluation: -1,
      idEvaluation: Number(evaluationId),
      idEtudiant: localStorage.getItem("id") || "",
      commentaire: comment,
      noEnseignant: -1,
      nomEnseignant: "",
      prenomEnseignant: "",
      codeFormation: "",
      anneeUniversitaire: "",
      codeUE: "",
      designationUE: "",
      nomFormation: "",
      noEvaluation: -1,
      designation: "",
      etat: "",
      periode: "",
      debutReponse: "",
      finReponse: "",
      rubriques: rubriques.map((rubrique) => ({
        idRubriqueEvaluation: -1,
        idRubrique: rubrique.idRubrique,
        designation: rubrique.designation,
        questions: rubrique.questions
          .map((question) => ({
            idQuestion: question.idQuestion,
            positionnement:
              ratings[`${rubrique.idRubrique}-${question.idQuestion}`] || 0,
            intitule: question.intitule,
            qualificatif: {
              maximal: question.qualificatif.maximal,
              minimal: question.qualificatif.minimal,
            },
          }))
          .filter((question) => question.positionnement !== 0),
      })),
    };
    const res = await dispatch(
      envoyerReponseEvaluationAsync(reponseEvaluation)
    );

    if (res.type === "evaluations/envoyerReponseEvaluationAsync/fulfilled") {
      toast.success("Réponse envoyée avec succès");
      setTimeout(() => {
        navigate("/user/home/evaluations");
      }, 3000);
    } else {
      toast.error("Erreur lors de l'envoi de la réponse");
    }
  };

  const areAllQuestionsAnswered = () => {
    if (activeStep >= rubriques.length) {
      return true; // Pas de questions pour les étapes "Commentaire" et "Récapitulatif"
    }

    const currentRubrique = rubriques[activeStep];
    return currentRubrique.questions.every((question) => {
      const compositeKey = `${currentRubrique.idRubrique}-${question.idQuestion}`;
      return ratings[compositeKey] !== 0; // Vérifie si la question a une réponse
    });
  };

  return (
    <div className="flex flex-col gap-3 mx-auto w-full px-4 md:px-24 py-4">
      <Stepper
        {...({} as React.ComponentProps<typeof Stepper>)}
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        className="w-[90%] md:w-[80%] mx-auto hover:cursor-pointer"
      >
        {stepsData?.map((step, index) => (
          <Step
            {...({} as React.ComponentProps<typeof Step>)}
            key={index}
            onClick={() => {
              if (index <= activeStep) {
                setActiveStep(index);
              }
            }}
            className={
              index > activeStep ? "cursor-not-allowed" : "cursor-pointer"
            }
          >
            <div className="absolute -bottom-[2.5rem] w-max text-center">
              <Tooltip content={step.designation} placement="top">
                <Typography
                  variant="h6"
                  {...({} as React.ComponentProps<typeof Typography>)}
                  className={
                    activeStep >= index
                      ? "font-bold text-black"
                      : "text-gray-400"
                  }
                >
                  <span className="hidden lg:inline max-w-xs overflow-hidden text-ellipsis whitespace-nowrap">
                    Étape {index + 1}
                  </span>
                  <span className="lg:hidden">Étape {index + 1}</span>
                </Typography>
              </Tooltip>
            </div>
          </Step>
        ))}
      </Stepper>

      <div className="mt-20 flex flex-col gap-4 w-[90%] mx-auto">
        {activeStep < rubriques.length ? (
          <>
            <h1 className="text-left font-bold mb-4 text-2xl">
              {rubriques[activeStep].designation}
            </h1>
            {rubriques[activeStep].questions.map((question) => (
              <div key={question.idQuestion}>
                <div className="flex flex-row justify-between">
                  <Typography
                    {...({} as React.ComponentProps<typeof Typography>)}
                    className="text-gray-600"
                  >
                    {question.intitule}
                  </Typography>
                  <div className="w-fit grid grid-cols-3 gap-7 items-center mr-[10%]">
                    <Typography
                      {...({} as React.ComponentProps<typeof Typography>)}
                      className="text-gray-600 text-left"
                    >
                      {question.qualificatif.minimal}
                    </Typography>
                    <Positionement
                      rating={
                        ratings[
                          `${rubriques[activeStep].idRubrique}-${question.idQuestion}`
                        ] || 0
                      }
                      setRating={(value) =>
                        handleRatingChange(
                          rubriques[activeStep].idRubrique,
                          question.idQuestion,
                          value
                        )
                      }
                      hover={
                        hover[
                          `${rubriques[activeStep].idRubrique}-${question.idQuestion}`
                        ] || 0
                      }
                      setHover={(value) =>
                        handleHoverChange(
                          rubriques[activeStep].idRubrique,
                          question.idQuestion,
                          value
                        )
                      }
                    />
                    <Typography
                      {...({} as React.ComponentProps<typeof Typography>)}
                      className="text-gray-600 text-right"
                    >
                      {question.qualificatif.maximal}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : activeStep === rubriques.length ? (
          <div>
            <Typography
              {...({} as React.ComponentProps<typeof Typography>)}
              className="text-gray-600"
            >
              Ajoutez un commentaire (facultatif):
            </Typography>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Votre commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <Typography
              {...({} as React.ComponentProps<typeof Typography>)}
              variant="h4"
              className="text-center font-bold"
            >
              Récapitulatif des réponses
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {evaluation?.rubriques?.map((rubrique, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md w-full"
                >
                  <Typography
                    {...({} as React.ComponentProps<typeof Typography>)}
                    variant="h5"
                    className="font-semibold mb-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {rubrique.designation}
                  </Typography>
                  {rubrique.questions.map((question) => (
                    <div
                      key={question.idQuestion}
                      className="mb-4 items-center justify-between grid grid-cols-2"
                    >
                      <Typography
                        {...({} as React.ComponentProps<typeof Typography>)}
                        className="text-gray-600"
                      >
                        {question.intitule}
                      </Typography>

                      <div className="grid grid-cols-3 gap-3 items-center">
                        <h1 className="text-right">
                          {question.qualificatif.minimal}
                        </h1>

                        {getStars(
                          ratings[
                            `${rubrique.idRubrique}-${question.idQuestion}`
                          ]
                        )}
                        <h1>{question.qualificatif.maximal}</h1>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Typography
                {...({} as React.ComponentProps<typeof Typography>)}
                variant="h5"
                className="font-semibold mb-4"
              >
                Commentaire :
              </Typography>
              <Typography
                {...({} as React.ComponentProps<typeof Typography>)}
                className="text-gray-800"
              >
                {comment || (
                  <Typography variant="h6" className="text-gray-400 italic"
                  {...({} as React.ComponentProps<typeof Typography>)}
                  >
                    Aucun commentaire
                  </Typography>
                )}
              </Typography>
            </div>
          </div>
        )}
      </div>

      <div className="mt-20 w-full justify-end flex flex-row gap-6">
        <Button
          {...({} as React.ComponentProps<typeof Button>)}
          onClick={handlePrev}
          className="hover:cursor-pointer disabled:cursor-not-allowed bg-gray-200 text-black"
          disabled={isFirstStep}
        >
          Précédent
        </Button>
        {activeStep === stepsData.length - 1 ? (
          <Button
            {...({} as React.ComponentProps<typeof Button>)}
            onClick={handleSubmit}
            className="hover:cursor-pointer bg-green-500 text-white"
          >
            Envoyer
          </Button>
        ) : (
          <Button
            {...({} as React.ComponentProps<typeof Button>)}
            onClick={handleNext}
            className="hover:cursor-pointer disabled:cursor-not-allowed"
            disabled={isLastStep || !areAllQuestionsAnswered()}
          >
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepperWithContent;
