import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionOrderDetails } from "./DetailsRubriques";
import { MdDragIndicator } from "react-icons/md";
import { FaMinus } from "react-icons/fa6";

interface QuestionProps {
  question: QuestionOrderDetails;
  isEditing: boolean;
}

const QuestionDetails = ({ question, isEditing }: QuestionProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: question.idQuestion });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...(isEditing ? attributes : {})}
      {...(isEditing ? listeners : {})}
      style={style}
      className={`flex flex-row justify-between gap-3 items-center px-4 py-3 bg-gray-100 rounded-md ${
        isEditing ? "cursor-grab hover:bg-gray-200" : ""
      }`}
    >
      <div className="flex flex-row items-center gap-3">
        {isEditing && (
          <FaMinus size={15} className="hover:cursor-pointer" />
        )}
        <div>
          <span className="font-medium">{question.intitule} :</span>
          <span className="ml-2 text-gray-700">
            {question.qualificatifMax} - {question.qualificatifMin}
          </span>
        </div>
      </div>
      {isEditing && (
        <MdDragIndicator size={20} className="cursor-grab justify-end" />
      )}
    </div>
  );
};

export default QuestionDetails;
