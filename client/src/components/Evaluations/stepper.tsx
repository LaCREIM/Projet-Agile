import React, { useState } from "react";
import {
  Stepper,
  Step,
  Button,
  Typography,
  Tooltip,
} from "@material-tailwind/react";
import { Rubrique } from "@/types/types";
import Positionement from "./Positionement";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface StepperProp {
  rubriques: Rubrique[];
}

const StepperWithContent = ({ rubriques }: StepperProp) => {
  const stepsData = [
    ...rubriques,
    { designation: "Commentaire", questions: [] }, // Étape pour le commentaire
    { designation: "Récapitulatif", questions: [] }, // Étape pour le récapitulatif
  ];
  const [ratings, setRatings] = useState<{ [key: number]: number }>({});
  const [hover, setHover] = useState<{ [key: number]: number }>({});
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);
  const [comment, setComment] = useState(""); // État pour stocker le commentaire
  const navigate = useNavigate(); // Hook pour la redirection

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

  const handleSubmit = () => {
    // Logique pour envoyer les réponses (ratings et comment)
    console.log("Réponses envoyées :", { ratings, comment });

    // Afficher un toast de succès
    toast.success("Réponses envoyées avec succès !", {
      position: "top-right",
      autoClose: 3000, // Fermer le toast après 3 secondes
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Rediriger vers la page des évaluations après 3 secondes
    setTimeout(() => {
      navigate("/user/home/evaluations"); // Remplacez "/evaluations" par le chemin de votre page des évaluations
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-3 w-full px-4 md:px-24 py-4">
      <Stepper
        {...({} as React.ComponentProps<typeof Stepper>)}
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        className="w-full md:w-[80%] mx-auto"
      >
        {stepsData.map((rubrique, index) => (
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
                  {/* Afficher la désignation complète sur les grands écrans */}
                  <span className="hidden lg:inline">
                    {rubrique.designation}
                  </span>
                  {/* Afficher "Étape X" sur les écrans medium et petits */}
                  <span className="lg:hidden">Étape {index + 1}</span>
                </Typography>
              </Tooltip>
            </div>
          </Step>
        ))}
      </Stepper>

      <div className="mt-20 flex flex-col gap-4">
        {/* Afficher la désignation de la rubrique au-dessus des questions sur les petits et moyens écrans */}
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
          // Étape du commentaire
          <div>
            <Typography
              {...({} as React.ComponentProps<typeof Typography>)}
              className="text-gray-600"
            >
              Ajoutez un commentaire :
            </Typography>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Votre commentaire..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        ) : activeStep === stepsData.length - 1 ? (
          // Étape du récapitulatif
          <div className="flex flex-col gap-6">
            <Typography
              {...({} as React.ComponentProps<typeof Typography>)}
              variant="h4"
              className="text-center font-bold"
            >
              Récapitulatif des réponses
            </Typography>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rubriques.map((rubrique, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <Typography
                    {...({} as React.ComponentProps<typeof Typography>)}
                    variant="h5"
                    className="font-semibold mb-4"
                  >
                    {rubrique.designation}
                  </Typography>
                  {rubrique.questions.map((question) => (
                    <div key={question.id} className="mb-4">
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
                        Réponse : {ratings[question.id] || "Non répondue"}
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
          // Étape des questions
          rubriques[activeStep].questions.map((question) => (
            <div key={question.id}>
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
                    {question.maxQualificatif}
                  </Typography>
                  <Positionement
                    rating={ratings[question.id] || 0}
                    setRating={(value) =>
                      handleRatingChange(question.id, value)
                    }
                    hover={hover[question.id] || 0}
                    setHover={(value) => handleHoverChange(question.id, value)}
                  />
                  <Typography
                    {...({} as React.ComponentProps<typeof Typography>)}
                    className="text-gray-600 text-right"
                  >
                    {question.minQualificatif}
                  </Typography>
                </div>
              </div>
            </div>
          ))
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
          // Bouton "Envoyer" pour la dernière étape
          <Button
            {...({} as React.ComponentProps<typeof Button>)}
            onClick={handleSubmit}
            className="hover:cursor-pointer bg-green-500 text-white"
          >
            Envoyer
          </Button>
        ) : (
          // Bouton "Suivant" pour les autres étapes
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
