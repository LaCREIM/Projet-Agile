import React, { useEffect, useState } from "react";
import {
  Domaine,
  getDiplomes,
  getDomaineDiplomeAsync,
  getDomaineLieuEntreeAsync,
  getDomaineProcessusStageAsync,
  getFormationAsync,
  getFormations,
  getProcessusStages,
  getSalles,
  updatePromotionAsync,
} from "../../features/PromotionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Formation, PromotionCreate } from "../../types/types";
// import {
//   getEnseignantAsync,
//   getEnseignants,
// } from "../../features/EnseignantSlice";

interface UpdatePromotioProps {
  promotionData: PromotionCreate;
  dispatchPromotion: () => void;
}

const UpdatePromotion = ({
  promotionData,
  dispatchPromotion,
}: UpdatePromotioProps) => {
  const dispatch = useAppDispatch();
  const formations = useAppSelector<Formation[]>(getFormations);
  const salles = useAppSelector<Domaine[]>(getSalles);
  const diplomes = useAppSelector<Domaine[]>(getDiplomes);
  const processusStage = useAppSelector<Domaine[]>(getProcessusStages);
  //   const enseaignants = useAppSelector(getEnseignants);
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
    promotion.codeFormation != "" &&
    promotion.siglePromotion != "" &&
    promotion.anneeUniversitaire != "" &&
    promotion.nbMaxEtudiant != 0 &&
    promotion.dateRentree != new Date() &&
    promotion.lieuRentree != "" &&
    // promotion.noEnseignant &&
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
    //  dispatch(getEnseignantAsync());
  }, [dispatch]);

  const formatDate = (date: string | Date | null) => {
    if (date === null) return "";
    date instanceof Date ? date.toISOString().split("T")[0] : date;
  };

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
                <span className="font-semibold">Année universitaire</span>
                <input
                  required
                  type="text"
                  name="anneeUniversitaire"
                  value={promotion.anneeUniversitaire}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 2023-2024"
                />
              </label>
            </div>
            <div className="flex flex-row justify-between">
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

              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Date rentrée</span>
                <input
                  required
                  type="date"
                  name="dateRentree"
                  value={formatDate(promotion.dateRentree)}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 2022-09-01"
                />
              </label>
            </div>
            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Diplôme</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="diplome"
                value={promotion.diplome}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez un diplôme
                </option>
                {diplomes.map((domaine) => (
                  <option key={domaine.rvLowValue} value={domaine.rvLowValue}>
                    {domaine.rvMeaning}
                  </option>
                ))}
              </select>
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
              <span className="font-semibold w-[15%]">Formation</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="codeFormation"
                value={promotion.codeFormation}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez une formation
                </option>
                {formations.map((formation) => (
                  <option
                    key={formation.codeFormation}
                    value={formation.codeFormation}
                  >
                    {formation.codeFormation}
                  </option>
                ))}
              </select>
            </label>
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
                  Sélectionnez une formation
                </option>
                {formations.map((formation) => (
                  <option
                    key={formation.codeFormation}
                    value={formation.codeFormation}
                  >
                    {formation.codeFormation}
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
                    {ps.rvMeaning}
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
