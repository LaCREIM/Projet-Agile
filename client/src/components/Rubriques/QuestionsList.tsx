import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import QuestionDetails from "./QuestionDetails";
import { QuestionOrderDetails } from "./DetailsRubriques";

interface QuestionListProps {
  questions: QuestionOrderDetails[];
  isEditing: boolean;
  handleDeleteQuestion: (idRubrique: number, idQuestion: number) => void;
}

const QuestionsList = ({ questions, isEditing, handleDeleteQuestion }: QuestionListProps) => {
  return (
    <div className="w-full space-y-4">
      <SortableContext
        items={questions.map((qst) => qst.idQuestion)}
        strategy={verticalListSortingStrategy}
      >
        {questions.map((qst) => (
          <QuestionDetails
            key={qst.idQuestion}
            question={qst}
            isEditing={isEditing}
            handleDeleteQuestion={handleDeleteQuestion}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default QuestionsList;
