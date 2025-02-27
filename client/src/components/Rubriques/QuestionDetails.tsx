import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionOrderDetails } from "./DetailsRubriques";
import { MdDragIndicator } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";

interface QuestionProps {
  question: QuestionOrderDetails;
  isEditing: boolean;
  handleDeleteQuestion: (idRubrique: number, idQuestion: number) => void;
}

const QuestionDetails = ({ question, isEditing, handleDeleteQuestion }: QuestionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: question.idQuestion,

    });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-row justify-between gap-3 items-center px-4 py-3 bg-gray-100 rounded-md ${
        isEditing ? "cursor-grab hover:bg-gray-200" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-3">
        {isEditing && (
          <div
                  className="tooltip tooltip-top"
                  data-tip="Séparer"
                >
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Button clicked");
              handleDeleteQuestion(question.idRubrique, question.idQuestion);
            }}
            className="hover:cursor-pointer hover:bg-gray-300 transition-all duration-200 rounded-full p-1"
          >
            <FaMinus size={15} />
          </button>
          </div>
        )}
        <div>
          <span className="font-medium">{question.intitule} :</span>
          <span className="ml-2 text-gray-700">
            {question.qualificatifMax} - {question.qualificatifMin}
          </span>
        </div>
      </div>
      {isEditing && (
        <MdDragIndicator
          size={23}
          className="cursor-grab justify-end text-gray-500"
          {...listeners} // Appliquer les events de drag SEULEMENT ici
          {...attributes}
        />
      )}
    </div>
  );
};

export default QuestionDetails;
