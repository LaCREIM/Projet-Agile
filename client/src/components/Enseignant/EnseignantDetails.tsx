import { Enseignant } from "../../types/types";

interface EnseignantProp {
  enseignant: Enseignant;
}

const EnseignantDetails = ({ enseignant }: EnseignantProp) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5">
        <h3 className="font-bold text-center text-lg">
          Détails de l'enseignant <b>{enseignant.nom.toUpperCase()}</b>
        </h3>
        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>Code :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.id}</dd>
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
              <dd className="mt-1 text-gray-500">{enseignant.mobile}</dd>
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Adresse :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.adresse}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Code postale :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.codePostal}</dd>
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
                {enseignant.emailPerso && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Email personnel :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.emailPerso}
                    </dd>
                  </div>
                )}
                {enseignant.emailUbo && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Email UBO :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.emailUbo}
                    </dd>
                  </div>
                )}
                {enseignant.telephone && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Numéro téléphone :</dt>
                    <dd className="mt-1 text-gray-500">
                      {enseignant.telephone}
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
        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button className="btn">Fermer</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EnseignantDetails;
