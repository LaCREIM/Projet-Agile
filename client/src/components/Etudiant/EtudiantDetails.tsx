import { sexeMapper, universiteMapper } from "../../mappers/mappers";
import { Etudiant } from "../../types/types";


interface EtudiantProp {
  etudiant: Etudiant;
}

const EtudiantDetails = ({ etudiant }: EtudiantProp) => {
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[55em] max-w-5xl space-y-5 hover:cursor-auto">
        <div className="flex flex-col items-center w-full">
          <h3 className="font-bold text-center text-lg mb-4">
            Détails de{" "}
            <b>
              {etudiant.prenom} {etudiant?.nom?.toUpperCase()}
            </b>
          </h3>
        </div>

        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>Numéro Étudiant :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.noEtudiant}</dd>
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Promotion :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.codeFormation} {" - "} {etudiant.anneeUniversitaire}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Email personnel :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.email}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Email UBO :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.emailUbo}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Mobile :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.mobile}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Téléphone :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.telephone}</dd>
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Sexe :</dt>
              <dd className="mt-1 text-gray-500">
                {sexeMapper(etudiant.sexe)}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Date de naissance :</dt>
              <dd className="mt-1 text-gray-500">
                {new Date(etudiant.dateNaissance!).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Lieu de naissance :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.lieuNaissance?.toUpperCase()}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Nationalité :</dt>
              <dd className="mt-1 text-gray-500">
                {etudiant.nationalite || "Française"}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Adresse permanente :</dt>
              <dd className="mt-1 text-gray-500">
                {etudiant.adresse} <br></br> {etudiant.codePostal}{" "}
                {etudiant.ville}
              </dd>
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Pays d'origine :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.paysOrigine}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Universite d'origine :</dt>
              <dd className="mt-1 text-gray-500">
                {etudiant.universiteOrigine} {" - "}
                {universiteMapper(etudiant.universiteOrigine)}{" - "}
                {etudiant.paysOrigine}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Groupe de TP :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.groupeTp}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Groupe d'anglais :</dt>
              <dd className="mt-1 text-gray-500">{etudiant.groupeAnglais}</dd>
            </div>
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

export default EtudiantDetails;
