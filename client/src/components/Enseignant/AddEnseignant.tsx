import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import {
  getEnseignantAsync,
  postEnseignantAsync,
} from "../../features/EnseignantSlice";
import { Chercheur, Enseignant, Intervenant } from "../../types/types";
import ChercheurInfo from "./ChercheurInfo";
import IntervenantInfo from "./IntervenantInfo";
import { Eye, EyeOff } from "lucide-react";
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
    telephone: "",  // Ajouté
    emailUbo: "",  // Correspondance avec l'interface
    emailPerso: "",  // Correspondance avec l'interface
    intSocNom: "", // Ajouté pour Intervenant
    intNoInsee: 0, // Ajouté pour Intervenant
    intFonction: "", // Ajouté pour Intervenant
    password: "",  // Ajouté
    motPasse: "",  // Correspondance avec l'interface

  });
  const [showPassword, setShowPassword] = useState(false);

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
  const handleSubmit = async () => {

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
            <div className="grid grid-cols-2 gap-5">
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


            <label className="flex items-center gap-2">
              <select
                required
                name="sexe"
                value={enseignant.sexe}
                onChange={handleChange}
                className="select select-bordered"
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
              <span className="font-semibold">Ville</span>
              <input
                required
                type="text"
                name="ville"
                value={enseignant.ville}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Brest"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 relative">
                <span className="font-semibold">Mot de passe</span>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="motPasse"
                  value={enseignant.motPasse}
                  onChange={handleChange}
                  className="grow pr-10"
                  placeholder="Mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </label>


            <label className="flex items-center gap-2">
              <select
                required
                name="type"
                value={enseignant.type}
                onChange={handleChange}
                className="select select-bordered"
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
            <form action="">


            <button className="btn">Annuler</button>
            <button
              type="submit"
              className="btn btn-neutral disabled:cursor-not-allowed"
              disabled={!canSave}
              >
              Ajouter
            </button>{" "}
              </form>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnseignant;
