import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  getEtudiantAsync,
  postEtudiantAsync,
} from "../../features/EtudiantSlice";

import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";

import { getEnseignantAsync } from "../../features/EnseignantSlice";

const AddStudent = () => {
  const dispatch = useAppDispatch();

  const [student, setStudent] = useState({
    nom: "",
    prenom: "",
    sexe: "",
    email: "",
    telephone: "",
    noEtudiantUbo: "",
    noEtudiantNat: "",
    dateNaissance: "",
    lieuNaissance: "",
    nationalite: "Française",
    universite: "",
    anneePro: "",
    adresse: "",
    permAdresse: "",
    permVille: "",
    permCp: "",
    permPays: "",
    dernierDiplome: "",
    sigleEtu: "",
    compteCri: "",
    siglePro: "",
    situation: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleSubmit = async () => {
    if (
      student.nom &&
      student.prenom &&
      student.sexe &&
      student.email &&
      student.telephone &&
      student.noEtudiantUbo &&
      student.noEtudiantNat &&
      student.dateNaissance &&
      student.lieuNaissance &&
      student.universite &&
      student.anneePro &&
      student.permAdresse &&
      student.permVille &&
      student.permCp &&
      student.permPays &&
      student.dernierDiplome &&
      student.sigleEtu &&
      student.compteCri &&
      student.situation
    ) {
      console.log(student);

      await dispatch(postEtudiantAsync(student));
    }
    dispatch(getEtudiantAsync());
  };

  const promotions = useAppSelector(getPromotions);

  useEffect(() => {
    dispatch(getPromotionAsync());
    dispatch(getEnseignantAsync());
  }, [dispatch]);

  const canSave = [
    student.nom &&
      student.prenom &&
      student.sexe &&
      student.email &&
      student.telephone &&
      student.noEtudiantUbo &&
      student.noEtudiantNat &&
      student.dateNaissance &&
      student.lieuNaissance &&
      student.universite &&
      student.anneePro &&
      student.permAdresse &&
      student.permVille &&
      student.permCp &&
      student.permPays &&
      student.dernierDiplome &&
      student.sigleEtu &&
      student.compteCri &&
      student.situation,
  ].every(Boolean);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className=" modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Ajouter un étudiant</h3>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            {/* Nom et Prénom */}
            <div className="flex flex-row justify-between">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Nom</span>
                <input
                  required
                  type="text"
                  name="nom"
                  value={student.nom}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: John"
                />
              </label>
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Prénom</span>
                <input
                  required
                  type="text"
                  name="prenom"
                  value={student.prenom}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: Doe"
                />
              </label>
            </div>

            {/* Sexe */}
            <label className="flex items-center gap-2">
              <select
                required
                name="sexe"
                value={student.sexe}
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
            <label className="flex items-center gap-2">
              <span className="font-semibold">Situation</span>
              <select
                required
                name="situation"
                value={student.situation}
                onChange={handleChange}
                className="select select-bordered w-full max-w-full"
              >
                <option value="" disabled>
                  Sélectionnez une situation matrimoniale
                </option>
                <option value="CEL">Célibataire</option>
                <option value="MAR">Marié</option>
                <option value="DIV">Divorcé</option>
              </select>
            </label>

            {/* Email et Téléphone */}
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Email</span>
              <input
                required
                type="email"
                name="email"
                value={student.email}
                onChange={handleChange}
                className="grow"
                placeholder="john.doe@univ.fr"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Téléphone</span>
              <input
                required
                type="text"
                name="telephone"
                value={student.telephone}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 0700000000"
              />
            </label>

            {/* Informations personnelles */}
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Date de naissance</span>
              <input
                required
                type="date"
                name="dateNaissance"
                value={student.dateNaissance}
                onChange={handleChange}
                className="grow"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Lieu de naissance</span>
              <input
                required
                type="text"
                name="lieuNaissance"
                value={student.lieuNaissance}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Paris"
              />
            </label>

            {/* Adresse permanente */}
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Adresse permanente</span>
              <input
                required
                type="text"
                name="permAdresse"
                value={student.permAdresse}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 12 rue..."
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Ville</span>
              <input
                required
                type="text"
                name="permVille"
                value={student.permVille}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Brest"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Code postal</span>
              <input
                required
                type="text"
                name="permCp"
                value={student.permCp}
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
                name="permPays"
                value={student.permPays}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: France"
              />
            </label>
            <label className="flex items-center gap-2">
              <span className="font-semibold">Promotion</span>
              <select
                required
                className="select w-full max-w-full"
                name="anneePro"
                value={student.anneePro === "-1" ? "" : student.anneePro}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez une promotion
                </option>
                {promotions.map((promotion) => (
                  <option key={promotion.anneePro} value={promotion.anneePro}>
                    {promotion.anneePro} : {promotion.siglePro}
                  </option>
                ))}
              </select>
            </label>

            {/* Dernier diplôme et université */}
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">No Etudiant National</span>
              <input
                required
                type="text"
                name="noEtudiantNat"
                value={student.noEtudiantNat}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: YI98765"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">No Etudiant UBO</span>
              <input
                required
                type="text"
                name="noEtudiantUbo"
                value={student.noEtudiantUbo}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: UB76543"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Dernier diplôme</span>
              <input
                required
                type="text"
                name="dernierDiplome"
                value={student.dernierDiplome}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Licence"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Université</span>
              <input
                required
                type="text"
                name="universite"
                value={student.universite}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: UBO"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Sigle Étudiant</span>
              <input
                required
                type="text"
                name="sigleEtu"
                value={student.sigleEtu}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: SIG123"
              />
            </label>

            {/* Compte CRI */}
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Compte CRI</span>
              <input
                required
                type="text"
                name="compteCri"
                value={student.compteCri}
                onChange={handleChange}
                className="grow"
                placeholder="Identifiant CRI"
              />
            </label>
          </div>
        </form>
        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button className="btn">Annuler</button>
            <button
              className="btn btn-neutral hover:cursor-pointer"
              onClick={handleSubmit}
              disabled={!canSave}
            >
              Ajouter
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddStudent;
