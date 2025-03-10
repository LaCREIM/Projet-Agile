import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import {
  getEvaluation,
  getEvaluationByIdAsync,
} from "../../features/EvaluationSlice";
import { etatEvaluationMapper } from "../../mappers/mappers";
import { BiSolidEdit } from "react-icons/bi";
import { RiUserSettingsFill } from "react-icons/ri";
import { Promotion } from "../../types/types";
import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";

const mockEvaluation = {
  id: 1,
  noEnseignant: {
    id: 1,
    nom: "Dupont",
    prenom: "Jean",
  },
  elementConstitutif: {
    id: 1,
    uniteEnseignement: {
      id: 1,
      code: "UE101",
      designation: "Programmation Web",
    },
    noEnseignant: {
      id: 1,
      nom: "Dupont",
      prenom: "Jean",
    },
    designation: "JavaScript Avancé",
    description: "Cours approfondi sur JavaScript et ses frameworks.",
    nbhCm: 20,
    nbhTd: 15,
    nbhTp: 10,
  },
  promotion: {
    id: 1,
    anneeUniversitaire: "2023-2024",
    codeFormation: "FORM101",
  },
  noEvaluation: 1,
  designation: "Évaluation de mi-parcours",
  etat: "En cours",
  periode: "Octobre 2023",
  debutReponse: new Date("2023-10-01"),
  finReponse: new Date("2023-10-15"),
  rubriques: [
    {
      id: 1,
      designation: "Compétences techniques",
      ordre: 1,
      questions: [
        {
          id: 1,
          designation: "Maîtrise de JavaScript",
          ordre: 1,
          qualificatif: {
            minimal: "Connaissances de base",
            maximal: "Expert confirmé",
          },
        },
        {
          id: 2,
          designation: "Connaissance de React",
          ordre: 2,
          qualificatif: {
            minimal: "Utilisation basique",
            maximal: "Développement avancé",
          },
        },
        {
          id: 3,
          designation: "Expérience avec Node.js",
          ordre: 3,
          qualificatif: {
            minimal: "Connaissances théoriques",
            maximal: "Déploiement en production",
          },
        },
      ],
    },
    {
      id: 2,
      designation: "Compétences en gestion de projet",
      ordre: 2,
      questions: [
        {
          id: 4,
          designation: "Utilisation de méthodologies Agile",
          ordre: 1,
          qualificatif: {
            minimal: "Connaissances de base",
            maximal: "Maîtrise complète",
          },
        },
        {
          id: 5,
          designation: "Gestion des délais",
          ordre: 2,
          qualificatif: {
            minimal: "Respect des échéances",
            maximal: "Optimisation des délais",
          },
        },
        {
          id: 6,
          designation: "Communication avec les parties prenantes",
          ordre: 3,
          qualificatif: {
            minimal: "Communication basique",
            maximal: "Communication stratégique",
          },
        },
      ],
    },
  ],
};

const DetailsEvaluation = () => {
  const evaluation = mockEvaluation;
  const evaluationId = useParams().evaluationId;
  const promotions = useAppSelector<Promotion[]>(getPromotions);

  const realEvaluation = useAppSelector(getEvaluation);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [evaluationEdit, setEvaluationEdit] = useState(realEvaluation);

  const [errors, setErrors] = useState({
    dateFinError: null as string | null,
    dateDebutError: null as string | null,
  });

  const unitesEnseignement = [
    { id: 1, code: "UE101", designation: "Programmation Web" },
    { id: 2, code: "UE102", designation: "Base de données" },
  ];

  useEffect(() => {
    dispatch(getEvaluationByIdAsync(Number(evaluationId)));
    dispatch(getPromotionAsync());
  }, [evaluationId]);

  useEffect(() => {
    if (realEvaluation) {
      setEvaluationEdit(realEvaluation);
    }
  }, [realEvaluation]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setEvaluationEdit((prevEvaluation) => {
      let newEvaluation = { ...prevEvaluation, [name]: value };
      setErrors({
        dateFinError: null,
        dateDebutError: null,
      });

      console.log(value);
      

      if (name === "debutReponse" || name === "finReponse") {
        const debutReponse = value
        const finReponse = value
        const today = new Date();

        if (debutReponse > finReponse) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            dateFinError:
              "La date de fin doit être supérieure à la date de début.",
          }));
          return prevEvaluation;
        }

        if (debutReponse < formatDate(today)) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            dateDebutError:
              "La date de début doit être supérieure à aujourd'hui.",
          }));

          return prevEvaluation;
        }
      }

      return newEvaluation;
    });
  };

  const formatDate = (date: string | Date | null) => {
    if (date === null) return "";
    return date instanceof Date ? date.toISOString().split("T")[0] : date;
  };

  const handlePromotionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPromotion = promotions.find(
      (p) => `${p.anneeUniversitaire}-${p.codeFormation}` === e.target.value
    );
    if (selectedPromotion) {
      setEvaluationEdit((prevEvaluation) => ({
        ...prevEvaluation,
        anneeUniversitaire: selectedPromotion.anneeUniversitaire,
        codeFormation: selectedPromotion.codeFormation,
      }));
    }
  };

  const handleUniteEnseignementChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedUnite = unitesEnseignement.find(
      (ue) => ue.code === e.target.value
    );
    if (selectedUnite) {
      setEvaluationEdit((prevEvaluation) => ({
        ...prevEvaluation,
        designationUE: selectedUnite.designation,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // dispatch(updateEvaluationAsync(evaluationEdit));
    console.log(evaluationEdit);
  };

  return (
    <div className="w-full min-h-screen p-5 bg-gray-100 overflow-y-auto">
      <div className="flex flex-row items-center justify-between gap-5 w-full px-14 py-5 bg-white shadow-md rounded-lg">
        <div className="flex flex-row w-full items-center justify-between gap-5">
          <div className="justify-start hover:cursor-pointer hover:transition hover:-translate-x-1 duration-300">
            <IoMdArrowBack
              size={25}
              onClick={() => navigate("/admin/home/evaluations")}
            />
          </div>
          <h1 className="text-center text-2xl font-bold">
            Détails de l'évaluation
          </h1>
          <div className="flex flex-row w-fit items-center justify-between gap-5">
            <div className="tooltip" data-tip="Modifier l'évaluation">
              <BiSolidEdit
                size={25}
                className="cursor-pointer"
                onClick={handleEditClick}
              />
            </div>
            <div className="tooltip" data-tip="Gérer les droits d'accès">
              <RiUserSettingsFill size={25} className="cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Informations générales */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? (
            <div className="flex flex-col gap-1">
              <label className="input input-bordered flex items-center gap-2 w-full">
                <span className="font-semibold">Désignation </span>
                <span className="text-red-500">*</span>
                <input
                  required
                  type="text"
                  name="designation"
                  value={evaluationEdit.designation}
                  onChange={handleChange}
                  className="grow"
                />
              </label>
            </div>
          ) : (
            realEvaluation.designation
          )}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-3">
            <div className=" flex flex-row space-x-3">
              <strong>Enseignant :</strong> {evaluation.noEnseignant.prenom}{" "}
              <p>{evaluation.noEnseignant.nom}</p>
            </div>
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <span className="font-semibold">Période </span>
                  <span className="text-red-500">*</span>
                  <input
                    required
                    type="text"
                    name="periode"
                    value={evaluationEdit.periode}
                    onChange={handleChange}
                    className="grow"
                    placeholder="Ex: DOSI"
                  />
                </label>
              </div>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Période :</strong>
                <p>{realEvaluation.periode}</p>
              </div>
            )}

            {isEditing ? (
              <div className="flex flex-col gap-1">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <span className="font-semibold">
                    Date de début <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="date"
                    name="debutReponse"
                    value={evaluationEdit.debutReponse}
                    onChange={handleChange}
                    className="grow"
                    placeholder="Ex: 2022-09-01"
                  />
                </label>
                {errors.dateDebutError && (
                  <p className="text-red-500 text-sm">
                    {errors.dateDebutError}
                  </p>
                )}
              </div>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Début des réponses : </strong>
                <p>{realEvaluation.debutReponse}</p>
              </div>
            )}
            {isEditing ? (
              <div className="flex flex-col gap-1">
                <label className="input input-bordered flex items-center gap-2 w-full">
                  <span className="font-semibold">
                    Date de fin <span className="text-red-500">*</span>
                  </span>
                  <input
                    type="date"
                    name="finReponse"
                    value={evaluationEdit.finReponse}
                    onChange={handleChange}
                    className="grow"
                    placeholder="Ex: 2022-09-01"
                  />
                </label>
                {errors.dateFinError && (
                  <p className="text-red-500 text-sm">{errors.dateFinError}</p>
                )}
              </div>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Fin des réponses :</strong>
                <p>{realEvaluation.finReponse}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {isEditing ? (
              <label className="flex flex-row items-center gap-2">
                <span className="font-semibold w-[30%]">
                  État <span className="text-red-500">*</span>
                </span>
                <select
                  name="etat"
                  value={evaluationEdit.etat}
                  onChange={handleChange}
                  className="select select-bordered w-full"
                >
                  <option value="ELA">{etatEvaluationMapper("ELA")}</option>
                  <option value="DIS">{etatEvaluationMapper("DIS")}</option>
                  <option value="CLO">{etatEvaluationMapper("CLO")}</option>
                </select>
              </label>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>État :</strong>
                <p>{etatEvaluationMapper(realEvaluation.etat)}</p>
              </div>
            )}

            {isEditing ? (
              <label className="flex flex-row items-center gap-2">
                <span className="font-semibold w-[30%]">
                  Promotion <span className="text-red-500">*</span>
                </span>
                <select
                  name="promotion"
                  value={`${evaluationEdit.anneeUniversitaire}-${evaluationEdit.codeFormation}`}
                  onChange={handlePromotionChange}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Sélectionner une promotion
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
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Promotion :</strong>
                <p>{`${realEvaluation.codeFormation} - ${realEvaluation.anneeUniversitaire}`}</p>
              </div>
            )}

            {isEditing ? (
              <label className="flex flex-row items-center gap-2">
                <span className="font-semibold w-[30%]">
                  Unité d'enseignement <span className="text-red-500">*</span>
                </span>
                <select
                  name="uniteEnseignement"
                  value={evaluationEdit.designationUE}
                  onChange={handleUniteEnseignementChange}
                  className="select select-bordered w-full"
                >
                  <option value="" disabled>
                    Sélectionner une unité d'enseignement
                  </option>
                  {unitesEnseignement.map((ue) => (
                    <option key={ue.id} value={ue.code}>
                      {ue.designation}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Unité d'enseignement :</strong>
                <p>{realEvaluation.designationUE}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-end gap-3 mt-5">
          {isEditing && (
            <>
              <button
                className="btn btn-neutral"
                onClick={
                  // dispatch(updateEvaluationAsync(evaluationEdit));
                  handleSubmit
                }
              >
                Enregistrer
              </button>
              <button
                className="btn"
                onClick={() => {
                  // dispatch(updateEvaluationAsync(evaluationEdit));
                  setIsEditing(false);
                }}
              >
                Annuler
              </button>
            </>
          )}
        </div>
      </div>

      {/* Rubriques et questions */}
      <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md">
        {evaluation.rubriques.map((rubrique) => (
          <div key={rubrique.id} className="mb-10">
            <h3 className="text-lg font-semibold mb-4">
              {rubrique.designation}
            </h3>
            <ul className="space-y-3 pl-6">
              {rubrique.questions.map((question) => (
                <li key={question.id} className="text-gray-700">
                  <div className="mb-2 flex flex-row items-center gap-2">
                    <strong className="min-w-fit">
                      {question.designation} :
                    </strong>{" "}
                    <p className="text-left">
                      {question.qualificatif.minimal}
                      <b>{" - "}</b>
                      {question.qualificatif.maximal}
                    </p>
                  </div>
                  <div className="pl-4 text-sm text-gray-600"></div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailsEvaluation;
