import { useDispatch, useSelector } from "react-redux";
import { enseignantMapper } from "../../mappers/mappers";
import { Enseignant } from "../../types/types";
import { useEffect } from "react";
import { getDomainePaysAsync } from "../../features/EnseignantSlice";
import { RootState, AppDispatch } from "../../api/store";

interface EnseignantProp {
  enseignant: Enseignant;
}

const EnseignantDetails = ({ enseignant }: EnseignantProp) => {
  const dispatch: AppDispatch = useDispatch();
  const paysList = useSelector((state: RootState) => state.enseignants.pays);

  useEffect(() => {
    dispatch(getDomainePaysAsync());
  }, [dispatch]);

  // Fonction pour récupérer le nom du pays
  const getPaysNom = (code: string) => {
    const pays = paysList.find((p: { rvLowValue: string; }) => p.rvLowValue === code);
    return pays ? pays.rvMeaning : "Pays inconnu";
  };
  const formatPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "") // Supprime tous les caractères non numériques
                .replace(/(\d{2})(?=\d)/g, "$1 ") // Ajoute un espace tous les deux chiffres
                .trim();
  };
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[50em] max-w-5xl space-y-5">
        <h3 className="font-bold text-center text-lg">
          Détails de  <b>{enseignant.nom.toUpperCase()} {enseignant.prenom.toUpperCase()}</b>
        </h3>
        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>Code :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.id}</dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Sexe :</dt>
              <dd className="mt-1 text-gray-500">
                {enseignant.sexe === "H" ? "HOMME" : enseignant.sexe === "F" ? "FEMME" : "Non spécifié"}
              </dd>
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Mobile :</dt>
              <dd className="mt-1 text-gray-500">{formatPhoneNumber(enseignant.mobile)}</dd>
            </div>
            {enseignant.telephone && (
                  <div className="text-base font-medium text-gray-900">
                    <dt>Numéro de téléphone :</dt>
                    <dd className="mt-1 text-gray-500">
                      {formatPhoneNumber(enseignant.telephone)}
                    </dd>
                  </div>
                )}
            <div className="text-base font-medium text-gray-900">
              <dt>Adresse :</dt>
              <dd className="mt-1 text-gray-500">{enseignant.adresse}, {enseignant.codePostal} - {enseignant.pays.toUpperCase() ? getPaysNom(enseignant.pays).toUpperCase() : "FRANCE"}</dd>
            </div>
            {/* 
            <div className="text-base font-medium text-gray-900">
              <dt>Email :</dt>
              <dd className="mt-1 text-gray-500">
                {enseignant.emailUbo || "France"}
              </dd>
            </div>
             <div className="text-base font-medium text-gray-900">
              <dt>Pays :</dt>
              <dd className="mt-1 text-gray-500">
                {enseignant.pays ? getPaysNom(enseignant.pays) : "France"}
              </dd>
            </div> */}

            <div className="text-base font-medium text-gray-900">
              <dt>Type :</dt>
              <dd className="mt-1 text-gray-500">{enseignantMapper(enseignant.type)}</dd>
            </div>

            
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

              </>
          

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
