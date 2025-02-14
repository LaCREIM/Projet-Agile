import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  getEnseignantAsync,
  postEnseignantAsync,
} from "../../features/EnseignantSlice";
import { Chercheur, Enseignant, Intervenant } from "../../types/types";
import ChercheurInfo from "./ChercheurInfo";
import IntervenantInfo from "./IntervenantInfo";

const AddEnseignant = () => {
  const dispatch = useAppDispatch();
  const [enseignant, setEnseignant] = useState<Enseignant>({
    id: 0,
    type: "ENC",
    sexe: "",
    nom: "",
    prenom: "",
    adresse: "",
    codePostal: "",
    ville: "",  // Ajouté
    pays: "FR",
    mobile: "",
    password: "",
    telephone: "", 
    emailUbo: "",  
    emailPerso: "",  
    intSocNom: "", 
    intNoInsee: 0, 
    intFonction: "", 
  });
  

  const [chercheur, setChercheur] = useState<Chercheur>({
    encUboEmail: "",
    encUboTel: "",
    encPersoEmail: "",
  });

  const [intervenant, setIntervenant] = useState<Intervenant>({
    intFonction: "",
    intNoInsee: 0,
    intSocNom: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    setEnseignant((prev) => {
      const updatedEnseignant = {
        ...prev,
        [name]: value,
      };
  
      // Correspondance explicite des valeurs pour Chercheur
      if (updatedEnseignant.type.toUpperCase() === "ENC") {
        setChercheur((prevChercheur) => ({
          ...prevChercheur,
          encUboEmail: updatedEnseignant.emailUbo,
          encPersoEmail: updatedEnseignant.emailPerso,
          encUboTel: updatedEnseignant.telephone,
        }));
      }
  
      if (updatedEnseignant.type.toUpperCase() === "INT") {
        setIntervenant((prevIntervenant) => ({
          ...prevIntervenant,
          intFonction: updatedEnseignant.intFonction || "",
          intNoInsee: Number(updatedEnseignant.intNoInsee) || 0,
          intSocNom: updatedEnseignant.intSocNom || "",
        }));
      }
      
  
      console.log("Nouvel état de enseignant :", updatedEnseignant);
      return updatedEnseignant;
    });
  }; 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // ⚠️ Empêcher le rechargement de la page
    if (!canSave) {
      console.error("Tous les champs requis doivent être remplis correctement.");
    }
    
    if (
      enseignant.nom &&
      enseignant.prenom &&
      enseignant.sexe &&
      enseignant.adresse &&
      enseignant.emailUbo &&
      enseignant.codePostal &&
      enseignant.mobile &&
      enseignant.type &&
      (enseignant.type === "ENC"
        ? chercheur.encUboEmail && chercheur.encUboTel && chercheur.encPersoEmail
        : intervenant.intFonction && intervenant.intNoInsee && intervenant.intSocNom)
    ) {
      const enseignantComplet =
        enseignant.type === "ENC"
          ? { ...enseignant, ...chercheur }
          : { ...enseignant, ...intervenant };
  
      await dispatch(postEnseignantAsync(enseignantComplet));
      dispatch(getEnseignantAsync({ page: 1, size: 10 }));
    } else {
      console.error("Tous les champs requis doivent être remplis.");
    }
  };
  
  

  const canSave = [
    { champ: "nom", valeur: enseignant.nom.trim() },
    { champ: "prenom", valeur: enseignant.prenom.trim() },
    { champ: "sexe", valeur: enseignant.sexe },
    { champ: "adresse", valeur: enseignant.adresse.trim() },
    { champ: "emailUbo", valeur: enseignant.emailUbo.trim() },
    { champ: "codePostal", valeur: enseignant.codePostal.trim() },
    { champ: "mobile", valeur: enseignant.mobile.trim() },
    { champ: "type", valeur: enseignant.type },
  ].every((field) => {
    // console.log(`Validation du champ ${field.champ} :`, Boolean(field.valeur)); // Debugging
    return Boolean(field.valeur);
  });
  


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
                name="mobile"
                value={enseignant.mobile}
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
                name="codePostal"
                value={enseignant.codePostal}
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
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Password</span>
              <input
                required
                type="text"
                name="password"
                value={enseignant.password}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Entrez un mot de passe"
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
              <ChercheurInfo
                setEnseignant={setEnseignant}
                setChercheur={setChercheur}
              />
            )}
            {enseignant.type === "INT" && (
              <IntervenantInfo
                setEnseignant={setEnseignant}
                setIntervenant={setIntervenant}
              />
            )}
          </div>

          <div className="modal-action">
            <button className="btn">Annuler</button>
            <button
              type="submit"
              className="btn btn-neutral disabled:cursor-not-allowed"
              disabled={!canSave}
            >
              Ajouter
            </button>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnseignant;
