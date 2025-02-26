import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { QuestionOrderDetails } from "./DetailsRubriques";

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
      className={`flex items-center px-4 py-3 bg-gray-100 rounded-md ${
        isEditing ? "cursor-grab hover:bg-gray-200" : ""
      }`}
    >
      <span className="font-medium">{question.intitule} :</span>
      <span className="ml-2 text-gray-700">
        {question.qualificatifMax} - {question.qualificatifMin}
      </span>
    </div>
  );
};

export default QuestionDetails;
