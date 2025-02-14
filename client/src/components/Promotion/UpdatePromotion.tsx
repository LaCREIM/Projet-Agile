import React, { useEffect, useState } from "react";
import {
  Domaine,
  getDomaineDiplomeAsync,
  getDomaineLieuEntreeAsync,
  getDomaineProcessusStageAsync,
  getFormationAsync,

  getProcessusStages,
  getSalles,
  updatePromotionAsync,
} from "../../features/PromotionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Enseignant, PromotionCreate } from "../../types/types";
import { processusmapper } from "../../mappers/mappers";

interface UpdatePromotioProps {
  promotionData: PromotionCreate;
  enseignants: Enseignant[];
  dispatchPromotion: () => void;
}

const UpdatePromotion = ({
  promotionData,
  enseignants,
  dispatchPromotion,
}: UpdatePromotioProps) => {
  const dispatch = useAppDispatch();

  const salles = useAppSelector<Domaine[]>(getSalles);
  const processusStage = useAppSelector<Domaine[]>(getProcessusStages);

  const [promotion, setPromotion] = useState<PromotionCreate>({
    ...promotionData,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPromotion({
      ...promotion,
      [name]: value,
    });
  };

  const canSave =
    promotion.siglePromotion != "" &&
    promotion.anneeUniversitaire != "" &&
    promotion.nbMaxEtudiant != 0 &&
    promotion.dateRentree != new Date() &&
    promotion.lieuRentree != "" &&
    promotion.noEnseignant != "" &&
    promotion.processusStage != "" &&
    promotion.diplome != "";

  const handleSubmit = async () => {
    if (canSave) {
      await dispatch(updatePromotionAsync(promotion));
      dispatchPromotion();
    }
  };

  useEffect(() => {
    dispatch(getFormationAsync());
    dispatch(getDomaineLieuEntreeAsync());
    dispatch(getDomaineProcessusStageAsync());
    dispatch(getDomaineDiplomeAsync());
  }, [dispatch]);



  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier une promotion</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Sigle</span>
                <input
                  required
                  type="text"
                  name="siglePromotion"
                  value={promotion.siglePromotion}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: DOSI"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Nombre Etudiants max</span>
                <input
                  required
                  type="number"
                  name="nbMaxEtudiant"
                  value={promotion.nbMaxEtudiant}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 25"
                />
              </label>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Date rentrée</span>
              <input
                required
                type="date"
                name="dateRentree"
                value={
                  promotion.dateRentree
                    ? new Date(promotion.dateRentree)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 2022-09-01"
              />
            </label>

            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Lieu rentrée</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="lieuRentree"
                value={promotion.lieuRentree}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez une salle
                </option>
                {salles.map((salle) => (
                  <option key={salle.rvLowValue} value={salle.rvLowValue}>
                    {salle.rvMeaning}
                  </option>
                ))}
              </select>
            </label>
            {/* Champs ajoutés */}

            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Responsable</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="noEnseignant"
                value={promotion.noEnseignant}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez un responsable
                </option>
                {enseignants.map((ens) => (
                  <option key={ens.id} value={ens.id}>
                    {ens.nom.toUpperCase()} {ens.prenom}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Processus stage</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="processusStage"
                value={promotion.processusStage}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez un etat
                </option>
                {processusStage.map((ps) => (
                  <option key={ps.rvLowValue} value={ps.rvLowValue}>
                    {processusmapper(ps.rvLowValue)}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </form>

        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button className="btn">Annuler</button>
            <button
              className="btn btn-neutral"
              onClick={handleSubmit}
              disabled={!canSave}
            >
              Mettre à jour
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePromotion;
