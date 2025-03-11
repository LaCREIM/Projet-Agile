import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import {
  getEvaluation,
  getEvaluationByIdAsync,
  updateEvaluationAsync,
} from "../../features/EvaluationSlice";
import { etatEvaluationMapper } from "../../mappers/mappers";
import { BiSolidEdit } from "react-icons/bi";
import { RiUserSettingsFill } from "react-icons/ri";
import { Promotion } from "../../types/types";
import {
  getPromotionAsync,
  getPromotions,
} from "../../features/PromotionSlice";
import { RootState } from "../../api/store";
import { useSelector } from "react-redux";
import { fetchAllUnitesEnseignementAsync } from "../../features/uniteEnseignementSlice";
import { toast, ToastContainer } from "react-toastify";
import AlertError from "../ui/alert-error";

const DetailsEvaluation = () => {
  const evaluationId = useParams().evaluationId;
  const promotions = useAppSelector<Promotion[]>(getPromotions);
  const evaluation = useAppSelector(getEvaluation);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [evaluationEdit, setEvaluationEdit] = useState(evaluation);
  const [errors, setErrors] = useState({
    designationError: null as string | null,
    periodeError: null as string | null,
    debutReponseError: null as string | null,
    finReponseError: null as string | null,
    noEvaluationError: null as string | null,
  });
  const [error, setError] = useState<string | null>(null);
  const unitesEnseignement = useSelector(
    (state: RootState) => state.unitesEnseignement.unitesEnseignement
  );

  useEffect(() => {
    dispatch(getEvaluationByIdAsync(Number(evaluationId)));
    dispatch(getPromotionAsync());
    dispatch(fetchAllUnitesEnseignementAsync());
  }, [evaluationId]);

  useEffect(() => {
    if (evaluation) {
      setEvaluationEdit(evaluation);
    }
  }, [evaluation]);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const validateDates = (debut: string | null, fin: string | null) => {
    if (!debut || !fin) return false;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today’s date for comparison

    const newErrors = { ...errors };

    if (new Date(debut) < new Date(today)) {
      newErrors.debutReponseError =
        "La date de début doit être aujourd'hui ou plus tard.";
    } else {
      newErrors.debutReponseError = null;
    }

    if (fin < debut) {
      newErrors.finReponseError =
        "La date de fin doit être postérieure ou égale à la date de début.";
    } else {
      newErrors.finReponseError = null;
    }

    setErrors(newErrors);

    return !newErrors.debutReponseError && !newErrors.finReponseError;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setEvaluationEdit((prevEvaluation) => {
      let newEvaluation = { ...prevEvaluation, [name]: value };

      console.log(value);

      if (name === "debutReponse" || name === "finReponse") {
        const debut =
          name === "debutReponse" ? value : newEvaluation.debutReponse;
        const fin = name === "finReponse" ? value : newEvaluation.finReponse;
        validateDates(debut, fin);
      }

      if (name === "designation" && value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          designationError: "La désignation ne peut pas être vide.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          designationError: null,
        }));
      }
      if (name === "periode" && value.trim() === "") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          periodeError: "La période ne peut pas être vide.",
        }));
      } else {
        setErrors((prevErrors) => ({
          ...prevErrors,
          periodeError: null,
        }));
      }

      return newEvaluation;
    });
    console.log(evaluationEdit);
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
      console.log("selected", selectedPromotion);

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
      (ue) => ue.codeUE === e.target.value
    );
    if (selectedUnite) {
      setEvaluationEdit((prevEvaluation) => ({
        ...prevEvaluation,
        codeUE: selectedUnite.codeUE,
        designationUE: selectedUnite.designationUE,
      }));
    }
  };

  const canSave =
    evaluationEdit.designation?.trim() !== "" &&
    evaluationEdit.debutReponse !== "" &&
    evaluationEdit.finReponse !== "" &&
    errors.debutReponseError === null &&
    errors.finReponseError === null &&
    evaluationEdit.anneeUniversitaire !== "" &&
    evaluationEdit.codeFormation !== "";

  const handleSubmit = async () => {
    console.log(canSave);

    console.log(evaluationEdit);
    if (canSave) {
      const res = await dispatch(updateEvaluationAsync(evaluationEdit));
      console.log(res);

      if (res?.type === "evaluations/updateEvaluationAsync/rejected") {
        setError(res.payload as string);
      } else if (res?.type === "evaluations/updateEvaluationAsync/fulfilled") {
        await dispatch(getEvaluationByIdAsync(Number(evaluationId)));
        setIsEditing(false);
        toast.success("Évaluation mise à jour avec succès");
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-5 bg-gray-100 overflow-y-auto">
      <ToastContainer theme="colored" />
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
              {errors.designationError && (
                <p className="text-red-500 text-sm">
                  {errors.designationError}
                </p>
              )}
            </div>
          ) : (
            evaluation.designation
          )}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-3">
            <div className=" flex flex-row space-x-3">
              <strong>Enseignant :</strong>

              <p>
                {evaluation.nomEnseignant} {evaluation.prenomEnseignant}
              </p>
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
                {errors.periodeError && (
                  <p className="text-red-500 text-sm">{errors.periodeError}</p>
                )}
              </div>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Période :</strong>
                <p>{evaluation.periode}</p>
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
                {errors.debutReponseError && (
                  <p className="text-red-500 text-sm">
                    {errors.debutReponseError}
                  </p>
                )}
              </div>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Début des réponses : </strong>
                <p>{evaluation.debutReponse}</p>
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
                {errors.finReponseError && (
                  <p className="text-red-500 text-sm">
                    {errors.finReponseError}
                  </p>
                )}
              </div>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Fin des réponses :</strong>
                <p>{evaluation.finReponse}</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            <div className=" flex flex-row space-x-3">
              <strong>État :</strong>
              <p>{etatEvaluationMapper(evaluation.etat)}</p>
            </div>

            {isEditing ? (
              <label className="flex flex-row items-center col-span-2 gap-2 ">
                <select
                  required
                  className="select w-full"
                  name="promotion"
                  value={
                    evaluationEdit.anneeUniversitaire &&
                    evaluationEdit.codeFormation
                      ? `${evaluationEdit.anneeUniversitaire}-${evaluationEdit.codeFormation}`
                      : ""
                  }
                  onChange={handlePromotionChange}
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
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Promotion :</strong>
                <p>{`${evaluation.codeFormation} - ${evaluation.anneeUniversitaire}`}</p>
              </div>
            )}

            {isEditing ? (
              <label className="flex flex-row items-center gap-2">
                <select
                  required
                  className="select w-full"
                  name="codeUE"
                  value={evaluationEdit.codeUE || ""}
                  onChange={handleUniteEnseignementChange}
                >
                  <option value="" disabled>
                    Sélectionner une unité d'enseignement{" "}
                    <span className="text-red-500"> *</span>
                  </option>
                  {unitesEnseignement.map((unite, idx) => (
                    <option key={idx} value={unite.codeUE}>
                      {unite.designationUE}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <div className=" flex flex-row space-x-3">
                <strong>Unité d'enseignement :</strong>
                <p>{evaluation.designationUE}</p>
              </div>
            )}
          </div>
          {isEditing && error && <AlertError error={error} />}
        </div>
        <div className="flex flex-row justify-end gap-3 mt-5">
          {isEditing && (
            <>
              <button
                className="btn btn-neutral"
                disabled={!canSave}
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
        {evaluation.rubriques?.map((rubrique) => (
          <div key={rubrique.id} className="mb-10">
            <h3 className="text-lg font-semibold mb-4">
              {rubrique.designation}
            </h3>
            <ul className="space-y-3 pl-6">
              {rubrique.questions.map((question) => (
                <li key={question.id} className="text-gray-700">
                  <div className="mb-2 flex flex-row items-center gap-2">
                    <strong className="min-w-fit">{question.intitule} :</strong>{" "}
                    <p className="text-left">
                      {question.qualificatif?.minimal}
                      <b>{" - "}</b>
                      {question.qualificatif?.maximal}
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
