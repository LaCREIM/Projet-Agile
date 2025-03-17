import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import QuestionDetails from "./QuestionDetails";
import { QuestionOrderDetails } from "./DetailsRubriques";

interface QuestionListProps {
  questions: QuestionOrderDetails[];
  isEditing: boolean;
  handleDeleteQuestion: (idQuestion: number) => void;
  removedQuestions: number[];
}

const QuestionsList = ({
  questions,
  isEditing,
  handleDeleteQuestion,
  removedQuestions,
}: QuestionListProps) => {
  return (
    <div className="w-full space-y-4">
      <SortableContext
        items={questions.map((qst) => qst.idQuestion)}
        strategy={verticalListSortingStrategy}
      >
        {questions.map((qst) => {
          const isRemoved = removedQuestions.includes(qst.idQuestion);
          return (
            <QuestionDetails
              key={qst.idQuestion}
              question={qst}
              isEditing={isEditing}
              handleDeleteQuestion={handleDeleteQuestion}
              isRemoved={isRemoved}
            />
          );
        })}
      </SortableContext>
    </div>
  );
};

export default QuestionsList;
