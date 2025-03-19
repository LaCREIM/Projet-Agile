import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import {
  getDomainePaysAsync,
  getEnseignantAsync,
  postEnseignantAsync,
} from "../../features/EnseignantSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Enseignant } from "../../types/types";
import { Eye, EyeOff } from "lucide-react";
import { getPays } from "../../features/EnseignantSlice";

const AddEnseignant = ({ onClose }: { onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const [enseignant, setEnseignant] = useState<Enseignant>({
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
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const pays = useAppSelector(getPays);

  const canSave = [
    { champ: "nom", valeur: enseignant.nom.trim() },
    { champ: "prenom", valeur: enseignant.prenom.trim() },
    { champ: "sexe", valeur: enseignant.sexe },
    { champ: "adresse", valeur: enseignant.adresse.trim() },
    { champ: "emailUbo", valeur: enseignant.emailUbo.trim() },
    { champ: "codePostal", valeur: enseignant.codePostal.trim() },
    { champ: "mobile", valeur: enseignant.mobile.trim() },
    { champ: "type", valeur: enseignant.type },
    { champ: "pays", valeur: enseignant.pays },
    { champ: "ville", valeur: enseignant.ville.trim() },
    { champ: "motPasse", valeur: enseignant.motPasse.trim() },
  ].every((field) => Boolean(field.valeur));

  const formatPhoneNumber = (value: string): string => {
    return value
      .replace(/\D/g, "") // Supprime tous les caractères non numériques
      .replace(/(\d{2})(?=\d)/g, "$1 ") // Ajoute un espace tous les deux chiffres
      .trim();
  };
  const validateEmail = (email: string, uboOnly = false) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const uboRegex = /^[a-zA-Z0-9._%+-]+@univ-brest\.fr$/;
    return uboOnly ? uboRegex.test(email) : emailRegex.test(email);
  };
  const validatePhoneNumber = (number: string) =>
    /^\d{10}$/.test(number.replace(/\s/g, ""));
  const validateFields = () => {
    const newErrors: { [key: string]: string } = {};

    // Vérification du mobile
    if (!validatePhoneNumber(enseignant.mobile)) {
      newErrors.mobile =
        "Le numéro de mobile doit contenir exactement 10 chiffres.";
    }
    if (enseignant.telephone && !validatePhoneNumber(enseignant.telephone)) {
      newErrors.telephone =
        "Le numéro de téléphone doit contenir exactement 10 chiffres.";
    }

    // Vérification des emails
    if (!validateEmail(enseignant.emailUbo, true)) {
      newErrors.emailUbo = "L'email UBO doit être au format xxxx@univ-brest.fr";
    }
    if (enseignant.emailPerso && !validateEmail(enseignant.emailPerso)) {
      newErrors.emailPerso =
        "L'email personnel doit être valide (ex: test@domaine.com).";
    }

    // Vérification du code postal (5 chiffres)
    if (!/^\d{5}$/.test(enseignant.codePostal)) {
      newErrors.codePostal = "Le code postal doit contenir 5 chiffres.";
    }

    // Vérification du nom et prénom (uniquement des lettres et espaces)
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === "mobile" || name === "telephone") {
      formattedValue = formatPhoneNumber(value);
    }

    setEnseignant((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    // Validation à chaque modification
    validateFields();
  };
  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const response = await dispatch(
        postEnseignantAsync(cleanedEnseignant)
      ).unwrap();
      console.log("Enseignant ajouté avec succès :", response);

      if (response != null) {
        toast.success("Enseignant ajouté avec succès !");
        await dispatch(getEnseignantAsync({ page: 1, size: 10 }));
        setEnseignant({
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
        });
        setErrors({});
        onClose();
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout :", error);
      // toast.error("Erreur lors de l'ajout. Veuillez réessayer.");
      setErrors((prev) => ({ ...prev, api: "Erreur lors de l'ajout." }));
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    dispatch(getDomainePaysAsync());
  }, [dispatch]);

  const handleCancel = () => {
    setEnseignant({
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
    });
    setErrors({});
  };

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter un enseignant</h3>
        <form onSubmit={handleSubmit} onChange={validateFields}>
          <div className="grid grid-cols-2 gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Nom<span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={enseignant.nom}
                onChange={handleChange}
                required
                className="grow"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Prénom<span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={enseignant.prenom}
                onChange={handleChange}
                required
                className="grow"
              />
            </label>

            <label className="flex items-center gap-2">
              <select
                name="sexe"
                value={enseignant.sexe}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option disabled value="">
                  Sélectionnez un sexe<span className="text-red-500">*</span>
                </option>
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>
            <div className="relative">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Mobile<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Mobile : 06 06 06 06 06"
                  value={enseignant.mobile}
                  onChange={handleChange}
                  required
                  className="grow"
                />
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
                  placeholder="Téléphone : 06 06 06 06 06"
                  value={enseignant.telephone}
                  onChange={handleChange}
                  required
                  className="grow"
                />
              </label>
              {errors.telephone && (
                <p className="text-red-500 text-xs absolute bottom-[-1.2rem] left-0">
                  {errors.telephone}
                </p>
              )}
            </div>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Adresse<span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="adresse"
                placeholder="Adresse : 123 Rue de la Paix"
                value={enseignant.adresse}
                onChange={handleChange}
                required
                className="grow"
              />
            </label>

            <div className="relative">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Code postal<span className="text-red-500">*</span>
                </span>
                <input
                  type="text"
                  name="codePostal"
                  placeholder="Code postal : 29200"
                  value={enseignant.codePostal}
                  onChange={handleChange}
                  required
                  className="grow"
                />
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
                <option value="">
                  Sélectionnez un pays<span className="text-red-500">*</span>
                </option>
                {pays?.length > 0 ? (
                  pays.map((p, idx) => (
                    <option key={idx} value={p.rvLowValue}>
                      {p.rvMeaning}
                    </option>
                  ))
                ) : (
                  <option>Chargement des pays...</option>
                )}
              </select>
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Ville<span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                name="ville"
                placeholder="Ville : Brest"
                value={enseignant.ville}
                onChange={handleChange}
                required
                className="grow"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2 relative">
              <span className="font-semibold">
                Mot de passe<span className="text-red-500">*</span>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                name="motPasse"
                value={enseignant.motPasse}
                onChange={handleChange}
                required
                className="grow pr-10"
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
                name="type"
                value={enseignant.type}
                onChange={handleChange}
                required
                className="select select-bordered"
              >
                <option value="">
                  Type d'enseignant<span className="text-red-500">*</span>
                </option>
                <option value="MCF">Maître de Conférences</option>
                <option value="INT">Intervenant-Exterieur</option>
                <option value="PR">Professeur des Universités</option>
                <option value="PRAST">Professionnel Associé</option>
                <option value="PRAG">Professeur Agrégé</option>
              </select>
            </label>
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Email UBO<span className="text-red-500">*</span>
                </span>
                <input
                  type="email"
                  name="emailUbo"
                  value={enseignant.emailUbo}
                  onChange={handleChange}
                  required
                  className="grow"
                  placeholder="john.doe@univ-brest.fr"
                />
              </label>
              {errors.emailUbo && (
                <p className="text-red-500 text-sm">{errors.emailUbo}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Email Personnel</span>
                <input
                  type="email"
                  name="emailPerso"
                  value={enseignant.emailPerso}
                  onChange={handleChange}
                  className="grow"
                  placeholder="john.doe@gmail.com"
                />
              </label>
              {errors.emailPerso && (
                <p className="text-red-500 text-sm">{errors.emailPerso}</p>
              )}
            </div>
          </div>

          <div className="modal-action">
            <form method="dialog" className="flex flex-row gap-5">
              <div className="modal-action">
                <button className="btn" onClick={handleCancel}>
                  Annuler
                </button>
                <button
                  className="btn btn-neutral disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={!canSave || submitting}
                >
                  {submitting ? "Ajout en cours..." : "Ajouter"}
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
