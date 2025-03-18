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
import { envoyerReponseEvaluationAsync, fetchReponseEvaluationAsync, getReponseEvaluation } from "@/features/EvaluationSlice";
import { useNavigate, useParams } from "react-router-dom";

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
  const evaluation = useAppSelector(getReponseEvaluation);

  
  
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [hover, setHover] = useState<{ [key: number]: number }>({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [comment, setComment] = useState("");
  const [stepsData, setStepsData] = useState<RubriqueReponse[]>([]);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();


  useEffect(() => {
    console.log("evaluationId", useParams());
    if (!evaluationId) {
      return;
    }
    const res = dispatch(
      fetchReponseEvaluationAsync({
        idEvaluation: Number(evaluationId),
        idEtudiant: localStorage.getItem("id") || "",
      })
    );

    setStepsData(evaluation?.rubriques || []);
    console.log("stepsData", stepsData);
    

    console.log("res", res);
  }, [dispatch]);

  

  if (!rubriques || rubriques.length === 0) {
    return <div>No rubriques available</div>;
  }

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const handleRatingChange = (questionId: number, rating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [questionId]: rating,
    }));
  };

  const handleHoverChange = (questionId: number, hoverValue: number) => {
    setHover((prevHover) => ({
      ...prevHover,
      [questionId]: hoverValue,
    }));
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
        questions: rubrique.questions.map((question) => ({
          idQuestion: question.idQuestion,
          positionnement: ratings[question.idQuestion] || 0,
          intitule: question.intitule,
          qualificatif: {
            maximal: question.qualificatif.maximal,
            minimal: question.qualificatif.minimal,
          },
        })),
      })),
    };

    console.log(reponseEvaluation);
    const res = await dispatch(envoyerReponseEvaluationAsync(reponseEvaluation));
    console.log(res);
    
  };

  return (
    <div className="flex flex-col gap-3 mx-auto w-full px-4 md:px-24 py-4">
      <Stepper
        {...({} as React.ComponentProps<typeof Stepper>)}
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        className="w-[90%] md:w-[80%] mx-auto"
      >
        {stepsData?.map((rubrique, index) => (
          <Step
            {...({} as React.ComponentProps<typeof Step>)}
            key={index}
            onClick={() => setActiveStep(index)}
          >
            <div className="absolute -bottom-[2.5rem] w-max text-center">
              <Tooltip content={rubrique.designation} placement="bottom">
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
        {activeStep !== rubriques.length &&
          activeStep !== stepsData.length - 1 && (
            <Typography
              {...({} as React.ComponentProps<typeof Typography>)}
              variant="h4"
              className="lg:hidden text-center mb-4 font-bold"
            >
              {rubriques[activeStep].designation}
            </Typography>
          )}

        {activeStep === rubriques.length ? (
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
        ) : activeStep === stepsData.length - 1 ? (
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
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <Typography
                    {...({} as React.ComponentProps<typeof Typography>)}
                    variant="h5"
                    className="font-semibold mb-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                  >
                    {rubrique.designation}
                  </Typography>
                  {rubrique.questions.map((question) => (
                    <div key={question.idQuestion} className="mb-4">
                      <Typography
                        {...({} as React.ComponentProps<typeof Typography>)}
                        className="text-gray-600"
                      >
                        {question.intitule}
                      </Typography>
                      <Typography
                        {...({} as React.ComponentProps<typeof Typography>)}
                        className="text-gray-800 font-bold"
                      >
                        Réponse :{" "}
                        {ratings[question.idQuestion] || "Non répondue"}
                      </Typography>
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
                {comment || "Aucun commentaire"}
              </Typography>
            </div>
          </div>
        ) : (
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
                  <div className="w-fit grid grid-cols-3 items-center">
                    <Typography
                      {...({} as React.ComponentProps<typeof Typography>)}
                      className="text-gray-600 text-left"
                    >
                      {question.qualificatif.maximal}
                    </Typography>
                    <Positionement
                      rating={ratings[question.idQuestion] || 0}
                      setRating={(value) =>
                        handleRatingChange(question.idQuestion, value)
                      }
                      hover={hover[question.idQuestion] || 0}
                      setHover={(value) =>
                        handleHoverChange(question.idQuestion, value)
                      }
                    />
                    <Typography
                      {...({} as React.ComponentProps<typeof Typography>)}
                      className="text-gray-600 text-right"
                    >
                      {question.qualificatif.minimal}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </>
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
            className="hover:cursor-pointer"
            disabled={isLastStep}
          >
            Suivant
          </Button>
        )}
      </div>
    </div>
  );
};

export default StepperWithContent;
