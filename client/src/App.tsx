import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import EnseignantsHome from "./components/Enseignant/EnseignantsHome";
import PromotionHome from "./components/Promotion/PromotionHome";
import RootLayout from "./layouts/RootLayout";
import { Dashboard } from "./components/Admin/Dashboard";
import StudentHome from "./components/Student/StudentHome";
import { useState } from "react";
import { PromotionDetails } from "./types/types";
function App() {
  const [promotionDetails, setPromotionDetails] = useState<PromotionDetails>({
    anneePro: "-1",
    siglePro: "",
  });
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RootLayout />}>
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
                    switchStudent={(anneePro, siglePro) =>
                      setPromotionDetails({ anneePro, siglePro })
                    }
                  />
                }
              />
            </Route>
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
