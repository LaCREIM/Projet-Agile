import { Routes, Route, BrowserRouter as Router, useNavigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import EnseignantsHome from "./components/Enseignant/EnseignantsHome";
import PromotionHome from "./components/Promotion/PromotionHome";
import RootLayout from "./layouts/RootLayout";
import { Dashboard } from "./components/Admin/Dashboard";
import StudentHome from "./components/Etudiant/EtudiantHome.tsx";
import { useState, useEffect } from "react";
import { PromotionDetails } from "./types/types";
import QualificatifHome from "./components/Qualificatifs/QualificatifHome";
import QuestionHome from "./components/Questions/QuestionHome";
import EvaluationHome from "./components/Evaluations/EvaluationHome";
import LoginForm from "./components/Auth/LoginForm";
import NotFound from "./layouts/NotFound";
import RubriqueHome from "./components/Rubriques/RubriqueHome.tsx";
import DetailsEvaluation from "./components/Evaluations/DetailsEvaluation.tsx";
import {ToastContainer} from "react-toastify";
import ConsulterReponseETD from "./components/Evaluations/ConsulterReponseETD";

import RepondreEvaluation from "./components/Evaluations/RepondreEvaluation.tsx";
import ListeEvaluationReponses from "./components/Evaluations/ListeEvaluationReponses.tsx";
import StatistiquesEvaluation from "@/components/Evaluations/StatistiquesEvaluation.tsx";


function App() {
  const [promotionDetails, setPromotionDetails] = useState<PromotionDetails>({
    anneeUniversitaire: "-1",
    codeFormation: "",
  } as PromotionDetails);

  return (
    <Router basename="/">
      <AuthChecker>
        <ToastContainer theme="colored"/>

        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LoginForm />} />
            <Route path="user" element={<AdminLayout />} />
            <Route path="/user/home" element={<Dashboard />}>
              <Route path="enseignants" element={<EnseignantsHome />} />
              <Route path="promotions" element={<PromotionHome />} />
              <Route
                path="etudiants"
                element={
                  <StudentHome
                    promotionDetails={promotionDetails}
                    setPromotionDetails={setPromotionDetails}
                    switchStudent={(anneeUniversitaire, codeFormation) =>
                      setPromotionDetails({
                        anneeUniversitaire,
                        codeFormation,
                      } as PromotionDetails)
                    }
                  />
                }
              />
              <Route path="qualificatifs" element={<QualificatifHome />} />
              <Route path="questions" element={<QuestionHome />} />
              <Route path="evaluations" element={<EvaluationHome />} />
              <Route path="evaluations/:evaluationId" element={<DetailsEvaluation />} />
               <Route path="evaluations/reponse/:evaluationId" element={<ConsulterReponseETD />} />

              <Route path="evaluations/statistiques/:evaluationId" element={<StatistiquesEvaluation/>} />
              <Route path="evaluations/repondre/:evaluationId" element={<RepondreEvaluation />} />
              <Route path="evaluations/reponses/:evaluationId" element={<ListeEvaluationReponses />} />
              <Route path="rubriques" element={<RubriqueHome />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthChecker>
    </Router>
  );
}

function AuthChecker({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
}

export default App;