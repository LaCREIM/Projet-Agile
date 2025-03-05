import { processusmapper } from "../../mappers/mappers";
import { Promotion } from "../../types/types";

interface PromotionProp {
  promotion: Promotion;
}

export const DetailsPromotions = ({ promotion }: PromotionProp) => {
    const formateDate = (date: Date | null) => 
          new Date(date!).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        
    
  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="modal-box w-[55em] max-w-5xl space-y-5 hover:cursor-default">
        <div className="flex flex-col items-center w-full">
          <h3 className="font-bold text-center text-lg">
            Détails de la promotion
          </h3>
        </div>
        <div className="divider divider-start xl:col-span-2 sm:col-span-3 col-span-1 text-lg text-gray-400 ">
          Formation
        </div>

        <div className="text-base font-medium text-gray-900">
          <dt>Nom de la formation :</dt>
          <dd className="mt-1 text-gray-500">{promotion.codeFormation} : {promotion.nomFormation}</dd>
        </div>

        <div className="divider divider-start xl:col-span-2 sm:col-span-3 col-span-1 text-lg text-gray-400 ">
          Promotion
        </div>
        <div className="flex-grow overflow-auto">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-3 sm:col-gap-6 xl:grid-cols-2">
            <div className="text-base font-medium text-gray-900">
              <dt>Année universitaire :</dt>
              <dd className="mt-1 text-gray-500">
                {promotion.anneeUniversitaire}
              </dd>
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Sigle :</dt>
              <dd className="mt-1 text-gray-500">{promotion.siglePromotion}</dd>
            </div>

            {promotion.dateRentree && (
              <div className="text-base font-medium text-gray-900">
                <dt>Date de la rentrée :</dt>
                <dd className="mt-1 text-gray-500">
                  {formateDate(promotion.dateRentree)}
                </dd>
              </div>
            )}
            <div className="text-base font-medium text-gray-900">
              <dt>Lieu de la rentrée :</dt>
              <dd className="mt-1 text-gray-500">{promotion.lieuRentree}</dd>
            </div>

            {promotion.commentaire && (
              <div className="text-base font-medium text-gray-900">
                <dt>Commentaire:</dt>
                <dd className="mt-1 text-gray-500">{ promotion.commentaire}</dd>
              </div>
            )}
            <div className="text-base font-medium text-gray-900">
              <dt>Stage :</dt>
              <dd className="mt-1 text-gray-500">{processusmapper(promotion.processusStage)}</dd>
            </div>


            <div className="divider divider-start xl:col-span-2 sm:col-span-3 col-span-1 text-lg text-gray-400 ">
              Responsable
            </div>


            <div className="text-base font-medium text-gray-900">
              <dt>Nom et Prénom :</dt>
              <dd className="mt-1 text-gray-500">
                {promotion.nom} {promotion.prenom}
              </dd> 
            </div>
            <div className="text-base font-medium text-gray-900">
              <dt>Email :</dt>
              <dd className="mt-1 text-gray-500">
                {promotion.emailEnseignant}
              </dd>
            </div>

            <div className="divider divider-start xl:col-span-2 sm:col-span-3 col-span-1 text-lg text-gray-400 ">
              Recrutement
            </div>

            <div className="text-base font-medium text-gray-900">
              <dt>Nombre maximal d'étudiants :</dt>
              <dd className="mt-1 text-gray-500">{promotion.nbMaxEtudiant}</dd>
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
