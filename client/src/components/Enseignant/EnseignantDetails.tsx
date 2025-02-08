import { Enseignant } from "../../features/EnseignantSlice";

interface EnseignantProp {
  enseignant: Enseignant;
}

const EnseignantDetails = ({ enseignant }: EnseignantProp) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-left justify-start w-full">
            <kbd className="kbd kbd-sm">ESC</kbd> pour quitter.
          </h1>
          <h3 className="font-bold text-center text-lg">
            Détails de l'enseignant <b>{enseignant.nom.toUpperCase()}</b>
          </h3>
        </div>
        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>Code :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.noEnseignant}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Nom :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.nom}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Prénom :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.prenom}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Sexe :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.sexe}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Téléphone :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.telPort}</dd>
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Adresse :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.adresse}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Code postale :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.cp}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Pays :</dt>
              <dd className="mt-1 text-gray-500">
                {enseignant.pays || "France"}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Type :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.type}</dd>
            </div>
            {enseignant.type === "ENC" && (
              <>
                {enseignant.encPersoEmail && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Email personnel :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.encPersoEmail}
                    </dd>
                  </div>
                )}
                {enseignant.encUboEmail && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Email UBO :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.encUboEmail}
                    </dd>
                  </div>
                )}
                {enseignant.encUboTel && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Numéro téléphone :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.encUboTel}
                    </dd>
                  </div>
                )}
              </>
            )}
            {enseignant.type === "INT" && (
              <>
                {enseignant.intFonction && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Fonction :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.intFonction}
                    </dd>
                  </div>
                )}
                {enseignant.intNoInsee && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>No INSEE :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.intNoInsee}
                    </dd>
                  </div>
                )}
                {enseignant.intSocNom && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Societé :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.intSocNom}
                    </dd>
                  </div>
                )}
              </>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default EnseignantDetails;
