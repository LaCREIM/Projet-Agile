import { useEffect } from "react";
import { IoMdArrowBack } from "react-icons/io";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hook/hooks";
import { getEvaluation, getEvaluationByIdAsync } from "../../features/EvaluationSlice";
import { etatEvaluationMapper } from "../../mappers/mappers";

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
        { id: 1, texte: "Maîtrise de JavaScript", ordre: 1 },
        { id: 2, texte: "Connaissance de React", ordre: 2 },
        { id: 3, texte: "Expérience avec Node.js", ordre: 3 },
      ],
    },
    {
      id: 2,
      designation: "Compétences en gestion de projet",
      ordre: 2,
      questions: [
        { id: 4, texte: "Utilisation de méthodologies Agile", ordre: 1 },
        { id: 5, texte: "Gestion des délais", ordre: 2 },
        { id: 6, texte: "Communication avec les parties prenantes", ordre: 3 },
      ],
    },
    {
      id: 3,
      designation: "Compétences en gestion de projet",
      ordre: 2,
      questions: [
        { id: 4, texte: "Utilisation de méthodologies Agile", ordre: 1 },
        { id: 5, texte: "Gestion des délais", ordre: 2 },
        { id: 6, texte: "Communication avec les parties prenantes", ordre: 3 },
      ],
    }
  ],
};


const DetailsEvaluation = () => {
  const evaluation = mockEvaluation; 
  const evaluationId = useParams().evaluationId;
  const realEvaluation = useAppSelector(getEvaluation);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();


  useEffect(()=>{
    console.log(evaluationId);
    dispatch(getEvaluationByIdAsync(Number(evaluationId)));
  }, [evaluationId])

  return (
    <div className="w-full min-h-screen p-5 bg-gray-100 overflow-y-auto">
      {/* En-tête avec bouton de retour */}
      <div className="flex flex-row items-center justify-between sticky top-0 gap-5 w-full px-14 py-5 bg-white shadow-md rounded-lg">
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
          <div></div>
        </div>
      </div>

      {/* Informations générales */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          {realEvaluation.designation}
        </h2>
        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div className="space-y-2">
            <p>
              <strong>État :</strong>{" "}
              {etatEvaluationMapper(realEvaluation.etat)}
            </p>
            <p>
              <strong>Période :</strong> {realEvaluation.periode}
            </p>
            <p>
              <strong>Début des réponses :</strong>{" "}
              {realEvaluation.debutReponse}
            </p>
            <p>
              <strong>Fin des réponses :</strong> {realEvaluation.finReponse}
            </p>
          </div>
          <div className="space-y-2">
            <p>
              <strong>Enseignant :</strong> {evaluation.noEnseignant.prenom}{" "}
              {evaluation.noEnseignant.nom}
            </p>
            <p>
              <strong>Promotion :</strong> {realEvaluation.codeFormation} :{" "}
              {realEvaluation.anneeUniversitaire}
            </p>
            <p>
              <strong>Élément constitutif :</strong>{" "}
              {realEvaluation.designationEC}
            </p>
            <p>
              <strong>Unité d'enseignement :</strong>{" "}
              {realEvaluation.designationUE}
            </p>
          </div>
        </div>
      </div>

      {/* Rubriques et questions */}
      <div className="mt-8 space-y-6 bg-white p-6 rounded-lg shadow-md">
        {evaluation.rubriques.map((rubrique) => (
          <div key={rubrique.id} className="">
            <h3 className="text-lg font-semibold mb-4">
              {rubrique.designation}
            </h3>
            <ul className="space-y-3 pl-6">
              {" "}
              {/* Ajout de `pl-6` pour l'indentation */}
              {rubrique.questions.map((question) => (
                <li key={question.id} className="text-gray-700">
                  <strong>Question {question.ordre} :</strong> {question.texte}
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
