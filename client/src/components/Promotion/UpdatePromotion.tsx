import React, { useEffect, useState } from "react";
import {
  getFormationAsync,
  getFormations,
  updatePromotionAsync,
} from "../../features/PromotionSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Promotion } from "../../types/types";
// import {
//   getEnseignantAsync,
//   getEnseignants,
// } from "../../features/EnseignantSlice";

interface UpdatePromotioProps {
  promotionData: Promotion;
  dispatchPromotion: () => void;
}

const UpdatePromotion = ({
  promotionData,
  dispatchPromotion,
}: UpdatePromotioProps) => {
  const dispatch = useAppDispatch();
  const formations = useAppSelector(getFormations);
//   const enseaignants = useAppSelector(getEnseignants);
  const [promotion, setPromotion] = useState<Promotion>({
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

  const handleSubmit = async () => {
    if (
      promotion.codeFormation &&
      promotion.nbMaxEtudiant &&
      promotion.dateRentree &&
      promotion.lieuRentree &&
      promotion.noEnseignant &&
      promotion.nomFormation &&
      promotion.diplome 
    ) {
      await dispatch(updatePromotionAsync(promotion));
      dispatchPromotion();
    }
  };

  useEffect(() => {
    dispatch(getFormationAsync());
    //  dispatch(getEnseignantAsync());
  }, [dispatch]);

    const formatDate = (date: string | Date | null) => {
    if (date === null) return "";
    date instanceof Date ? date.toISOString().split("T")[0] : date;
  };

  const canSave = [
    promotion.codeFormation &&
      promotion.nbMaxEtudiant &&
      promotion.dateRentree &&
      promotion.lieuRentree &&
      promotion.noEnseignant &&
      promotion.nomFormation &&
      promotion.diplome 
  ].every(Boolean);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier une promotion</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Désignation</span>
                <input
                  required
                  type="text"
                  name="codeFormation"
                  value={promotion.codeFormation}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: DOSI"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Nbr Etudiants</span>
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
                value={formatDate(promotion.dateRentree)}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 2022-09-01"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Lieu rentrée</span>
              <input
                required
                type="text"
                name="lieuRentree"
                value={promotion.lieuRentree}
                onChange={handleChange}
                className="grow"
                placeholder="Brest"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-semibold">Formation</span>
              <select
                required
                className="select w-full max-w-full"
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
            {/* <label className="flex items-center gap-2">
              <span className="font-semibold">Responsable</span>
              <select
                required
                className="select w-full max-w-full"
                name="noEnseignant"
                value={promotion.noEnseignant}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez un responsable
                </option>
                {enseaignants.map((enseignant) => (
                  <option
                    key={enseignant.noEnseignant}
                    value={enseignant.noEnseignant}
                  >
                    {enseignant?.nom.toLocaleUpperCase()} {enseignant.prenom} -{" "}
                    {enseignant.type}
                  </option>
                ))}
              </select>
            </label> */}
            
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Diplôme</span>
              <input
                required
                type="text"
                name="diplome"
                value={promotion.diplome}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Master"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Nom Formation</span>
              <input
                required
                type="text"
                name="nomFormation"
                value={promotion.nomFormation}
                onChange={handleChange}
                className="grow"
                placeholder="Nom Formation"
              />
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
