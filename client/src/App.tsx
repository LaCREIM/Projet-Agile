import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import EnseignantsHome from "./components/Enseignant/EnseignantsHome";
import PromotionHome from "./components/Promotion/PromotionHome";
import RootLayout from "./layouts/RootLayout";
import EtudiantHome from "./components/Etudiant/EtudiantHome";
import { Dashboard } from "./components/Admin/Dashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route path="admin" element={<AdminLayout />}>
        <Route path="home" element={<Dashboard />} />
        <Route path="home/enseignants" element={<EnseignantsHome />} />
        <Route path="home/promotions" element={<PromotionHome />} />
        <Route path="home/etudiants" element={<EtudiantHome />} />
      </Route>

      <Route path="*" element={<div>404 Not Found</div>} />
    </Route>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
