import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  getFormationAsync,
  postPromotionsAsync,
  Promotion,
  Formation,
  getFormations,
} from "../../features/PromotionSlice";

import {
    //Enseignant,
  getEnseignantAsync,
 // getEnseignants,
} from "../../features/EnseignantSlice";

interface AddPromotionProps {
  dispatchPromotion: () => void;
}

const AddPromotion = ({ dispatchPromotion }: AddPromotionProps) => {
  const dispatch = useAppDispatch();
  const formations = useAppSelector<Formation[]>(getFormations);
  //const enseaignants = useAppSelector<Enseignant[]>(getEnseignants);
  const [promotion, setPromotion] = useState<Promotion>({
    anneePro: "",
    siglePro: "",
    nbEtuSouhaite: 0,
    dateRentree: "",
    lieuRentree: "",
    noEnseignant: "",
    nom: "",
    prenom: "",
    type: "",
    codeFormation: "",
    nomFormation: "",
    diplome: "",
    etatPreselection: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPromotion({ ...promotion, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      promotion.siglePro &&
      promotion.nbEtuSouhaite &&
      promotion.dateRentree &&
      promotion.lieuRentree &&
      promotion.noEnseignant &&
      promotion.nomFormation &&
      promotion.diplome &&
      promotion.etatPreselection
    ) {
      await dispatch(postPromotionsAsync(promotion));
      dispatchPromotion();
    }
  };

  useEffect(() => {
    dispatch(getFormationAsync());
    dispatch(getEnseignantAsync());
  }, [dispatch]);

  const canSave = [
    promotion.siglePro,
    promotion.nbEtuSouhaite,
    promotion.dateRentree,
    promotion.lieuRentree,
    promotion.noEnseignant,
    promotion.nomFormation,
    promotion.diplome,
    promotion.etatPreselection,
  ].every(Boolean);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter une promotion</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Désignation</span>
                <input
                  required
                  type="text"
                  name="siglePro"
                  value={promotion.siglePro}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: DOSI"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Nombre Etudiants Souhaité</span>
                <input
                  required
                  type="number"
                  name="nbEtuSouhaite"
                  value={promotion.nbEtuSouhaite}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 25"
                />
              </label>
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Annee Promotion</span>
              <input
                required
                type="text"
                name="anneePro"
                value={promotion.anneePro}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 2024-2025"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Date rentrée</span>
              <input
                required
                type="date"
                name="dateRentree"
                value={promotion.dateRentree}
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
                placeholder="Ex: Brest"
              />
            </label>
            {/* Champs ajoutés */}
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
              <span className="font-semibold">Etat Préselection</span>
              <select
                required
                className="select w-full max-w-full"
                name="etatPreselection"
                value={promotion.etatPreselection}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez un etat
                </option>
                <option value="TER">Terminée</option>
                <option value="ENC">En cours</option>
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
                placeholder="Ex: Informatique"
              />
            </label>
          </div>
        </form>

        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button className="btn">Annuler</button>
            <button className="btn btn-neutral" disabled={!canSave}>
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPromotion;
