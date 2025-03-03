import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  getDomainePaysAsync,
  getDomaineUnivAsync,
  getEtudiantAsync,
  getPays,
  getUniversite,
  updateEtudiantAsync,
} from "../../features/EtudiantSlice";
import { Etudiant, Promotion } from "../../types/types";
import { getFormationAsync } from "../../features/PromotionSlice";

interface UpdateStudentProps {
  studentData: Etudiant;
  promotions: Promotion[];
  currentpage: number;
}

const UpdateEtudiant = ({
  studentData,
  promotions,
  currentpage,
}: UpdateStudentProps) => {
  const dispatch = useAppDispatch();
  const [dateError, setDateError] = useState<string | null>(null);

  

  console.log("got student",studentData);
  
  const [canSave, setCanSave] = useState(true);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "dateNaissance") {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();

      if (
        age < 17 ||
        (age === 17 &&
          (today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() &&
              today.getDate() < birthDate.getDate())))
      ) {
        setDateError("L'étudiant doit avoir au moins 17 ans.");
      } else {
        setDateError(null);
      }
    }

    studentData[name] = value;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log(e);

    if (canSave) {
      await dispatch(updateEtudiantAsync(studentData));
      dispatch(getEtudiantAsync({ page: currentpage, size: 5 }));
    }
  };

  

  const formatDate = (date: string | Date | null) => {
    if (date === null) return "";
    return date instanceof Date ? date.toISOString().split("T")[0] : date;
  };

  useEffect(() => {
    console.log(studentData);
    
    if (studentData != null || studentData !== undefined)
      setCanSave(
        studentData.nom.trim() !== "" &&
          studentData.prenom.trim() !== "" &&
          studentData.sexe.trim() !== "" &&
          studentData.email.trim() !== "" &&
          studentData.emailUbo.trim() !== "" &&
          studentData.noEtudiant.trim() !== "" &&
          studentData.dateNaissance !== null &&
          dateError === null &&
          studentData.lieuNaissance.trim() !== "" &&
          studentData.nationalite.trim() !== "" &&
          studentData.adresse.trim() !== "" &&
          studentData.ville.trim() !== "" &&
          studentData.paysOrigine.trim() !== "" &&
          studentData.universiteOrigine.trim() !== "" &&
          studentData.anneeUniversitaire.trim() !== "" &&
          studentData.codeFormation.trim() !== ""
      );
  }, [studentData]);

  const pays = useAppSelector(getPays);
  const universite = useAppSelector(getUniversite);

  useEffect(() => {
    dispatch(getDomainePaysAsync());
    dispatch(getDomaineUnivAsync());
    dispatch(getFormationAsync());
  }, [dispatch]);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier un étudiant</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Nom <span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="nom"
                value={studentData.nom}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: John"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Prénom<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="prenom"
                value={studentData.prenom}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Doe"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                No Etudiant<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="noEtudiant"
                value={studentData.noEtudiant}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: YI98765"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Mot de passe<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="password"
                name="motPasse"
                value={studentData.motPasse}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Entrez un mot de passe"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Email <span className="text-red-500">*</span>
              </span>
              <input
                required
                type="email"
                name="email"
                value={studentData.email}
                onChange={handleChange}
                className="grow"
                placeholder="john.doe@gamil.com"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Email Ubo<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="email"
                name="emailUbo"
                value={studentData.emailUbo}
                onChange={handleChange}
                className="grow"
                placeholder="john.doe@univ.fr"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Téléphone</span>
              <input
                type="text"
                name="telephone"
                value={studentData.telephone}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 0700000000"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Mobile</span>
              <input
                type="text"
                name="mobile"
                value={studentData.mobile}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 0700000000"
              />
            </label>
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Date de naissance<span className="text-red-500">*</span>
                </span>
                <input
                  required
                  type="date"
                  name="dateNaissance"
                  value={formatDate(studentData.dateNaissance)}
                  onChange={handleChange}
                  className="grow"
                />
              </label>
              {dateError && <p className="text-red-500 text-sm">{dateError}</p>}
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Lieu de naissance<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="lieuNaissance"
                value={studentData.lieuNaissance}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Paris"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Nationalité<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="nationalite"
                value={studentData.nationalite}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Marocaine"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Adresse<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="adresse"
                value={studentData.adresse}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 12 rue..."
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Ville<span className="text-red-500">*</span>
              </span>
              <input
                required
                type="text"
                name="ville"
                value={studentData.ville}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Brest"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">Code postal</span>
              <input
                type="text"
                name="codePostal"
                value={studentData.codePostal}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 29200"
              />
            </label>
            <label className="flex items-center gap-2">
              <select
                required
                name="sexe"
                value={studentData.sexe}
                onChange={handleChange}
                className="select select-bordered "
              >
                <option disabled value="">
                  Sélectionnez un sexe <span className="text-red-500">*</span>
                </option>
                <option value="H">Homme</option>
                <option value="F">Femme</option>
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <select
                required
                className="select max-w-full"
                name="paysOrigine"
                value={studentData.paysOrigine}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez le pays d'origine{" "}
                  <span className="text-red-500">*</span>
                </option>
                {pays.map((pays, idx) => (
                  <option key={idx} value={pays.rvLowValue}>
                    {pays.rvMeaning}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <select
                required
                className="select"
                name="promotion"
                value={
                  studentData.anneeUniversitaire && studentData.codeFormation
                    ? `${studentData.anneeUniversitaire}-${studentData.codeFormation}`
                    : ""
                }
                onChange={(e) => {
                  const selectedPromotion = promotions.find(
                    (p) =>
                      `${p.anneeUniversitaire}-${p.codeFormation}` ===
                      e.target.value
                  );
                  if (selectedPromotion) {
                    studentData["anneeUniversitaire"] =
                      selectedPromotion.anneeUniversitaire;
                    studentData["codeFormation"] = selectedPromotion.codeFormation
                  }
                }}
              >
                <option value="" disabled>
                  Sélectionner une promotion{" "}
                  <span className="text-red-500">*</span>
                </option>
                {promotions.map((promotion, idx) => (
                  <option
                    key={idx}
                    value={`${promotion.anneeUniversitaire}-${promotion.codeFormation}`}
                  >
                    {promotion.nomFormation} - {promotion.anneeUniversitaire}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <select
                required
                className="select"
                name="universiteOrigine"
                value={studentData.universiteOrigine}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez l'université d'origine{" "}
                  <span className="text-red-500">*</span>
                </option>
                {universite.map((univ, idx) => (
                  <option key={idx} value={univ.rvLowValue}>
                    {univ.rvMeaning}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <select
                required
                name="groupeAnglais"
                value={studentData.groupeAnglais}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value={-1} disabled>
                  Sélectionnez un groupe d'anglais
                </option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </label>
            <label className="flex flex-row items-center gap-2">
              <select
                name="groupeTp"
                value={studentData.groupeTp}
                onChange={handleChange}
                className="select select-bordered"
              >
                <option value={-1} disabled>
                  Sélectionnez un groupe de TP
                </option>
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </label>
          </div>
        </form>
        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-5">
            <button className="btn" >
              Annuler
            </button>
            <button
              className="btn btn-neutral hover:cursor-pointer"
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

export default UpdateEtudiant;
