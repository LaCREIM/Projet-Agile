import { Etudiant } from "../../features/EtudiantSlice";

interface EtudiantProp {
  etudiant: Etudiant;
}

const EtudiantDetails = ({ etudiant }: EtudiantProp) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[55em] max-w-5xl space-y-5">
        <div className="flex flex-col items-center w-full">
          <h1 className="text-left justify-start w-full">
            <kbd className="kbd kbd-sm">ESC</kbd> pour quitter.
          </h1>
          <h3 className="font-bold text-center text-lg">
            Détails de l'étudiant <b>{etudiant.nom.toUpperCase()}</b>
          </h3>
        </div>

        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>Nom :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.nom}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Prénom :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.prenom}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Numéro UBO :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.noEtudiantUbo}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Numéro National :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.noEtudiantNat}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Promotion :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.anneePro}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Email :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.email}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Téléphone :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.telephone}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Université :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.universite}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Sexe :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.sexe}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Date de naissance :</dt>
              <dd className="mt-1 text-gray-500">
                {new Date(etudiant.dateNaissance).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Lieu de naissance :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.lieuNaissance}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Nationalité :</dt>
              <dd className="mt-1 text-gray-500">
                {etudiant.nationalite || "Française"}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Adresse permanente :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.permAdresse}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Ville :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.permVille}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Code Postal :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.permCp}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Pays :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.permPays}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Dernier Diplôme :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.dernierDiplome}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Sigle Étudiant :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.sigleEtu}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Compte CRI :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.compteCri}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Situation :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.situation}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default EtudiantDetails;
