import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import {
  getAllEtudiantsAsync,
  getDomainePaysAsync,
  getDomaineUnivAsync,
  getEtudiantByIdAsync,
  getPays,
  getUniversite,
  updateEtudiantAsync,
} from "../../features/EtudiantSlice";
import { Etudiant, Promotion, PromotionDetails } from "../../types/types";
import { getFormationAsync } from "../../features/PromotionSlice";
import { toast } from "react-toastify";

interface UpdateStudentProps {
  studentData: Etudiant;
  promotions: Promotion[];
  currentpage: number;
  onClose: () => void;
  setPro: (pro: PromotionDetails) => void;
}

const UpdateEtudiant = ({
  studentData,
  promotions,
  setPro,
  onClose,
}: UpdateStudentProps) => {
  const dispatch = useAppDispatch();
  const [student, setStudent] = useState<Etudiant>(studentData);
  const pays = useAppSelector(getPays);
  const universite = useAppSelector(getUniversite);
  const [canSave, setCanSave] = useState(true);
  const [errors, setErrors] = useState({
    dateError: null as string | null,
    telephoneError: null as string | null,
    mobileError: null as string | null,
    groupeTpError: null as string | null,
    groupeAnglaisError: null as string | null,
    emailError: null as string | null,
    emailUboError: null as string | null,
  });

  const [error, setError] = useState<string | null>(null);
  const formatPhoneNumber = (value: string): string => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.replace(/(\d{2})(?=\d)/g, "$1 ");
    return formatted.trim();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "emailUbo") {
      const uboRegex = /^[a-zA-Z0-9._%+-]+@univ-brest\.fr$/;
      if (!uboRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailUboError: "L'email UBO doit être au format xxxx@univ-brest.fr.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailUboError: null,
        }));
      }
    }

    if (name === "email") {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailError: "Veuillez entrer une adresse email valide.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          emailError: null,
        }));
      }
    }

    if (name === "telephone" || name === "mobile") {
      const formattedValue = formatPhoneNumber(value);
      setStudent((prevStudent) => ({
        ...prevStudent,
        [name]: formattedValue,
      }));

      if (!/^\d{2}( \d{2}){4}$/.test(formattedValue)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`${name}Error`]: "Le numéro doit contenir exactement 10 chiffres.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [`${name}Error`]: null,
        }));
      }
      return;
    }

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
        setErrors((prevErrors) => ({
          ...prevErrors,
          dateError: "L'étudiant doit avoir au moins 17 ans.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          dateError: null,
        }));
      }
    }

    setStudent((prevStudent) => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (canSave) {
      const cleanedStudent = {
        ...student,
        telephone: student.telephone?.replace(/\s/g, ""),
        mobile: student.mobile?.replace(/\s/g, ""),
      };
      const res = await dispatch(updateEtudiantAsync(cleanedStudent));

      if (res?.type === "etudiants/updateEtudiantAsync/rejected") {
        // toast.error(res?.payload as string);
        setError(res.payload as string);
      } else if (res?.type === "etudiants/updateEtudiantAsync/fulfilled") {
        toast.success(res?.payload as string);
        dispatch(getAllEtudiantsAsync());
        setPro({
          anneeUniversitaire: "-1",
          codeFormation: "",
        } as PromotionDetails);
        onClose();
      }
    }
  };

  const formatDate = (date: string | Date | null) => {
    if (date === null) return "";
    return date instanceof Date ? date.toISOString().split("T")[0] : date;
  };

  useEffect(() => {
    if (Object.keys(student).length !== 0)
      setCanSave(
        student?.nom?.trim() !== "" &&
          student?.prenom?.trim() !== "" &&
          student?.sexe?.trim() !== "" &&
          student?.email?.trim() !== "" &&
          student?.emailUbo?.trim() !== "" &&
          student?.noEtudiant?.trim() !== "" &&
          student?.dateNaissance !== null &&
          formatDate(student.dateNaissance) !== "" &&
          errors.dateError === null &&
          errors.emailError === null &&
          errors.emailUboError === null &&
          errors.mobileError === null &&
          errors.telephoneError === null &&
          student?.lieuNaissance?.trim() !== "" &&
          student?.nationalite?.trim() !== "" &&
          student?.adresse?.trim() !== "" &&
          student?.ville?.trim() !== "" &&
          student?.paysOrigine?.trim() !== "" &&
          student?.universiteOrigine?.trim() !== "" &&
          student?.anneeUniversitaire?.trim() !== "" &&
          student?.codeFormation?.trim() !== ""
      );
  }, [student, errors]);

  useEffect(() => {
    dispatch(getDomainePaysAsync());
    dispatch(getDomaineUnivAsync());
    dispatch(getFormationAsync());
    dispatch(getEtudiantByIdAsync(studentData.noEtudiant));
  }, [dispatch]);

  useEffect(() => {
    setStudent(studentData);
  }, [studentData]);

  return (
    <div className="flex justify-center items-center w-full h-screen backdrop-blur-sm">
      <div className="modal-box w-[50em] max-w-5xl">
        <h3 className="font-bold text-lg my-4">Modifier un étudiant</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-5">
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                No Etudiant<span className="text-red-500"> *</span>
              </span>
              <input
                disabled
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
              <span className="font-semibold">
                Nom <span className="text-red-500"> *</span>
              </span>
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
              <span className="font-semibold">
                Prénom<span className="text-red-500"> *</span>
              </span>
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

            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Mot de passe<span className="text-red-500"> *</span>
              </span>
              <input
                required
                type="password"
                name="motPasse"
                value={student.motPasse}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Entrez un mot de passe"
              />
            </label>
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Email <span className="text-red-500"> *</span>
                </span>
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
              {errors.emailError && (
                <p className="text-red-500 text-sm">{errors.emailError}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Email Ubo<span className="text-red-500"> *</span>
                </span>
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
              {errors.emailUboError && (
                <p className="text-red-500 text-sm">{errors.emailUboError}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Téléphone</span>
                <input
                  type="text"
                  name="telephone"
                  value={student.telephone}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 0700000000"
                />
              </label>
              {errors.telephoneError && (
                <p className="text-red-500 text-sm">{errors.telephoneError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">Mobile</span>
                <input
                  type="text"
                  name="mobile"
                  value={student.mobile}
                  onChange={handleChange}
                  className="grow"
                  placeholder="Ex: 0700000000"
                />
              </label>
              {errors.mobileError && (
                <p className="text-red-500 text-sm">{errors.mobileError}</p>
              )}
            </div>
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2">
                <span className="font-semibold">
                  Date de naissance<span className="text-red-500"> *</span>
                </span>
                <input
                  required
                  type="date"
                  name="dateNaissance"
                  value={formatDate(student.dateNaissance)}
                  onChange={handleChange}
                  className="grow"
                />
              </label>
              {errors.dateError && (
                <p className="text-red-500 text-sm">{errors.dateError}</p>
              )}
            </div>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Lieu de naissance<span className="text-red-500"> *</span>
              </span>
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
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Nationalité<span className="text-red-500"> *</span>
              </span>
              <input
                required
                type="text"
                name="nationalite"
                value={student.nationalite}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: Marocaine"
              />
            </label>
            <label className="input input-bordered flex items-center gap-2">
              <span className="font-semibold">
                Adresse<span className="text-red-500"> *</span>
              </span>
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
              <span className="font-semibold">
                Ville<span className="text-red-500"> *</span>
              </span>
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
                type="text"
                name="codePostal"
                value={student.codePostal}
                onChange={handleChange}
                className="grow"
                placeholder="Ex: 29200"
              />
            </label>
            <label className="flex items-center gap-2">
              <select
                required
                name="sexe"
                value={student.sexe}
                onChange={handleChange}
                className="select select-bordered "
              >
                <option disabled value="">
                  Sélectionnez un sexe <span className="text-red-500"> *</span>
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
                value={student.paysOrigine}
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
                  student.anneeUniversitaire && student.codeFormation
                    ? `${student.anneeUniversitaire}-${student.codeFormation}`
                    : ""
                }
                onChange={(e) => {
                  const selectedPromotion = promotions.find(
                    (p) =>
                      `${p.anneeUniversitaire}-${p.codeFormation}` ===
                      e.target.value
                  );
                  if (selectedPromotion) {
                    setStudent((prevStudent) => ({
                      ...prevStudent,
                      anneeUniversitaire: selectedPromotion.anneeUniversitaire,
                      codeFormation: selectedPromotion.codeFormation,
                    }));
                  }
                }}
              >
                <option value="" disabled>
                  Sélectionner une promotion{" "}
                  <span className="text-red-500"> *</span>
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
                value={student.universiteOrigine}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Sélectionnez l'université d'origine{" "}
                  <span className="text-red-500"> *</span>
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
                value={student.groupeAnglais}
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
                value={student.groupeTp}
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
        {error && <div className="text-red-500 text-sm my-2 ">{error}</div>}

        <div className="modal-action">
          <button className="btn" onClick={() => onClose()}>
            Annuler
          </button>
          <button
            className="btn btn-neutral hover:cursor-pointer"
            onClick={handleSubmit}
            disabled={!canSave}
          >
            Mettre à jour
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEtudiant;
