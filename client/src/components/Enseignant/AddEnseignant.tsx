import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  getEnseignantAsync,
  postEnseignantAsync,
} from "../../features/EnseignantSlice";
import { Chercheur, Intervenant } from "../../types/types";
import ChercheurInfo from "./ChercheurInfo";
import IntervenantInfo from "./IntervenantInfo";

const AddEnseignant = () => {
  const dispatch = useAppDispatch();
  const [enseignant, setEnseignant] = useState({
    noEnseignant: 0,
    type: "ENC",
    nom: "",
    prenom: "",
    sexe: "",
    adresse: "",
    email: "",
    cp: "",
    telPort: "",
    pays: "France",
  });

  const [chercheur, setChercheur] = useState<Chercheur>({
    encUboEmail: "",
    encUboTel: 0,
    encPersoEmail: "",
  });

  const [intervenant, setIntervenant] = useState<Intervenant>({
    intFonction: "",
    intNoInsee: 0,
    intSocNom: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEnseignant({ ...enseignant, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      enseignant.nom &&
      enseignant.prenom &&
      enseignant.sexe &&
      enseignant.adresse &&
      enseignant.email &&
      enseignant.cp &&
      enseignant.telPort &&
      enseignant.type
    ) {
      const enseignantComplet = {
        ...enseignant,
        ...chercheur,
        ...intervenant,
      };
      await dispatch(postEnseignantAsync(enseignantComplet));
      dispatch(getEnseignantAsync());
    } else {
      console.error("Tous les champs requis doivent être remplis.");
    }
  };

  const canSave = [
    enseignant.nom,
    enseignant.prenom,
    enseignant.sexe,
    enseignant.adresse,
    enseignant.email,
    enseignant.cp,
    enseignant.telPort,
    enseignant.type,
  ].every(Boolean);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl ">
        <h3 className="font-bold text-lg my-4">Ajouter un enseignant</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <div className="flex flex-row justify-between">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Nom</span>
                <input
                  required
                  type="text"
                  name="nom"
                  value={enseignant.nom}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: Dupont"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Prénom</span>
                <input
                  required
                  type="text"
                  name="prenom"
                  value={enseignant.prenom}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: Jean"
                />
              </label>
            </div>

            <label className="flex items-center gap-2">
              <select
                required
                name="sexe"
                value={enseignant.sexe}
                onChange={handleChange}
                className="select select-bordered w-full max-w-full"
              >
                <option disabled value="">
                  Sélectionnez un sexe
                </option>
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Telephone</span>
              <input
                required
                type="number"
                name="telPort"
                value={enseignant.telPort}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 0701010101"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Adresse</span>
              <input
                required
                type="text"
                name="adresse"
                value={enseignant.adresse}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 10 Rue des Écoles"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Code postal</span>
              <input
                required
                type="text"
                name="cp"
                value={enseignant.cp}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 29200"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Pays</span>
              <input
                required
                type="text"
                name="pays"
                value={enseignant.pays}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: France"
              />
            </label>

            <label className="flex items-center gap-2">
              <select
                required
                name="type"
                value={enseignant.type}
                onChange={handleChange}
                className="select select-bordered w-full max-w-full"
              >
                <option disabled value="">
                  Sélectionnez un type
                </option>
                <option value="ENC">Chercheur</option>
                <option value="INT">Intervenant</option>
              </select>
            </label>

            {enseignant.type === "ENC" && (
              <ChercheurInfo setChercheur={setChercheur} />
            )}
            {enseignant.type === "INT" && (
              <IntervenantInfo setIntervenant={setIntervenant} />
            )}
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button className="btn">Annuler</button>
              <button
                className="btn btn-neutral disabled:cursor-not-allowed"
                disabled={!canSave}
              >
                Ajouter
              </button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnseignant;
