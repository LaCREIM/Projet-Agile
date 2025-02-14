import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import EnseignantsHome from "./components/Enseignant/EnseignantsHome";
import PromotionHome from "./components/Promotion/PromotionHome";
import RootLayout from "./layouts/RootLayout";
import { Dashboard } from "./components/Admin/Dashboard";
import StudentHome from "./components/Student/StudentHome";
import { useState } from "react";
import { PromotionDetails } from "./types/types";
import QualificatifHome from "./components/Qualificatifs/QualificatifHome";
import QuestionHome from "./components/Questions/QuestionHome";
import EvaluationHome from "./components/Evaluations/EvaluationHome";
import RubriqueHome from "./components/Rubriques/RubriqueHome";
import LoginForm from "./components/Auth/LoginForm";
import NotFound from "./layouts/NotFound";
function App() {
  const [promotionDetails, setPromotionDetails] = useState<PromotionDetails>({
    anneeUniversitaire: "-1",
    codeFormation: "",
  } as PromotionDetails);
  return (
    <>
      <Router basename="/">
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LoginForm />} />
            <Route path="admin" element={<AdminLayout />} />
            <Route path="/admin/home" element={<Dashboard />}>
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
              {/* <Route path="rubriques" element={<RubriqueHome />} /> */}
            </Route>
            <Route path="*" element={<NotFound/>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
