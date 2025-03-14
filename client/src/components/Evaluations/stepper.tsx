import React, { useState } from "react";
import { Stepper, Step, Button, Typography } from "@material-tailwind/react";
import { Rubrique } from "@/types/types";
import Positionement from "./Positionement";

interface StepperProp {
  rubriques: Rubrique[];
}

const StepperWithContent = ({ rubriques }: StepperProp) => {
  const [ratings, setRatings] = useState<{ [key: number]: number }>({}); // État pour stocker les notes par question
  const [hover, setHover] = useState<{ [key: number]: number }>({}); // État pour gérer le survol par question
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  // Fonction pour mettre à jour la note d'une question spécifique
  const handleRatingChange = (questionId: number, rating: number) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [questionId]: rating,
    }));
  };

  // Fonction pour mettre à jour l'état de survol d'une question spécifique
  const handleHoverChange = (questionId: number, hoverValue: number) => {
    setHover((prevHover) => ({
      ...prevHover,
      [questionId]: hoverValue,
    }));
  };

  return (
    <div className="flex flex-col gap-3 w-full px-24 py-4">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
        className="w-[80%] mx-auto"
        {...({} as React.ComponentProps<typeof Stepper>)}
      >
        {rubriques.map((rubrique, index) => (
          <Step
            {...({} as React.ComponentProps<typeof Step>)}
            onClick={() => setActiveStep(index)}
            key={index}
          >
            <div className="absolute -bottom-[2.5rem] w-max text-center">
              <Typography
                variant="h6"
                className={
                  activeStep >= index ? "font-bold text-black" : "text-gray-400"
                }
                {...({} as React.ComponentProps<typeof Typography>)}
              >
                {rubrique.designation}
              </Typography>
            </div>
          </Step>
        ))}
        
      </Stepper>

      <div className="mt-20 flex flex-col gap-4">
        {rubriques[activeStep].questions.map((question) => (
          <div key={question.id}>
            <div className="flex flex-row justify-between">
              <Typography
                className="text-gray-600"
                {...({} as React.ComponentProps<typeof Typography>)}
              >
                {question.intitule}
              </Typography>
              <div className="w-fit grid grid-cols-3 items-center">
                <Typography
                  className="text-gray-600 text-left"
                  {...({} as React.ComponentProps<typeof Typography>)}
                >
                  {question.maxQualificatif}
                </Typography>
                <Positionement
                  rating={ratings[question.id] || 0} // Passer la note spécifique à la question
                  setRating={(value) => handleRatingChange(question.id, value)} // Mettre à jour la note
                  hover={hover[question.id] || 0} // Passer l'état de survol spécifique à la question
                  setHover={(value) => handleHoverChange(question.id, value)} // Mettre à jour l'état de survol
                />
                <Typography
                  className="text-gray-600 text-right"
                  {...({} as React.ComponentProps<typeof Typography>)}
                >
                  {question.minQualificatif}
                </Typography>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-32 w-full justify-end flex flex-row gap-6">
        <Button
          {...({} as React.ComponentProps<typeof Button>)}
          onClick={handlePrev}
          className="hover:cursor-pointer disabled:cursor-not-allowed bg-gray-200 text-black"
          disabled={isFirstStep}
        >
          Précédent
        </Button>
        <Button
          {...({} as React.ComponentProps<typeof Button>)}
          onClick={handleNext}
          className="hover:cursor-pointer"
          disabled={isLastStep}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default StepperWithContent;
