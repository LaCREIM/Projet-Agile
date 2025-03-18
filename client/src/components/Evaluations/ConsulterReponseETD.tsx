import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import {  fetchReponseEvaluationAsyncETD, getReponseEvaluationETD } from "../../features/EvaluationSlice";
import { ToastContainer } from "react-toastify";
import { IoMdArrowBack } from "react-icons/io";
import { etatEvaluationMapper } from "../../mappers/mappers";
import { FaCircle, FaRegCircle } from 'react-icons/fa';

const getStars = (positionnement: number) => {
  const totalStars = 5;
  return (
    <span className="flex space-x-1 text-black-500">
      {[...Array(totalStars)].map((_, index) => (
        index < positionnement ? <FaCircle key={index} /> : <FaRegCircle key={index} />
      ))}
    </span>
  );
};
const ConsulterReponseETD = () => {
  const { evaluationId } = useParams();
  const idEtudiant = localStorage.getItem("id") || "";
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const evaluation = useAppSelector(getReponseEvaluationETD);
  // Récupérer les réponses de l'évaluation au chargement du composant
  useEffect(() => {
    if (evaluationId && idEtudiant) {
      dispatch(fetchReponseEvaluationAsyncETD({ idEvaluation: Number(evaluationId), idEtudiant }));
    }
  }, [dispatch, evaluationId, idEtudiant]);

  return (
    <div className="w-full min-h-screen p-5 bg-gray-100 overflow-y-auto">
      <ToastContainer theme="colored" />

      {/* En-tête */}
      <div className="flex flex-row items-center justify-between w-full px-14 py-5 bg-white shadow-md rounded-lg">
        <IoMdArrowBack size={25} className="cursor-pointer" onClick={() => navigate("/user/home/evaluations")} />
        <h1 className="text-2xl font-bold">Réponse de l'évaluation</h1>
        <div></div> {/* Espace vide pour équilibrer la mise en page */}
      </div>

      {/* Informations générales */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{evaluation?.designation || "Aucune désignation"}</h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-3">
            <div><strong>Enseignant :</strong> {evaluation?.nomEnseignant} {evaluation?.prenomEnseignant}</div>
            <div><strong>Période :</strong> {evaluation?.periode}</div>
            <div><strong>Début des réponses :</strong> {evaluation?.debutReponse}</div>
            <div><strong>Fin des réponses :</strong> {evaluation?.finReponse}</div>
          </div>
          <div className="space-y-3">
            <div><strong>État :</strong> {etatEvaluationMapper(evaluation?.etat || "")}</div>
            <div><strong>Promotion :</strong> {evaluation?.nomFormation} - {evaluation?.anneeUniversitaire}</div>
            <div><strong>Unité d'enseignement :</strong> {evaluation?.designationUE}</div>
          </div>
        </div>
      </div>

{/* Affichage des rubriques et questions */}
<div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md">
      {evaluation?.rubriques?.length ? (
        evaluation.rubriques.map((rubrique) => (
<div key={rubrique.idRubriqueEvaluation} className="mb-10">
  <h3 className="text-lg font-semibold mb-4">{rubrique.designation}</h3>
  
  <div className="grid grid-cols-4 gap-1 text-gray-700 font-semibold border-b border-gray-300 pb-2">
    <span>Question</span>
    <span className="text-center">Qualificatif minimal</span>
    <span className="text-center">Réponse</span>
    <span className="text-center">Qualificatif maximal</span>
  </div>

  <ul className="space-y-3 pl-0">
    {rubrique.questions.map((question) => (
      <li key={question.idQuestion} className="grid grid-cols-4 gap-1 items-center border-gray-200 py-2">
        <span>{question.intitule}</span>
        <div className="flex justify-center text-sm text-gray-600">
          <span>{question.qualificatif?.minimal}</span>
        </div>

        <div className="flex justify-center">
          {getStars(question.positionnement)}
        </div>

        <div className="flex justify-center text-sm text-gray-600">
          <span>{question.qualificatif?.maximal}</span>
        </div>
      </li>
    ))}
  </ul>
</div>

        ))
      ) : (
        <div className="text-center text-lg text-gray-600">
          Aucune rubrique n'est associée à cette évaluation.
        </div>
      )}
    </div>
    </div>
  );
};

export default ConsulterReponseETD;
