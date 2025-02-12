import { Question } from "../../types/types";

interface QuestionDetailsProps {
  question: Question;
}

const DetailsQuestion = ({ question }: QuestionDetailsProps) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-left justify-start w-full">
            <kbd className="kbd kbd-sm">ESC</kbd> pour quitter.
          </h1>
          <h3 className="font-bold text-center text-lg">
            Détails de la Question <b>{question.intitule}</b>
          </h3>
        </div>
        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>ID :</dt>
              <dd className="mt-1 text-gray-500">{question.id}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Type :</dt>
              <dd className="mt-1 text-gray-500">{question.type}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Intitulé :</dt>
              <dd className="mt-1 text-gray-500">{question.intitule}</dd>
            </div>
            {question.noEnseignant && (
              <div className="text-base font-medium text-gray-900">
                <dt>No Enseignant :</dt>
                <dd className="mt-1 text-gray-500">{question.noEnseignant.nom + " "+ question.noEnseignant.prenom}</dd>
              </div>
            )}
            {question.idQualificatif && (
              <div className="text-base font-medium text-gray-900">
                <dt>Qualificatif :</dt>
                <dd className="mt-1 text-gray-500">
                  {question.idQualificatif.maximal + "-" + question.idQualificatif.minimal}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DetailsQuestion;
