import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionOrderDetails } from "./DetailsRubriques";
import { MdDragIndicator } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

interface QuestionProps {
  question: QuestionOrderDetails;
  isEditing: boolean;
  handleDeleteQuestion: (idRubrique: number, idQuestion: number) => void;
}

const QuestionDetails = ({
  question,
  isEditing,
  handleDeleteQuestion,
}: QuestionProps) => {
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
      className={`flex flex-row justify-between gap-3 items-center  `}
    >
      <div className="flex flex-row items-center gap-3 w-full">
        <div
          className={`px-4 py-3 bg-gray-100 rounded-md flex flex-row w-full gap-5 ${
            isEditing ? "cursor-grab hover:bg-gray-200" : ""
          }`}
          {...listeners} // Appliquer les events de drag SEULEMENT ici
          {...attributes}
        >
          {isEditing && (
            <MdDragIndicator
              size={23}
              className="cursor-grab justify-end text-gray-500"
            />
          )}
          <div>
            <span className="font-medium">{question.intitule} :</span>
            <span className="ml-2 text-gray-700">
              {question.qualificatifMax} - {question.qualificatifMin}
            </span>
          </div>
        </div>
        {isEditing && (
          <div className="tooltip tooltip-top" data-tip="Supprimer">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteQuestion(question.idRubrique, question.idQuestion);
              }}
              className={`hover:cursor-pointer hover:bg-gray-300 transition-all duration-200 rounded-full p-1 `}
            >
              <FaTrash size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDetails;
