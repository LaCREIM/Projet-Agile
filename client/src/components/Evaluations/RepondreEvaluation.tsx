import { useEffect } from "react";
import StepperWithContent from "./stepper";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import {
  fetchReponseEvaluationAsync,
  getReponseEvaluation,
} from "@/features/EvaluationSlice";
import { IoMdArrowBack } from "react-icons/io";

const RepondreEvaluation = () => {
  const { evaluationId } = useParams<{ evaluationId: string }>();
  const navigate = useNavigate();

  const dispatch = useAppDispatch();
  const evaluation = useAppSelector(getReponseEvaluation);

  useEffect(() => {
    console.log("evaluationId", evaluationId);
    if (!evaluationId) {
      return;
    }
    dispatch(
      fetchReponseEvaluationAsync({
        idEvaluation: Number(evaluationId),
        idEtudiant: localStorage.getItem("id") || "",
      })
    );
  }, [dispatch, evaluationId]);

  // Si l'évaluation n'est pas encore chargée, affichez un message de chargement
  if (!evaluation) {
    return <div>Chargement de l'évaluation...</div>;
  }

  return (
    <>
      <div className="w-full min-h-screen p-5 bg-gray-100 overflow-y-auto">
        <div className="flex flex-row items-center justify-between gap-5 w-full px-14 py-5 mb-5 bg-white shadow-md rounded-lg">
          <div className="flex flex-row w-full items-center justify-between gap-5">
            <div className="justify-start hover:cursor-pointer hover:transition hover:-translate-x-1 duration-300">
              <IoMdArrowBack
                size={25}
                onClick={() => navigate("/user/home/evaluations")}
              />
            </div>
            <h1 className="text-center text-2xl">
              Répondre à l'évaluation{" "}
              "<span className="font-bold">{evaluation.designation}</span>"
            </h1>
            <div></div>
          </div>
        </div>
        {/* Passez les rubriques de l'évaluation à StepperWithContent */}
        <StepperWithContent rubriques={evaluation.rubriques} />
      </div>
    </>
  );
};

export default RepondreEvaluation;
