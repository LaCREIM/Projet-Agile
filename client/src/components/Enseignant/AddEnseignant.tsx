import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import { getDomainePaysAsync, getEnseignantAsync, postEnseignantAsync } from "../../features/EnseignantSlice";
import { Enseignant } from "../../types/types";
import { Eye, EyeOff } from "lucide-react";
import { getPays } from "../../features/EnseignantSlice";

const AddEnseignant = () => {
  const dispatch = useAppDispatch();
  const enseignantNull: Enseignant = {
    id: 0,
    type: "",
    sexe: "",
    nom: "",
    prenom: "",
    adresse: "",
    codePostal: "",
    ville: "",
    pays: "",
    mobile: "",
    telephone: "",
    emailUbo: "",
    emailPerso: "",
    password: "",
    motPasse: "",
  };
  const [enseignant, setEnseignant] = useState<Enseignant>(
    enseignantNull);

const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log(name, value); // Vérifie si les valeurs sont bien récupérées
    setEnseignant((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const pays = useAppSelector(getPays);

  const canSave = [
    { champ: "nom", valeur: enseignant.nom.trim() },
    { champ: "prenom", valeur: enseignant.prenom.trim() },
    { champ: "sexe", valeur: enseignant.sexe },
    { champ: "adresse", valeur: enseignant.adresse.trim() },
    { champ: "emailUbo", valeur: enseignant.emailUbo.trim() },
    { champ: "codePostal", valeur: enseignant.codePostal.trim() },
    { champ: "mobile", valeur: enseignant.mobile.trim() },
    { champ: "telephone", valeur: enseignant.telephone.trim()},
    { champ: "type", valeur: enseignant.type },
    { champ: "pays", valeur: enseignant.pays },
    { champ: "ville", valeur: enseignant.ville.trim() },
    { champ: "motPasse", valeur: enseignant.motPasse.trim() },
  ].every((field) => Boolean(field.valeur));

  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
  
    // Vérification du mobile et téléphone (doivent contenir exactement 10 chiffres)
    if (!/^\d{10}$/.test(enseignant.mobile)) {
      newErrors.mobile = "Le numéro de mobile doit contenir exactement 10 chiffres.";
    }
    if (!/^\d{10}$/.test(enseignant.telephone)) {
      newErrors.telephone = "Le numéro de téléphone doit contenir exactement 10 chiffres.";
    }
  
    // Vérification des emails avec regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(enseignant.emailUbo)) {
      newErrors.emailUbo = "L'email UBO doit être valide (ex: test@domaine.com).";
    }
    if (enseignant.emailPerso && !emailRegex.test(enseignant.emailPerso)) {
      newErrors.emailPerso = "L'email personnel doit être valide (ex: test@domaine.com).";
    }
  
    // Mettre à jour les erreurs
    setErrors(newErrors);
  
    // Retourner vrai si pas d'erreur
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {

    if (!canSave) {
      console.error("Tous les champs requis doivent être remplis correctement.");
      return;
    }

    if (!validateFields()) {
      console.error("Validation échouée.");
      return;
    }
    try {
      const response = await dispatch(postEnseignantAsync(enseignant));
      if (response.meta.requestStatus === "fulfilled") {
        dispatch(getEnseignantAsync({ page: 1, size: 10 }));
        setEnseignant(enseignantNull);
        setErrors({});
      } else {
        console.error("L'ajout a échoué :", response);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
    }
  };
  useEffect(() => {
    dispatch(getDomainePaysAsync());
}, [dispatch]);
const handleCancel = () => {
  setEnseignant(enseignantNull);
  setErrors({});
};

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter un enseignant</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <label className="input input-bordered flex items-center gap-2">

              <span className="font-semibold">Nom<span className="text-red-500">*</span></span>
              <input type="text" name="nom" value={enseignant.nom} onChange={handleChange} required className="grow" />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Prénom<span className="text-red-500">*</span></span>
              <input type="text" name="prenom" value={enseignant.prenom} onChange={handleChange} required className="grow" />

            </label>

            <label className="flex items-center gap-2">
              <select name="sexe" value={enseignant.sexe} onChange={handleChange} required className="select select-bordered">
                <option disabled value="">Sélectionnez un sexe<span className="text-red-500">*</span></option>
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>
            <div className="relative">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Mobile<span className="text-red-500">*</span></span>
                <input type="number" name="mobile" value={enseignant.mobile} onChange={handleChange} required className="grow" />
              </label>
              {errors.mobile && (
                <p className="text-red-500 text-xs absolute bottom-[-1.2rem] left-0">
                  {errors.mobile}
                </p>
              )}
            </div>
            <div className="relative">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Téléphone</span>
              <input type="number" name="telephone" value={enseignant.telephone} onChange={handleChange} required className="grow" />
            </label>
            {errors.telephone && (
              <p className="text-red-500 text-xs absolute bottom-[-1.2rem] left-0">
                {errors.telephone}
              </p>
            )}
            </div>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Adresse<span className="text-red-500">*</span></span>
              <input type="text" name="adresse" value={enseignant.adresse} onChange={handleChange} required className="grow" />
            </label>

            <div className="relative">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Code postal<span className="text-red-500">*</span></span>
                <input type="text" name="codePostal" value={enseignant.codePostal} onChange={handleChange} required className="grow" />
              </label>
              {errors.codePostal && (
                <p className="text-red-500 text-xs absolute bottom-[-1.2rem] left-0">
                  {errors.codePostal}
                </p>
              )}
            </div>


            <label className="flex flex-row items-center gap-2">
                <select
                  required
                  className="select max-w-full"
                  name="pays"
                  value={enseignant.pays}
                  onChange={handleChange}
                >
                  <option value="" >
                    Sélectionnez un pays<span className="text-red-500">*</span>
                  </option>
                  {pays?.length > 0 ? (
                    pays.map((p, idx) => (
                      <option key={idx} value={p.rvLowValue}>{p.rvMeaning}</option>
                    ))
                  ) : (
                    <option>Chargement des pays...</option>
                  )}
                </select>
              </label>


            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Ville<span className="text-red-500">*</span></span>
              <input type="text" name="ville" value={enseignant.ville} onChange={handleChange} required className="grow" />
            </label>

            <label className="input input-bordered flex items-center gap-2 relative">
              <span className="font-semibold">Mot de passe<span className="text-red-500">*</span></span>
              <input type={showPassword ? "text" : "password"} name="motPasse" value={enseignant.motPasse} onChange={handleChange} required className="grow pr-10" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 text-gray-500 hover:text-gray-700">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </label>

            <label className="flex items-center gap-2">

              <select name="type" value={enseignant.type} onChange={handleChange} required className="select select-bordered">
                <option value="">Type d'enseignant<span className="text-red-500">*</span></option>
                <option value="MCF">Maître de Conférences</option>
                <option value="INT">Intervenant-Exterieur</option>
                <option value="PR">Professeur des Universités</option>
                <option value="PRAST">Professionnel Associé</option>
                <option value="PRAG">Professeur Agrégé</option>
              </select>
            </label>


            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Email UBO<span className="text-red-500">*</span></span>
              <input type="email" name="emailUbo" value={enseignant.emailUbo} onChange={handleChange} required className="grow" />
            </label>

           <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Email Personnel</span>
              <input type="email" name="emailPerso" value={enseignant.emailPerso} onChange={handleChange} className="grow" />
            </label>
          </div>

          <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
          <div className="modal-action">
              <button className="btn" onClick={handleCancel}>Annuler</button>
              <button
                className="btn btn-neutral disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={!canSave}
              >
                Ajouter
              </button>
          </div>
          </form>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEnseignant;

