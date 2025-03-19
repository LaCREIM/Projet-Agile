import React, { useState } from "react";
import { useAppDispatch } from "../../hook/hooks";
import { editEnseignantAsync, getEnseignantAsync, getPays } from "../../features/EnseignantSlice";
import { Enseignant } from "../../types/types";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";

interface UpdateEnseignantProps {
  enseignantData: Enseignant;
}

const UpdateEnseignant = ({ enseignantData }: UpdateEnseignantProps) => {
  const dispatch = useAppDispatch();
  const [enseignant, setEnseignant] = useState<Enseignant>({ ...enseignantData });
  const pays = useAppSelector(getPays);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;
  
    if (name === "mobile" || name === "telephone") {
      formattedValue = formatPhoneNumber(value);
    }
  
    setEnseignant((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  
    setErrors((prev) => ({ ...prev, [name]: "" })); // Efface les erreurs lorsqu'on modifie le champ
  };
  

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSave) return; // Empêche la soumission si les champs ne sont pas valides
    if (!validateFields()) {
      toast.error("Veuillez corriger les erreurs du formulaire.");
      return;
    }

    setSubmitting(true);

    try {
      const cleanedEnseignant = {
        ...enseignant,
        telephone: enseignant.telephone.replace(/\s/g, ""),
        mobile: enseignant.mobile.replace(/\s/g, ""),
      };

      await dispatch(editEnseignantAsync(cleanedEnseignant));
      toast.success("Enseignant mis à jour avec succès !");
      dispatch(getEnseignantAsync({ page: 1, size: 10 }));
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setErrors((prev) => ({ ...prev, api: "Erreur lors de la mise à jour." }));
    } finally {
      setSubmitting(false);
    }
  };

  const canSave =
  Object.keys(errors).length === 0 &&
  [
    enseignant.adresse,
    enseignant.type,
    enseignant.pays,
    enseignant.nom,
    enseignant.prenom,
    enseignant.sexe,
    enseignant.codePostal,
    enseignant.emailUbo,
  ].every(Boolean);


  // Formatage du numéro de téléphone
  const formatPhoneNumber = (value: string): string => {
    return value.replace(/\D/g, "") // Supprime tous les caractères non numériques
                .replace(/(\d{2})(?=\d)/g, "$1 ") // Ajoute un espace tous les deux chiffres
                .trim();
  };

  // Validation des emails
  const validateEmail = (email: string, uboOnly = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uboRegex = /^[a-zA-Z0-9._%+-]+@univ-brest\.fr$/;
    return uboOnly ? uboRegex.test(email) : emailRegex.test(email);
  };

  // Validation du numéro de téléphone
  const validatePhoneNumber = (number: string): boolean => {
    return /^\d{10}$/.test(number.replace(/\D/g, ""));
  };
  
  // Validation des champs
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};
    let phone =formatPhoneNumber(enseignant.mobile)
    if (!validatePhoneNumber(phone)) {
      newErrors.mobile = "Le mobile doit contenir exactement 10 chiffres.";
    }
     phone =formatPhoneNumber(enseignant.telephone)

    if (enseignant.telephone && !validatePhoneNumber(enseignant.telephone)) {
      newErrors.telephone = "Le téléphone doit contenir exactement 10 chiffres.";
    }
    if (!validateEmail(enseignant.emailUbo, true)) {
      newErrors.emailUbo = "L'email UBO doit être au format xxxx@univ-brest.fr.";
    }
    if (enseignant.emailPerso && !validateEmail(enseignant.emailPerso)) {
      newErrors.emailPerso = "L'email personnel doit être valide (ex: test@domaine.com).";
    }
    if (!/^\d{5}$/.test(enseignant.codePostal)) {
      newErrors.codePostal = "Le code postal doit contenir 5 chiffres.";
    }
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s-]+$/;
    if (!nameRegex.test(enseignant.nom.trim())) {
      newErrors.nom = "Le nom ne doit contenir que des lettres.";
    }
    if (!nameRegex.test(enseignant.prenom.trim())) {
      newErrors.prenom = "Le prénom ne doit contenir que des lettres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier un enseignant</h3>
        <form onSubmit={handleSubmit} onChange={validateFields}>
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
              <input type="text" name="mobile" value={enseignant.mobile} onChange={handleChange} required className="grow" />
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
              <input
                type="text"
                name="telephone"
                value={enseignant.telephone}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 02 98 XX XX XX"
              />
            </label>
            
            {errors.telephone && (
              <p className="text-red-500 text-xs absolute left-0 mt-1">
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
                <span className="font-semibold">Code Postal<span className="text-red-500">*</span></span>
                <input
                  type="number"
                  name="codePostal"
                  value={enseignant.codePostal}
                  onChange={handleChange}
                  required
                  className="grow"
                />
              </label>
              {errors.codePostal && (
                <p className="text-red-500 text-xs absolute left-0 mt-1">
                  {errors.codePostal}
                </p>
              )}
            </div>

            <label className="flex flex-row items-center gap-2">
              <select name="pays" value={enseignant.pays} onChange={handleChange} required className="select select-bordered">
                <option value="">Sélectionnez un pays<span className="text-red-500">*</span></option>
                {pays?.length > 0 ? (
                  pays.map((p, idx) => (
                    <option key={idx} value={p.rvLowValue}>{p.rvMeaning}</option>
                  ))
                ) : (
                  <option>Chargement des pays...</option>
                )}
              </select>
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



            <div className="relative">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Email Personnel</span>
                <input
                  type="email"
                  name="emailPerso"
                  value={enseignant.emailPerso}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: john.doe@gmail.com"
                />
              </label>
              {errors.emailPerso && (
                <p className="text-red-500 left-0 mt-1">
                  {errors.emailPerso}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Email UBO<span className="text-red-500">*</span></span>
                <input
                  type="email"
                  name="emailUbo"
                  value={enseignant.emailUbo}
                  onChange={handleChange}
                  required
                  className="grow"
                  placeholder="Ex: john.doe@ubo.fr"
                />
              </label>
              {errors.emailUbo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.emailUbo}
                </p>
              )}
            </div>

          </div>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <button className="btn">Annuler</button>
              <button className="btn btn-neutral" onClick={handleSubmit} disabled={!canSave || submitting}>Mettre à jour</button>
            </form>
          </div>
        </form>
      </div>
    </div>

  );
};

export default UpdateEnseignant;
