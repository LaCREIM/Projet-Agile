import { Rubrique } from "../../types/types";

interface RubriqueDetailsProps {
  rubrique: Rubrique;
}

const DetailsRubrique = ({ rubrique }: RubriqueDetailsProps) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-left justify-start w-full">
            <kbd className="kbd kbd-sm">ESC</kbd> pour quitter.
          </h1>
          <h3 className="font-bold text-center text-lg">
            Détails de la Rubrique <b>{rubrique.designation}</b>
          </h3>
        </div>
        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>ID :</dt>
              <dd className="mt-1 text-gray-500">{rubrique.id}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Type :</dt>
              <dd className="mt-1 text-gray-500">{rubrique.type}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Désignation :</dt>
              <dd className="mt-1 text-gray-500">{rubrique.designation}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Ordre :</dt>
              <dd className="mt-1 text-gray-500">{rubrique.ordre}</dd>
            </div>
            {rubrique.noEnseignant && (
              <div className="text-base font-medium text-gray-900">
                <dt>Enseignant :</dt>
                <dd className="mt-1 text-gray-500">
                  {rubrique.noEnseignant.nom + " " + rubrique.noEnseignant.prenom}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default DetailsRubrique;
