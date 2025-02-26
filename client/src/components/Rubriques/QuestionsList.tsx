import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import QuestionDetails from "./QuestionDetails";
import { QuestionOrderDetails } from "./DetailsRubriques";

interface QuestionListProps {
  questions: QuestionOrderDetails[];
  isEditing: boolean;
}

const QuestionsList = ({ questions, isEditing }: QuestionListProps) => {
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
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default QuestionsList;
