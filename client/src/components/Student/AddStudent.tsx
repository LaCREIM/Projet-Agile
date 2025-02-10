import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  getDomainePaysAsync,
  getEtudiantAsync,
  getPays,
  postEtudiantAsync,
} from "../../features/EtudiantSlice";

import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";

import { Etudiant } from "../../types/types";


const AddStudent = () => {
  const dispatch = useAppDispatch();

  const [student, setStudent] = useState<Etudiant>({
    noEtudiant: "",
    promotion: "",
    nom: "",
    prenom: "",
    sexe: "",
    dateNaissance: null,
    lieuNaissance: "",
    nationalite: "",
    telephone: "",
    mobile: "",
    email: "",
    emailUbo: "",
    adresse: "",
    codePostal: "",
    ville: "",
    paysOrigine: "",
    universiteOrigine: "",
    groupeTp: 0,
    groupeAnglais: 0,
    codeFormation: "",
    anneeUniversitaire: "",
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
      student.noEtudiant &&
      student.dateNaissance &&
      student.lieuNaissance &&
      student.universiteOrigine &&
      student.codeFormation &&
      student.adresse &&
      student.ville &&
      student.codePostal &&
      student.paysOrigine &&
      student.universiteOrigine &&
      student.groupeTp &&
      student.groupeAnglais &&
      student.mobile&& 
      student.codeFormation &&
      student.anneeUniversitaire &&
      student.promotion
    ) {
      console.log(student);

      await dispatch(postEtudiantAsync(student));
    }
    dispatch(getEtudiantAsync());
  };

  const promotions = useAppSelector(getPromotions);
  const pays = useAppSelector(getPays);

  useEffect(() => {
    dispatch(getPromotionAsync());
    dispatch(getDomainePaysAsync())
  }, [dispatch]);

  const canSave = [
    student.nom &&
      student.prenom &&
      student.sexe &&
      student.email &&
      student.telephone &&
      student.noEtudiant &&
      student.dateNaissance &&
      student.lieuNaissance &&
      student.universiteOrigine &&
      student.codeFormation &&
      student.adresse &&
      student.ville &&
      student.codePostal &&
      student.paysOrigine &&
      student.universiteOrigine &&
      student.groupeTp &&
      student.groupeAnglais &&
      student.mobile,
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
                placeholder="john.doe@gamil.com"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Email Ubo</span>
              <input
                required
                type="email"
                name="emailUbo"
                value={student.emailUbo}
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
                name="mobile"
                value={student.mobile}
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
                value={
                  student.dateNaissance
                    ? student.dateNaissance.toISOString().split("T")[0]
                    : ""
                }
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
              <span className="font-semibold">Adresse</span>
              <input
                required
                type="text"
                name="adresse"
                value={student.adresse}
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
                name="ville"
                value={student.ville}
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
                name="codePostal"
                value={student.codePostal}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 29200"
              />
            </label>
            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Pays</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="paysOrigine"
                value={student.paysOrigine}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez un pays
                </option>
                {pays.map((pays, idx) => (
                  <option key={idx} value={pays.rvLowValue}>
                    {pays.rvMeaning}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Promotion</span>
              <select
                required
                className="select w-[80%] max-w-full"
                name="anneePro"
                value={
                  student.codeFormation === "-1"
                    ? ""
                    : student.anneeUniversitaire
                }
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

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">No Etudiant</span>
              <input
                required
                type="text"
                name="noEtudiant"
                value={student.noEtudiant}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: YI98765"
              />
            </label>

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Université</span>
              <input
                required
                type="text"
                name="universiteOrigine"
                value={student.universiteOrigine}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Licence"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Code Postale</span>
              <input
                required
                type="number"
                name="codePostal"
                value={student.codePostal}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 02922"
              />
            </label>

            {/* Groupe TP et Anglais */}
            <label className="flex  flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Groupe TP</span>
              <select
                required
                name="groupeAnglais"
                value={student.groupeAnglais}
                onChange={handleChange}
                className="select select-bordered w-[80%] max-w-full"
              >
                <option value="" disabled>
                  Sélectionnez un groupe d'anglais
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <span className="font-semibold w-[15%]">Groupe Anglais</span>
              <select
                required
                name="groupeTp"
                value={student.groupeTp}
                onChange={handleChange}
                className="select select-bordered w-[80%] max-w-full"
              >
                <option value="" disabled>
                  Sélectionnez un groupe de TP
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
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
